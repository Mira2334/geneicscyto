// ---- Tabs & background ----
const $ = (s, el=document) => el.querySelector(s);
const $$ = (s, el=document) => Array.from(el.querySelectorAll(s));

$$('.tab').forEach(sec => {
  if (sec.dataset.bg) {
    // apply background image
    sec.style.setProperty('--bg-url', `url(${sec.dataset.bg})`)
  }
});
// Polyfill for css attr(url) which is not broadly supported: set via inline style
$$('.with-hero').forEach(sec => {
  const bg = sec.getAttribute('data-bg');
  if (bg) sec.style.setProperty('backgroundImage', `url(${bg})`);
  sec.style.backgroundSize = 'cover';
  sec.style.backgroundPosition = 'center';
  sec.style.backgroundAttachment = 'fixed';
  sec.style.setProperty('backgroundColor', '#ffffff55');
});

const tabs = $$('.tab-btn');
const sections = $$('.tab');
tabs.forEach(btn=>btn.addEventListener('click', () => {
  tabs.forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  const id = btn.dataset.tab;
  sections.forEach(s=>s.classList.toggle('active', s.id===id));

  // If user leaves TEST while attempt is active -> lock immediately
  if (id !== 'test' && localStorage.getItem('gen_test_started') === '1') {
    lockTest('Вы покинули вкладку — тест завершён.');
  }
}));

// ---- Tasks data ----
const tfStatements = [
  "Хромосомы являются носителями наследственной информации.",
  "При мейозе каждая пара гомологичных хромосом расходится в разные гаметы.",
  "Моногибридное скрещивание — это скрещивание организмов, отличающихся по трём признакам.",
  "При моногибридном скрещивании изучается наследование одного признака.",
  "При мейозе число хромосом в клетке увеличивается в два раза.",
  "Гены, отвечающие за один и тот же признак, могут находиться в одинаковых или разных состояниях (аллелях).",
  "При оплодотворении зигота получает по одному набору хромосом от каждого родителя.",
  "В процессе мейоза возможен кроссинговер, который усиливает разнообразие наследственных комбинаций.",
  "Гомозиготный организм имеет два одинаковых аллеля одного гена.",
  "Результаты моногибридного скрещивания можно предсказать с помощью решётки Пеннета."
];
const tfKey = [true, true, false, true, false, true, true, true, true, true];

const tfList = $('#tf-list');
tfStatements.forEach((t,i)=>{
  const li = document.createElement('li');
  li.innerHTML = `<span>${i+1}. ${t}</span>
    <select data-i="${i}">
      <option value="">— выбери —</option>
      <option value="true">Верно</option>
      <option value="false">Неверно</option>
    </select>`;
  tfList.appendChild(li);
});
$('#check-tf').addEventListener('click', ()=>{
  let correct=0, filled=true;
  $$('#tf-list select').forEach(sel=>{
    if (!sel.value) filled=false;
    else if ((sel.value==='true') === tfKey[+sel.dataset.i]) correct++;
  });
  if (!filled){ $('#tf-result').textContent='Заполни все пункты!'; $('#tf-result').className='result bad'; return; }
  $('#tf-result').textContent=`Верно: ${correct} из ${tfKey.length}`;
  $('#tf-result').className = correct>=8 ? 'result good' : 'result bad';
  $('#show-tf-key').disabled=false;
});
$('#show-tf-key').addEventListener('click', ()=>{
  $$('#tf-list select').forEach(sel=>{
    const isTrue = tfKey[+sel.dataset.i];
    sel.value = String(isTrue);
  });
  $('#tf-result').textContent='Ответы заполнены по ключу.';
});

// Matching
const matchPairs = [
  { left:"1. Аллель", key:'В', right:"В) Разные состояния одного гена" },
  { left:"2. Генотип", key:'Г', right:"Г) Совокупность всех генов организма" },
  { left:"3. Фенотип", key:'А', right:"А) Совокупность всех признаков организма" },
  { left:"4. Гомозигота", key:'Б', right:"Б) Два одинаковых аллеля одного гена" },
  { left:"5. Гетерозигота", key:'Д', right:"Д) Два разных аллеля одного гена" },
];
const letters = ['А','Б','В','Г','Д'];
const matchArea = $('#match-area');
matchPairs.forEach((p,i)=>{
  const row = document.createElement('div');
  row.className='row';
  row.innerHTML = `<div>${p.left}</div>
    <select data-i="${i}">
      <option value="">— выбери —</option>
      ${letters.map(L=>`<option value="${L}">${L}</option>`).join('')}
    </select>`;
  matchArea.appendChild(row);
});
$('#check-match').addEventListener('click', ()=>{
  let correct=0, filled=true;
  $$('#match-area select').forEach(sel=>{
    if(!sel.value) filled=false;
    else if(sel.value===matchPairs[+sel.dataset.i].key) correct++;
  });
  if (!filled){ $('#match-result').textContent='Заполни все соответствия!'; $('#match-result').className='result bad'; return; }
  $('#match-result').textContent=`Верно: ${correct} из ${matchPairs.length}`;
  $('#match-result').className = correct>=4 ? 'result good' : 'result bad';
  $('#show-match-key').disabled=false;
});
$('#show-match-key').addEventListener('click', ()=>{
  $$('#match-area select').forEach(sel=>{
    sel.value = matchPairs[+sel.dataset.i].key;
  });
  $('#match-result').textContent='Ответы заполнены по ключу.';
});

// Tasks free-form answers
const taskSolutions = {
  t1: `F₁: все Аа (чёрные). 
Если скрестить Аа × Аа: F₂ по генотипу 1АА : 2Аа : 1аа; по фенотипу 3 чёрные : 1 белая.`,
  t2: `Возможные генотипы: АА, Аа, аа.
Соотношение по генотипу: 1 : 2 : 1. 
Соотношение по фенотипу: 3 жёлтых : 1 зелёная.`
};
$('#task1-check').addEventListener('click', ()=>{
  if (!$('#task1-answer').value.trim()){ $('#task1-result').textContent='Сначала запиши своё решение.'; $('#task1-result').className='result bad'; return; }
  $('#task1-result').textContent='Ответ отправлен. Можешь сравнить с образцом.'; $('#task1-result').className='result good';
  $('#task1-solution').disabled=false;
});
$('#task1-solution').addEventListener('click', ()=>{
  $('#task1-result').textContent = taskSolutions.t1;
});
$('#task2-check').addEventListener('click', ()=>{
  if (!$('#task2-answer').value.trim()){ $('#task2-result').textContent='Сначала запиши своё решение.'; $('#task2-result').className='result bad'; return; }
  $('#task2-result').textContent='Ответ отправлен. Можешь сравнить с образцом.'; $('#task2-result').className='result good';
  $('#task2-solution').disabled=false;
});
$('#task2-solution').addEventListener('click', ()=>{
  $('#task2-result').textContent = taskSolutions.t2;
});

// ---- Test logic ----
const variantBtns = $$('.variant-btn');
let chosenVariant = '1';
variantBtns.forEach(b=>b.addEventListener('click', ()=>{
  if (localStorage.getItem('gen_test_started')==='1') return; // lock after start
  variantBtns.forEach(x=>x.classList.remove('active'));
  b.classList.add('active');
  chosenVariant = b.dataset.variant;
}));

const testData = {
  1: [
    {q:"Что является носителем наследственной информации в клетке?", opts:["Белки","ДНК","Рибосомы","Углеводы"], a:1},
    {q:"Как называются разные формы одного и того же гена?", opts:["Хромосомы","Аллели","Гаметы","Центромеры"], a:1},
    {q:"Если у организма генотип Аа, он является:", opts:["Гомозиготой доминантной","Гомозиготой рецессивной","Гетерозиготой","Гаплоидом"], a:2},
    {q:"Какой процесс лежит в основе образования гамет?", opts:["Митоз","Мейоз","Дупликация ДНК","Деление клетки на две части"], a:1},
    {q:"Доминантный признак проявляется у:", opts:["Только у гомозигот","Только у рецессивных особей","У гомо- и гетерозигот","Никогда"], a:2},
    {q:"Что показывает моногибридное скрещивание?", opts:["Наследование признака, контролируемого одной парой генов","Наследование нескольких признаков","Мутации","Изменчивость"], a:0},
    {q:"Какое расщепление по фенотипу наблюдается во втором поколении при моногибридном скрещивании гетерозигот (Аа × Аа)?", opts:["3:1","1:1","9:3:3:1","2:1"], a:0},
    {q:"В каком поколении всегда проявляется единообразие гибридов?", opts:["F₁","F₂","P","F₃"], a:0},
    {q:"Генотипы родителей в моногибридном скрещивании, если один гомозиготен доминантно, а другой рецессивно:", opts:["Аа × Аа","АА × аа","Аа × аа","АА × АА"], a:1},
    {q:"Какое расщепление по генотипу будет во втором поколении при Аа × Аа?", opts:["1:1","3:1","1:2:1","9:3:3:1"], a:2},
  ],
  2: [
    {q:"Что изучает генетика?", opts:["Взаимосвязь организмов в экосистеме","Наследственность и изменчивость","Фотосинтез","Развитие эмбриона"], a:1},
    {q:"Что означает запись “АА”?", opts:["Гомозигота доминантная","Гомозигота рецессивная","Гетерозигота","Аллель"], a:0},
    {q:"Как называется полный набор хромосом клетки?", opts:["Генотип","Кариотип","Фенотип","Гамета"], a:1},
    {q:"Какой генотип будет у гамет организма Аа?", opts:["А и а","АА","аа","Аа"], a:0},
    {q:"Какой термин обозначает внешние признаки организма?", opts:["Генотип","Аллель","Фенотип","Хромосома"], a:2},
    {q:"Какое соотношение по фенотипу получится в F₂ при скрещивании Аа × Аа, если А — красный цвет цветков, а — белый?", opts:["1 красный : 1 белый","3 красных : 1 белый","2 красных : 1 белый","4 красных"], a:1},
    {q:"Какой генетический закон объясняет единообразие гибридов первого поколения?", opts:["Закон расщепления","Закон доминирования","Закон сцепленного наследования","Закон независимого наследования"], a:1},
    {q:"Что образуется после мейоза?", opts:["Диплоидные клетки","Четыре гаплоидные гаметы","Две одинаковые клетки","Споры и ризоиды"], a:1},
    {q:"Какой генотип будет у всех особей F₁ при скрещивании АА × аа?", opts:["Аа","АА","аа","1 АА : 1 аа"], a:0},
    {q:"Какое соотношение по генотипу в F₂ при Аа × Аа?", opts:["1:1","1:2:1","3:1","2:2"], a:1},
  ]
};

const form = $('#test-form');
function renderTest(variant){
  form.innerHTML = '';
  testData[variant].forEach((item, idx) => {
    const div = document.createElement('div');
    div.className='q-card';
    div.innerHTML = `<div class="q-title">${idx+1}. ${item.q}</div>
      <div class="options">
        ${item.opts.map((o, i)=>`
          <label>
            <input type="radio" name="q${idx}" value="${i}" />
            <span>${"АБВГ"[i]}) ${o}</span>
          </label>`).join('')}
      </div>`;
    form.appendChild(div);
  });
}
renderTest(chosenVariant);

// Timer & attempt lock
let timeLeft = 180; // seconds
let tick=null;

function formatTime(s){
  const m = Math.floor(s/60).toString().padStart(2,'0');
  const ss = (s%60).toString().padStart(2,'0');
  return `${m}:${ss}`;
}

function startTimer(){
  $('#timer').textContent = formatTime(timeLeft);
  tick = setInterval(()=>{
    timeLeft--;
    $('#timer').textContent = formatTime(timeLeft);
    if (timeLeft<=0){
      clearInterval(tick);
      lockTest('Время вышло!');
    }
  }, 1000);
}

function disableInputs(){
  $$('#test-form input').forEach(i=>i.disabled=true);
  $('#submit-test').disabled = true;
}

function lockTest(msg){
  localStorage.setItem('gen_test_done','1');
  disableInputs();
  $('#test-result').textContent = msg;
  $('#test-result').className='result bad';
  $('#show-score').disabled=false;
  $('#start-test').disabled=true;
}

function testAlreadyBlocked(){
  return localStorage.getItem('gen_test_done')==='1';
}

// Start test
$('#start-test').addEventListener('click', ()=>{
  if (testAlreadyBlocked()) return;
  const name = $('#student-name').value.trim();
  if (!name){ alert('Введите имя.'); return; }
  // Freeze UI and start
  localStorage.setItem('gen_test_started','1');
  $$('.variant-btn').forEach(b=>b.disabled=true);
  $('#start-test').disabled=true;
  $('#submit-test').disabled=false;
  renderTest(chosenVariant);
  startTimer();
});

// Submit & show score
$('#submit-test').addEventListener('click', ()=>{
  let correct=0;
  testData[chosenVariant].forEach((item, idx)=>{
    const mark = $(`input[name="q${idx}"]:checked`);
    if (mark && +mark.value === item.a) correct++;
  });
  const total = testData[chosenVariant].length;
  $('#test-result').textContent = `Баллы: ${correct} из ${total}`;
  $('#test-result').className = correct >= Math.ceil(total*0.7) ? 'result good':'result bad';
  $('#show-score').disabled=false;
  lockTest('Ответы зафиксированы.');
});

$('#show-score').addEventListener('click', ()=>{
  // reveal correct answers inline
  $$('.q-card').forEach((q,idx)=>{
    const right = testData[chosenVariant][idx].a;
    const opt = q.querySelectorAll('label')[right];
    if (opt) opt.style.outline = '2px solid #31d67b';
  });
});

// On load: block if attempt was used previously.
window.addEventListener('load', ()=>{
  if (testAlreadyBlocked()){
    disableInputs();
    $('#start-test').disabled = true;
    $('#test-result').textContent = 'Повторная попытка недоступна.';
    $('#test-result').className='result bad';
    $$('.variant-btn').forEach(b=>b.disabled=true);
  }
});

// Extra guard: if user tries to reload the page after starting — mark as done
window.addEventListener('beforeunload', ()=>{
  if (localStorage.getItem('gen_test_started')==='1' && localStorage.getItem('gen_test_done')!=='1'){
    localStorage.setItem('gen_test_done','1');
  }
});
