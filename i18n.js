(function (global) {
  var STR = {
    ar: {
      dir:'rtl', name:'العربية',
      app_title:'قاموس لغة الإشارة الجزائرية',
      app_subtitle:'قاموس موثَّق، جاهز للأفاتار',
      count_signs:'{n} إشارة',
      theme_light:'الوضع الفاتح', theme_dark:'الوضع الداكن', language:'اللغة',

      tab_explore:'استكشف', tab_dictionary:'القاموس', tab_translate:'نص ← إشارة',
      tab_practice:'تدرّب', tab_saved:'المحفوظات',

      ctrl_replay:'إعادة', ctrl_slow:'بطيء', ctrl_loop:'تكرار', ctrl_save:'حفظ',
      behind_title:'خلف الإشارة', behind_sub:'ترميز HamNoSys / SiGML',
      behind_note:'هذا هو ترميز HamNoSys القابل للقراءة آليًا، المُسلسَل بصيغة SiGML — نفس البيانات التي يعرضها الأفاتار. وهو ما يجعل القاموس قابلًا للنقل وإعادة الاستخدام.',
      meta_symbols:'{n} رمزًا للترميز', meta_two:'بكلتا اليدين', meta_one:'بيد واحدة',
      meta_validated:'مُوثَّقة في هذا العمل', meta_3dz:'من 3DZSignDB',
      src_validated:'مُوثَّقة حديثًا', src_3dz:'3DZSignDB',

      hero_h2:'أكبر قاموس جاهز للأفاتار للغة الإشارة الجزائرية.',
      hero_p:'كل إشارة هنا مُوثَّقة ومُرمَّزة بـ HamNoSys ومُسلسَلة بصيغة SiGML — قابلة للقراءة آليًا ويعرضها أفاتار ثلاثي الأبعاد مباشرةً.',
      stat_total:'إجمالي الإشارات', stat_validated:'موثَّقة حديثًا',
      stat_french:'مع الفرنسية', stat_two:'بكلتا اليدين',
      coverage:'التغطية من القاموس الوطني', coverage_of:'من ~{total}',
      q_browse:'📖 تصفّح القاموس', q_browse_d:'ابحث في {n} إشارة بالعربية أو الفرنسية',
      q_translate:'⌨️ نص ← إشارة', q_translate_d:'اكتب بالعربية وشاهدها بالإشارة',
      q_practice:'🎯 تدرّب', q_practice_d:'تعلّم الإشارات باختبار سريع',
      sotd:'إشارة اليوم', watch:'▶ شاهد',

      search_ph:'ابحث بالعربية أو الفرنسية…',
      filter_all:'الكل',
      count_n:'{n} إشارة',
      categories_title:'اختر فئة', categories_sub:'ابدأ من أي مكان — يمكنك العودة في أي وقت',
      cat_by_theme:'حسب الموضوع', cat_by_pos:'حسب القسم النحوي',
      cat_all_signs:'كل الإشارات', back_categories:'→ الفئات', n_signs:'{n} إشارة',

      ta_ph:'اكتب جملة بالعربية…  (مثال: أنا أحب بيت كبير)',
      sign_it:'▶ ترجِم بالإشارة', clear:'مسح',
      translate_hint:'تُترجَم كل كلمة معروفة بالترتيب. تُعلَّم الكلمات غير المتوفرة.',
      not_added:'غير متوفرة بعد',

      quiz_title:'خمّن الإشارة', quiz_prompt:'شاهد الأفاتار، ثم اختر الكلمة التي يؤدّيها.',
      score:'النتيجة', streak:'متتالية', best:'الأفضل',
      replay_sign:'↺ إعادة الإشارة', correct:'✓ صحيح!', wrong:'✗ كانت',
      next:'التالي →', hidden_quiz:'مخفية أثناء الاختبار',

      saved_empty_t:'لا إشارات محفوظة بعد.',
      saved_empty_d:'افتح أي إشارة واضغط حفظ لبناء قائمة دراستك.',
      saved_count:'{n} محفوظة',

      foot:'تشغيل الإشارات بواسطة محرّك الأفاتار <b>JASigning</b> (نظام قائم). المجموعة والتوثيق والمنصّة هي مساهمة هذه الأطروحة.',
      load_err_t:'تعذّر تحميل البيانات.',
      load_err_d:'افتح الموقع عبر خادم ويب وليس عبر مسار file://.'
    },

    fr: {
      dir:'ltr', name:'Français',
      app_title:'Dictionnaire de la Langue des Signes Algérienne',
      app_subtitle:'Un lexique validé, prêt pour l’avatar',
      count_signs:'{n} signes',
      theme_light:'Mode clair', theme_dark:'Mode sombre', language:'Langue',

      tab_explore:'Explorer', tab_dictionary:'Dictionnaire', tab_translate:'Texte → Signe',
      tab_practice:'S’exercer', tab_saved:'Enregistrés',

      ctrl_replay:'Rejouer', ctrl_slow:'Lent', ctrl_loop:'Boucle', ctrl_save:'Enregistrer',
      behind_title:'Derrière le signe', behind_sub:'l’encodage HamNoSys / SiGML',
      behind_note:'Ceci est la notation HamNoSys lisible par machine, sérialisée en SiGML — les mêmes données que l’avatar restitue. C’est ce qui rend le dictionnaire portable et réutilisable.',
      meta_symbols:'{n} symboles', meta_two:'à deux mains', meta_one:'à une main',
      meta_validated:'validé dans ce travail', meta_3dz:'de 3DZSignDB',
      src_validated:'Nouvellement validés', src_3dz:'3DZSignDB',

      hero_h2:'Le plus grand dictionnaire prêt pour l’avatar de la Langue des Signes Algérienne.',
      hero_p:'Chaque signe est validé et encodé en HamNoSys, sérialisé en SiGML — lisible par machine et restitué en direct par un avatar 3D.',
      stat_total:'signes au total', stat_validated:'nouvellement validés',
      stat_french:'avec le français', stat_two:'à deux mains',
      coverage:'Couverture du dictionnaire national', coverage_of:'sur ~{total}',
      q_browse:'📖 Parcourir le dictionnaire', q_browse_d:'Cherchez {n} signes en arabe ou en français',
      q_translate:'⌨️ Texte → Signe', q_translate_d:'Tapez en arabe, regardez-le signé',
      q_practice:'🎯 S’exercer', q_practice_d:'Apprenez les signes avec un quiz rapide',
      sotd:'Signe du jour', watch:'▶ Regarder',

      search_ph:'Rechercher en arabe ou en français…',
      filter_all:'Tous',
      count_n:'{n} signes',
      categories_title:'Choisir une catégorie', categories_sub:'Commencez où vous voulez — vous pouvez revenir à tout moment',
      cat_by_theme:'Par thème', cat_by_pos:'Par nature',
      cat_all_signs:'Tous les signes', back_categories:'← Catégories', n_signs:'{n} signes',

      ta_ph:'Tapez une phrase en arabe…  (ex. : أنا أحب بيت كبير)',
      sign_it:'▶ Signer', clear:'Effacer',
      translate_hint:'Chaque mot connu est signé dans l’ordre. Les mots inconnus sont signalés.',
      not_added:'pas encore ajouté',

      quiz_title:'Devine le signe', quiz_prompt:'Regardez l’avatar, puis choisissez le mot qu’il signe.',
      score:'Score', streak:'Série', best:'Record',
      replay_sign:'↺ Rejouer le signe', correct:'✓ Correct !', wrong:'✗ C’était',
      next:'Suivant →', hidden_quiz:'caché pendant le quiz',

      saved_empty_t:'Aucun signe enregistré.',
      saved_empty_d:'Ouvrez un signe et appuyez sur Enregistrer pour bâtir votre liste.',
      saved_count:'{n} enregistrés',

      foot:'Signature assurée par le moteur d’avatar <b>JASigning</b> (système existant). Le jeu de données, la validation et la plateforme sont la contribution de cette thèse.',
      load_err_t:'Impossible de charger les données.',
      load_err_d:'Ouvrez le site via un serveur web, pas un chemin file://.'
    },

    en: {
      dir:'ltr', name:'English',
      app_title:'Algerian Sign Language Dictionary',
      app_subtitle:'A validated, avatar-ready lexicon',
      count_signs:'{n} signs',
      theme_light:'Light mode', theme_dark:'Dark mode', language:'Language',

      tab_explore:'Explore', tab_dictionary:'Dictionary', tab_translate:'Text → Sign',
      tab_practice:'Practice', tab_saved:'Saved',

      ctrl_replay:'Replay', ctrl_slow:'Slow', ctrl_loop:'Loop', ctrl_save:'Save',
      behind_title:'Behind the sign', behind_sub:'the HamNoSys / SiGML encoding',
      behind_note:'This is the machine-readable HamNoSys notation, serialised as SiGML — the same data the avatar renders. It is what makes the dictionary portable and reusable.',
      meta_symbols:'{n} notation symbols', meta_two:'two-handed', meta_one:'one-handed',
      meta_validated:'validated in this work', meta_3dz:'from 3DZSignDB',
      src_validated:'Newly validated', src_3dz:'3DZSignDB',

      hero_h2:'The largest avatar-ready dictionary of Algerian Sign Language.',
      hero_p:'Every sign here is validated and encoded in HamNoSys, serialised as SiGML — machine-readable and rendered live by a 3D avatar.',
      stat_total:'signs total', stat_validated:'newly validated',
      stat_french:'with French', stat_two:'two-handed',
      coverage:'Coverage of the national dictionary', coverage_of:'of ~{total}',
      q_browse:'📖 Browse the dictionary', q_browse_d:'Search {n} signs in Arabic or French',
      q_translate:'⌨️ Text → Sign', q_translate_d:'Type Arabic, watch it signed',
      q_practice:'🎯 Practice', q_practice_d:'Learn signs with a quick quiz',
      sotd:'Sign of the day', watch:'▶ Watch',

      search_ph:'Search in Arabic or French…',
      filter_all:'All',
      count_n:'{n} signs',
      categories_title:'Choose a category', categories_sub:'Start anywhere — you can return anytime',
      cat_by_theme:'By theme', cat_by_pos:'By part of speech',
      cat_all_signs:'All signs', back_categories:'← Categories', n_signs:'{n} signs',

      ta_ph:'Type a sentence in Arabic…  (e.g. أنا أحب بيت كبير)',
      sign_it:'▶ Sign it', clear:'Clear',
      translate_hint:'Each known word is signed in order. Unknown words are flagged.',
      not_added:'not yet added',

      quiz_title:'Guess the sign', quiz_prompt:'Watch the avatar, then choose the word it is signing.',
      score:'Score', streak:'Streak', best:'Best',
      replay_sign:'↺ Replay sign', correct:'✓ Correct!', wrong:'✗ It was',
      next:'Next →', hidden_quiz:'hidden during quiz',

      saved_empty_t:'No saved signs yet.',
      saved_empty_d:'Open any sign and tap Save to build your study list.',
      saved_count:'{n} saved',

      foot:'Signing powered by the <b>JASigning</b> avatar engine (existing). Dataset, validation &amp; platform are the contribution of this thesis.',
      load_err_t:'Couldn’t load the dataset.',
      load_err_d:'Open this site through a web server, not a file:// path.'
    }
  };

  var LANGS = ['ar','fr','en'];
  var lang = (function(){ var s = localStorage.getItem('alsl_lang'); return (s && STR[s]) ? s : 'ar'; })();

  function getLang(){ return lang; }
  function langName(code){ return (STR[code]||{}).name || code; }
  function langs(){ return LANGS.slice(); }

  function t(key, vars){
    var s = (STR[lang] && STR[lang][key] != null) ? STR[lang][key]
          : (STR.en[key] != null ? STR.en[key] : key);
    if (vars) s = s.replace(/\{(\w+)\}/g, function(_, k){ return vars[k] != null ? vars[k] : '{'+k+'}'; });
    return s;
  }

  function dir(){ return STR[lang].dir; }

  function applyDir(){
    var html = document.documentElement;
    html.setAttribute('lang', lang);
    html.setAttribute('dir', STR[lang].dir);
  }

  function applyStaticI18n(root){
    root = root || document;
    root.querySelectorAll('[data-i18n]').forEach(function(el){ el.textContent = t(el.getAttribute('data-i18n')); });
    root.querySelectorAll('[data-i18n-html]').forEach(function(el){ el.innerHTML = t(el.getAttribute('data-i18n-html')); });
    root.querySelectorAll('[data-i18n-ph]').forEach(function(el){ el.setAttribute('placeholder', t(el.getAttribute('data-i18n-ph'))); });
    root.querySelectorAll('[data-i18n-title]').forEach(function(el){ el.setAttribute('title', t(el.getAttribute('data-i18n-title'))); });
  }

  function setLang(code){
    if(!STR[code]) return;
    lang = code; localStorage.setItem('alsl_lang', code);
    applyDir();
    if (typeof global.onLangChange === 'function') global.onLangChange();
  }

  global.I18N = { t:t, getLang:getLang, setLang:setLang, langName:langName, langs:langs, dir:dir, applyDir:applyDir, applyStaticI18n:applyStaticI18n };
  global.t = t;
})(window);
