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
    {p:'La RAM è…', a:'Memoria di lavoro volatile', o:['Memoria di lavoro volatile','Archivio su disco','Stampante','Router']},
    {p:'La ROM/firmware contiene…', a:'Istruzioni permanenti di avvio', o:['Istruzioni permanenti di avvio','File temporanei','Documenti','Password']},
    {p:'Un esempio di hardware è…', a:'La tastiera', o:['La tastiera','Il browser','Un file .docx','Un’app di posta']},
    {p:'Un esempio di software è…', a:'Il sistema operativo o un’app', o:['Il sistema operativo o un’app','La scheda video','La chiavetta USB','Il monitor']},
    {p:'Il sistema operativo è…', a:'Il software base che gestisce hardware e programmi', o:['Il software base che gestisce hardware e programmi','Una periferica','Un cavo di rete','Una cartella']},
    {p:'Una periferica di input è…', a:'La tastiera', o:['La tastiera','Le casse audio','Il monitor','La stampante 3D']},
    {p:'Una periferica di output è…', a:'Il monitor', o:['Il monitor','Il microfono','La webcam','La tastiera']},
    {p:'La memoria di massa è…', a:'SSD/HDD', o:['SSD/HDD','RAM','CPU','Scheda madre']},
    {p:'Il mouse è…', a:'Dispositivo di puntamento (hardware)', o:['Dispositivo di puntamento (hardware)','Programma','File PDF','Password']}
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
    {p:'Con quale operatore cerchi almeno uno dei termini?', a:'OR', o:['OR','AND','NOT','NEAR']}
  ]); }
  function genICT2FA(){ return makeBank('ICT: sicurezza (2FA)',[
    {p:'La 2FA serve a…', a:'Aumentare la sicurezza', o:['Aumentare la sicurezza','Navigare più veloce','Bloccare pubblicità','Salvare password']},
    {p:'Un esempio di 2FA è…', a:'Codice OTP via app', o:['Codice OTP via app','Emoji nel nome','Password breve','Condivisione password']}
  ]); }
  function genCS_OSvsSW(){ return makeBank('ICT: OS vs SW',[
    {p:'Il kernel appartiene a…', a:'Sistema operativo', o:['Sistema operativo','Applicazione','Firmware','Driver video']},
    {p:'Un driver è…', a:'Software che controlla l’hardware', o:['Software che controlla l’hardware','Memoria di massa','Tipo di processore','Rete privata']},
    {p:'La RAM è…', a:'Memoria di lavoro volatile', o:['Memoria di lavoro volatile','Archivio permanente','Un programma','Periferica di rete']},
    {p:'Esempio di sistema operativo', a:'Linux/macOS/Windows', o:['Linux/macOS/Windows','PowerPoint','Chrome','PDF']},
    {p:'Esempio di software applicativo', a:'Foglio di calcolo', o:['Foglio di calcolo','BIOS','Scheduler del kernel','Router']},
    {p:'Il file system si occupa di…', a:'Organizzare file e cartelle', o:['Organizzare file e cartelle','Disegnare grafici','Aumentare la RAM','Crittografare HTTPS']},
    {p:'Gli aggiornamenti di sicurezza servono a…', a:'Correggere vulnerabilità note', o:['Correggere vulnerabilità note','Aggiungere pubblicità','Cambiare provider','Formattare il disco']},
    {p:'Il BIOS/UEFI è…', a:'Firmware di avvio della macchina', o:['Firmware di avvio della macchina','Un’applicazione Office','Un antivirus','Un cavo']}
  ]); }
  function genCS_NetworksLiceo(){ return makeBank('ICT: reti/protocolli',[
    {p:'HTTPS usa tipicamente la porta…', a:'443', o:['443','80','21','25']},
    {p:'Il DNS serve a…', a:'Risoluzione dei nomi in indirizzi IP', o:['Risoluzione dei nomi in indirizzi IP','Criptare i file','Comprimere immagini','Bilanciare il carico']},
    {p:'Un indirizzo IPv4 è del tipo…', a:'192.168.1.10', o:['192.168.1.10','300.500.1.1','AB:CD:EF:12:34','www.esempio.it']}
  ]); }
  function genCS_DBConcepts(){ return makeBank('ICT: database',[
    {p:'In un database relazionale, una riga si chiama…', a:'Tupla/record', o:['Tupla/record','Chiave esterna','Indice','Vista']},
    {p:'La chiave primaria serve a…', a:'Identificare univocamente i record', o:['Identificare univocamente i record','Criptare i dati','Descrivere il dominio','Unire due tabelle']},
    {p:'SQL è…', a:'Un linguaggio per interrogare database', o:['Un linguaggio per interrogare database','Sistema operativo','Protocollo di rete','Formato immagine']}
  ]); }
  function genCS_AlgoComplex(){ return makeBank('ICT: algoritmi/complessità',[
    {p:'Un algoritmo in O(n) ha complessità…', a:'Lineare', o:['Lineare','Costante','Quadratica','Esponenziale']},
    {p:'La ricorsione è…', a:'Una funzione che richiama se stessa', o:['Una funzione che richiama se stessa','Variabile','Tabella database','Rete privata']},
    {p:'La ricerca binaria è…', a:'O(log n)', o:['O(log n)','O(n)','O(1)','O(n!)']}
  ]); }
  function genCS_SecurityAdv(){ return makeBank('ICT: sicurezza avanzata',[
    {p:'Il phishing è…', a:'Tentativo di furto credenziali con messaggi ingannevoli', o:['Tentativo di furto credenziali con messaggi ingannevoli','Backup online','Firma digitale','Firewall hardware']},
    {p:'Autenticazione forte: esempio', a:'Biometria o token hardware', o:['Biometria o token hardware','Password breve','Cookie pubblicitari','Screenshot di conferma']},
    {p:'La crittografia serve a…', a:'Proteggere la confidenzialità dei dati', o:['Proteggere la confidenzialità dei dati','Velocizzare la rete','Comprimere immagini','Stampare documenti']},
    {p:'Esempio di dato personale', a:'Indirizzo e-mail', o:['Indirizzo e-mail','Logo del sito','Colore preferito','Font usato']},
    {p:'HTTPS protegge…', a:'Dati in transito client-server', o:['Dati in transito client-server','File nel disco locale','Batteria del telefono','Qualità del Wi-Fi']},
    {p:'Un backup 3-2-1 prevede…', a:'3 copie, 2 supporti, 1 copia off-site', o:['3 copie, 2 supporti, 1 copia off-site','1 copia su chiavetta','Solo cloud','Solo NAS']},
    {p:'Il ransomware è…', a:'Malware che cifra i dati chiedendo riscatto', o:['Malware che cifra i dati chiedendo riscatto','Filtro antispam','Una patch di sicurezza','Un proxy web']},
    {p:'Il social engineering consiste nel…', a:'Manipolare le persone per ottenere informazioni', o:['Manipolare le persone per ottenere informazioni','Criptare database','Scansionare porte','Aggiornare i driver']},
    {p:'La VPN serve a…', a:'Creare un tunnel cifrato su reti insicure', o:['Creare un tunnel cifrato su reti insicure','Velocizzare la CPU','Pulire i cookie','Cambiare il file system']},
    {p:'La firma digitale garantisce…', a:'Integrità e autenticità del documento', o:['Integrità e autenticità del documento','Velocità di download','Compressione ottimale','Rimozione virus']}
  ]); }

  // Legends for paths
  function getLegendForPath(name){
    var m = {
      'Geometria: perimetro (piccoli)': 'Legenda: w = larghezza, h = altezza, P = perimetro (P = 2 × (w + h))',
      'Geometria: perimetro (rettangoli)': 'Legenda: w = larghezza, h = altezza, P = perimetro (P = 2 × (w + h))',
      'Geometria: perimetro (poligoni)': 'Legenda: somma di tutti i lati',
      'Aree: rettangolo/triangolo (piccoli)': 'Legenda: A_rett = b × h; A_tri = (b × h) ÷ 2',
      'Volume del parallelepipedo (piccoli)': 'Legenda: V = w × h × l',
      'Tabelline 2/5/10 (prime)': 'Suggerimento: usa salti di 2, 5 o 10',
      'Tabelline complete': 'Ripasso: 2–10',
      'Divisioni semplici': 'Ricorda: ÷ = operazione inversa di ×',
      'Frazioni equivalenti (semplici)': 'Definizione: n/d ≡ (n×k)/(d×k)',
      'Decimali (somma facile)': 'Allinea la virgola',
      'Percentuali di base': 'p% di N = (p/100) × N',
      'Proporzioni': 'a:b = c:d ⇒ a×d = b×c',
      'Equazioni di 1° grado (semplici)': 'Forma tipica: ax + b = c',
      'Equazioni di 1° grado': 'Isola la x: ax + b = c',
      'f(x)=mx+q (valori)': 'f(x) = m×x + q',
      'Quadratica (somma radici)': 'Per ax²+bx+c=0: somma radici = -b/a',
      'Quadratica (radici — concetto)': 'Prodotto (c/a) e somma (-b/a) delle radici',
      'Trigonometria (angoli notevoli)': 'Valori notevoli: 0°, 30°, 45°, 60°, 90°',
      // Informatica
      'Informatica: mouse e tastiera': 'Legenda: mouse = puntatore; barra spaziatrice = spazio',
      'Informatica: hardware/software (base)': 'Hardware = parte fisica; Software = programmi',
      'Informatica: file e cartelle': 'File = documento; Cartella = contenitore di file',
      'Informatica: coding a blocchi': 'Sequenze, cicli (ripeti), condizioni (se… allora)',
      'Informatica: password (base)': 'Password robuste: lunghe + lettere + numeri + simboli',
      'Informatica: Internet e ricerca': 'Virgolette per frasi esatte; https = connessione sicura',
      'Informatica: ricerca avanzata': 'Operatori: AND, OR, - (esclusione)',
      'Informatica: sicurezza (2FA)': '2FA = Autenticazione a due fattori',
      'Informatica: sistemi operativi e software': 'OS = sistema operativo; kernel/driver/ram',
      'Informatica: reti e protocolli': 'DNS = nomi→IP; HTTPS porta 443; IPv4 es. 192.168.1.10',
      'Informatica: basi di dati (concetti)': 'Record/chiavi; SQL = linguaggio di interrogazione',
      'Informatica: algoritmi e complessità (base)': 'O(1), O(n), O(log n) — crescita della complessità',
      'Informatica: sicurezza e privacy (avanzato)': 'Phishing, 2FA forte, crittografia = protezione dei dati'
    };
    return m[name] || '';
  }

  // ROUTE MAP (aligned)
  var routeMap = {
    primaria1: { name:'1ª primaria', paths:{
      'Addizioni entro 20': [makeAddRange(1,10,1,10)],
      'Sottrazioni entro 20': [makeSubRange(1,20,1,10)],
      'Tabelline 2/5/10 (prime)': [makeTables([2,5,10])],
      'Geometria: perimetro (piccoli)': [makePerimeterSmall(1,10,1,10)],
      'Informatica: mouse e tastiera': [genInfoMouseKeyboard()],
      'Informatica: hardware/software (base)': [genInfoHwSwBasics()]
    }},
    primaria2: { name:'2ª primaria', paths:{
      'Addizioni con riporto (entro 100)': [makeAddRange(10,70,10,30)],
      'Sottrazioni con prestito (entro 100)': [makeSubRange(20,99,1,20)],
      'Tabelline 2/3/4/5/10': [makeTables([2,3,4,5,10])],
      'Geometria: perimetro (rettangoli)': [makePerimeterSmall(2,15,2,15)],
      'Informatica: file e cartelle': [genInfoFiles()],
      'Informatica: hardware/software (base)': [genInfoHwSwBasics()]
    }},
    primaria3: { name:'3ª primaria', paths:{
      'Tabelline complete': [makeTables([2,3,4,5,6,7,8,9,10])],
      'Divisioni semplici': [makeDivisionExact([2,3,4,5,6,7,8,9])],
      'Geometria: perimetro (poligoni)': [makePerimeterSmall(3,20,3,20)],
      'Informatica: coding a blocchi': [genInfoBlocks()],
      'Informatica: password (base)': [genInfoPasswords()],
      'Informatica: Internet e ricerca': [genInfoNet()]
    }},
    primaria4: { name:'4ª primaria', paths:{
      'Frazioni equivalenti (semplici)': [makeFractionsEqSmall()],
      'Decimali (somma facile)': [makeDecimalsEasy()],
      'Aree: rettangolo/triangolo (piccoli)': [makeAreaRectSmall(), makeAreaTriSmall()],
      'Proporzioni semplici': [makeProportionFillSmall()],
      'Informatica: Internet e ricerca': [genInfoNet()]
    }},
    primaria5: { name:'5ª primaria', paths:{
      'Percentuali di base': [makePercentBasic()],
      'Proporzioni': [makeProportionFillSmall()],
      'Volume del parallelepipedo (piccoli)': [makeVolumeCuboidSmall()],
      'Decimali (somma)': [makeDecimalsEasy()],
      'Informatica: sicurezza (password)': [genInfoPasswords()],
      'Informatica: gestione file': [genInfoFiles()]
    }},
    media1: { name:'1ª media', paths:{
      'Equazioni di 1° grado (semplici)': [genEq1()],
      'Percentuali (problemi)': [genPercent()],
      'Pitagora (cateti piccoli)': [genPitagora()],
      'Informatica: ricerca avanzata': [genICTSearchOps()]
    }},
    media2: { name:'2ª media', paths:{
      'Equazioni di 1° grado': [genEq1()],
      'Pitagora': [genPitagora()],
      'Percentuali': [genPercent()],
      'Informatica: sicurezza (2FA)': [genICT2FA()]
    }},
    media3: { name:'3ª media', paths:{
      'f(x)=mx+q (valori)': [genLinearFuncValue()],
      'Pitagora e percentuali (misto)': [genPitagora(), genPercent()],
      'Quadratica (radici — concetto)': [genQuadraticRootsSimple()],
      'Informatica: ricerca avanzata': [genICTSearchOps()]
    }},
    liceo1: { name:'1ª liceo', paths:{
      'f(x)=mx+q (valori)': [genLinearFuncValue()],
      'Equazioni di 1° grado (con parametri)': [genEq1()],
      'Informatica: sistemi operativi e software': [genCS_OSvsSW()]
    }},
    liceo2: { name:'2ª liceo', paths:{
      'Quadratica (somma radici)': [genQuadraticRootsSimple()],
      'f(x)=mx+q (valori)': [genLinearFuncValue()],
      'Informatica: reti e protocolli': [genCS_NetworksLiceo()]
    }},
    liceo3: { name:'3ª liceo', paths:{
      'Trigonometria (angoli notevoli)': [genTrigNotable()],
      'Quadratica (radici)': [genQuadraticRootsSimple()],
      'Informatica: basi di dati (concetti)': [genCS_DBConcepts()]
    }},
    liceo4: { name:'4ª liceo', paths:{
      'Trigonometria (angoli notevoli)': [genTrigNotable()],
      'f(x)=mx+q (valori)': [genLinearFuncValue()],
      'Informatica: algoritmi e complessità (base)': [genCS_AlgoComplex()]
    }},
    liceo5: { name:'5ª liceo', paths:{
      'Trigonometria (angoli notevoli)': [genTrigNotable()],
      'Quadratica (radici)': [genQuadraticRootsSimple()],
      'f(x)=mx+q (valori)': [genLinearFuncValue()],
      'Informatica: sicurezza e privacy (avanzato)': [genCS_SecurityAdv()]
    }}
  };

  // Export map for debug
  try{ window.routeMap = routeMap; }catch(e){}

  // Game state + engine
  var currentRoute=[], currentPathName='', currentGradeKey='primaria2', level=0, stars=0, done=0, total=8, currentQuestion=null;
  function populatePaths(){var g=$('livello'),p=$('percorso'); if(!g||!p) return; var info=routeMap[g.value]; p.innerHTML=''; Object.keys(info.paths).forEach(function(name){var o=document.createElement('option');o.value=name;o.textContent=name;p.appendChild(o);});}
  function startGame(){var g=$('livello'),p=$('percorso'); if(!g||!p||!p.value) return; currentGradeKey=g.value; currentPathName=p.value; var info=routeMap[currentGradeKey]; currentRoute=info.paths[currentPathName]; level=0; stars=0; done=0; total=8; resetSeen(); $('stars').textContent=stars; $('progress').textContent=done; $('total').textContent=total; $('levelName').textContent=currentPathName; $('legend').textContent = getLegendForPath(currentPathName); $('gradeName').textContent=info.name; $('intro').classList.add('hidden'); $('summary').classList.add('hidden'); $('game').classList.remove('hidden'); nextQuestion(true); window.scrollTo(0,0); }
  function nextQuestion(resetTitle){$('nextBtn').classList.add('hidden'); $('choices').innerHTML=''; var gen=currentRoute[Math.min(level,currentRoute.length-1)]; currentQuestion=gen(); $('prompt').textContent=currentQuestion.prompt; $('legend').textContent = getLegendForPath(currentPathName); currentQuestion.choices.forEach(function(c,idx){var btn=document.createElement('button'); btn.type='button'; btn.className='choice'; btn.textContent=String(c); btn.addEventListener('click', function(){ selectChoice(idx, btn); }, {once:true}); $('choices').appendChild(btn);});}
  function selectChoice(idx, el){var correct = idx===currentQuestion.correct; el.classList.add(correct?'correct':'wrong'); document.querySelectorAll('.choice').forEach(n=>n.disabled=true); if(correct){stars+=1; done+=1; $('stars').textContent=stars; $('progress').textContent=done;} if(done>=total){ endGame(); } else { if(done%2===0){ level=Math.min(level+1,currentRoute.length-1);} $('nextBtn').classList.remove('hidden'); } }
  function endGame(){ $('game').classList.add('hidden'); $('summary').classList.remove('hidden'); $('finalStars').textContent=stars.toFixed(1); $('feedback').textContent=(stars>=total*0.9)?'Ottimo lavoro!':(stars>=total*0.6)?'Ben fatto! Continua ad allenarti.':'Buon inizio! Riprova.'; }
  // Buttons & UI
  document.addEventListener('DOMContentLoaded', function(){ populatePaths(); on($('livello'),'change',populatePaths); on($('refreshPathsBtn'),'click',populatePaths); on($('playBtn'),'click',startGame); on($('howBtn'),'click',function(){ $('intro').classList.add('hidden'); $('howto').classList.remove('hidden'); }); on($('backIntro'),'click',function(){ $('howto').classList.add('hidden'); $('intro').classList.remove('hidden'); }); on($('menuBtn'),'click',function(){ $('game').classList.add('hidden'); $('intro').classList.remove('hidden'); }); on($('againBtn'),'click',startGame); on($('homeBtn'),'click',function(){ $('summary').classList.add('hidden'); $('intro').classList.remove('hidden'); }); on($('skipBtn'),'click',function(){ stars=Math.max(0,stars-0.5); nextQuestion(false); }); on($('nextBtn'),'click', function(){ nextQuestion(false); }); });
  // LIM
  on(document.getElementById('limBtn'),'click', function(){ document.body.classList.toggle('lim'); this.textContent=document.body.classList.contains('lim')?'LIM: ON':'Modalità LIM'; document.getElementById('statusBar').style.display=document.body.classList.contains('lim')?'block':'none'; });
  // Install & auto-update
  var deferredPrompt=null; window.addEventListener('beforeinstallprompt',function(e){e.preventDefault();deferredPrompt=e;var b=$('installBtn'); if(b){b.hidden=false; b.onclick=function(){try{b.hidden=true; deferredPrompt.prompt(); deferredPrompt=null;}catch(_){}}}});
  if('serviceWorker' in navigator){ window.addEventListener('load', function(){ navigator.serviceWorker.register('service-worker.js').then(function(reg){ reg.addEventListener('updatefound', function(){ var nw=reg.installing; if(!nw) return; nw.addEventListener('statechange', function(){ if(nw.state==='installed' && navigator.serviceWorker.controller){ nw.postMessage({type:'SKIP_WAITING'}); } }); }); }); }); var refreshing=false; navigator.serviceWorker.addEventListener('controllerchange', function(){ if(refreshing) return; refreshing=true; window.location.reload(); }); }
})();