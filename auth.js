/* Let's Taco - shared staff authentication (Supabase Auth, server-verified).
 * Replaces the browser-side password hashes that used to ship in admin.html.
 * Roles come from the signed JWT (app_metadata.role) and are enforced by
 * Postgres Row Level Security. Anything shown or hidden in the UI is only
 * a convenience - never the security boundary.
 */
(function (w) {
  'use strict';
  var SB_URL = 'https://kigqjuxxoeoeezjguuxu.supabase.co';
  var SB_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtpZ3FqdXh4b2VvZWV6amd1dXh1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAwNTgxNjIsImV4cCI6MjA5NTYzNDE2Mn0.e-V7jsZ0yEjHUziUeFAZQkNDgxKmMq_v4TcYcHBEyhQ'; // public anon key (safe to ship; RLS protects the data)
  var STORE = 'lt_auth';
  var MAX_SESSION_MS = 12 * 60 * 60 * 1000;
  var st = null;
  var refreshing = null;

  function load() {
    try { st = JSON.parse(localStorage.getItem(STORE) || 'null'); } catch (e) { st = null; }
    if (st && (!st.at || Date.now() - (st.t0 || 0) > MAX_SESSION_MS)) clear();
  }
  function save() { try { localStorage.setItem(STORE, JSON.stringify(st)); } catch (e) {} }
  function clear() { st = null; try { localStorage.removeItem(STORE); } catch (e) {} }

  function claims(t) {
    try {
      var s = String(t).split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
      while (s.length % 4) s += '=';
      return JSON.parse(decodeURIComponent(escape(atob(s))));
    } catch (e) { return {}; }
  }
  function adopt(j, t0) {
    var c = claims(j.access_token);
    var am = c.app_metadata || {};
    var um = c.user_metadata || {};
    var email = c.email || '';
    st = {
      at: j.access_token,
      rt: j.refresh_token,
      exp: Date.now() + (j.expires_in || 3600) * 1000,
      t0: t0 || Date.now(),
      email: email,
      role: am.role || '',
      name: um.name || email.split('@')[0] || 'Staff'
    };
    save();
  }

  function refresh() {
    if (!st || !st.rt) return Promise.resolve(false);
    if (refreshing) return refreshing;
    var t0 = st.t0;
    refreshing = fetch(SB_URL + '/auth/v1/token?grant_type=refresh_token', {
      method: 'POST',
      headers: { apikey: SB_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: st.rt })
    }).then(function (r) { return r.ok ? r.json() : null; })
      .then(function (j) {
        if (j && j.access_token) { adopt(j, t0); return true; }
        lost(); return false;
      })
      .catch(function () { return false; }) // network blip: keep session, retry next call
      .then(function (ok) { refreshing = null; return ok; });
    return refreshing;
  }

  function lost() {
    clear();
    try { w.dispatchEvent(new Event('lt-auth-lost')); } catch (e) {}
  }

  function ensure() {
    if (!st) return Promise.resolve(false);
    if (st.exp - Date.now() > 60000) return Promise.resolve(true);
    return refresh().then(function (ok) { return ok || (st && st.exp > Date.now()); });
  }

  function doFetch(path, opts, retried) {
    opts = opts || {};
    if (!st) return Promise.resolve(null);
    var h = Object.assign({ apikey: SB_KEY, Authorization: 'Bearer ' + st.at, 'Content-Type': 'application/json' }, opts.headers || {});
    return fetch(SB_URL + path, Object.assign({}, opts, { headers: h })).then(function (r) {
      if ((r.status === 401 || r.status === 403) && !retried && st) {
        // 401 = expired/invalid token: try one refresh. 403 = permission: never retried.
        if (r.status === 401) return refresh().then(function (ok) { return ok ? doFetch(path, opts, true) : r; });
      }
      if (r.status === 401) lost();
      return r;
    });
  }

  var LT = {
    url: SB_URL,
    key: SB_KEY,
    /* Sign in with email + password. Resolves {ok, role, name, email} or {ok:false, msg}. */
    signIn: function (email, password) {
      return fetch(SB_URL + '/auth/v1/token?grant_type=password', {
        method: 'POST',
        headers: { apikey: SB_KEY, 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email, password: password })
      }).then(function (r) { return r.json().then(function (j) { return { r: r, j: j }; }); })
        .then(function (x) {
          if (!x.r.ok || !x.j.access_token) return { ok: false, msg: 'Incorrect email or password' };
          adopt(x.j, Date.now());
          return { ok: true, role: st.role, name: st.name, email: st.email };
        })
        .catch(function () { return { ok: false, msg: 'Network error - check your connection' }; });
    },
    signOut: function () {
      var t = st && st.at;
      clear();
      if (t) { try { fetch(SB_URL + '/auth/v1/logout', { method: 'POST', headers: { apikey: SB_KEY, Authorization: 'Bearer ' + t } }); } catch (e) {} }
    },
    /* Current session summary from local state (no network) or null. */
    session: function () { return st ? { role: st.role, name: st.name, email: st.email } : null; },
    role: function () { return st ? st.role : ''; },
    /* Resolves true when a usable (or refreshed) session exists. */
    ready: function () { return ensure(); },
    /* Raw authenticated fetch against the Supabase project. Resolves a Response (or null when signed out). */
    fetch: function (path, opts) {
      // Fast path is synchronous so a request fired right before signOut() still carries its token.
      if (st && st.exp - Date.now() > 60000) return doFetch(path, opts);
      return ensure().then(function (ok) { return ok ? doFetch(path, opts) : null; });
    },
    /* JSON helper: resolves parsed JSON, null for 204/empty, or null on error. */
    api: function (path, opts) {
      return LT.fetch(path, opts).then(function (r) {
        if (!r) return null;
        return r.status === 204 ? null : r.json();
      }).catch(function () { return null; });
    }
  };

  /* HTML-escape for text and quoted attributes. Use on EVERY customer/staff-supplied value put into innerHTML. */
  w.esc = function (s) {
    return String(s == null ? '' : s).replace(/[&<>"'\x60]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;', '\x60': '&#96;' }[c];
    });
  };
  /* For values placed inside a JS string inside an inline onclick="..." attribute. */
  w.escJs = function (s) {
    return w.esc(String(s == null ? '' : s).replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\r?\n/g, ' '));
  };

  load();
  w.LTAuth = LT;
})(window);
