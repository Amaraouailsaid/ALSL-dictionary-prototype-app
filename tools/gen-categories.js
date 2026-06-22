const fs = require('fs');
const path = require('path');
const DATA = path.join(__dirname, '..', 'data');
const signs = require(path.join(DATA, 'signs.json'));

const norm = s => (s||'')
  .replace(/[ً-ْـٰ]/g,'')
  .replace(/[آأإٱ]/g,'ا')
  .replace(/ى/g,'ي')
  .replace(/ة/g,'ه')
  .replace(/[ؤئ]/g,'ء')
  .replace(/_\d+$/,'')
  .trim();

const set = (...w) => new Set(w.flat().map(norm));

const ADV = set('أبداً','أبدا','أحياناً','أيضاً','أيضا','دائماً','دائما','جداً','سابقاً','غالباً','كثيراً','كثيرا','قريباً','قريبا','غداً','غدا','تقريبا','مباشرة','ببطء','الآن','اليوم','أمس','هنا','من وقت لآخر','كل يوم','معاً','معا');
const PRON = set('أنا','أنت','أنتم','نحن','هو','هي','هم','لي','لديه','لقب');
const PARTICLE = set('في','مع','من','بدون','ضد','إذا','إذن','لذا','حتى','لماذا','أين','متى','كيف','كم','بين','أمام','تحت','نعم','لا','موافق','حسنا','فقط','من فضلك','إلى','بعد','قبل','كل شيء','أول','آخر');
const ADJ = set('أخضر','أصفر','أبيض','أحمر','أزرق','أسود','بارد','بعيد','ثقيل','جاف','جيد','حامض','حقيقي','خطير','سيئ','سيء','ضيق','طويل','عالي','غالي','غريب','فارغ','قريب','قصير','قليل','قوي','كبير','كبير في السن','مبلول','متعب','مختصر','مختلف','مريح','مظلم','ناعم','نيء','واضح','وحيد','وسخ','حار','حر','جديد','جميل','ذكي','سعيد','سهل','صعب','غاضب','غبي','غني','فريد','لطيف','مريض','مشغول','مهم','نظيف','هادئ','واسع','باهض','بخيل','بسيط','مجتهد','محظوظ','نبيل','مزدوج','كافٍ','كاف','قادر','ممتلئ','منخفض','مغلق','معجب','مرتبك','مشهور','مضحك','أساسي','عام','دولي','مجهول','مستمر','مخيّب');
const VERB_EXTRA = set('أحسب','أختار','أعلم');

function isDigit(ar){ return /[0-9٠-٩]/.test(ar); }
function pos(ar){
  const n = norm(ar);
  if (isDigit(ar)) return 'num';
  if (/^ي../.test(n) || VERB_EXTRA.has(n)) return 'verb';
  if (ADV.has(n)) return 'adv';
  if (PRON.has(n)) return 'pron';
  if (PARTICLE.has(n)) return 'particle';
  if (ADJ.has(n)) return 'adj';
  return 'noun';
}

const THEMES = {
  family:   set('أب','أم','أخ','أخت','ابن','بنت','عائلة','عم','عمة','خال','زوج','زواج','والدين','طفل','امرأة','رجل','فرد من العائلة','إنسان','شاب','صديق'),
  body:     set('أسنان','إصبع','يد','رأس','أذن','أنف','فم','ركبتان','صدر','جلد','شعر','قلب','ظهر','جسم','بشرة','وجه','نفس','ألم','جُرح'),
  colors:   set('أخضر','أصفر','أبيض','أحمر','أزرق','أسود','لون'),
  numbers:  set('عدد'),
  food:     set('خبز','ماء','شاي','قهوة','زبدة','بيرة','سمك','لحم','لحم بقر','حساء','سكر','ملح','طعام','طبق','وجبة','حبة عنب','كرز','طماطم','دجاجة','معجنات','طحين','مشروب','كحول','شهية','طعم','وصفة','فنجان','ملعقة','شوكة','سكاكين','مقلاة','علبة','زجاجة','سمنة'),
  clothing: set('بلوزة','تنورة','سروال','جوارب','حزام','خاتم','فستان','قميص','معطف','ملابس','مظلة','حقيبة','حقيبة ظهر','حقيبة كتف','أمتعة'),
  time:     set('صباح','مساء','ظهيرة','الظهيرة','الليل','يوم','اليوم','أمس','غد','بعد غد','سنة','ساعة','وقت','صيف','شتاء','خريف','موسم','الآن','منتصف الليل','عطلة','عيد ميلاد','كل يوم','مستقبل','نصف','تأخر','غداً'),
  calendar: set('الاثنين','الإثنين','الجمعة','الأحد','السبت','الخميس','الثلاثاء','أغسطس','سبتمبر','أكتوبر','نوفمبر','يناير','فبراير','يونيو','يوليو','جانفي','أوت','ماي','أوروبا'),
  nature:   set('أرض','شمس','قمر','نجمة','سماء','جبل','تلة','نهر','ريح','مطر','ثلج','جليد','شجرة','زهرة','أزهار','ضباب','رماد','فحم','هواء','غابة','طبيعة','بيئة','حرارة','ضوء','غروب الشمس','حيوان','عصفور','كلب','قط','فرع'),
  places:   set('باب','بيت','منزل','سقف','سرير','مدرسة','متحف','مطار','سوق','مدينة','قرية','حقل','ساحل','كنيسة','مخبزة','مبنى','مكتبة','مسرح','محكمة','مختبر','غرفة','طابق','قبو','مدخل','نافذة','جسر','فناء المنزل','بئر السلم','خزانة','ثلاجة','فرن','مغسلة','أريكة','كرسي','مرآة','طريق','عاصمة','جسر'),
  transport:set('حافلة','سيارة','طائرة','قارب','قافلة','راكب','سائق','تذكرة','قيادة','اتجاه','مسافة','وصول','مغادرة','سيرا على الأقدام'),
  society:  set('تجارة','صناعة','حكومة','جندي','جيش','حرفي','عمل','عامل','اقتصاد','قانون','ديمقراطية','مجتمع','شركة','وزير','رئيس','مسؤول','قاض','طبيب أسنان','أستاذ','فنان','ممثل','مراسل','عالم','عالِم','كهربائي','حادث','معركة','عنف','قنبلة','حدود','دولي','عدو','زائر','جار','صحف','أخبار','إعلان عام','بريد','اتصال','تواصل','برنامج','حق','حظ','حاجة','شخصية','قوة'),
  learning: set('قاموس','كتاب','كلمة','لغة','قصة','نسخة','ورق','معرفة','معلومة','فكرة','سؤال','رسم','إشارة','اسم','موضوع','مادة','مواد','نتائج','دعوة','رقص','موسيقى','رياضة','كرة','كرة القدم','لعبة','تسلية','كاميرا','صوت'),
  greetings:set('شكراً','شكرا','مرحبا','برافو','تصبح على خير','مساء الخير','صباح الخير','أحسنت','الحمدلله','نعم','لا','موافق','حسنا','من فضلك','حظ','دعوة','هدايا','قُبلة','حب','فرح','قبلة'),
  money:    set('مال','شيك','بريد','ثمن','سعر','اقتصاد','حقيبة','زر','مفتاح'),
};

signs.forEach(s => { if (isDigit(s.ar)) THEMES.numbers.add(norm(s.ar)); });

const themeOf = ar => {
  const n = norm(ar);
  for (const id in THEMES) if (THEMES[id].has(n)) return id;
  return null;
};

const POS_META = [
  { id:'noun', icon:'🔵', ar:'اسم',  fr:'Nom',       en:'Noun' },
  { id:'verb', icon:'🟢', ar:'فعل',  fr:'Verbe',     en:'Verb' },
  { id:'adj',  icon:'🟡', ar:'صفة',  fr:'Adjectif',  en:'Adjective' },
  { id:'adv',  icon:'🟣', ar:'ظرف',  fr:'Adverbe',   en:'Adverb' },
  { id:'num',  icon:'🔢', ar:'عدد',  fr:'Nombre',    en:'Number' },
  { id:'pron', icon:'🟠', ar:'ضمير', fr:'Pronom',    en:'Pronoun' },
  { id:'particle', icon:'⚪', ar:'أداة', fr:'Particule', en:'Particle' },
];
const THEME_META = [
  { id:'family',    icon:'👪', ar:'العائلة',        fr:'Famille',        en:'Family' },
  { id:'body',      icon:'✋', ar:'الجسم',          fr:'Le corps',       en:'Body' },
  { id:'colors',    icon:'🎨', ar:'الألوان',        fr:'Couleurs',       en:'Colors' },
  { id:'numbers',   icon:'🔢', ar:'الأرقام',        fr:'Nombres',        en:'Numbers' },
  { id:'food',      icon:'🍽️', ar:'الطعام والشراب', fr:'Nourriture',     en:'Food & Drink' },
  { id:'clothing',  icon:'👕', ar:'الملابس',        fr:'Vêtements',      en:'Clothing' },
  { id:'time',      icon:'⏰', ar:'الوقت',          fr:'Le temps',       en:'Time' },
  { id:'calendar',  icon:'📅', ar:'الأيام والأشهر', fr:'Jours & mois',   en:'Days & Months' },
  { id:'nature',    icon:'🌿', ar:'الطبيعة',        fr:'La nature',      en:'Nature' },
  { id:'places',    icon:'🏠', ar:'الأماكن',        fr:'Lieux',          en:'Places' },
  { id:'transport', icon:'🚗', ar:'النقل',          fr:'Transport',      en:'Transport' },
  { id:'society',   icon:'🏛️', ar:'المجتمع والعمل', fr:'Société & travail', en:'Society & Work' },
  { id:'learning',  icon:'📚', ar:'التعلّم واللغة', fr:'Apprentissage',  en:'Learning & Language' },
  { id:'greetings', icon:'👋', ar:'التحية والمشاعر',fr:'Salutations',    en:'Greetings & Feelings' },
  { id:'money',     icon:'💰', ar:'المال',          fr:'Argent',         en:'Money' },
];

const posTag = {}, themeTag = {};
const posCount = {}, themeCount = {};
signs.forEach(s => {
  const p = pos(s.ar); posTag[s.id] = p; posCount[p] = (posCount[p]||0)+1;
  const th = themeOf(s.ar); if (th){ themeTag[s.id] = th; themeCount[th] = (themeCount[th]||0)+1; }
});

const out = {
  generatedAt: new Date().toISOString().slice(0,10),
  pos:   POS_META.filter(m => posCount[m.id]),
  themes: THEME_META.filter(m => themeCount[m.id]),
  posTag, themeTag
};
fs.writeFileSync(path.join(DATA, 'categories.json'), JSON.stringify(out));

console.log('POS counts:', JSON.stringify(posCount));
const themedTotal = Object.values(themeCount).reduce((a,b)=>a+b,0);
console.log('Theme counts:', JSON.stringify(themeCount));
console.log('themed:', themedTotal, '/', signs.length, '(' + Math.round(themedTotal/signs.length*100) + '% have a theme; rest still appear under All signs)');
