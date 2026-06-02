const fs = require('fs');

const html = fs.readFileSync('index.html', 'utf8');

if (html.includes('Lam Tuyen')) {
  console.log('STOP — Wrong file detected.');
  process.exit(1);
}
console.log('✅ File confirmed — Lets Taco Da Nang');

let fixed = html;

// Replace the entire tracker view content with premium psychological stories
const oldTracker = `<div id="cart-view-tracker" style="flex:1;overflow-y:auto;display:none;flex-direction:column;padding:25px;text-align:center;">
<div style="font-size:4rem;margin-bottom:15px;">🎉</div>
<div style="font-family:'Bebas Neue',sans-serif;font-size:2.2rem;color:#D4A017;letter-spacing:3px;">Order Placed!</div>
<div style="font-family:'Playfair Display',serif;font-style:italic;color:#B8A99A;margin-top:8px;margin-bottom:25px;">Your tacos are on their way to being amazing</div>
<div style="background:rgba(212,160,23,0.08);border:1px solid rgba(212,160,23,0.25);border-radius:8px;padding:20px;margin-bottom:20px;"><div style="font-size:0.7rem;letter-spacing:2px;text-transform:uppercase;color:#B8A99A;margin-bottom:8px;">Order Reference</div><div style="font-family:'Bebas Neue',sans-serif;font-size:2rem;color:#D4A017;letter-spacing:5px;" id="tracker-ref">LTD-XXXXXX</div></div>
<div style="margin-bottom:25px;"><div style="font-size:0.7rem;letter-spacing:2px;text-transform:uppercase;color:#B8A99A;margin-bottom:15px;">Live Order Status</div><div id="order-tracker-steps" style="display:flex;align-items:center;overflow-x:auto;padding-bottom:5px;"></div></div>`;

const newTracker = `<div id="cart-view-tracker" style="flex:1;overflow-y:auto;display:none;flex-direction:column;padding:30px 25px;text-align:center;">
<div style="background:rgba(212,160,23,0.06);border:1px solid rgba(212,160,23,0.2);border-radius:4px;padding:8px 20px;display:inline-block;margin-bottom:24px;"><div style="font-size:0.6rem;letter-spacing:3px;text-transform:uppercase;color:#B8A99A;">Order Reference</div><div style="font-family:Bebas Neue,sans-serif;font-size:1.6rem;color:#D4A017;letter-spacing:5px;" id="tracker-ref">LTD-XXXXXX</div></div>
<div id="story-display" style="margin-bottom:30px;"></div>
<div style="margin-bottom:25px;display:none;"><div id="order-tracker-steps" style="display:flex;align-items:center;overflow-x:auto;padding-bottom:5px;"></div></div>`;

if (fixed.includes(oldTracker)) {
  fixed = fixed.replace(oldTracker, newTracker);
  console.log('✅ Fix 1: Tracker view replaced with story display');
} else {
  console.log('⚠️  Fix 1: tracker pattern not found — trying fallback');
  // Fallback — just add story-display div after tracker-ref
  fixed = fixed.replace(
    'id="tracker-ref">LTD-XXXXXX</div></div>',
    'id="tracker-ref">LTD-XXXXXX</div></div><div id="story-display" style="margin-bottom:30px;"></div>'
  );
}

// Add the 20 stories and story engine before closing </script>
const stories = `
var STORIES=[
  {
    en:"The tortilla hits the iron first. You hear it before you smell it — that low sizzle that says something real is happening. The birria has been going since before you woke up. Hours of slow heat, dried chiles, bone broth, patience. This isn't fast food. This is a man who decided the world deserved better tacos.",
    vi:"Chiếc bánh tortilla chạm vào chảo gang trước. Bạn nghe thấy trước khi ngửi thấy — tiếng xèo xèo trầm báo hiệu điều gì đó thực sự đang xảy ra. Birria đã được nấu từ trước khi bạn thức dậy. Hàng giờ đồng hồ ninh chậm, ớt khô, nước hầm xương, sự kiên nhẫn. Đây không phải đồ ăn nhanh. Đây là một người đàn ông quyết định thế giới xứng đáng được ăn taco ngon hơn."
  },
  {
    en:"There is a moment — right after the first bite — where your brain goes quiet. No notifications. No noise. Just the smoke, the spice, the fat from slow-cooked meat melting into corn tortilla. Chefs spend their whole careers chasing that moment. He found it. And now he makes it for you.",
    vi:"Có một khoảnh khắc — ngay sau miếng đầu tiên — khi tâm trí bạn trở nên tĩnh lặng. Không thông báo. Không tiếng ồn. Chỉ có khói, vị cay, chất béo từ thịt ninh chậm tan vào bánh tortilla bắp. Các đầu bếp dành cả sự nghiệp để theo đuổi khoảnh khắc đó. Anh ấy đã tìm thấy nó. Và bây giờ anh ấy tạo ra nó cho bạn."
  },
  {
    en:"In Mexico City, they line up at 6am for tacos like this. In Da Nang, you just ordered them from your phone. Some people call that luck. We call it Tuesday.",
    vi:"Ở Mexico City, người ta xếp hàng từ 6 giờ sáng để ăn taco như thế này. Ở Đà Nẵng, bạn vừa đặt chúng từ điện thoại. Một số người gọi đó là may mắn. Chúng tôi gọi đó là ngày thường."
  },
  {
    en:"The consommé is the secret. Dark, deep, built from bones and time. You dip the taco and something happens to your face — your eyes close for half a second. That's not an accident. That's 20 years of a chef understanding exactly what the human soul needs.",
    vi:"Nước consommé là bí mật. Đậm, sâu, được tạo ra từ xương và thời gian. Bạn nhúng taco vào và điều gì đó xảy ra với khuôn mặt bạn — mắt nhắm lại nửa giây. Đó không phải ngẫu nhiên. Đó là 20 năm một đầu bếp hiểu chính xác những gì tâm hồn con người cần."
  },
  {
    en:"He has cooked in kitchens across four continents. He has eaten everything. Street food in Bangkok. Fine dining in Paris. Grandmothers cooking in small Mexican villages. And every single time, the taco won. So he stopped looking and started making.",
    vi:"Anh ấy đã nấu ăn trong những căn bếp trên bốn châu lục. Anh ấy đã ăn mọi thứ. Đồ ăn đường phố ở Bangkok. Ẩm thực cao cấp ở Paris. Những người bà nấu ăn trong các làng nhỏ ở Mexico. Và mỗi lần, taco đều thắng. Vì vậy anh ấy ngừng tìm kiếm và bắt đầu chế biến."
  },
  {
    en:"The al pastor pork has been marinating since yesterday. Layers of dried guajillo, achiote, pineapple, garlic. When it hits the grill it caramelizes at the edges. That sweet char is not a mistake — it is the whole point. Order more. You will not regret it.",
    vi:"Thịt heo al pastor đã được ướp từ hôm qua. Từng lớp ớt guajillo khô, achiote, dứa, tỏi. Khi chạm vào vỉ nướng, nó caramel hóa ở các cạnh. Màu cháy ngọt đó không phải là sự cố — đó chính là điểm mấu chốt. Gọi thêm đi. Bạn sẽ không hối hận."
  },
  {
    en:"Somewhere between the first taco and the last, you will realize you are not just eating. You are sitting inside someone's life's work. Every flavor is a decision. Every texture is intentional. The man behind this grill did not guess his way here. He earned it.",
    vi:"Ở đâu đó giữa chiếc taco đầu tiên và chiếc cuối cùng, bạn sẽ nhận ra rằng bạn không chỉ đang ăn. Bạn đang ngồi trong công trình cả đời của ai đó. Mỗi hương vị là một quyết định. Mỗi kết cấu đều có chủ ý. Người đàn ông đứng sau vỉ nướng này không đến đây bằng cách đoán mò. Anh ấy đã kiếm được nó."
  },
  {
    en:"The carnitas take four hours. Low heat. Patience most chefs do not have. The result is pork that falls apart before it reaches your mouth — so tender it barely needs your teeth. Pair it with the rice chips and avocado salsa. Trust us on this one.",
    vi:"Carnitas mất bốn tiếng. Lửa nhỏ. Sự kiên nhẫn mà hầu hết đầu bếp không có. Kết quả là thịt heo tan ra trước khi đến miệng bạn — mềm đến mức hầu như không cần răng. Kết hợp với bánh chips gạo và salsa bơ. Hãy tin chúng tôi về điều này."
  },
  {
    en:"144 people gave this place 5 stars. Travelers from 30 countries. Food bloggers. Locals who come back every week. All of them trying to describe the same thing. Most of them fail. The best review we ever got said just four words: I closed my eyes.",
    vi:"144 người đã cho nơi này 5 sao. Du khách từ 30 quốc gia. Blogger ẩm thực. Người địa phương quay lại mỗi tuần. Tất cả họ đều cố mô tả cùng một điều. Hầu hết đều thất bại. Đánh giá hay nhất chúng tôi từng nhận được chỉ có bốn chữ: Tôi đã nhắm mắt lại."
  },
  {
    en:"The grilled steak arrives still sizzling. Marinated overnight. Charred hard on the outside, pink and rested in the middle. White onion. Fresh cilantro. A salsa that took three years to perfect. This is not a taco. This is a reason to come back to Da Nang.",
    vi:"Bò nướng đến trong khi vẫn còn xèo. Ướp qua đêm. Cháy vỏ bên ngoài, hồng và mềm bên trong. Hành trắng. Rau mùi tươi. Một loại salsa mất ba năm để hoàn thiện. Đây không phải taco. Đây là lý do để quay lại Đà Nẵng."
  },
  {
    en:"Most restaurants give you food. This one gives you a memory. The kind you describe to someone on a plane six months later. The kind that makes you search the name when you land. That is what we are building here — one taco at a time.",
    vi:"Hầu hết nhà hàng cho bạn đồ ăn. Nơi này cho bạn một ký ức. Loại mà bạn kể cho ai đó trên máy bay sáu tháng sau. Loại khiến bạn tìm kiếm cái tên khi hạ cánh. Đó là những gì chúng tôi đang xây dựng ở đây — một chiếc taco một lúc."
  },
  {
    en:"There is rice on the menu for a reason. Not because we ran out of ideas. Because the Mexican fried rice here — spiced, smoky, loaded with your choice of protein — is the kind of thing that makes you reconsider everything you thought you knew about fried rice.",
    vi:"Có cơm trong thực đơn vì một lý do. Không phải vì chúng tôi hết ý tưởng. Vì cơm rang Mexico ở đây — đầy gia vị, khói, với protein tùy chọn — là loại khiến bạn xem lại tất cả những gì bạn nghĩ bạn biết về cơm rang."
  },
  {
    en:"The tortillas are hand-pressed every hour. Not frozen. Not pre-made. Each one shaped by hand, cooked on cast iron, handed to you warm. In Mexico that is called respect. Here in Da Nang we just call it the way it should be done.",
    vi:"Bánh tortillas được ép tay mỗi giờ. Không đông lạnh. Không làm sẵn. Mỗi cái được tạo hình bằng tay, nướng trên gang, trao cho bạn khi còn nóng. Ở Mexico người ta gọi đó là sự tôn trọng. Ở đây tại Đà Nẵng chúng tôi chỉ gọi đó là cách mọi thứ nên được làm."
  },
  {
    en:"He could have opened a bigger restaurant. More tables. More tourists. More money. Instead he kept it small, kept it personal, kept the quality at a level that most places cannot maintain when they scale. Small was never the limitation. Small was always the point.",
    vi:"Anh ấy có thể mở nhà hàng lớn hơn. Nhiều bàn hơn. Nhiều khách du lịch hơn. Nhiều tiền hơn. Thay vào đó anh giữ nhỏ, giữ cá nhân, giữ chất lượng ở mức mà hầu hết các nơi không thể duy trì khi mở rộng. Nhỏ chưa bao giờ là giới hạn. Nhỏ luôn luôn là mục tiêu."
  },
  {
    en:"The avocado salsa is made fresh every day. Real avocado. Lime. A little heat. Served with crispy rice chips that shatter when you bite them. It is the kind of starter that makes you forget you ordered main courses. Add it. You will thank yourself.",
    vi:"Salsa bơ được làm tươi mỗi ngày. Bơ thật. Chanh. Một chút cay. Phục vụ với bánh chips gạo giòn tan khi bạn cắn. Đây là loại khai vị khiến bạn quên rằng mình đã gọi món chính. Thêm vào đi. Bạn sẽ tự cảm ơn bản thân."
  },
  {
    en:"9 months. That is how long it took to become Da Nang's highest-rated Mexican restaurant. Not nine years. Nine months. Because when the food is real, when the passion is real, when every single ingredient is chosen with intention — people notice. People come back. People tell their friends.",
    vi:"9 tháng. Đó là thời gian để trở thành nhà hàng Mexico được đánh giá cao nhất Đà Nẵng. Không phải chín năm. Chín tháng. Bởi vì khi đồ ăn thật, khi đam mê thật, khi mỗi nguyên liệu được chọn có chủ ý — mọi người nhận ra. Mọi người quay lại. Mọi người kể cho bạn bè nghe."
  },
  {
    en:"Birria is a Mexican tradition that takes all day to make. It is not a shortcut food. The beef goes in early. The chiles are toasted and soaked. The broth is built layer by layer. By the time it reaches your table it has been cooked longer than most people work in a day.",
    vi:"Birria là một truyền thống Mexico mất cả ngày để làm. Đây không phải đồ ăn nhanh. Thịt bò được bỏ vào sớm. Ớt được rang và ngâm. Nước dùng được xây dựng từng lớp. Đến khi đến bàn của bạn, nó đã được nấu lâu hơn hầu hết mọi người làm việc trong một ngày."
  },
  {
    en:"The cheese pull on a birria taco is not just visual. It is structural. The cheese holds the taco together while you dip it in the consommé. The whole thing is engineered — the crunch of the tortilla, the pull of the cheese, the depth of the broth. Order the birria first. Always.",
    vi:"Sợi phô mai kéo dài trên taco birria không chỉ là thẩm mỹ. Đó là cấu trúc. Phô mai giữ taco lại với nhau khi bạn nhúng vào consommé. Toàn bộ được thiết kế — độ giòn của tortilla, độ kéo của phô mai, chiều sâu của nước dùng. Gọi birria trước. Luôn luôn."
  },
  {
    en:"Some nights this place is so full you can feel the energy from the street. Laughter. The smell of smoke and chiles. Music. Strangers sharing a table and ending up exchanging numbers. Food does that when it is real. It turns a meal into a moment.",
    vi:"Một số buổi tối nơi này đông đến mức bạn có thể cảm nhận năng lượng từ đường phố. Tiếng cười. Mùi khói và ớt. Âm nhạc. Người lạ chia sẻ một bàn và cuối cùng trao đổi số điện thoại. Đồ ăn làm điều đó khi nó thật. Nó biến một bữa ăn thành một khoảnh khắc."
  },
  {
    en:"You could add extra cheese. You could add avocado. You could get the birria dipping sauce on the side even if you did not order birria — it works on everything. We are not telling you what to do. We are just saying these are options that exist and people who choose them tend to look very happy.",
    vi:"Bạn có thể thêm phô mai. Bạn có thể thêm bơ. Bạn có thể lấy nước chấm birria ở bên dù không gọi birria — nó hợp với mọi thứ. Chúng tôi không nói bạn phải làm gì. Chúng tôi chỉ nói đây là những lựa chọn tồn tại và những người chọn chúng thường trông rất hạnh phúc."
  }
];

function getStory(ref){
  // Use order ref to pick consistent story for this customer
  // but cycle through all 20 so every customer gets something different
  var idx=0;
  if(ref&&ref.length>4){
    var chars=ref.slice(-4);
    var num=0;
    for(var i=0;i<chars.length;i++){num+=chars.charCodeAt(i);}
    idx=num%STORIES.length;
  }
  return STORIES[idx];
}

function renderStory(ref){
  var s=getStory(ref);
  var el=document.getElementById('story-display');
  if(!el)return;
  el.innerHTML='<div style="border-left:3px solid #D4A017;padding:25px 20px;text-align:left;margin-bottom:20px;">'
    +'<div style="font-family:Playfair Display,serif;font-style:italic;font-size:1.05rem;color:#FAF0E6;line-height:1.9;margin-bottom:20px;">'+s.en+'</div>'
    +'<div style="font-family:Jost,sans-serif;font-size:0.88rem;color:#B8A99A;line-height:1.8;border-top:1px solid rgba(212,160,23,0.15);padding-top:16px;">'+s.vi+'</div>'
    +'</div>'
    +'<div style="font-size:0.65rem;letter-spacing:3px;text-transform:uppercase;color:rgba(184,169,154,0.4);margin-bottom:25px;">While we prepare your order</div>';
}
`;

// Inject stories before closing script tag of the last script block
const lastScriptClose = fixed.lastIndexOf('<\/script>');
if (lastScriptClose !== -1) {
  fixed = fixed.substring(0, lastScriptClose) + stories + '\n<\/script>' + fixed.substring(lastScriptClose + 9);
  console.log('✅ Fix 2: 20 stories injected into page');
} else {
  console.log('❌ Could not find closing script tag');
}

// Update showTracker to call renderStory
const oldShowTracker = "document.getElementById('tracker-ref').textContent=ref;";
const newShowTracker = "document.getElementById('tracker-ref').textContent=ref;\n  renderStory(ref);";

if (fixed.includes(oldShowTracker)) {
  fixed = fixed.replace(oldShowTracker, newShowTracker);
  console.log('✅ Fix 3: showTracker now renders story');
} else {
  console.log('⚠️  Fix 3: showTracker pattern not found');
}

// JS Validation
const scripts = [];
let pos = 0;
while (true) {
  const s = fixed.indexOf('<script>', pos);
  if (s === -1) break;
  const e = fixed.indexOf('<\/script>', s);
  if (e === -1) break;
  scripts.push(fixed.substring(s + 8, e));
  pos = e + 9;
}
let ok = true;
scripts.forEach(function(sc, i) {
  try { new Function(sc); }
  catch(e) { console.log('❌ JS Error block', i, ':', e.message); ok = false; }
});
if (!ok) {
  console.log('❌ JS validation failed — file NOT saved.');
  process.exit(1);
}
console.log('✅ JS validation passed');
fs.writeFileSync('index.html', fixed, 'utf8');
console.log('✅ index.html saved — 20 stories live, order tracker removed');
