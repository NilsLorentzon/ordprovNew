import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'

const dataMeta: {
  word: string,
  synonyms: string[],
  definition: string,
  sentences: string[]
}[] = [ // convert the commented text at the end of this file into the correct data structure
  {
    word: "Jantelagen",
    synonyms: ["Konformism", "Avundsjuka", "Social kontroll", "Självutplåning", "Likhetsideal"],
    definition: "Jantelagen är en oskriven social lag som uttrycker en dyster syn på mänskligt värde och framgång. Den innebär i korthet att man inte ska tro att man är märkvärdig eller bättre än någon annan.",
    sentences: [
      "Många menar att jantelagen fortfarande hämmar entreprenörskapet i Sverige eftersom man inte förväntas skryta om sina framgångar.",
      "Trots att hon blivit internationellt känd, verkade hon mån om att följa jantelagen och framstod som väldigt ödmjuk i intervjun.",
      "Det krävs ett visst mod för att våga sticka ut i en småstad där jantelagen styr hur folk ser på varandra.",
      "Han kritiserade den svenska jantelagen och menade att vi borde bli bättre på att fira varandras prestationer.",
      "Inom idrottsvärlden talas det ofta om att vi måste göra upp med jantelagen för att våga satsa på att bli bäst i världen."
    ]
  },
  {
    word: "Målsägande",
    synonyms: ["Brottsoffer", "Skadelidande", "Klagande"],
    definition: "En målsägande är den person som har utsatts för ett brott eller lidit skada av det. I juridiska sammanhang är det alltså 'offret' i en rättsprocess.",
    sentences: [
      "Målsäganden vittnade om händelsen i rätten.",
      "Advokaten representerade målsäganden under rättegången.",
      "Målsäganden fick ersättning för de skador som uppstått.",
      "Rätten tog hänsyn till målsägandens berättelse vid domen.",
      "Målsäganden kände sig tryggare efter att ha fått stöd från brottsofferjouren."
    ]
  },
  {
    word: "Måndagsexemplar",
    synonyms: ["Exemplar", "Prototyp", "Första upplaga"],
    definition: "Ett måndagsexemplar är ett uttryck som används för att beskriva något som är defekt eller av dålig kvalitet, ofta på grund av tillverkningsfel.",
    sentences: [
      "Boken var ett måndagsexemplar och hade flera tryckfel.",
      "Telefonen jag köpte visade sig vara ett måndagsexemplar och fungerade inte som den skulle.",
      "Måndagsexemplaret av bilen hade problem med motorn redan från början.",
      "Han fick ett måndagsexemplar av spelet och kunde inte spela det ordentligt.",
      "Måndagsexemplaret av möbeln var skadat vid leveransen."
    ]
  },
  {
    word: "kvadrant",
    synonyms: ["Fjärdedel", "Sektor", "Område", "Fält", "Fyrfältare"],
    definition: "En kvadrant är en av de fyra delar som uppstår när en yta delas av två vinkelräta linjer (ofta en x-axel och en y-axel). Ordet kommer från latinets quadrans, som betyder 'fjärdedel'. Inom matematiken numreras dessa delar ofta motsols, men begreppet används även flitigt i modeller för att kategorisera saker, till exempel 'Eisenhowermatrisen' för tidshantering.",
    sentences: [
      "I koordinatsystemet ligger punkten (3,−2) i den fjärde kvadranten.",
      "För att prioritera rätt placerade han alla sina arbetsuppgifter i rätt kvadrant i sin planeringsmatris.",
      "Analysen visar att vårt företag befinner sig i den övre högra kvadranten, vilket innebär hög marknadsandel och hög tillväxt.",
      "Läkaren undersökte bröstet och noterade en förändring i den övre yttre kvadranten.",
      "När man navigerar med en gammaldags kvadrant använder man stjärnorna för att bestämma sin position på havet."
    ]
  },
  {
    word: "allmänning",
    synonyms: ["Gemensam mark", "Delad resurs", "Offentlig mark"],
    definition: "En allmänning är ett område (oftast mark eller skog) som ägs eller får nyttjas gemensamt av en grupp människor eller av hela samhället. Historiskt sett var det byns gemensamma betesmark eller skog där alla bönder fick låta sina djur beta. Idag används begreppet även bildligt, till exempel om internet ('den digitala allmänningen') eller atmosfären, som något vi alla delar och har ett gemensamt ansvar för.",
    sentences: [
      "Byborna samlades för att diskutera hur allmänningen skulle skötas.",
      "Fisket i sjön betraktades som en allmänning där alla hade rätt att fiska.",
      "Den digitala allmänningen omfattar resurser som internet och öppen källkod.",
      "Atmosfären är en global allmänning som vi alla måste skydda.",
      "Historiskt sett var allmänningen en viktig resurs för byns överlevnad."
    ]
  },
  {
    word: "halvpension",
    synonyms: ["Delvis kost och logi", "Halv kost", "Halvboende"],
    definition: "Halvpension innebär att man får två måltider om dagen, vanligtvis frukost och middag, inkluderat i priset för boendet, men inte lunch.",
    sentences: [
      "Hotellet erbjuder halvpension, vilket inkluderar frukost och middag.",
      "Vi valde halvpension för att slippa tänka på var vi skulle äta lunch.",
      "Halvpension är ett populärt alternativ för resenärer som vill ha flexibilitet under dagen.",
      "Många turistorter erbjuder paket med halvpension under högsäsong.",
      "Halvpension kan vara ett kostnadseffektivt sätt att resa på."
    ]
  },
  {
    word: "amfiteater",
    synonyms: ["Arena", "Teater", "Scen", "Amfiteater"],
    definition: "En amfiteater är en rund eller oval byggnad med sittplatser som stiger uppåt från scenen eller spelplatsen, ofta använd för teaterföreställningar, konserter eller sportevenemang. Ordet kommer från grekiskans amphitheatron, som betyder 'på båda sidor av teatern'.",
    sentences: [
      "Det gamla romerska amfiteatern kunde rymma tusentals åskådare.",
      "Konserten hölls i en modern amfiteater med utmärkt akustik.",
      "Skolan byggde en liten amfiteater för utomhusföreställningar.",
      "Amfiteatern i staden är en populär plats för sommarteater.",
      "Arkeologerna upptäckte resterna av en antik amfiteater."
    ]
  },
  {
    word: "dubier",
    synonyms: ["Tvivel", "Betänkligheter", "Misstro", "Skeptisk inställning", "Vankelmod"],
    definition: "Dubier betyder tvivel, misstankar eller betänkligheter. Det används ofta för att beskriva en inre osäkerhet inför ett beslut eller en tveksamhet inför om något verkligen är sant eller riktigt. Ordet har samma stam som engelskans doubt och latinets dubius. Det används nästan uteslutande i plural (flertal).",
    sentences: [
      "Trots styrelsens positiva besked hyser jag fortfarande vissa dubier kring projektets långsiktiga finansiering.",
      "Hon uttryckte sina dubier om planens genomförbarhet.",
      "Jag har vissa dubier kring om detta är den bästa lösningen.",
      "Hans kommentarer väckte dubier hos teamet.",
      "Det finns dubier om huruvida informationen är korrekt."
    ]
  },
  {
    word: "dagsmeja",
    synonyms: ["Solvärme", "Dagsljus", "Värmebölja"],
    definition: "Dagsmeja är den värme som uppstår när solen skiner på snö eller is och får den att smälta. Ordet används också bildligt för att beskriva en kortvarig värme eller glädje under dagen.",
    sentences: [
      "Efter en kall morgon njöt vi av dagsmejan på verandan.",
      "Dagsmejan fick snön att smälta snabbt.",
      "Barnen lekte i dagsmejan på skolgården.",
      "Vi tog en promenad för att njuta av dagsmejan.",
      "Dagsmejan gjorde att isen på sjön började sjunka."
    ]
  },
  {
    word: "klänge",
    synonyms: ["Klängtråd", "Gripverktyg", "Rankor", "Slingertråd"],
    definition: "Ett klänge är ett specialiserat, trådlika organ hos vissa klätterväxter. Det fungerar som en gripklo eller en fjäder som växten använder för att fästa vid och klättra uppför stöd, såsom stängsel, pinnar eller andra växter.",
    sentences: [
      "Sockerärtans tunna klängen sökte febrilt efter något att hålla fast vid på nätet.",
      "Om man tittar nära ser man hur växtens klängen har virat sig som en liten spiral runt bambupinnen.",
      "Vissa växter, som vinrankor, förlitar sig helt på sina klängen för att kunna växa på höjden.",
      "Det är fascinerande hur ett klänge reagerar på beröring och börjar kröka sig bara några minuter efter kontakt.",
      "När hösten kom torkade växtens klängen och blev bruna, men de höll fortfarande kvar plantan i ett stadigt grepp."
    ]
  },
  {
    word: "ganglie",
    synonyms: ["Nervknut", "Kopplingsstation", "Senknuta", "Plexus"],
    definition: " Ett ganglie är en ansamling av nervcellskroppar i det perifera nervsystemet (alltså utanför hjärnan och ryggmärgen). Man kan likna det vid en sorts \"kopplingsstation\" eller en lokal central där nervsignaler bearbetas eller skickas vidare. Termen används också ibland för att beskriva en godartad vätskefylld utbuktning vid en led eller sena (ofta på handleden), då kallat för en \"senknuta\".",    
    sentences: [
      "Gangliet i handen är känsligt för tryck och smärta.",
      "Forskare studerar ganglier för att förstå nervsystemets funktion.",
      "Ett skadat ganglie kan påverka nervsignaleringen.",
      "Ganglier finns i olika delar av kroppen och har olika funktioner.",
      "Behandling av ganglier kan innebära kirurgi eller medicinering."
    ]
  },
  {
    word: "anletsdrag",
    synonyms: ["Ansiktsdrag", "Fysiognomi", "Anlete", "Mina"],
    definition: "Anletsdrag syftar på de individuella formerna och linjerna i ett ansikte som ger det dess unika karaktär, såsom näsans form, munnens kurvatur eller ögonens placering. Ordet kommer från \"anlete\", som är ett äldre och mer högtidligt ord för ansikte. När man pratar om anletsdrag menar man ofta helheten av dessa drag som gör att man känner igen en person.",
    sentences: [
      "Trots att det gått tjugo år sedan de sågs sist, var hans anletsdrag precis så skarpa och tydliga som hon mindes dem.",
      "Konstnären arbetade länge med att fånga modellens mjuka anletsdrag i det fladdrande ljuset från stearinljusen.",
      "Barnet hade ärvt sin fars grova anletsdrag men fått sin mors pigga och glada ögon.",
      "När han fick höra det sorgliga beskedet stelnade hans anletsdrag till en mask av förtvivlan.",
      "I skymningen var det svårt att urskilja personens exakta anletsdrag, men kroppsspråket kändes bekant."
    ]
  },
  {
    word: "armatur",
    synonyms: ["Belysningsenhet", "Vattenblandare", "Hållare", "Sockel", "Inredningsdetalj", "Garnityr"],
    definition: "En armatur är den fasta utrustning eller de anordningar som krävs för att en viss funktion ska fungera, oftast kopplat till el, vatten eller belysning. I vardagsspråk menar man oftast en belysningsarmatur (själva höljet som håller lampan, sladdarna och fästet). Inom VVS syftar det på kranar, duschmunstycken och ventiler som styr vattenflödet. Ordet kommer från latinets armatura, som betyder utrustning eller beväpning.",
    sentences: [
      "Vid renoveringen av badrummet valde de en modern armatur i borstad mässing till tvättstället.",
      "I den stora fabrikslokalen hängde gamla industriella armaturer som gav ett rått men stilrent intryck.",
      "Vaktmästaren behövde byta ut hela armaturen eftersom fästet hade spruckit och inte längre gick att laga.",
      "Det är viktigt att kontrollera att din utomhus-armatur är godkänd för fuktiga miljöer och har rätt IP-klassning.",
      "Arkitekten lade stor vikt vid valet av armaturer för att skapa rätt stämning i byggnadens entréhall."
    ]
  },
  {
    word: "komponent",
    synonyms: ["Beståndsdel", "Del", "Element", "Modul", "Ingrediens"],
    definition: "En komponent är en beståndsdel eller en del av en större helhet. Ordet används för att beskriva något som ingår i ett system eller en maskin och som fyller en specifik funktion för att helheten ska fungera. Det kan vara en fysisk sak (som en skruv i en motor eller en processor i en dator) eller något abstrakt (som en del i en politisk strategi eller en ingrediens i ett recept).",
    sentences: [
      "Den nya datorn hade en kraftfull processor som en viktig komponent i systemet.",
      "I receptet är smöret en viktig komponent för att få rätt konsistens på degen.",
      "Projektet misslyckades eftersom en kritisk komponent saknades i planen.",
      "Elektronikingenjören kontrollerade varje komponent noggrant innan montering.",
      "Teamet diskuterade hur varje komponent i strategin bidrog till det övergripande målet."
    ]
  },
  {
    word: "grannlåt",
    synonyms: ["Prydnad", "Smycke", "Ståt", "Prål", "Dekoration"],
    definition: "Grannlåt syftar på prydnader, smycken eller dekorationer som är iögonfallande, praktfulla eller kanske till och med lite pråliga. Förr i tiden användes ordet ofta om vackra klädesdetaljer eller smycken som bars vid högtider. Idag används det ofta för att beskriva något som är glittrigt och vackert, men ibland med en underton av att det är lite ytligt eller onödigt pynt.",   
    sentences: [
      "Julgranen var klädd i glittrande girlanger, röda kulor och annan glänsande grannlåt.",
      "Trots sin rikedom var hon inte mycket för glitter och grannlåt, utan föredrog en enkel och stilren klädsel.",
      "I montern på museet låg kungliga kronor och historisk grannlåt som imponerade på besökarna.",
      "Han spenderade alla sina pengar på dyra klockor och annan grannlåt som egentligen inte fyllde någon praktisk funktion.",
      "Marknadsståndet var fyllt av billig grannlåt i plast som lockade barnen med sina starka färger."
    ]

  }


]

const dataWithUXdata = dataMeta.map(item => ({
  ...item,
  showAnswers: false
}))
function App() {
  const [data, setData] = useState(dataWithUXdata)
  return (
    <>
     <div className="">
      
      {data.map((item, index) => (
        <div key={index}>
          <h2>{item.word}</h2>
          <button className="" onClick={() => {
            const newData = [...data];
            newData[index].showAnswers = !newData[index].showAnswers;
            setData(newData);
          }}>
            {item.showAnswers ? "Dölj svar" : "Visa svar"}
          </button>
          {(item.showAnswers && <>
            <p><strong>Definition:</strong> {item.definition}</p>
            <p><strong>Synonyms:</strong> {item.synonyms.join(', ')}</p>
            <div>
              <strong>Example Sentences:</strong>
              <ul>
                {item.sentences.map((sentence, idx) => (
                  <li key={idx}>{sentence}</li>
                ))}
              </ul>
            </div>
          </>)}
        </div>
      ))}
     </div>
    </>
  )
}

export default App





// villebråd

// Ett ord som ofta förknippas med jakt, men som även används flitigt i överförd mening. Här är genomgången av villebråd.

// Förklaring
// Villebråd syftar ursprungligen på vilda djur som är föremål för jakt, det vill säga det vilt man jagar för att få kött eller päls. I en mer bildlig betydelse används ordet om en person eller något som jagas, förföljs eller är ett mål för någons uppmärksamhet (ofta i en utsatt position).

// Synonymer
// Byte (det mest närliggande ordet)

// Vilt (när man talar om djuren i skogen)

// Jaktbyte

// Mål (i överförd mening)

// Ordet i 5 olika meningar
// Jägarna gav sig ut i gryningen i hopp om att få syn på något lämpligt villebråd.

// I den hårda politiska debatten blev ministern ett tacksamt villebråd för oppositionens kritik.

// Lejonet smög ljudlöst genom det höga gräset för att inte skrämma sitt villebråd.

// Efter de stora tidningsrubrikerna kände han sig som ett jagat villebråd så fort han lämnade sitt hem.

// Skogen var rik på villebråd, vilket gjorde området mycket populärt bland traktens jaktlag.

// årder

// Ett ord som tar oss långt tillbaka i jordbrukshistorien! Här är genomgången av årder.

// Förklaring
// Ett årder är ett av människans äldsta jordbruksredskap. Det är en föregångare till plogen och används för att rista skåror i marken inför sådd. Till skillnad från en plog, som vänder på jorden (grästorven), skär årdret bara ett spår i marken utan att vända den. Det ser ut som en kraftig krok som dras genom jorden, oftast av oxar eller hästar i äldre tid.

// Synonymer och relaterade begrepp
// Krokplog (en beskrivande benämning)

// Alvslappare (ett modernare redskap som påminner om årdrets funktion)

// Plog (det modernare redskapet som ersatte årdret)

// Rist (själva skäret på redskapet)

// Ordet i 5 olika meningar
// Arkeologer har hittat spår i jorden som visar att bönder använde årder redan under bronsåldern.

// Eftersom ett årder inte vänder på jorden, behövde man ofta köra det korsvis över fältet för att luckra upp marken ordentligt.

// Museet ställde ut ett välbevarat årder av trä som hittats i en mosse.

// Innan den tunga hjulplogen uppfanns, var årder det vanligaste redskapet för att bereda åkermarken.

// I vissa torra regioner föredrog man länge årder framför plog, eftersom det minskade risken för att jorden torkade ut när den inte vändes.

// amöba

// En amöba är en riktig klassiker inom biologin, känd för sin förmåga att ständigt byta form. Här är genomgången!

// Förklaring
// En amöba är en encellig organism som tillhör gruppen protozoer. Det mest utmärkande för en amöba är att den inte har någon fast kroppsform. Istället rör den sig och jagar föda genom att skjuta ut delar av sin cellkropp, så kallade "skenfötter" (pseudopodier). Genom att sträcka ut dessa kan den långsamt rinna framåt eller omsluta bakterier och andra små partiklar för att äta dem. De flesta amöbor lever i vatten eller fuktig jord.

// Synonymer och relaterade begrepp
// Encellig organism

// Urdjur (protozo)

// Skenfotsdjur

// Formlös varelse (i bildlig mening)

// Ordet i 5 olika meningar
// I biologisalen fick vi titta i mikroskop för att se hur en amöba långsamt rörde sig över glaset.

// Genom att sträcka ut sina pseudopodier kan en amöba enkelt fånga upp näringspartiklar i vattnet.

// Vissa typer av amöbor kan orsaka sjukdomar hos människor om man råkar dricka förorenat vatten.

// Han beskrev organisationen som en amöba, eftersom den saknade tydlig struktur och ständigt ändrade form.

// En amöba förökar sig genom celldelning, vilket innebär att en modercell blir till två identiska dotterceller.

// dekal

// Ett ord som de flesta kommer i kontakt med dagligen, oavsett om det är på en laptop, en bil eller en fönsterruta. Här är genomgången av dekal.

// Förklaring
// En dekal är en typ av klistermärke eller bild som är tryckt på ett speciellt underlag för att sedan kunna överföras till en annan yta. Till skillnad från ett vanligt klistermärke som man bara drar av och klistrar fast, förknippas dekaler ofta med lite högre kvalitet eller specifika tekniker (som vattenöverföring eller vinyl). De används ofta för märkning, reklam eller dekoration på föremål som fordon, maskiner och fönster eftersom de är gjorda för att tåla väder och vind.

// Synonymer
// Klistermärke (det vanligaste vardagsordet)

// Transfer (ofta inom industri eller hobby)

// Etikett (ofta mer för information än dekoration)

// Vinyltryck (när det gäller utskurna bokstäver eller logotyper)

// Ordet i 5 olika meningar
// Han satte en dekal med företagets logotyp på bakrutan av sin skåpbil.

// Modellflygplanet blev komplett först när alla små dekaler hade monterats på vingarna.

// Butikens fönster pryddes av färgglada dekaler som informerade om att den stora rean hade börjat.

// Det kan vara svårt att få bort gamla dekaler från en yta utan att det blir fula märken efter klistret.

// Många bärbara datorer är nästan helt täckta av olika dekaler från mjukvaruföretag och konferenser.

// faksimil

// Ett ord som ofta används inom bokvärlden, journalistiken och historieforskningen! Här är genomgången av faksimil.

// Förklaring
// Ett faksimil är en exakt kopia eller återgivning av ett originaldokument, en bok, en karta eller ett konstverk. Målet med ett faksimil är att det ska likna originalet så mycket som möjligt, inte bara vad gäller texten utan även typsnitt, papperskvalitet, fläckar och ålderstecken. Det kommer från latinets fac simile, som ordagrant betyder "gör liknande".

// Synonymer
// Efterbildning

// Kopia (men mer exakt och trogen än en vanlig kopia)

// Reproduktion

// Avtryck

// Ordet i 5 olika meningar
// Biblioteket förvarar originalet i ett valv, men besökarna får gärna bläddra i ett faksimil av den gamla bibeln.

// Tidningen tryckte ett faksimil av förstasidan från dagen då människan landsteg på månen.

// För samlare som inte har råd med dyra förstautgåvor kan ett välgjort faksimil vara ett utmärkt alternativ.

// I boken fanns ett faksimil av författarens handskrivna brev, komplett med bläckplump och allt.

// Forskaren använde ett digitalt faksimil för att kunna studera de medeltida texterna hemifrån utan att skada originalet.

// pentagram

// Ett ord som bär på en enorm tyngd av symbolik, från matematik och astronomi till religion och populärkultur. Här är genomgången av pentagram.

// Förklaring
// Ett pentagram är en femuddig stjärna dragen med fem raka streck i en enda obruten linje. Geometriskt sett bildas det genom att man drar diagonaler i en regelbunden femhörning (pentagon).

// Symbolen har använts i tusentals år:

// I antiken: Som en symbol för hälsa och perfektion. Pythagoréerna såg gudomliga matematiska proportioner i stjärnan (det gyllene snittet).

// Inom astronomin: Planeten Venus bana runt jorden bildar ett mönster som liknar ett pentagram över en åttaårsperiod.

// Inom ockultism och religion: En uppåtriktad stjärna symboliserar ofta andens seger över materian. En nedåtriktad stjärna (där två uddar pekar uppåt) förknippas ofta inom modern populärkultur med satanism eller mörk magi.

// Synonymer och relaterade begrepp
// Femuddig stjärna

// Pentakel (ofta ett pentagram inskrivet i en cirkel)

// Morgonstjärna (i vissa historiska och astronomiska sammanhang)

// Pentalfa (ett annat namn eftersom figuren kan ses som fem sammansatta "A":n)

// Ordet i 5 olika meningar
// Huvudpersonen i filmen hittade ett gammalt pentagram inristat i det dammiga trägolvet på vinden.

// Inom matematiken är ett pentagram intressant eftersom alla dess linjer delar varandra enligt det gyllene snittet.

// Många förväxlar felaktigt alla pentagram med ondska, trots att symbolen historiskt sett ofta stått för skydd och hälsa.

// Boken beskrev hur alkemister under medeltiden använde pentagrammet som en symbol för de fem elementen.

// Flaggorna i vissa länder, som Marocko och Etiopien, innehåller ett pentagram som en nationell symbol.

// spor

// Ett ord som har två helt olika betydelser beroende på om vi befinner oss i naturens värld eller i stallet! Här är genomgången av spor.

// Förklaring
// Ordet spor (ofta använd i plural: sporer) har två huvudsakliga definitioner:

// Biologi: En spor är en liten, oftast encellig förökningskropp hos växter (som ormbunkar och mossor), svampar och alger. Till skillnad från frön innehåller sporer ingen näring till ett embryo, men de är extremt tåliga och kan spridas långa vägar med vinden för att sedan gro när de landar på en gynnsam plats.

// Ridsport: En sporre (där "spor" är en äldre eller mer teknisk variant av ordet, även om sporre är det vanligaste idag) är ett metallredskap som ryttaren fäster på sina stövelklackar. De används för att ge hästen finare och mer precisa signaler med skänklarna.

// Synonymer och relaterade begrepp
// Frökropp (biologisk liknelse)

// Grodd

// Sporre (för ridning)

// Drivfjäder (bildligt, som i att "sporra någon")

// Ordet i 5 olika meningar
// När man trycker på en mogen röksvamp flyger miljontals bruna sporer ut som ett moln av damm.

// Många bakterier kan bilda sporer för att överleva i extrem hetta eller torka under väldigt lång tid.

// Ryttaren använde sina sporer varsamt för att få hästen att utföra den svåra rörelsen i dressyrprogrammet.

// Ormbunkar har inga blommor, utan på undersidan av bladen sitter små bruna prickar där deras sporer bildas.

// Mögel sprids snabbt i fuktiga miljöer genom att osynliga sporer färdas genom luften och landar på nya ytor.

// ankel

// Ett ord som de flesta förknippar med löpning, snygga strumpor eller kanske en och annan vrickning! Här är genomgången av ankel.

// Förklaring
// Ankeln (eller fotleden) är den led som binder samman foten med underbenet. Den består av tre huvudsakliga ben: skenbenet, vadbenet och språngbenet. Ankeln är en av kroppens mest belastade leder eftersom den bär upp hela din kroppsvikt och dessutom tillåter foten att röra sig i flera olika riktningar.

// Synonymer och relaterade begrepp
// Fotled (den mer medicinskt korrekta termen)

// Malleol (de utstickande benknölarna på in- och utsidan av ankeln)

// Häl (sitter precis under ankeln)

// Vrist (används ofta synonymt i vardagsspråk, även om vristen tekniskt sett sitter lite längre fram på fotryggen)

// Ordet i 5 olika meningar
// Efter att ha trampat snett i skogen svullnade min ankel upp och blev alldeles blå.

// Byxorna var lite för korta och slutade precis ovanför ankeln, vilket visade upp hennes nya tatuering.

// För att förebygga skador är det viktigt för idrottare att träna upp stabiliteten i sina anklar.

// Han bar en tunn kedja av guld runt sin vänstra ankel som ett minne från resan.

// Läkaren undersökte rörligheten i min ankel genom att be mig rotera foten långsamt.

// brottstycke

// Ett ord som ofta används när man pratar om minnen, berättelser eller musik som inte är kompletta. Här är genomgången av brottstycke.

// Förklaring
// Ett brottstycke är en liten del, ett fragment eller ett lösryckt stycke av en större helhet. Ordet antyder att delen har "brutits loss" från sitt sammanhang. Det används sällan om fysiska föremål (där säger man hellre skärva eller bit), utan oftast om abstrakta saker som information, samtal, texter eller minnesbilder.

// Synonymer
// Fragment (ett mer vetenskapligt eller formellt ord)

// Utdrag (en medvetet utvald del)

// Lösryckt del

// Skärva (bildligt, t.ex. "skärvor av ett liv")

// Passage (när det gäller text eller musik)

// Ordet i 5 olika meningar
// Jag lyckades bara uppfatta ett brottstycke av deras samtal när jag gick förbi i korridoren.

// Boken består av korta brottstycken ur författarens dagbok under krigsåren.

// Polisen försökte pussla ihop händelseförloppet med hjälp av små brottstycken från olika vittnesmål.

// I mitt huvud ringer fortfarande ett litet brottstycke av den där melodin vi hörde på radion imorse.

// Trots att det var länge sedan jag bodde där, dyker det ibland upp klara brottstycken av minnen från min barndom.

// fanerogam

// Ett ord som för oss rakt in i botanikens systematik! Här är genomgången av fanerogam.

// Förklaring
// En fanerogam är en fröväxt. Ordet kommer från grekiskans phaneros (synlig) och gamos (äktenskap/befruktning). Det syftar på att dessa växter har tydliga könsorgan i form av blommor eller kottar, till skillnad från kryptogamer (sporväxter som mossor och ormbunkar) där fortplantningen sker mer "dolt".

// Fanerogamer delas in i två huvudgrupper:

// Gömfröiga växter: De vi oftast kallar blomväxter, där fröet utvecklas inuti en frukt.

// Nakenfröiga växter: Växter där fröna sitter öppet, som till exempel hos barrträd (i kottar).

// Synonymer och relaterade begrepp
// Fröväxt (den moderna och vanligaste termen)

// Blomväxt (ofta använt synonymt, även om det strikt sett bara är en del av fanerogamerna)

// Spermatofyt (det vetenskapliga namnet på gruppen)

// Kryptogam (motsatsen: växter som förökar sig med sporer)

// Ordet i 5 olika meningar
// Inom biologin delar man traditionellt upp växtriket i fanerogamer och kryptogamer baserat på hur de förökar sig.

// De flesta växter vi ser i en vanlig trädgård, från rosor till äppelträd, tillhör gruppen fanerogamer.

// Utvecklingen av fröet gav fanerogamerna en stor evolutionär fördel eftersom fröet skyddar och ger näring åt embryot.

// Även om tallar inte har färgglada kronblad, räknas de som fanerogamer eftersom de producerar frön i sina kottar.

// I den gamla floran var växterna strikt sorterade efter om de var fanerogamer eller sporväxter.

// bale

// Ett ord som de flesta har sett på en åker, men som också har en helt annan betydelse inom handel och sjöfart. Här är genomgången av bale.

// Förklaring
// En bale är ett tätt sammanpackat och ofta sammanbundet paket av något material. Syftet med att göra en bale är att underlätta transport och förvaring genom att minska volymen på materialet.

// De vanligaste typerna är:

// Inom jordbruket: En sammanpressad mängd hö, halm eller ensilage. Förr var de fyrkantiga och små, men idag är de oftast stora, runda och inplastade i vit plast (vilket gett upphov till smeknamnet "traktorgägg").

// Inom handel/industri: Stora paket av råvaror som bomull, papper, ull eller tyg. Dessa kallas ofta för varubalar.

// Synonymer och relaterade begrepp
// Bunt (för mindre mängder)

// Packe

// Kollit (inom frakt)

// Ensilageboll (specifikt för de vita plastade balarna på åkern)

// Ordet i 5 olika meningar
// Bonden arbetade sent inpå kvällen med att köra hem alla balar med hö innan regnet kom.

// I hamnen stod stora balar med återvunnet papper som väntade på att lastas ombord på fartyget.

// Förr i tiden bars bomull ofta i tunga balar som vägde flera hundra kilo styck.

// Vi använde gamla balar av halm som sittplatser under den stora logdansen.

// Maskinen pressar samman gräset till en kompakt bale och binder den sedan med ett starkt nät.
