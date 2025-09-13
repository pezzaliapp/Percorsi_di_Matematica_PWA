(function(){
  function $(id){return document.getElementById(id);} function on(el,ev,fn){if(el&&el.addEventListener)el.addEventListener(ev,fn);}
  function rand(a,b){return Math.floor(Math.random()*(b-a+1))+a;}
  function choice(arr){return arr[rand(0,arr.length-1)];}
  function shuffle(arr){for(var i=arr.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1));var t=arr[i];arr[i]=arr[j];arr[j]=t;}return arr;}

  // Non-repeating bank utility
  var seenQ=new Set(); function resetSeen(){seenQ.clear();}
  function makeBank(name, items){ return function(){ var q=null; for(var k=0;k<20;k++){ var cand=items[rand(0,items.length-1)]; if(!seenQ.has(cand.p)){ q=cand; break; } } if(!q) q=items[0]; seenQ.add(q.p); var o=q.o.slice(); shuffle(o); return {prompt:q.p, choices:o, correct:o.indexOf(q.a)}; }; }

  // Math generators (re-used from balanced set)
  function makeAddRange(minA,maxA,minB,maxB){ return function(){ var x=rand(minA,maxA), y=rand(minB,maxB), r=x+y; var o=shuffle([r,r+1,Math.max(0,r-1),r+10]); return {prompt:x+' + '+y+' = ?', choices:o, correct:o.indexOf(r)}; }; }
  function makeSubRange(minA,maxA,minB,maxB){ return function(){ var x=rand(minA,maxA), y=rand(minB,maxB); if(y>x){y=rand(0,x);} var r=x-y; var o=shuffle([r,r+1,Math.max(0,r-1),r+10]); return {prompt:x+' - '+y+' = ?', choices:o, correct:o.indexOf(r)}; }; }
  function makeTables(setTbl){ return function(){ var t=setTbl[rand(0,setTbl.length-1)], b=rand(1,10), r=t*b; var o=shuffle([r,r+t,Math.max(0,r-t),r+rand(2,9)]); return {prompt:t+' × '+b+' = ?', choices:o, correct:o.indexOf(r)}; }; }
  function makePerimeterSmall(minW,maxW,minH,maxH){ return function(){ var w=rand(minW,maxW), h=rand(minH,maxH), r=2*(w+h); var o=shuffle([r,r+2,Math.max(0,r-2),r+4]); return {prompt:'w='+w+', h='+h+' ⇒ P = ?', choices:o, correct:o.indexOf(r)}; }; }
  function makeDivisionExact(divisors){ return function(){ var a=divisors[rand(0,divisors.length-1)], q=rand(2,10), r=a*q; var o=shuffle([q,q+1,Math.max(0,q-1),q+2]); return {prompt:r+' ÷ '+a+' = ?', choices:o, correct:o.indexOf(q)}; }; }
  function makeFractionsEqSmall(){ return function(){ var n=rand(1,4), d=rand(2,9); if(n>=d){n=d-1;} var k=rand(2,4); var r=(n*k)+'/'+(d*k); var o=shuffle([r,(n*(k+1))+'/'+(d*(k+1)),(n*k+1)+'/'+(d*k),(n*k)+'/'+(d*k+1)]); return {prompt:'Equivalente di '+n+'/'+d+' ?', choices:o, correct:o.indexOf(r)}; }; }
  function makeDecimalsEasy(){ return function(){ var a=(rand(10,50)/10).toFixed(1), b=(rand(10,50)/10).toFixed(1); var r=(parseFloat(a)+parseFloat(b)).toFixed(1); var o=shuffle([r,(+r+0.1).toFixed(1),Math.max(0,(+r-0.1)).toFixed(1),(+r+1).toFixed(1)]); return {prompt:a+' + '+b+' = ?', choices:o, correct:o.indexOf(r)}; }; }
  function makeAreaRectSmall(){ return function(){ var b=rand(2,12), h=rand(2,12), r=b*h; var o=shuffle([r,r+2,Math.max(0,r-2),r+4]); return {prompt:'b='+b+', h='+h+' ⇒ A = ?', choices:o, correct:o.indexOf(r)}; }; }
  function makeAreaTriSmall(){ return function(){ var b=rand(2,20), h=rand(2,20), r=Math.round(0.5*b*h); var o=shuffle([r,r+1,Math.max(0,r-1),r+2]); return {prompt:'b='+b+', h='+h+' ⇒ A = ?', choices:o, correct:o.indexOf(r)}; }; }
  function makePercentBasic(){ return function(){ var p=[10,20,25,50][rand(0,3)], n=rand(40,400); var r=Math.round(n*p/100); var o=shuffle([r,r+5,Math.max(0,r-5),r+10]); return {prompt:p+'% di '+n+' = ?', choices:o, correct:o.indexOf(r)}; }; }
  function makeProportionFillSmall(){ return function(){ var a=rand(2,12), k=rand(2,9); var d=k*a; var o=shuffle([d,d+1,Math.max(0,d-1),d+2]); return {prompt:a+':'+(a*k)+' = '+k+': ?', choices:o, correct:o.indexOf(d)}; }; }
  function makeVolumeCuboidSmall(){ return function(){ var w=rand(2,8), h=rand(2,8), l=rand(2,8), r=w*h*l; var o=shuffle([r,r+4,Math.max(0,r-4),r+8]); return {prompt:'w='+w+', h='+h+', l='+l+' ⇒ V = ?', choices:o, correct:o.indexOf(r)}; }; }
  function genEq1(){ var a,b; return function(){ a=rand(1,9); var x=rand(1,12); b=rand(-9,9); var c=a*x + b; var r=x; var o=shuffle([r,r+1,r-1,r+2]); return {prompt:a+'x '+(b>=0?'+ '+b:b)+' = '+c+' ⇒ x = ?', choices:o, correct:o.indexOf(r)}; }; }
  function genPitagora(){ return function(){ var a=[3,5,6,8][rand(0,3)], b=[4,12,8,15][rand(0,3)]; var c=Math.round(Math.sqrt(a*a+b*b)); var o=shuffle([c,c+1,c-1,c+2]); return {prompt:'a='+a+', b='+b+' ⇒ c = ?', choices:o, correct:o.indexOf(c)}; }; }
  function genPercent(){ return makePercentBasic(); }
  function genLinearFuncValue(){ return function(){ var m=rand(-5,5); if(m===0)m=1; var q=rand(-10,10), x=rand(-5,5); var r=m*x+q; var o=shuffle([r,r+1,r-1,r+2]); return {prompt:'f(x)='+m+'x'+(q>=0?'+':'')+q+', x='+x+' ⇒ f(x)= ?', choices:o, correct:o.indexOf(r)}; }; }
  function genQuadraticRootsSimple(){ return function(){ var r1=rand(-5,5), r2=rand(-5,5); var sum=r1+r2; var o=shuffle([sum,sum+1,sum-1,sum+2]); return {prompt:'Somma delle radici di (x - '+r1+')(x - '+r2+') = 0 ?', choices:o, correct:o.indexOf(sum)}; }; }
  function genTrigNotable(){ return function(){ var angles=[0,30,45,60,90], a=angles[rand(0,angles.length-1)], which=['sin','cos'][rand(0,1)];
    var exact={'sin0':'0','sin30':'1/2','sin45':'√2/2','sin60':'√3/2','sin90':'1','cos0':'1','cos30':'√3/2','cos45':'√2/2','cos60':'1/2','cos90':'0'}[which+String(a)];
    var opts=['0','1/2','√2/2','√3/2', exact]; var o=[]; while(opts.length){ o.push(opts.splice(rand(0,opts.length-1),1)[0]); }
    return {prompt: which+'('+a+'°) = ?', choices:o, correct:o.indexOf(exact)}; }; }

  // ICT banks (Primaria, Medie, Liceo)
  function genInfoMouseKeyboard(){ return makeBank('ICT: mouse/tastiera',[
    {p:'Quale dispositivo muove il puntatore?', a:'Mouse', o:['Mouse','Tastiera','Monitor','Stampante']},
    {p:'Quale tasto crea uno spazio?', a:'Barra spaziatrice', o:['Barra spaziatrice','Invio','Shift','Esc']},
    {p:'Il tasto SHIFT serve per…', a:'Scrivere maiuscole e simboli', o:['Scrivere maiuscole e simboli','Spegnere il PC','Spostare file','Aprire la posta']}
  ]); }
  function genInfoHwSwBasics(){ return makeBank('ICT: hardware/software (base)',[
    {p:'La CPU è…', a:'Il processore del computer', o:['Il processore del computer','La memoria permanente','Un programma','La stampante']},
    {p:'Il software è…', a:'L’insieme dei programmi', o:['L’insieme dei programmi','La parte fisica','Solo Internet','Solo i giochi']},
    {p:'Un esempio di hardware è…', a:'La tastiera', o:['La tastiera','Il browser','Un file .docx','Un’app di posta']}
  ]); }
  function genInfoFiles(){ return makeBank('ICT: file/cartelle',[
    {p:'Estensione tipica di un’immagine', a:'.jpg', o:['.jpg','.docx','.pptx','.xlsx']},
    {p:'Il Cestino serve a…', a:'Conservare file eliminati temporaneamente', o:['Conservare file eliminati temporaneamente','Salvare password','Fare backup','Pulire lo schermo']},
    {p:'Una cartella può contenere…', a:'File e altre cartelle', o:['File e altre cartelle','Solo immagini','Solo testi','Solo programmi']}
  ]); }
  function genInfoBlocks(){ return makeBank('ICT: coding a blocchi',[
    {p:'\"Ripeti 10 volte\" è un…', a:'Ciclo (loop)', o:['Ciclo (loop)','Evento','Variabile','Immagine']},
    {p:'\"Se … allora\" serve per…', a:'Prendere decisioni', o:['Prendere decisioni','Disegnare','Salvare file','Aumentare il volume']},
    {p:'Una variabile è…', a:'Un contenitore di valori', o:['Un contenitore di valori','Una figura','Un suono','Una cartella']}
  ]); }
  function genInfoPasswords(){ return makeBank('ICT: password (base)',[
    {p:'Quale password è più sicura?', a:'Una lunga con lettere, numeri e simboli', o:['Una lunga con lettere, numeri e simboli','123456','nome+cognome','password']},
    {p:'È consigliato…', a:'Usare password diverse per i servizi', o:['Usare password diverse per i servizi','Scrivere la password sul banco','Condividerla con gli amici','Riutilizzare sempre la stessa']},
    {p:'Per ricordare le password è utile…', a:'Un gestore di password affidabile', o:['Un gestore di password affidabile','Inviare password via chat','Post-it sul PC','Usare sempre la stessa']}
  ]); }
  function genInfoNet(){ return makeBank('ICT: internet/ricerca',[
    {p:'Un browser serve per…', a:'Navigare su internet', o:['Navigare su internet','Stampare','Disegnare','Presentazioni']},
    {p:'Per cercare una frase esatta si usano…', a:'Le virgolette \" \"', o:['Le virgolette \" \"','Il cancelletto #','Le parentesi ()','L’asterisco *']},
    {p:'Il lucchetto accanto all’URL indica…', a:'Connessione sicura (HTTPS)', o:['Connessione sicura (HTTPS)','Volume alto','Batteria carica','Download completato']}
  ]); }
  function genICTSearchOps(){ return makeBank('ICT: ricerca avanzata',[
    {p:'Quale operatore esclude un termine?', a:'-', o:['-','+','?','~']},
    {p:'Quale operatore richiede entrambe le parole?', a:'AND', o:['AND','OR','NEAR','XOR']},
    {p:'Con quale operatore cerchi almeno uno dei termini?', a:'OR', o:['OR','AND','NOT','NEAR']},
    {p:'Cosa fanno le virgolette "…"?', a:'Cercano la frase esatta', o:['Cercano la frase esatta','Aggiungono sinonimi','Ordinano per data','Traducono il testo']},
    {p:'Che cosa indica il lucchetto accanto all’URL?', a:'Connessione sicura (HTTPS)', o:['Connessione sicura (HTTPS)','Pagina con cookie','Pagina salvata','Pubblicità attiva']},
    {p:'Che cos’è una “fonte primaria”?', a:'La fonte originale del dato', o:['La fonte originale del dato','Un blog che riporta la notizia','Un social','Un motore di ricerca']},
    {p:'Che cosa controlli per stimare l’affidabilità?', a:'Autore, data, citazioni', o:['Autore, data, citazioni','Numero di immagini','Colore del sito','Lunghezza del testo']},
    {p:'La stringa site:.gov cosa fa?', a:'Limita la ricerca ai domini .gov', o:['Limita la ricerca ai domini .gov','Traduce in inglese','Cerca nei social','Rimuove la pubblicità']},
    {p:'Il parametro filetype:pdf cosa fa?', a:'Cerca solo file PDF', o:['Cerca solo file PDF','Cerca immagini','Blocca i video','Apre il Cestino']}
  ]); }
  function genICT2FA(){ return makeBank('ICT: sicurezza (2FA)',[
    {p:'La 2FA serve a…', a:'Aumentare la sicurezza', o:['Aumentare la sicurezza','Velocizzare internet','Bloccare pubblicità','Fare backup']},
    {p:'Un esempio di 2FA è…', a:'Codice OTP via app', o:['Codice OTP via app','Emoji nel nome','Password breve','Condivisione password']},
    {p:'Cos’è un OTP?', a:'Un codice monouso a tempo', o:['Un codice monouso a tempo','Una password fissa','Una mail di conferma','Un nickname']},
    {p:'Qual è la password più robusta?', a:'Lunga + lettere/numeri/simboli', o:['Lunga + lettere/numeri/simboli','NomeCane2024','123456','qwerty']},
    {p:'Dove NON salvare le password?', a:'Post-it sul PC', o:['Post-it sul PC','Gestore password','Memoria cifrata','Chiave hardware']},
    {p:'Cos’è il phishing?', a:'Tentativo di furto credenziali con messaggi ingannevoli', o:['Tentativo di furto credenziali con messaggi ingannevoli','Backup online','Firma digitale','Firewall hardware']},
    {p:'Che cos’è la smishing?', a:'Phishing via SMS', o:['Phishing via SMS','Backup su chiavetta','Copia-incolla','Anonimato online']},
    {p:'Come riconosci un’email sospetta?', a:'Link strani, urgenza, errori', o:['Link strani, urgenza, errori','Logo perfetto','Allegato PNG','Messaggio breve']},
    {p:'Qual è una buona pratica con i link?', a:'Passare il mouse e controllare l’URL', o:['Passare il mouse e controllare l’URL','Cliccare subito','Rispondere con dati','Inoltrare agli amici']}
  ]); }
  function genCS_OSvsSW(){

  return makeBank('ICT: sistemi operativi e software', [
    {p:'Il kernel appartiene a', a:'Sistema operativo', o:['Firmware','Applicazione','Sistema operativo','Driver video']},
    {p:'Un driver è', a:'Software che controlla l’hardware', o:['Software che controlla l’hardware','Un tipo di CPU','Un file compresso','Un cavo di rete']},
    {p:'La RAM è', a:'Memoria di lavoro volatile', o:['Memoria di lavoro volatile','Archivio permanente','Una stampante','Un protocollo web']},
    {p:'Esempio di sistema operativo', a:'Linux', o:['Linux','PowerPoint','Chrome','PDF']},
    {p:'Esempio di software applicativo', a:'Foglio di calcolo', o:['Foglio di calcolo','BIOS','Scheduler del kernel','Router']},
    {p:'Il file system si occupa di', a:'Organizzare file e cartelle', o:['Organizzare file e cartelle','Disegnare grafici','Aumentare la RAM','Criptare l’HTTPS']},
    {p:'Gli aggiornamenti di sicurezza servono a', a:'Correggere vulnerabilità note', o:['Correggere vulnerabilità note','Aggiungere pubblicità','Cambiare provider','Formattare il disco']}
  ]);

})();