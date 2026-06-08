import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from './assets/vite.svg'
// import heroImg from './assets/hero.png'
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



