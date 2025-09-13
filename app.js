
(function(){
  function $(id){return document.getElementById(id);} 
  function on(el,ev,fn){if(el&&el.addEventListener)el.addEventListener(ev,fn);}
  function rand(a,b){return Math.floor(Math.random()*(b-a+1))+a;}
  function shuffle(arr){for(var i=arr.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1));var t=arr[i];arr[i]=arr[j];arr[j]=t;}return arr;}

  // ===== Normalizzazione e anti-duplicati =====
  function norm(s){return String(s||"").toLowerCase().replace(/[.\u2026]+$/g,"").replace(/\s+/g," ").trim();}

  // ===== makeBank con rotazione interna (ma NON ripete nella stessa partita grazie al deck) =====
  function makeBank(name, items){
    var order = items.map(function(_,i){return i;}); order = shuffle(order.slice());
    var idx = 0, lastKey = null;
    return function(){
      if (idx >= order.length){ order = shuffle(order.slice()); idx=0; }
      var cand = items[ order[idx++] ];
      var key  = norm(cand.p);
      if(lastKey && key===lastKey && order.length>1){
        cand = items[ order[idx % order.length] ]; idx++; key = norm(cand.p);
      }
      lastKey = key;
      var o=cand.o.slice(); shuffle(o);
      return {prompt:cand.p, choices:o, correct:o.indexOf(cand.a)};
    };
  }

  // ===== Generatori Matematica (come prima) =====
  function makeAddRange(minA,maxA,minB,maxB){ 
    return function(){ 
      var x=rand(minA,maxA), y=rand(minB,maxB), r=x+y; 
      var o=shuffle([r,r+1,Math.max(0,r-1),r+10]); 
      return {prompt:x+" + "+y+" = ?", choices:o, correct:o.indexOf(r)}; 
    }; 
  }
  function makeSubRange(minA,maxA,minB,maxB){ 
    return function(){ 
      var x=rand(minA,maxA), y=rand(minB,maxB); 
      if(y>x){y=rand(0,x);} 
      var r=x-y; 
      var o=shuffle([r,r+1,Math.max(0,r-1),r+10]); 
      return {prompt:x+" - "+y+" = ?", choices:o, correct:o.indexOf(r)}; 
    }; 
  }
  function makeTables(setTbl){ 
    return function(){ 
      var t=setTbl[rand(0,setTbl.length-1)], b=rand(1,10), r=t*b; 
      var o=shuffle([r,r+t,Math.max(0,r-t),r+rand(2,9)]); 
      return {prompt:t+" × "+b+" = ?", choices:o, correct:o.indexOf(r)}; 
    }; 
  }
  function makePerimeterSmall(minW,maxW,minH,maxH){ 
    return function(){ 
      var w=rand(minW,maxW), h=rand(minH,maxH), r=2*(w+h); 
      var o=shuffle([r,r+2,Math.max(0,r-2),r+4]); 
      return {prompt:"w="+w+", h="+h+" ⇒ P = ?", choices:o, correct:o.indexOf(r)}; 
    }; 
  }
  function makeDivisionExact(divisors){ 
    return function(){ 
      var a=divisors[rand(0,divisors.length-1)], q=rand(2,10), r=a*q; 
      var o=shuffle([q,q+1,Math.max(0,q-1),q+2]); 
      return {prompt:r+" ÷ "+a+" = ?", choices:o, correct:o.indexOf(q)}; 
    }; 
  }
  function makeFractionsEqSmall(){ 
    return function(){ 
      var n=rand(1,4), d=rand(2,9); if(n>=d){n=d-1;} 
      var k=rand(2,4); 
      var r=(n*k)+"/"+(d*k); 
      var o=shuffle([r,(n*(k+1))+"/"+(d*(k+1)),(n*k+1)+"/"+(d*k),(n*k)+"/"+(d*k+1)]); 
      return {prompt:"Equivalente di "+n+"/"+d+" ?", choices:o, correct:o.indexOf(r)}; 
    }; 
  }
  function makeDecimalsEasy(){ 
    return function(){ 
      var a=(rand(10,50)/10).toFixed(1), b=(rand(10,50)/10).toFixed(1); 
      var r=(parseFloat(a)+parseFloat(b)).toFixed(1); 
      var o=shuffle([r,(+r+0.1).toFixed(1),Math.max(0,(+r-0.1)).toFixed(1),(+r+1).toFixed(1)]); 
      return {prompt:a+" + "+b+" = ?", choices:o, correct:o.indexOf(r)}; 
    }; 
  }
  function makeAreaRectSmall(){ 
    return function(){ 
      var bb=rand(2,12), h=rand(2,12), r=bb*h; 
      var o=shuffle([r,r+2,Math.max(0,r-2),r+4]); 
      return {prompt:"b="+bb+", h="+h+" ⇒ A = ?", choices:o, correct:o.indexOf(r)}; 
    }; 
  }
  function makeAreaTriSmall(){ 
    return function(){ 
      var b=rand(2,20), h=rand(2,20), r=Math.round(0.5*b*h); 
      var o=shuffle([r,r+1,Math.max(0,r-1),r+2]); 
      return {prompt:"b="+b+", h="+h+" ⇒ A = ?", choices:o, correct:o.indexOf(r)}; 
    }; 
  }
  function makePercentBasic(){ 
    return function(){ 
      var p=[10,20,25,50][rand(0,3)], n=rand(40,400); 
      var r=Math.round(n*p/100); 
      var o=shuffle([r,r+5,Math.max(0,r-5),r+10]); 
      return {prompt:p+"% di "+n+" = ?", choices:o, correct:o.indexOf(r)}; 
    }; 
  }
  function makeProportionFillSmall(){ 
    return function(){ 
      var a=rand(2,12), k=rand(2,9); var d=k*a; 
      var o=shuffle([d,d+1,Math.max(0,d-1),d+2]); 
      return {prompt:a+":"+ (a*k) +" = "+ k +": ?", choices:o, correct:o.indexOf(d)}; 
    }; 
  }
  function makeVolumeCuboidSmall(){ 
    return function(){ 
      var w=rand(2,8), h=rand(2,8), l=rand(2,8), r=w*h*l; 
      var o=shuffle([r,r+4,Math.max(0,r-4),r+8]); 
      return {prompt:"w="+w+", h="+h+", l="+l+" ⇒ V = ?", choices:o, correct:o.indexOf(r)}; 
    }; 
  }
  function genEq1(){ 
    var a,b; 
    return function(){ 
      a=rand(1,9); var x=rand(1,12); b=rand(-9,9); var c=a*x + b; 
      var r=x; var o=shuffle([r,r+1,r-1,r+2]); 
      return {prompt:a+"x "+(b>=0?"+ "+b:b)+" = "+c+" ⇒ x = ?", choices:o, correct:o.indexOf(r)}; 
    }; 
  }
  function genPitagora(){ 
    return function(){ 
      var a=[3,5,6,8][rand(0,3)], b=[4,12,8,15][rand(0,3)]; 
      var c=Math.round(Math.sqrt(a*a+b*b)); 
      var o=shuffle([c,c+1,c-1,c+2]); 
      return {prompt:"a="+a+", b="+b+" ⇒ c = ?", choices:o, correct:o.indexOf(c)}; 
    }; 
  }
  function genPercent(){ return makePercentBasic(); }
  function genLinearFuncValue(){ 
    return function(){ 
      var m=rand(-5,5); if(m===0)m=1; 
      var q=rand(-10,10), x=rand(-5,5); 
      var r=m*x+q; 
      var o=shuffle([r,r+1,r-1,r+2]); 
      return {prompt:"f(x)="+m+"x"+(q>=0?"+":"")+q+", x="+x+" ⇒ f(x)= ?", choices:o, correct:o.indexOf(r)}; 
    }; 
  }
  function genQuadraticRootsSimple(){ 
    return function(){ 
      var r1=rand(-5,5), r2=rand(-5,5); 
      var sum=r1+r2; 
      var o=shuffle([sum,sum+1,sum-1,sum+2]); 
      return {prompt:"Somma delle radici di (x - "+r1+")(x - "+r2+") = 0 ?", choices:o, correct:o.indexOf(sum)}; 
    }; 
  }
  function genTrigNotable(){ 
    return function(){ 
      var angles=[0,30,45,60,90], a=angles[rand(0,angles.length-1)], which=['sin','cos'][rand(0,1)];
      var exact={'sin0':'0','sin30':'1/2','sin45':'√2/2','sin60':'√3/2','sin90':'1','cos0':'1','cos30':'√3/2','cos45':'√2/2','cos60':'1/2','cos90':'0'}[which+String(a)];
      var opts=['0','1/2','√2/2','√3/2', exact]; 
      var o=[]; while(opts.length){ o.push(opts.splice(rand(0,opts.length-1),1)[0]); }
      return {prompt: which+"("+a+"°) = ?", choices:o, correct:o.indexOf(exact)}; 
    }; 
  }

  // ===== Banche Informatica (tutte 12–15 item) =====

  function genInfoMouseKeyboard(){ return makeBank('ICT: mouse/tastiera',[
    {p:'Quale dispositivo muove il puntatore?', a:'Mouse', o:['Mouse','Tastiera','Monitor','Stampante']},
    {p:'Quale tasto crea uno spazio?', a:'Barra spaziatrice', o:['Barra spaziatrice','Invio','Shift','Esc']},
    {p:'Il tasto SHIFT serve per...', a:'Scrivere maiuscole e simboli', o:['Scrivere maiuscole e simboli','Spegnere il PC','Spostare file','Aprire la posta']},
    {p:'Il tasto INVIO serve per...', a:'Andare a capo o confermare', o:['Andare a capo o confermare','Cancellare caratteri','Spegnere lo schermo','Aprire il browser']},
    {p:'Il doppio clic serve a...', a:'Aprire file o cartelle', o:['Aprire file o cartelle','Spegnere il PC','Cambiare lingua','Stampare velocemente']},
    {p:'Il tasto ESC di solito...', a:'Annulla o chiude una finestra', o:['Annulla o chiude una finestra','Salva il file','Spegne il monitor','Cambia sfondo']},
    {p:'La rotella del mouse...', a:'Serve per lo scorrimento', o:['Serve per lo scorrimento','Apre il menù Start','Aumenta il volume','Blocca la tastiera']},
    {p:'CTRL+C di solito...', a:'Copia', o:['Copia','Incolla','Taglia','Salva']},
    {p:'CTRL+V di solito...', a:'Incolla', o:['Incolla','Copia','Taglia','Stampa']},
    {p:'CTRL+Z di solito...', a:'Annulla', o:['Annulla','Ripeti','Salva','Cerca']},
    {p:'La barra spaziatrice...', a:'Inserisce uno spazio', o:['Inserisce uno spazio','Cancella testo','Spegne il PC','Apre il browser']},
    {p:'La tastiera è...', a:'Una periferica di input', o:['Una periferica di input','Un’app','Un driver','Un file system']}
  ]); }

  function genInfoHwSwBasics(){ return makeBank('ICT: hardware/software (base)',[
    {p:'La CPU è...', a:'Il processore del computer', o:['Il processore del computer','La memoria permanente','Un programma','La stampante']},
    {p:'La RAM è...', a:'Memoria di lavoro volatile', o:['Memoria di lavoro volatile','Archivio su disco','Stampante','Router']},
    {p:'La ROM/firmware contiene...', a:'Istruzioni permanenti di avvio', o:['Istruzioni permanenti di avvio','File temporanei','Documenti','Password']},
    {p:'Un esempio di hardware è...', a:'La tastiera', o:['La tastiera','Il browser','Un file .docx','Un’app di posta']},
    {p:'Un esempio di software è...', a:'Il sistema operativo o un’app', o:['Il sistema operativo o un’app','La scheda video','La chiavetta USB','Il monitor']},
    {p:'Il sistema operativo è...', a:'Il software base che gestisce hardware e programmi', o:['Il software base che gestisce hardware e programmi','Una periferica','Un cavo di rete','Una cartella']},
    {p:'Una periferica di input è...', a:'La tastiera', o:['La tastiera','Le casse audio','Il monitor','La stampante 3D']},
    {p:'Una periferica di output è...', a:'Il monitor', o:['Il monitor','Il microfono','La webcam','La tastiera']},
    {p:'La memoria di massa è...', a:'SSD/HDD', o:['SSD/HDD','RAM','CPU','Scheda madre']},
    {p:'Il mouse è...', a:'Dispositivo di puntamento (hardware)', o:['Dispositivo di puntamento (hardware)','Programma','File PDF','Password']},
    {p:'La scheda video (GPU) è...', a:'Hardware per l’output grafico', o:['Hardware per l’output grafico','Un sistema operativo','Un antivirus','Una rete Wi‑Fi']},
    {p:'Il browser è...', a:'Un software per navigare sul web', o:['Un software per navigare sul web','Una periferica','Un cavo','Una stampante']},
    {p:'Il case/armadio del PC contiene...', a:'I principali componenti hardware', o:['I principali componenti hardware','Solo il monitor','Solo il mouse','Solo la tastiera']},
    {p:'Un’app è...', a:'Software applicativo', o:['Software applicativo','Periferica','Driver','Cavo USB']},
    {p:'Il driver è...', a:'Software che dialoga con l’hardware', o:['Software che dialoga con l’hardware','Un antivirus','Una RAM','Un SSD']}
  ]); }

  function genInfoFiles(){ return makeBank('ICT: file/cartelle',[
    {p:'Estensione tipica di un’immagine', a:'.jpg', o:['.jpg','.docx','.pptx','.xlsx']},
    {p:'Quale di questi è un formato immagine raster?', a:'.png', o:['.png','.mp3','.pdf','.txt']},
    {p:'Quale di questi è un formato immagine animata?', a:'.gif', o:['.gif','.xlsx','.mp4','.zip']},
    {p:'Quale di questi è un formato vettoriale?', a:'.svg', o:['.svg','.jpg','.wav','.exe']},
    {p:'Quale NON è un formato immagine?', a:'.pdf', o:['.pdf','.png','.jpg','.gif']},
    {p:'Il Cestino serve a…', a:'Conservare file eliminati temporaneamente', o:['Conservare file eliminati temporaneamente','Salvare password','Fare backup','Pulire lo schermo']},
    {p:'Una cartella può contenere…', a:'File e altre cartelle', o:['File e altre cartelle','Solo immagini','Solo testi','Solo programmi']},
    {p:'Rinominare un file cambia…', a:'Solo il nome, non il contenuto', o:['Solo il nome, non il contenuto','Il contenuto','La dimensione','Il tipo di porta USB']},
    {p:'L’icona graffetta/drag&drop indica…', a:'Allegare o spostare un file', o:['Allegare o spostare un file','Cancellare per sempre','Stampare','Cifrare i dati']},
    {p:'Le estensioni sono…', a:'Indicative del tipo di file', o:['Indicative del tipo di file','Obbligatorie per aprire','Sempre maiuscole','Pericolose di per sé']},
    {p:'Un percorso (path) indica…', a:'Dove si trova il file nel sistema', o:['Dove si trova il file nel sistema','La velocità del PC','La password Wi‑Fi','Il livello della batteria']},
    {p:'Un cloud drive (es. Drive) permette di…', a:'Salvare file online e sincronizzarli', o:['Salvare file online e sincronizzarli','Aumentare la RAM','Velocizzare la CPU','Cambiare la risoluzione']},
    {p:'File molto pesanti si possono…', a:'Comprimere in .zip', o:['Comprimere in .zip','Convertire in .exe','Stampare per alleggerire','Cancellare estensione']},
    {p:'HEIC è…', a:'Un formato immagine usato su smartphone', o:['Un formato immagine usato su smartphone','Un virus','Un protocollo di rete','Una cartella di sistema']}
  ]); }

  function genInfoBlocks(){ return makeBank('ICT: coding a blocchi',[
    {p:'"Ripeti 10 volte" è un…', a:'Ciclo (loop)', o:['Ciclo (loop)','Evento','Variabile','Immagine']},
    {p:'"Se … allora" serve per…', a:'Prendere decisioni', o:['Prendere decisioni','Disegnare','Salvare file','Aumentare il volume']},
    {p:'Una variabile è…', a:'Un contenitore di valori', o:['Un contenitore di valori','Una figura','Un suono','Una cartella']},
    {p:'Un evento in un ambiente a blocchi è…', a:'Un’azione che fa partire uno script', o:['Un’azione che fa partire uno script','Una cartella','Una password','Una GPU']},
    {p:'Il debugging è…', a:'La correzione degli errori', o:['La correzione degli errori','La stampa su carta','La cancellazione file','La compressione']},
    {p:'Uno sprite è…', a:'Un personaggio/oggetto grafico', o:['Un personaggio/oggetto grafico','Un file ZIP','Un driver','Un antivirus']},
    {p:'Un ciclo “fino a quando” …', a:'Ripete finché la condizione è vera', o:['Ripete finché la condizione è vera','Esegue una sola volta','Cancella variabili','Spegne il PC']},
    {p:'La sequenza è…', a:'Ordine dei blocchi da eseguire', o:['Ordine dei blocchi da eseguire','Nome del progetto','Formato immagine','Password']},
    {p:'La condizione è…', a:'Un controllo vero/falso', o:['Un controllo vero/falso','Un driver','Una GPU','Un PDF']},
    {p:'La variabile “contatore” …', a:'Tiene il numero di ripetizioni', o:['Tiene il numero di ripetizioni','Cambia il colore','Apre il browser','Cifra i dati']},
    {p:'Il blocco “attendi 1 sec” …', a:'Inserisce una pausa', o:['Inserisce una pausa','Chiude il progetto','Crea una cartella','Spegne il display']},
    {p:'Il blocco “mostra” …', a:'Rende visibile lo sprite', o:['Rende visibile lo sprite','Cancella il file','Riduce la RAM','Crea un PDF']}
  ]); }

  function genInfoPasswords(){ return makeBank('ICT: password (base)',[
    {p:'Quale password è più sicura?', a:'Una lunga con lettere, numeri e simboli', o:['Una lunga con lettere, numeri e simboli','123456','nome+cognome','password']},
    {p:'È consigliato…', a:'Usare password diverse per i servizi', o:['Usare password diverse per i servizi','Scrivere la password sul banco','Condividerla con gli amici','Riutilizzare sempre la stessa']},
    {p:'Per ricordare le password è utile…', a:'Un gestore di password affidabile', o:['Un gestore di password affidabile','Inviare password via chat','Post‑it sul PC','Usare sempre la stessa']},
    {p:'Password con solo lettere minuscole…', a:'Sono deboli', o:['Sono deboli','Sono fortissime','Impossibili da ricordare','Sempre accettate']},
    {p:'Meglio attivare…', a:'L’autenticazione a due fattori', o:['L’autenticazione a due fattori','La modalità aereo','Lo screensaver con foto','La luminosità massima']},
    {p:'Non condividere password…', a:'Nemmeno con amici', o:['Nemmeno con amici','Solo con compagni','Solo via chat','Sul diario']},
    {p:'Le password vanno…', a:'Aggiornate periodicamente', o:['Aggiornate periodicamente','Scritte sulla tastiera','Invitate via email','Usate ovunque uguali']},
    {p:'Le domande di sicurezza…', a:'Vanno scelte non banali', o:['Vanno scelte non banali','Devono essere sempre “nome cane”','Si possono saltare','Si scrivono sui social']},
    {p:'Un passphrase è…', a:'Una frase lunga facile da ricordare', o:['Una frase lunga facile da ricordare','Un PDF','Un virus','Un driver']},
    {p:'Un gestore di password…', a:'Memorizza e compila credenziali', o:['Memorizza e compila credenziali','Aggiunge RAM','Stampa documenti','Installa driver']},
    {p:'Le password nelle note del telefono…', a:'Meglio evitarlo, usa un gestore', o:['Meglio evitarlo, usa un gestore','È la pratica migliore','Postarle su social','Inviare per chat']},
    {p:'Il simbolo “@” nelle password…', a:'Può aumentare la robustezza', o:['Può aumentare la robustezza','È vietato','Riduce la sicurezza','Blocca gli accessi']}
  ]); }

  function genInfoNet(){ return makeBank('ICT: internet/ricerca',[
    {p:'Un browser serve per…', a:'Navigare su internet', o:['Navigare su internet','Stampare','Disegnare','Presentazioni']},
    {p:'Per cercare una frase esatta si usano…', a:'Le virgolette " "', o:['Le virgolette " "','Il cancelletto #','Le parentesi ()','L’asterisco *']},
    {p:'Il lucchetto accanto all’URL indica…', a:'Connessione sicura (HTTPS)', o:['Connessione sicura (HTTPS)','Volume alto','Batteria carica','Download completato']},
    {p:'Per aprire un link in una nuova scheda…', a:'Click con tasto centrale/CTRL+click', o:['Click con tasto centrale/CTRL+click','Doppio click sullo sfondo','Trascina sul desktop','Premi Esc']},
    {p:'La cronologia del browser…', a:'Elenca i siti visitati', o:['Elenca i siti visitati','Mostra le password','Aumenta la RAM','Blocca i pop‑up']},
    {p:'La cache del browser…', a:'Memorizza file per velocizzare', o:['Memorizza file per velocizzare','Cripta i PDF','Stampa a colori','Spegne il Wi‑Fi']},
    {p:'HTTPS rispetto a HTTP…', a:'Cifra il traffico', o:['Cifra il traffico','Riduce la batteria a zero','Aumenta la RAM','Impedisce internet']},
    {p:'I cookie sono…', a:'Dati salvati dal sito sul browser', o:['Dati salvati dal sito sul browser','Virus','Password','Immagini']},
    {p:'La modalità in incognito…', a:'Non salva cronologia locale', o:['Non salva cronologia locale','Cripta sempre tutto','Blocca i virus','Accelera la rete']},
    {p:'Un motore di ricerca è…', a:'Un servizio che indicizza pagine web', o:['Un servizio che indicizza pagine web','Una GPU','Un file ZIP','Un antivirus']},
    {p:'Il risultato “annuncio” è…', a:'Un link sponsorizzato', o:['Un link sponsorizzato','Sempre il migliore','Un virus','Un driver']},
    {p:'Per cercare immagini…', a:'Usa la scheda Immagini del motore', o:['Usa la scheda Immagini del motore','Apri il task manager','Cambia lingua di sistema','Spegni il PC']}
  ]); }

  function genICTSearchOps(){ return makeBank('ICT: ricerca avanzata',[
    {p:'Quale operatore esclude un termine?', a:'-', o:['-','+','?','~']},
    {p:'Quale operatore richiede entrambe le parole?', a:'AND', o:['AND','OR','NEAR','XOR']},
    {p:'Con quale operatore cerchi almeno uno dei termini?', a:'OR', o:['OR','AND','NOT','NEAR']},
    {p:'Cosa fanno le virgolette "…" nella ricerca?', a:'Cercano la frase esatta', o:['Cercano la frase esatta','Trovano sinonimi','Traducono la pagina','Filtrano per data']},
    {p:'Cosa fa l’operatore site:edu?', a:'Limita la ricerca a domini .edu', o:['Limita la ricerca a domini .edu','Mostra solo PDF','Ordina per data','Mostra immagini']},
    {p:'Che effetto ha filetype:pdf?', a:'Cerca solo file PDF', o:['Cerca solo file PDF','Blocca i link','Mostra mappe','Traduce risultati']},
    {p:'Cosa fa -parola?', a:'Esclude la parola dai risultati', o:['Esclude la parola dai risultati','Aggiunge una parola','Sostituisce la parola','Evidenzia la parola']},
    {p:'A cosa serve OR?', a:'A trovare almeno uno dei termini', o:['A trovare almeno uno dei termini','A trovare entrambi i termini','A escludere termini','A cercare frasi esatte']},
    {p:'L’operatore site:gov…', a:'Limita a siti governativi', o:['Limita a siti governativi','Mostra solo video','Scarica PDF','Traduce siti']},
    {p:'L’operatore intitle:…', a:'Cerca una parola nel titolo della pagina', o:['Cerca una parola nel titolo della pagina','Esclude parole dal testo','Filtra per lingua','Apre risultati in nuova scheda']},
    {p:'L’operatore related:…', a:'Mostra siti simili a un URL', o:['Mostra siti simili a un URL','Mostra solo siti vecchi','Blocca i risultati','Traduce il sito']},
    {p:'L’operatore site:it…', a:'Limita a domini italiani', o:['Limita a domini italiani','Cerca solo in inglese','Scarica immagini','Mostra mappe']}
  ]); }

  function genICT2FA(){ return makeBank('ICT: sicurezza (2FA)',[
    {p:'La 2FA serve a…', a:'Aumentare la sicurezza', o:['Aumentare la sicurezza','Navigare più veloce','Bloccare pubblicità','Salvare password']},
    {p:'Un esempio di 2FA è…', a:'Codice OTP via app', o:['Codice OTP via app','Emoji nel nome','Password breve','Condivisione password']},
    {p:'OTP significa…', a:'One‑Time Password', o:['One‑Time Password','Only Test Page','Open Transfer Protocol','Offline Time Password']},
    {p:'Buona pratica per le password…', a:'Usare un gestore affidabile', o:['Usare un gestore affidabile','Condividerle','Riutilizzarle','Usare 123456']},
    {p:'Autenticazione forte: esempio', a:'Token hardware o biometria', o:['Token hardware o biometria','SMS non protetto','Domanda segreta banale','Memo su post‑it']},
    {p:'Evita truffe online…', a:'Verifica mittente e URL prima di cliccare', o:['Verifica mittente e URL prima di cliccare','Apri subito gli allegati','Inserisci credenziali ovunque','Disattiva l’antivirus']},
    {p:'Backup delle OTP…', a:'Conservare i codici di emergenza', o:['Conservare i codici di emergenza','Condividerli via chat','Postarli sui social','Memorizzarli in chiaro']},
    {p:'App 2FA vs SMS…', a:'L’app è più sicura dell’SMS', o:['L’app è più sicura dell’SMS','Sono equivalenti','SMS è sempre migliore','Meglio nessuna 2FA']},
    {p:'Un TOTP…', a:'È un codice temporaneo basato sul tempo', o:['È un codice temporaneo basato sul tempo','È un driver video','È un file immagine','È un PDF']},
    {p:'Perdere il telefono con 2FA…', a:'Usa i codici di recupero', o:['Usa i codici di recupero','Non si può più accedere','Scrivi al caso','Spegni il router']},
    {p:'Push notification 2FA…', a:'Richiede approvazione su app', o:['Richiede approvazione su app','È un SMS','È una email','È una chiamata']},
    {p:'Passkey…', a:'Autenticazione senza password basata su chiavi', o:['Autenticazione senza password basata su chiavi','Un PDF protetto','Un antivirus','Una VPN']}
  ]); }

  function genCS_OSvsSW(){ return makeBank('ICT: OS vs SW',[
    {p:'Il kernel appartiene a…', a:'Sistema operativo', o:['Sistema operativo','Applicazione','Firmware','Driver video']},
    {p:'Un driver è…', a:'Software che controlla l’hardware', o:['Software che controlla l’hardware','Memoria di massa','Tipo di processore','Rete privata']},
    {p:'La RAM è…', a:'Memoria di lavoro volatile', o:['Memoria di lavoro volatile','Archivio permanente','Un programma','Periferica di rete']},
    {p:'Esempio di sistema operativo', a:'Linux/macOS/Windows', o:['Linux/macOS/Windows','PowerPoint','Chrome','PDF']},
    {p:'Esempio di software applicativo', a:'Foglio di calcolo', o:['Foglio di calcolo','BIOS','Scheduler del kernel','Router']},
    {p:'Il file system si occupa di…', a:'Organizzare file e cartelle', o:['Organizzare file e cartelle','Disegnare grafici','Aumentare la RAM','Crittografare HTTPS']},
    {p:'Gli aggiornamenti di sicurezza servono a…', a:'Correggere vulnerabilità note', o:['Correggere vulnerabilità note','Aggiungere pubblicità','Cambiare provider','Formattare il disco']},
    {p:'Il BIOS/UEFI è…', a:'Firmware di avvio della macchina', o:['Firmware di avvio della macchina','Un applicativo Office','Un antivirus','Un cavo']},
    {p:'La GPU è…', a:'Hardware che elabora grafica', o:['Hardware che elabora grafica','Un sistema operativo','Un file system','Un router casalingo']},
    {p:'La shell è…', a:'Interfaccia per impartire comandi', o:['Interfaccia per impartire comandi','Una periferica di stampa','Un antivirus','Un browser']},
    {p:'Lo scheduler del kernel gestisce…', a:'L’uso della CPU tra i processi', o:['L’uso della CPU tra i processi','La risoluzione dello schermo','Il volume audio','Il colore del desktop']},
    {p:'Il task manager/monitor di sistema serve a…', a:'Vedere e gestire i processi attivi', o:['Vedere e gestire i processi attivi','Modificare i driver video','Formattare il disco fisso','Cambiare provider Internet']},
    {p:'Un processo è…', a:'Un programma in esecuzione', o:['Un programma in esecuzione','Un file immagine','Una cartella','Un protocollo di rete']},
    {p:'La memoria virtuale serve a…', a:'Estendere la RAM su disco', o:['Estendere la RAM su disco','Aumentare la GPU','Cancellare virus','Comprimere PDF']},
    {p:'Un servizio (daemon)…', a:'È un processo in background', o:['È un processo in background','È un cavo HDMI','È un file ZIP','È una rete Wi‑Fi']}
  ]); }

  function genCS_NetworksLiceo(){ return makeBank('ICT: reti/protocolli',[
    {p:'HTTPS usa tipicamente la porta…', a:'443', o:['443','80','21','25']},
    {p:'Il DNS serve a…', a:'Risoluzione dei nomi in indirizzi IP', o:['Risoluzione dei nomi in indirizzi IP','Criptare i file','Comprimere immagini','Bilanciare il carico']},
    {p:'Un indirizzo IPv4 è del tipo…', a:'192.168.1.10', o:['192.168.1.10','300.500.1.1','AB:CD:EF:12:34','www.esempio.it']},
    {p:'Il protocollo SMTP si usa per…', a:'Inviare email', o:['Inviare email','Scaricare pagine web','Trasferire file','Streaming video']},
    {p:'Il protocollo IMAP si usa per…', a:'Leggere email su server', o:['Leggere email su server','Inviare email','Videochiamate','Stampa di rete']},
    {p:'La porta 80 è tipica di…', a:'HTTP', o:['HTTP','FTP','SSH','SMTP']},
    {p:'La porta 22 è tipica di…', a:'SSH', o:['SSH','HTTP','DNS','IMAP']},
    {p:'NAT serve a…', a:'Tradurre indirizzi privati/pubblici', o:['Tradurre indirizzi privati/pubblici','Cifrare dischi','Disegnare grafici','Fare backup']},
    {p:'Un indirizzo IPv6 ha…', a:'Formato esadecimale con due punti', o:['Formato esadecimale con due punti','Solo numeri e punti','Solo lettere','È un file']},
    {p:'Ping serve a…', a:'Verificare raggiungibilità di un host', o:['Verificare raggiungibilità di un host','Cifrare dati','Disegnare','Gestire file']},
    {p:'Una subnet mask…', a:'Definisce la rete e gli host', o:['Definisce la rete e gli host','Cambia la password','Aumenta la RAM','Stampa documenti']},
    {p:'FTP usa di solito…', a:'Porta 21', o:['Porta 21','Porta 80','Porta 110','Porta 53']}
  ]); }

  function genCS_DBConcepts(){ return makeBank('ICT: database',[
    {p:'In un database relazionale, una riga si chiama…', a:'Tupla/record', o:['Tupla/record','Chiave esterna','Indice','Vista']},
    {p:'La chiave primaria serve a…', a:'Identificare univocamente i record', o:['Identificare univocamente i record','Criptare i dati','Descrivere il dominio','Unire due tabelle']},
    {p:'SQL è…', a:'Un linguaggio per interrogare database', o:['Un linguaggio per interrogare database','Sistema operativo','Protocollo di rete','Formato immagine']},
    {p:'Una chiave esterna…', a:'Collega record tra tabelle', o:['Collega record tra tabelle','Cifra i dati','Stampa report','Blocca accessi']},
    {p:'La normalizzazione serve a…', a:'Ridurre ridondanze', o:['Ridurre ridondanze','Aumentare RAM','Cifrare HDD','Fare backup']},
    {p:'Una vista (view)…', a:'È una query salvata come tabella virtuale', o:['È una query salvata come tabella virtuale','È un driver','È una GPU','È un PDF']},
    {p:'L’SQL SELECT…', a:'Recupera dati', o:['Recupera dati','Cancella tabelle','Installa driver','Cambia password']},
    {p:'La clausola WHERE…', a:'Filtra le righe', o:['Filtra le righe','Ordina le colonne','Crea un indice','Crea una chiave primaria']},
    {p:'L’SQL JOIN…', a:'Unisce tabelle correlate', o:['Unisce tabelle correlate','Cripta colonne','Spegne il server','Salva file']},
    {p:'Un indice su una colonna…', a:'Accelera le ricerche', o:['Accelera le ricerche','Stampa PDF','Aumenta RAM','Riduce sicurezza']},
    {p:'SQL INSERT serve a…', a:'Inserire nuove righe', o:['Inserire nuove righe','Eliminare tabelle','Avviare servizi','Cambiare tema']},
    {p:'SQL UPDATE serve a…', a:'Modificare dati esistenti', o:['Modificare dati esistenti','Creare database','Spegnere DBMS','Stampare report']}
  ]); }

  function genCS_AlgoComplex(){ return makeBank('ICT: algoritmi/complessità',[
    {p:'Un algoritmo in O(n) ha complessità…', a:'Lineare', o:['Lineare','Costante','Quadratica','Esponenziale']},
    {p:'La ricorsione è…', a:'Una funzione che richiama se stessa', o:['Una funzione che richiama se stessa','Variabile','Tabella database','Rete privata']},
    {p:'La ricerca binaria è…', a:'O(log n)', o:['O(log n)','O(n)','O(1)','O(n!)']},
    {p:'Un algoritmo in O(1)…', a:'Ha tempo costante', o:['Ha tempo costante','È impossibile','È sempre ricorsivo','È esponenziale']},
    {p:'Un algoritmo in O(n^2)…', a:'Ha crescita quadratica', o:['Ha crescita quadratica','È costante','È logaritmico','È lineare']},
    {p:'Il caso peggiore (worst‑case)…', a:'Tempo massimo richiesto', o:['Tempo massimo richiesto','Tempo medio','Tempo minimo','Tempo reale']},
    {p:'Il caso medio (average‑case)…', a:'Tempo atteso medio', o:['Tempo atteso medio','Tempo minimo','Sempre massimo','Sempre zero']},
    {p:'Il Big‑O misura…', a:'Come cresce il tempo/spazio con n', o:['Come cresce il tempo/spazio con n','La RAM fisica','La GPU','La rete']},
    {p:'Il backtracking…', a:'Esplora e torna indietro se necessario', o:['Esplora e torna indietro se necessario','È un antivirus','È un driver','È una GUI']},
    {p:'La memoization…', a:'Memorizza risultati per riuso', o:['Memorizza risultati per riuso','Cancella cache','Cripta dati','Stampa']},
    {p:'La programmazione dinamica…', a:'Scompone problemi in sottoproblemi', o:['Scompone problemi in sottoproblemi','Disegna grafici','Cambia risoluzione','Gestisce reti']},
    {p:'Una coda prioritaria…', a:'Estrae l’elemento con priorità maggiore', o:['Estrae l’elemento con priorità maggiore','È una coda casuale','È uno stack','È un array ordinato']}
  ]); }

  function genCS_SecurityAdv(){ return makeBank('ICT: sicurezza avanzata',[
    {p:'Il phishing è…', a:'Tentativo di furto credenziali con messaggi ingannevoli', o:['Tentativo di furto credenziali con messaggi ingannevoli','Backup online','Firma digitale','Firewall hardware']},
    {p:'Autenticazione forte: esempio', a:'Biometria o token hardware', o:['Biometria o token hardware','Password breve','Cookie pubblicitari','Screenshot di conferma']},
    {p:'La crittografia serve a…', a:'Proteggere la confidenzialità dei dati', o:['Proteggere la confidenzialità dei dati','Velocizzare la rete','Comprimere immagini','Stampare documenti']},
    {p:'Esempio di dato personale', a:'Indirizzo e‑mail', o:['Indirizzo e‑mail','Logo del sito','Colore preferito','Font usato']},
    {p:'HTTPS protegge…', a:'Dati in transito client‑server', o:['Dati in transito client‑server','File nel disco locale','Batteria del telefono','Qualità del Wi‑Fi']},
    {p:'Un backup 3‑2‑1 prevede…', a:'3 copie, 2 supporti, 1 copia off‑site', o:['3 copie, 2 supporti, 1 copia off‑site','1 copia su chiavetta','Solo cloud','Solo NAS']},
    {p:'Il ransomware è…', a:'Malware che cifra i dati chiedendo riscatto', o:['Malware che cifra i dati chiedendo riscatto','Filtro antispam','Una patch di sicurezza','Un proxy web']},
    {p:'Il social engineering consiste nel…', a:'Manipolare persone per ottenere informazioni', o:['Manipolare persone per ottenere informazioni','Criptare database','Scansionare porte','Aggiornare i driver']},
    {p:'La VPN serve a…', a:'Creare un tunnel cifrato su reti insicure', o:['Creare un tunnel cifrato su reti insicure','Velocizzare la CPU','Pulire i cookie','Cambiare il file system']},
    {p:'La firma digitale garantisce…', a:'Integrità e autenticità del documento', o:['Integrità e autenticità del documento','Velocità di download','Compressione ottimale','Rimozione virus']},
    {p:'La 2FA difende da…', a:'Furto credenziali anche se la password trapela', o:['Furto credenziali anche se la password trapela','Guasti hardware','Sovraccarico CPU','Calo di banda']},
    {p:'La politica Zero Trust prevede…', a:'Non fidarsi per default, verificare sempre', o:['Non fidarsi per default, verificare sempre','Fidarsi della LAN','Password condivise','Accesso libero in locale']},
    {p:'Un allegato sospetto è…', a:'Da non aprire: verificare il mittente', o:['Da non aprire: verificare il mittente','Sempre sicuro se PDF','Sicuro se zippato','Aprire e poi controllare']},
    {p:'Gli aggiornamenti di sicurezza…', a:'Riducano vulnerabilità note', o:['Riducano vulnerabilità note','Rallentano sempre il PC','Sono opzionali','Cancellano file utente']},
    {p:'Un sito con HTTP (senza S)…', a:'Trasmette dati non cifrati', o:['Trasmette dati non cifrati','È sempre falso','È sempre veloce','Blocca i cookie']},
    {p:'Il furto d’identità consiste…', a:'Nell’uso illecito dei dati personali', o:['Nell’uso illecito dei dati personali','Nel fare backup','Nel cambiare password','Nel cancellare cookie']},
    {p:'Un “password leak” è…', a:'Una fuga di credenziali da un servizio', o:['Una fuga di credenziali da un servizio','Una pulizia cache','Un errore di stampa','Una patch del driver']},
    {p:'Il principio del minimo privilegio…', a:'Concede solo i permessi necessari', o:['Concede solo i permessi necessari','Concede tutti i permessi','Blocca gli account','Richiede password deboli']}
  ]); }

  // ===== Legend =====
  function getLegendForPath(name){
    var m = {
      'Geometria: perimetro (piccoli)': 'Legenda: w = larghezza, h = altezza, P = 2*(w+h)',
      'Geometria: perimetro (rettangoli)': 'Legenda: w = larghezza, h = altezza, P = 2*(w+h)',
      'Geometria: perimetro (poligoni)': 'Legenda: somma di tutti i lati',
      'Aree: rettangolo/triangolo (piccoli)': 'A_rett = b*h; A_tri = (b*h)/2',
      'Volume del parallelepipedo (piccoli)': 'V = w*h*l',
      'Tabelline 2/5/10 (prime)': 'Usa salti di 2, 5 o 10',
      'Tabelline complete': 'Ripasso: 2–10',
      'Divisioni semplici': '÷ = operazione inversa di ×',
      'Frazioni equivalenti (semplici)': 'n/d ≡ (n*k)/(d*k)',
      'Decimali (somma facile)': 'Allinea la virgola',
      'Percentuali di base': 'p% di N = (p/100)*N',
      'Proporzioni': 'a:b = c:d ⇒ a*d = b*c',
      'Equazioni di 1° grado (semplici)': 'ax + b = c',
      'Equazioni di 1° grado': 'Isola la x',
      'f(x)=mx+q (valori)': 'f(x) = m*x + q',
      'Quadratica (somma radici)': 'Somma = -b/a',
      'Quadratica (radici — concetto)': 'Prodotto c/a e somma -b/a',
      'Trigonometria (angoli notevoli)': '0°, 30°, 45°, 60°, 90°',
      // Informatica
      'Informatica: mouse e tastiera': 'Tasti base, doppio clic, scorciatoie',
      'Informatica: hardware/software (base)': 'Hardware vs software, OS, driver',
      'Informatica: file e cartelle': 'Estensioni, percorsi, zip, cloud',
      'Informatica: coding a blocchi': 'Sequenze, eventi, cicli, debug',
      'Informatica: password (base)': 'Manager, 2FA, buone pratiche',
      'Informatica: Internet e ricerca': 'HTTPS, cache, cookie, incognito',
      'Informatica: ricerca avanzata': 'AND, OR, -, site:, filetype:',
      'Informatica: sicurezza (2FA)': 'OTP, passkey, backup codici',
      'Informatica: sistemi operativi e software': 'Kernel, processi, memoria',
      'Informatica: reti e protocolli': 'DNS, porte note, ping, NAT',
      'Informatica: basi di dati (concetti)': 'Record, chiavi, join, viste',
      'Informatica: algoritmi/complessità': 'Big-O, ricorsione, DP',
      'Informatica: sicurezza avanzata': 'Phishing, ransomware, Zero Trust'
    };
    return m[name] || '';
  }

  // ===== Route Map (identica) =====
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
      'Informatica: algoritmi/complessità': [genCS_AlgoComplex()]
    }},
    liceo5: { name:'5ª liceo', paths:{
      'Trigonometria (angoli notevoli)': [genTrigNotable()],
      'Quadratica (radici)': [genQuadraticRootsSimple()],
      'f(x)=mx+q (valori)': [genLinearFuncValue()],
      'Informatica: sicurezza avanzata': [genCS_SecurityAdv()]
    }}
  };

  // ===== Motore "deck-based": nessuna ripetizione nella partita =====
  var deck=[], deckIdx=0, currentPathName='', currentGradeKey='primaria2', level=0, stars=0, done=0, total=8, currentQuestion=null;

  function buildDeck(generators, desired){
    var unique = new Map(); // key -> question object
    var tries = 0, maxTries = desired*20;
    while(unique.size < desired && tries < maxTries){
      for(var i=0;i<generators.length;i++){
        var q = generators[i]();
        var key = norm(q.prompt);
        if(!unique.has(key)){ unique.set(key,q); }
        if(unique.size >= desired) break;
      }
      tries++;
    }
    // in caso di percorsi poveri, accettiamo quello che abbiamo
    var arr = Array.from(unique.values());
    shuffle(arr);
    return arr;
  }

  function populatePaths(){
    var g=$('livello'),p=$('percorso'); 
    if(!g||!p) return; 
    var info=routeMap[g.value]; 
    p.innerHTML=''; 
    Object.keys(info.paths).forEach(function(name){
      var o=document.createElement('option');o.value=name;o.textContent=name;p.appendChild(o);
    });
  }

  function startGame(){
    var g=$('livello'),p=$('percorso'); 
    if(!g||!p||!p.value) return; 
    currentGradeKey=g.value; 
    currentPathName=p.value; 
    var info=routeMap[currentGradeKey]; 
    var generators = info.paths[currentPathName]; 
    level=0; stars=0; done=0; total=8; 
    deckIdx=0;
    deck = buildDeck(generators, total*2); // deck abbondante
    if(deck.length < total){ total = deck.length; }
    $('stars').textContent=stars; 
    $('progress').textContent=done; 
    $('total').textContent=total; 
    $('levelName').textContent=currentPathName; 
    $('legend').textContent = getLegendForPath(currentPathName); 
    $('gradeName').textContent=info.name; 
    $('intro').classList.add('hidden'); 
    $('summary').classList.add('hidden'); 
    $('game').classList.remove('hidden'); 
    nextQuestion(true); 
    window.scrollTo(0,0); 
  }

  function nextQuestion(resetTitle){
    $('nextBtn').classList.add('hidden'); 
    $('choices').innerHTML=''; 
    if(deckIdx >= deck.length){ endGame(); return; }
    currentQuestion = deck[deckIdx++];
    $('prompt').textContent=currentQuestion.prompt; 
    $('legend').textContent = getLegendForPath(currentPathName); 
    currentQuestion.choices.forEach(function(c,idx){
      var btn=document.createElement('button'); 
      btn.type='button'; 
      btn.className='choice'; 
      btn.textContent=String(c); 
      btn.addEventListener('click', function(){ selectChoice(idx, btn); }, {once:true}); 
      $('choices').appendChild(btn);
    });
  }

  function selectChoice(idx, el){
    var correct = idx===currentQuestion.correct; 
    el.classList.add(correct?'correct':'wrong'); 
    Array.prototype.forEach.call(document.querySelectorAll('.choice'), function(n){ n.disabled=true; });
    if(correct){ stars+=1; done+=1; $('stars').textContent=stars; $('progress').textContent=done; }
    if(done>=total || deckIdx>=deck.length){ endGame(); } 
    else { $('nextBtn').classList.remove('hidden'); }
  }

  function endGame(){ 
    $('game').classList.add('hidden'); 
    $('summary').classList.remove('hidden'); 
    $('finalStars').textContent=stars.toFixed(1); 
    var msg = (done>=total) ? 
      ((stars>=total*0.9)?'Ottimo lavoro!':(stars>=total*0.6)?'Ben fatto! Continua ad allenarti.':'Buon inizio! Riprova.') :
      'Hai completato tutte le domande disponibili per questo percorso.';
    $('feedback').textContent=msg; 
  }

  // ===== Pulsanti & UI =====
  document.addEventListener('DOMContentLoaded', function(){ 
    populatePaths(); 
    on($('livello'),'change',populatePaths); 
    on($('refreshPathsBtn'),'click',populatePaths); 
    on($('playBtn'),'click',startGame); 
    on($('howBtn'),'click',function(){ $('intro').classList.add('hidden'); $('howto').classList.remove('hidden'); }); 
    on($('backIntro'),'click',function(){ $('howto').classList.add('hidden'); $('intro').classList.remove('hidden'); }); 
    on($('menuBtn'),'click',function(){ $('game').classList.add('hidden'); $('intro').classList.remove('hidden'); }); 
    on($('againBtn'),'click',startGame); 
    on($('homeBtn'),'click',function(){ $('summary').classList.add('hidden'); $('intro').classList.remove('hidden'); }); 
    on($('skipBtn'),'click',function(){ /* niente penalità sul deck */ nextQuestion(false); }); 
    on($('nextBtn'),'click', function(){ nextQuestion(false); }); 
  });

  // ===== Modalità LIM =====
  on(document.getElementById('limBtn'),'click', function(){ 
    document.body.classList.toggle('lim'); 
    this.textContent=document.body.classList.contains('lim')?'LIM: ON':'Modalità LIM'; 
    document.getElementById('statusBar').style.display=document.body.classList.contains('lim')?'block':'none'; 
  });

  // ===== PWA: install & auto-update =====
  var deferredPrompt=null; 
  window.addEventListener('beforeinstallprompt',function(e){
    e.preventDefault();deferredPrompt=e;
    var b=$('installBtn'); 
    if(b){
      b.hidden=false; 
      b.onclick=function(){
        try{b.hidden=true; deferredPrompt.prompt(); deferredPrompt=null;}catch(_){}
      };
    }
  });

  if('serviceWorker' in navigator){ 
    window.addEventListener('load', function(){ 
      navigator.serviceWorker.register('service-worker.js').then(function(reg){ 
        reg.addEventListener('updatefound', function(){ 
          var nw=reg.installing; if(!nw) return; 
          nw.addEventListener('statechange', function(){ 
            if(nw.state==='installed' && navigator.serviceWorker.controller){ 
              nw.postMessage({type:'SKIP_WAITING'}); 
            } 
          }); 
        }); 
      }); 
    }); 
    var refreshing=false; 
    navigator.serviceWorker.addEventListener('controllerchange', function(){ 
      if(refreshing) return; 
      refreshing=true; 
      window.location.reload(); 
    }); 
  }
})(); 
