// Caccia ai Numeri - PWA v4 (iPhone-friendly)
(function(){
  // Install prompt
  var deferredPrompt = null;
  window.addEventListener('beforeinstallprompt', function(e){
    e.preventDefault();
    deferredPrompt = e;
    var btn = document.getElementById('installBtn');
    if (btn) {
      btn.hidden = false;
      btn.addEventListener('click', function(){
        try {
          btn.hidden = true;
          deferredPrompt.prompt();
          deferredPrompt = null;
        } catch (err) {}
      });
    }
  });

  // Service Worker registration
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function(){
      navigator.serviceWorker.register('service-worker.js');
    });
  }

  // Shorthands
  function $(id){return document.getElementById(id);}
  function show(id){$(id).classList.remove('hidden');}
  function hide(id){$(id).classList.add('hidden');}

  // LIM
  var limBtn = $('limBtn'), statusBar = $('statusBar'), updateBtn = $('updateBtn');
  function applyLIM(on){
    document.body.classList.toggle('lim', !!on);
    limBtn.textContent = on ? 'LIM: ON' : 'Modalita LIM';
    statusBar.style.display = on ? 'block' : 'none';
    try { localStorage.setItem('limMode','' + (on?1:0)); } catch(e){}
  }
  limBtn.addEventListener('click', function(){ applyLIM(!document.body.classList.contains('lim')); });
  try { applyLIM(localStorage.getItem('limMode')==='1'); } catch(e){}

  // Update App button: clear caches and reload
  if (updateBtn){
    updateBtn.addEventListener('click', function(){
      if ('caches' in window) {
        caches.keys().then(function(keys){
          return Promise.all(keys.map(function(k){ return caches.delete(k); }));
        }).then(function(){ location.reload(true); });
      } else {
        location.reload(true);
      }
    });
  }

  // Random utils
  function rand(a,b){return Math.floor(Math.random()*(b-a+1))+a;}
  function shuffle(arr){for(var i=arr.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1));var t=arr[i];arr[i]=arr[j];arr[j]=t;}return arr;}

  // Generators (ASCII operators only)
  function genAddCarry(){
    return function(){
      var x=rand(10,90), y=rand(10,90), res=x+y;
      var choices=shuffle([res,res+1,res-1,res+10]);
      return { name:'Addizioni con cambio', prompt: x+' + '+y+' = ?', choices:choices, correct:choices.indexOf(res) };
    };
  }
  function genSubBorrow(){
    return function(){
      var x=rand(20,99), y=rand(10,19), res=x-y;
      var choices=shuffle([res,res+1,res-1,res+10]);
      return { name:'Sottrazioni con prestito', prompt: x+' - '+y+' = ?', choices:choices, correct:choices.indexOf(res) };
    };
  }
  function genSmallTables(){
    return function(){
      var tables=[2,5,10]; var table=tables[rand(0,2)]; var b=rand(1,10); var res=table*b;
      var choices=shuffle([res,res+table,res-table,res+rand(2,9)]);
      return { name:'Tabelline '+table, prompt: table+' * '+b+' = ?', choices:choices, correct:choices.indexOf(res) };
    };
  }
  function genGeometry(){
    return function(){
      var qs=[{p:'Quanti lati ha un triangolo?',a:3},{p:'Quanti lati ha un quadrato?',a:4},{p:'Quante facce ha un cubo?',a:6}];
      var q=qs[rand(0,qs.length-1)];
      var choices=shuffle([q.a,q.a+1,q.a-1,q.a+2]);
      return { name:'Geometria base', prompt: q.p, choices:choices, correct:choices.indexOf(q.a) };
    };
  }

  // Routes
  var routes = {
    mix: [genAddCarry(), genSubBorrow(), genSmallTables(), genGeometry()],
    add: [genAddCarry()],
    sub: [genSubBorrow()],
    tab: [genSmallTables()],
    geo: [genGeometry()]
  };

  // State
  var level=0, stars=0, done=0, total=8;
  var currentQuestion=null, currentRoute=routes.mix;

  function startGame(){
    var sel = $('percorso').value || 'mix';
    currentRoute = routes[sel] || routes.mix;
    level=0; stars=0; done=0; total=8;
    hide('intro'); hide('howto'); hide('summary'); show('game');
    $('stars').textContent = stars;
    $('progress').textContent = done;
    $('total').textContent = total;
    $('levelName').textContent = currentRoute[0]().name;
    nextQuestion(true);
    window.scrollTo(0,0);
  }

  function nextQuestion(resetTitle){
    $('nextBtn').classList.add('hidden');
    $('choices').innerHTML='';
    var gen = currentRoute[Math.min(level, currentRoute.length-1)];
    currentQuestion = gen();
    if (resetTitle) $('levelName').textContent = currentQuestion.name;
    $('prompt').textContent = currentQuestion.prompt;
    for (var i=0;i<currentQuestion.choices.length;i++){
      (function(idx){
        var c = currentQuestion.choices[idx];
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'choice';
        btn.textContent = String(c);
        btn.addEventListener('click', function(){ selectChoice(idx, btn); }, { once:true });
        $('choices').appendChild(btn);
      })(i);
    }
  }

  function selectChoice(idx, el){
    var correct = idx === currentQuestion.correct;
    el.classList.add(correct ? 'correct' : 'wrong');
    var nodes = document.querySelectorAll('.choice');
    for (var i=0;i<nodes.length;i++){ nodes[i].disabled = true; }
    if (correct){
      stars += 1; done += 1;
      $('stars').textContent = stars;
      $('progress').textContent = done;
    }
    if (done >= total){
      endGame();
    } else {
      if (done % 2 === 0){
        level = Math.min(level + 1, currentRoute.length - 1);
        $('levelName').textContent = currentRoute[level]().name;
      }
      $('nextBtn').classList.remove('hidden');
      window.scrollTo(0,0);
    }
  }

  function endGame(){
    hide('game'); show('summary');
    $('finalStars').textContent = stars.toFixed(1);
    $('feedback').textContent = (stars >= total*0.9) ? 'Ottimo lavoro!' : (stars >= total*0.6) ? 'Ben fatto! Continua ad allenarti.' : 'Buon inizio! Riprova per migliorare.';
    window.scrollTo(0,0);
  }

  // Wire UI
  document.addEventListener('DOMContentLoaded', function(){
    $('menuBtn').addEventListener('click', function(){ hide('game'); show('intro'); window.scrollTo(0,0); });
    $('howBtn').addEventListener('click', function(){ hide('intro'); show('howto'); });
    $('backIntro').addEventListener('click', function(){ hide('howto'); show('intro'); });
    $('playBtn').addEventListener('click', startGame);
    $('againBtn').addEventListener('click', startGame);
    $('homeBtn').addEventListener('click', function(){ hide('summary'); show('intro'); });
    $('skipBtn').addEventListener('click', function(){ stars = Math.max(0, stars - 0.5); nextQuestion(false); });
    $('nextBtn').addEventListener('click', function(){ nextQuestion(false); });
  });
})();