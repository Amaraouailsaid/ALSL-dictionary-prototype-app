const NATIONAL_TOTAL = 1500;
const $ = (s, r=document) => r.querySelector(s);
const $$ = (s, r=document) => Array.from(r.querySelectorAll(s));
const esc = s => (s||'').replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const signUrl = id => new URL('signs/'+id+'.sigml', location.href).href;

function normAr(s){
  return (s||'')
    .replace(/[ً-ْـٰ]/g,'')
    .replace(/[آأإٱ]/g,'ا')
    .replace(/ى/g,'ي')
    .replace(/ة/g,'ه')
    .replace(/[ؤئ]/g,'ء')
    .trim().toLowerCase();
}

const State = {
  signs: [], byId: {}, normIndex: {},
  cats: { pos:[], themes:[], posTag:{}, themeTag:{} },
  favs: new Set(JSON.parse(localStorage.getItem('alsl_favs')||'[]')),
  quiz: JSON.parse(localStorage.getItem('alsl_quiz')||'{"score":0,"best":0,"streak":0}'),
  speed: 1, loop: false, currentId: null, quizMode: false, tab: 'explore'
};
function saveFavs(){ localStorage.setItem('alsl_favs', JSON.stringify([...State.favs])); }
function saveQuiz(){ localStorage.setItem('alsl_quiz', JSON.stringify(State.quiz)); }

let signerReadyFlag = false, signerQueue = [];
window.signerReady = () => { signerReadyFlag = true; signerQueue.forEach(f=>f()); signerQueue=[]; };
function avatar(){ const f=$('#avatar'); return f && f.contentWindow && f.contentWindow.AVATAR; }
function withAvatar(fn){ const a=avatar(); if(signerReadyFlag && a){ fn(a); } else { signerQueue.push(()=>{const a2=avatar(); if(a2) fn(a2);}); } }
function signOpts(sign, extra){
  return Object.assign({label:sign.ar, fr:sign.fr||'', url:signUrl(sign.id),
    n:sign.n, speed:State.speed, loop:State.loop}, extra||{});
}
function playSign(sign, opts){ withAvatar(a=>a.play(signOpts(sign,opts))); }
function playSequence(signs){ withAvatar(a=>a.playSequence(signs.map(s=>({label:s.ar,fr:s.fr||'',url:signUrl(s.id),n:s.n})),{speed:State.speed})); }

function dispName(s){
  const l = I18N.getLang();
  if(l==='fr') return { main:s.fr||s.ar, mainAr:!s.fr, sub:s.ar, subAr:true };
  if(l==='en') return { main:s.en||s.fr||s.ar, mainAr:!(s.en||s.fr), sub:s.ar, subAr:true };
  return { main:s.ar, mainAr:true, sub:s.fr||'', subAr:false };
}

function setCurrent(id){
  State.quizMode = false;
  const s = State.byId[id]; if(!s) return;
  State.currentId = id;
  const d = dispName(s);
  $('#np-word').textContent = d.main; $('#np-word').classList.toggle('ar', d.mainAr);
  $('#np-fr').textContent = d.sub;   $('#np-fr').classList.toggle('ar', d.subAr);
  const badge = $('#np-src');
  badge.textContent = s.source==='validated' ? t('src_validated') : t('src_3dz');
  badge.className = 'srcbadge' + (s.source==='validated'?' val':'');
  syncFavBtn();
  loadBehind(s);
  playSign(s);
  $$('.word.active').forEach(w=>w.classList.remove('active'));
  const card = $('#w-'+id); if(card) card.classList.add('active');
}
function syncFavBtn(){ $('#c-fav').classList.toggle('on', State.favs.has(State.currentId)); }

async function loadBehind(s){
  const meta = $('#behind-meta'), tags = $('#behind-tags');
  meta.innerHTML = `<span class="chipstat">${t('meta_symbols',{n:'<b>'+s.n+'</b>'})}</span>
    <span class="chipstat">${s.two?t('meta_two'):t('meta_one')}</span>
    <span class="chipstat">${s.source==='validated'?t('meta_validated'):t('meta_3dz')}</span>`;
  tags.innerHTML = '<span class="htag">…</span>';
  try{
    const txt = await (await fetch('signs/'+s.id+'.sigml')).text();
    const m = txt.match(/<hamnosys_manual>([\s\S]*?)<\/hamnosys_manual>/);
    const names = m ? (m[1].match(/<ham[^/>]*\/>/g)||[]).map(t=>t.replace(/<ham|\/>/g,'')) : [];
    tags.innerHTML = names.slice(0,80).map(n=>`<span class="htag">${esc(n)}</span>`).join('') || '<span class="htag">—</span>';
  }catch(e){ tags.innerHTML = '<span class="htag">—</span>'; }
}

$('#c-replay').onclick = ()=>{ if(State.quizMode){ replayQuiz(); } else if(State.currentId){ playSign(State.byId[State.currentId]); } };
$('#c-slow').onclick = function(){ State.speed = State.speed===1?0.5:1; this.classList.toggle('on', State.speed===0.5);
  refreshControls();
  if(State.quizMode) replayQuiz(); else if(State.currentId) playSign(State.byId[State.currentId]); };
$('#c-loop').onclick = function(){ State.loop = !State.loop; this.classList.toggle('on', State.loop);
  if(State.currentId && !State.quizMode) playSign(State.byId[State.currentId]); };
$('#c-fav').onclick = function(){ if(!State.currentId) return;
  if(State.favs.has(State.currentId)) State.favs.delete(State.currentId); else State.favs.add(State.currentId);
  saveFavs(); syncFavBtn(); if(State.tab==='saved') render(); };

function refreshControls(){
  const sp = $('#c-slow span'); if(sp) sp.textContent = t('ctrl_slow') + (State.speed===0.5?' ✓':'');
}

$('#tabs').addEventListener('click', e=>{
  const b = e.target.closest('.tab'); if(!b) return;
  State.tab = b.dataset.tab;
  $$('.tab').forEach(t=>t.classList.toggle('active', t===b));
  render();
});
function go(tab){ State.tab=tab; $$('.tab').forEach(t=>t.classList.toggle('active',t.dataset.tab===tab)); render(); }

function render(){
  const p = $('#panel'); p.className='panelbody fade';
  if(State.tab==='explore') renderExplore(p);
  else if(State.tab==='dictionary') renderDictionary(p);
  else if(State.tab==='translate') renderTranslate(p);
  else if(State.tab==='practice') renderPractice(p);
  else if(State.tab==='saved') renderSaved(p);
}

function renderExplore(p){
  const total=State.signs.length;
  const val=State.signs.filter(s=>s.source==='validated').length;
  const fr=State.signs.filter(s=>s.fr).length;
  const two=State.signs.filter(s=>s.two).length;
  const cov=Math.round(total/NATIONAL_TOTAL*100);
  p.innerHTML = `
   <div class="card hero">
     <h2>${t('hero_h2')}</h2>
     <p>${t('hero_p')}</p>
     <div class="stats">
       <div class="stat"><div class="n" data-to="${total}">0</div><div class="l">${t('stat_total')}</div></div>
       <div class="stat"><div class="n" data-to="${val}">0</div><div class="l">${t('stat_validated')}</div></div>
       <div class="stat"><div class="n" data-to="${fr}">0</div><div class="l">${t('stat_french')}</div></div>
       <div class="stat"><div class="n" data-to="${two}">0</div><div class="l">${t('stat_two')}</div></div>
     </div>
     <div class="bar"><i id="covbar"></i></div>
     <div class="coverage-l"><span>${t('coverage')}</span><span><b style="color:var(--emerald)">~${cov}%</b> ${t('coverage_of',{total:NATIONAL_TOTAL})}</span></div>
     <div class="quick">
       <button class="qbtn" data-go="dictionary"><div class="t">${t('q_browse')}</div><div class="d">${t('q_browse_d',{n:total})}</div></button>
       <button class="qbtn" data-go="translate"><div class="t">${t('q_translate')}</div><div class="d">${t('q_translate_d')}</div></button>
       <button class="qbtn" data-go="practice"><div class="t">${t('q_practice')}</div><div class="d">${t('q_practice_d')}</div></button>
     </div>
     <div class="sotd" id="sotd"></div>
   </div>`;
  $$('.qbtn').forEach(b=>b.onclick=()=>go(b.dataset.go));
  $$('[data-to]').forEach(animateCount);
  requestAnimationFrame(()=>{ $('#covbar').style.width = cov+'%'; });
  const day = Math.floor(Date.now()/864e5);
  const s = State.signs[day % State.signs.length];
  const sd = $('#sotd');
  sd.innerHTML = `<div><div class="lab">${t('sotd')}</div><div class="w ar">${esc(s.ar)}</div>
     <div class="fr">${esc(s.fr||'—')}</div></div><button class="btn" id="sotd-play">${t('watch')}</button>`;
  $('#sotd-play').onclick = ()=>setCurrent(s.id);
}
function animateCount(el){
  const to=+el.dataset.to, t0=performance.now(), dur=900;
  function tick(t){ const k=Math.min(1,(t-t0)/dur); el.textContent=Math.round(to*(1-Math.pow(1-k,3))); if(k<1) requestAnimationFrame(tick); }
  requestAnimationFrame(tick);
}

let dictState={q:'',src:'all',mode:'theme',cat:null};
function bySource(){ return State.signs.filter(s=> dictState.src==='all' || s.source===dictState.src); }
function searchResults(){
  const q=normAr(dictState.q), ql=dictState.q.trim().toLowerCase();
  return bySource().filter(s=> normAr(s.ar).includes(q) || (s.fr||'').toLowerCase().includes(ql) || (s.en||'').toLowerCase().includes(ql));
}
function tagOf(s){ return dictState.mode==='theme' ? State.cats.themeTag[s.id] : State.cats.posTag[s.id]; }
function signsInCat(){
  if(dictState.cat==='all' || !dictState.cat) return bySource();
  return bySource().filter(s=> tagOf(s)===dictState.cat);
}
function countIn(id){ return bySource().filter(s=> tagOf(s)===id).length; }
function catMeta(id){ const arr = dictState.mode==='theme'?State.cats.themes:State.cats.pos; return arr.find(m=>m.id===id); }
function catLabel(m){ const l=I18N.getLang(); return m[l]||m.en||m.id; }

function renderDictionary(p){
  p.innerHTML = `
    <div class="search"><svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4-4"/></svg>
      <input id="q" dir="auto" placeholder="${esc(t('search_ph'))}" value="${esc(dictState.q)}"/></div>
    <div class="filters">
      <button class="fchip ${dictState.src==='all'?'on':''}" data-src="all">${t('filter_all')}</button>
      <button class="fchip ${dictState.src==='validated'?'on':''}" data-src="validated">${t('src_validated')}</button>
      <button class="fchip ${dictState.src==='3DZSignDB'?'on':''}" data-src="3DZSignDB">${t('src_3dz')}</button>
    </div>
    <div id="dictbody"></div>`;
  const input=$('#q');
  input.oninput = ()=>{ dictState.q=input.value; drawDictBody(); };
  $$('.filters .fchip').forEach(b=>b.onclick=()=>{ dictState.src=b.dataset.src;
    $$('.filters .fchip').forEach(x=>x.classList.toggle('on',x===b)); drawDictBody(); });
  drawDictBody();
}
function listGrid(res){
  return `<div class="list" id="list">${res.slice(0,600).map(s=>{
    const d=dispName(s);
    return `<button class="word ${s.id===State.currentId?'active':''}" id="w-${s.id}" data-id="${s.id}">
      <span class="dot ${s.source==='validated'?'val':''}"></span>
      <div class="w ${d.mainAr?'ar':''}">${esc(d.main)}</div>
      <div class="fr ${d.subAr?'ar':''}">${esc(d.sub)}</div>
    </button>`;
  }).join('')}</div>`;
}
function wireList(){ $$('#list .word').forEach(b=>b.onclick=()=>setCurrent(b.dataset.id)); }

function categoryPickerHTML(){
  const meta = dictState.mode==='theme' ? State.cats.themes : State.cats.pos;
  const allCard = `<button class="catcard" data-cat="all"><div class="ico">🗂️</div>
      <div class="nm">${t('cat_all_signs')}</div><div class="ct">${t('n_signs',{n:bySource().length})}</div></button>`;
  const cards = meta.map(m=>`<button class="catcard" data-cat="${m.id}"><div class="ico">${m.icon}</div>
      <div class="nm">${esc(catLabel(m))}</div><div class="ct">${t('n_signs',{n:countIn(m.id)})}</div></button>`);
  return `<div class="cats">
    <div class="chead"><h2>${t('categories_title')}</h2><p>${t('categories_sub')}</p></div>
    <div class="catmodes">
      <button class="fchip ${dictState.mode==='theme'?'on':''}" data-mode="theme">${t('cat_by_theme')}</button>
      <button class="fchip ${dictState.mode==='pos'?'on':''}" data-mode="pos">${t('cat_by_pos')}</button>
    </div>
    <div class="catgrid">${allCard}${cards.join('')}</div>
  </div>`;
}
function drawDictBody(){
  const body=$('#dictbody');
  if(dictState.q.trim()){
    const res=searchResults();
    body.innerHTML = `<div class="count">${t('count_n',{n:res.length})}</div>` + listGrid(res);
    wireList(); return;
  }
  if(!dictState.cat){
    body.innerHTML = categoryPickerHTML();
    $$('#dictbody .catmodes .fchip').forEach(b=>b.onclick=()=>{ dictState.mode=b.dataset.mode; drawDictBody(); });
    $$('#dictbody .catcard').forEach(b=>b.onclick=()=>{ dictState.cat=b.dataset.cat; drawDictBody(); });
    return;
  }

  const res=signsInCat();
  const title = dictState.cat==='all' ? t('cat_all_signs') : (catMeta(dictState.cat)?catLabel(catMeta(dictState.cat)):'');
  body.innerHTML = `<button class="backcat" id="backcat">${t('back_categories')}</button>
    <div class="dicthead"><div class="ttl">${esc(title)}</div><div class="count">${t('count_n',{n:res.length})}</div></div>`
    + listGrid(res);
  $('#backcat').onclick=()=>{ dictState.cat=null; drawDictBody(); };
  wireList();
}

function findSign(tk){
  const n = normAr(tk);
  if(!n) return null;
  if(State.normIndex[n]) return State.normIndex[n];
  if(n.length>3 && n.startsWith('ال') && State.normIndex[n.slice(2)]) return State.normIndex[n.slice(2)];
  let best=null;
  for(const s of State.signs){
    const a=s.norm; if(!a || a.length<3) continue;
    const short = a.length<n.length ? a : n, long = a.length<n.length ? n : a;
    if(long.startsWith(short) && long.length-short.length<=2 && (!best || a.length>best.norm.length)) best=s;
  }
  return best;
}

let seqTimer=null;
function renderTranslate(p){
  p.innerHTML = `
    <div class="card" style="padding:20px">
      <textarea class="ta ar" id="ta" placeholder="${esc(t('ta_ph'))}"></textarea>
      <div class="row">
        <button class="btn" id="t-go">${t('sign_it')}</button>
        <button class="btn ghost" id="t-clear">${t('clear')}</button>
        <span style="font-size:12px;color:var(--muted)">${t('translate_hint')}</span>
      </div>
      <div class="playlist" id="pl"></div>
    </div>`;
  $('#t-clear').onclick=()=>{ $('#ta').value=''; $('#pl').innerHTML=''; if(seqTimer)clearInterval(seqTimer); withAvatar(a=>a.stop&&a.stop()); };
  $('#t-go').onclick=()=>{
    if(seqTimer) clearInterval(seqTimer);
    const raw=$('#ta').value.trim(); if(!raw) return;
    const toks=raw.split(/[\s،.؟!?,;:،؟]+/).filter(Boolean);
    const items=toks.map(tk=>({tk, sign:findSign(tk)}));
    const found=items.filter(i=>i.sign);
    $('#pl').innerHTML = items.map((it,i)=>it.sign
      ? `<button class="tok found" data-i="${i}" data-id="${it.sign.id}">${esc(it.tk)}<small>${esc(it.sign.fr||'')}</small></button>`
      : `<span class="tok miss">${esc(it.tk)}<small>${t('not_added')}</small></span>`).join('');
    $$('#pl .tok.found').forEach(b=>b.onclick=()=>setCurrent(b.dataset.id));
    if(!found.length) return;
    playSequence(found.map(f=>f.sign));
    let k=0; const cadence=1700/State.speed;
    const mark=()=>{ $$('#pl .tok.playing').forEach(x=>x.classList.remove('playing'));
      if(k>=found.length) return; const idx=items.indexOf(found[k]);
      const el=$(`#pl .tok[data-i="${idx}"]`); if(el) el.classList.add('playing'); k++; };
    mark(); seqTimer=setInterval(()=>{ if(k>=found.length){clearInterval(seqTimer);
      setTimeout(()=>$$('#pl .tok.playing').forEach(x=>x.classList.remove('playing')),cadence); return;} mark(); }, cadence);
  };
}

let quizAnswer=null;
function renderPractice(p){
  p.innerHTML = `
    <div class="card quizwrap">
      <div class="qhead">
        <div style="font-weight:700">${t('quiz_title')}</div>
        <div class="score">
          <span class="pill">${t('score')} <b id="q-score">${State.quiz.score}</b></span>
          <span class="pill streak">${t('streak')} <b id="q-streak">${State.quiz.streak}</b></span>
          <span class="pill">${t('best')} <b id="q-best">${State.quiz.best}</b></span>
        </div>
      </div>
      <div class="qprompt">${t('quiz_prompt')}</div>
      <div class="opts" id="opts"></div>
      <div class="qfoot" id="qfoot"></div>
    </div>`;
  nextQuestion();
}
function sample(arr,n,exclude){ const out=[],seen=new Set(exclude);
  while(out.length<n){ const x=arr[Math.floor(Math.random()*arr.length)]; if(!seen.has(x.id)){seen.add(x.id);out.push(x);} } return out; }
function nextQuestion(){
  State.quizMode=true;
  const ans=State.signs[Math.floor(Math.random()*State.signs.length)];
  quizAnswer=ans;
  const opts=sample(State.signs,3,[ans.id]).concat(ans).sort(()=>Math.random()-0.5);
  $('#np-word').textContent='؟'; $('#np-fr').textContent=''; $('#np-src').textContent=''; $('#np-src').className='srcbadge';
  $('#behind-meta').innerHTML=''; $('#behind-tags').innerHTML=`<span class="htag">${t('hidden_quiz')}</span>`;
  withAvatar(a=>a.play({label:'', fr:'', url:signUrl(ans.id), n:ans.n, speed:State.speed, loop:false}));
  $('#opts').innerHTML = opts.map(o=>{ const d=dispName(o);
    return `<button class="opt ${d.mainAr?'ar':''}" data-id="${o.id}">${esc(d.main)}</button>`; }).join('');
  $('#qfoot').innerHTML = `<button class="btn ghost" id="q-replay">${t('replay_sign')}</button>`;
  $('#q-replay').onclick=()=>withAvatar(a=>a.play({label:'',url:signUrl(ans.id),n:ans.n,speed:State.speed}));
  $$('#opts .opt').forEach(b=>b.onclick=()=>answer(b, opts));
}
function replayQuiz(){ if(quizAnswer) withAvatar(a=>a.play({label:'',url:signUrl(quizAnswer.id),n:quizAnswer.n,speed:State.speed})); }
function answer(btn, opts){
  const correct = btn.dataset.id===quizAnswer.id;
  $$('#opts .opt').forEach(b=>{ b.disabled=true;
    if(b.dataset.id===quizAnswer.id) b.classList.add('correct');
    else if(b===btn) b.classList.add('wrong'); });
  if(correct){ State.quiz.score++; State.quiz.streak++; State.quiz.best=Math.max(State.quiz.best,State.quiz.streak); }
  else { State.quiz.streak=0; }
  saveQuiz();
  $('#q-score').textContent=State.quiz.score; $('#q-streak').textContent=State.quiz.streak; $('#q-best').textContent=State.quiz.best;
  const dq=dispName(quizAnswer);
  $('#np-word').textContent=dq.main; $('#np-word').classList.toggle('ar',dq.mainAr);
  $('#np-fr').textContent=dq.sub;   $('#np-fr').classList.toggle('ar',dq.subAr);
  $('#qfoot').innerHTML = `<span class="feedback ${correct?'ok':'no'}">${correct?t('correct'):t('wrong')+' '+esc(dq.main)}</span>
     <button class="btn" id="q-next">${t('next')}</button>`;
  $('#q-next').onclick=nextQuestion;
}

function renderSaved(p){
  const items=[...State.favs].map(id=>State.byId[id]).filter(Boolean);
  if(!items.length){ p.innerHTML=`<div class="card empty"><div class="big">★</div>
    <div>${t('saved_empty_t')}</div><div style="font-size:13px;margin-top:6px">${t('saved_empty_d')}</div></div>`; return; }
  p.innerHTML = `<div class="count">${t('saved_count',{n:items.length})}</div>` + listGrid(items);
  wireList();
}

const MOON_SVG = '<svg viewBox="0 0 24 24"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>';
const SUN_SVG  = '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.4 1.4M17.6 17.6L19 19M19 5l-1.4 1.4M6.4 17.6L5 19"/></svg>';
function currentTheme(){ return document.documentElement.getAttribute('data-theme')==='light' ? 'light' : 'dark'; }
function applyThemeBtn(){
  const cur=currentTheme(); const btn=$('#themebtn');
  btn.innerHTML = cur==='light' ? SUN_SVG : MOON_SVG;
  btn.setAttribute('title', cur==='light' ? t('theme_light') : t('theme_dark'));
}
function setupControls(){
  const sel=$('#langsel');
  sel.innerHTML = I18N.langs().map(c=>`<option value="${c}"${c===I18N.getLang()?' selected':''}>${esc(I18N.langName(c))}</option>`).join('');
  sel.onchange=()=>I18N.setLang(sel.value);

  $('#themebtn').onclick=()=>{
    const next=currentTheme()==='light'?'dark':'light';
    document.documentElement.setAttribute('data-theme',next);
    localStorage.setItem('alsl_theme',next);
    applyThemeBtn();
  };
}
function applyI18nAll(){
  I18N.applyStaticI18n();
  document.title = t('app_title') + ' — ALSL';
  $('#topcount').textContent = t('count_signs',{n:State.signs.length});
  applyThemeBtn(); refreshControls();
}

window.onLangChange = ()=>{ applyI18nAll(); render(); };

(async function(){
  try{
    State.signs = await (await fetch('data/signs.json')).json();
  }catch(e){
    I18N.applyDir();
    $('#panel').innerHTML = `<div class="card empty"><div class="big">⚠️</div>
      <div>${t('load_err_t')}</div>
      <div style="font-size:13px;margin-top:8px;color:var(--muted)">${t('load_err_d')}</div></div>`;
    return;
  }
  try{ State.cats = await (await fetch('data/categories.json')).json(); }catch(e){  }
  let TR={}; try{ TR = await (await fetch('data/translations.json')).json(); }catch(e){  }
  State.signs.forEach(s=>{
    const tr=TR[s.id]; if(tr){ if(!s.fr) s.fr=tr.fr; s.en=tr.en; }
    State.byId[s.id]=s; s.norm=normAr(s.ar); if(!(s.norm in State.normIndex)) State.normIndex[s.norm]=s;
  });
  setupControls();
  I18N.applyDir();
  applyI18nAll();
  render();
})();
