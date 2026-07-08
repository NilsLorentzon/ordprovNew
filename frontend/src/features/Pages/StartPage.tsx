import { useNavigate } from "react-router-dom";
import ScrollArrowIcon from "../../assets/SVG/ScrollArrowIcon";
import { motion } from "motion/react";
import { AuthContext } from "../../providers/AuthenticationProvider";
import { useContext } from "react";
import { routePaths } from "../../routes/MainRoutes";

function StartPage() {
  const navigate = useNavigate();
  const { auth } = useContext(AuthContext);
  const features = [
    { id: 1, text: "Detaljerade definitioner och exempelmeningar" },
    { id: 2, text: "Kursplan för effektiv inlärning" },
    { id: 3, text: "högskoleprovsliknande quiz" },
    {
      id: 4,
      text: (
        <>
          <a
            href="https://en.wikipedia.org/wiki/Spaced_repetition"
            aria-label="Spaced repetition"
            className="text-blue-400 hover:underline font-medium"
            target="_blank"
            rel="noopener noreferrer"
          >
            Spaced repetition
          </a>{" "}
          som gör att orden sitter
        </>
      ),
    },
    {
      id: 6,
      text: "Helt gratis att använda och ingen reklam ",
      highlight: true,
    },
  ];

  // get amount of days and hours between today and 2026-10-18
  const today = new Date();
  const examDate = new Date("2026-10-18");
  const timeDiff = examDate.getTime() - today.getTime();
  const daysDiff = Math.floor(timeDiff / (1000 * 3600 * 24));
  const hoursDiff = Math.floor((timeDiff % (1000 * 3600 * 24)) / (1000 * 3600));
  return (
    <div className="min-h-full h-full">
      <div className="h-full w-full justify-center flex items-center relative bg-white">
        <div className="flex flex-col justify-between max-w-2xl">
          <div className="flex items-center flex-col">
            <h1 className=" max-[370px]:text-4xl text-5xl lg:px-4 px-2 text-center tracking-tight font-semibold text-slate-900">
              Öka ditt ordförråd och <span className="text-p-300">spika </span>{" "}
              ORD-delen på högskoleprovet
            </h1>
            <h2 className="px-4 pt-3 text-center font-medium tracking-wide text-slate-500 text-lg">
              10 000 utvalda ord inför högskoleprovet &ndash; interaktiva quiz
              med detaljerade definitioner och exempelmeningar.
            </h2>
            <button
              aria-label="Starta provet"
              className="mt-8 px-8 py-3.5 bg-p-200 text-white text-xl font-semibold rounded-xl hover:bg-p-300 hover:scale-105 transition duration-200 shadow-md"
              onClick={() => navigate(routePaths.provStart)}
            >
              Starta provet
            </button>
          </div>
          {/* <div className="text-center py-4">footer afaf</div> */}
        </div>
        <motion.div
          // make it bounce
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="absolute bg-p-100 rounded-full bottom-4 right-4 w-12 h-12 flex justify-center items-center"
        >
          <button
            className="p-4 hidden md:block"
            aria-label="Scrolla ner"
            // scroll one full viewport height down on click
            onClick={() => {
              const nextSection = document.querySelector("#features-section");
              const main = document.querySelector("#main-content");
              if (nextSection) {
                nextSection.scrollIntoView({ behavior: "smooth" });
              }
            }}
          >
            <ScrollArrowIcon className="fill-white w-8 h-8" />
          </button>
          <button
            className="p-4 md:hidden block"
            aria-label="Scrolla ner"
            // scroll one full viewport height down on click
            onClick={() => {
              const nextSection = document.querySelector("#features-section");
              const main = document.querySelector("#main-content");
              if (nextSection) {
                const offset = 56;
                const elementPosition = nextSection.getBoundingClientRect().top;
                const offsetPosition =
                  elementPosition + window.pageYOffset - offset;
                if (main) {
                  main.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth",
                  });
                }
                // nextSection.scrollIntoView({ behavior: "smooth" });
              }
            }}
          >
            <ScrollArrowIcon className="fill-white w-8 h-8" />
          </button>
        </motion.div>
      </div>

      <div
        className="w-full h-full px-4 bg-slate-800 relative justify-center flex items-center "
        id="features-section"
      >
        <div className="w-full m-auto max-w-md lg:pl-4 flex flex-col items-start">
          <h2 className="text-3xl sm:text-4xl mb-10 font-medium  text-white text-left">
            Varför Ordprov.com?
          </h2>

          {/* Features List */}
          <ul className="space-y-5 text-base sm:text-lg text-slate-300 w-full">
            {features.map((feature) => (
              <li key={feature.id} className="flex items-start gap-3">
                {/* Checkmark Icon */}
                <svg
                  className="w-6 h-6 text-emerald-500 shrink-0 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>

                {/* Feature Text */}
                <span
                  className={feature.highlight ? "font-medium text-white" : ""}
                >
                  {feature.text}
                </span>
              </li>
            ))}
          </ul>
        </div>
        <motion.div
          // make it bounce
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="absolute  bg-p-200 rounded-full bottom-4 right-4 w-12 h-12 flex justify-center items-center"
        >
          <button
            className="p-4"
            aria-label="Scrolla ner"
            // scroll one full viewport height down on click
            onClick={() => {
              const nextSection = document.querySelector("#signup-section");
              if (nextSection) {
                nextSection.scrollIntoView({ behavior: "smooth" });
              }
            }}
          >
            <ScrollArrowIcon className="fill-white w-8 h-8" />
          </button>
        </motion.div>
      </div>
      <div
        className="h-full w-full justify-center flex items-center bg-slate-50"
        id="signup-section"
      >
        <div className="flex flex-col justify-between max-w-sm text-center relative px-4 py-16">
          <div className="flex items-center flex-col">
            <h2 className=" text-xl lg:px-2 px-2 text-center font-medium text-[#222222]">
              <span className=" font-bold text-2xl">{daysDiff}</span> dagar och{" "}
              <span className=" font-bold text-2xl">{hoursDiff}</span> timmar
              kvar till Högskoleprovet &ndash; börja plugga idag!
            </h2>
            <button
              aria-label="Till kursplan"
              className="mt-2 px-8 py-3.5 bg-p-200 text-white text-xl font-semibold rounded-xl hover:bg-p-300 hover:scale-105 transition duration-200 shadow-md"
              onClick={() => navigate(routePaths.wordCoursePlan)}
            >
              Till kursplan
            </button>
          </div>
        </div>
      </div>

      {/* ── Feature detail cards ────────────────────────────────────────────────── */}
      <div className="bg-white py-16 px-4">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4 text-center">
            Allt du behöver för att spika ORD-delen
          </h2>
          <p className="text-slate-500 text-center mb-12 text-lg leading-relaxed">
            Ordprov.com kombinerar en komplett ordlista med smarta
            inlärningsverktyg &ndash; helt gratis, utan konto och utan annonser.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              {
                title: "10 000+ ord med djupgående definitioner",
                body: "Varje ord presenteras med en tydlig definition, ordklass och upp till 10 exempelmeningar så att du förstår hur ordet används i rätt sammanhang.",
              },
              {
                title: "Högskoleprovsliknande flervalsfrågor",
                body: "Öva med quiz i samma format som ORD-delen. Välj antal frågor och svarsalternativ efter din nivå och fördjupa dig i varje ords definition efter att du svarat.",
              },
              {
                title: "Spaced repetition – minns orden på lång sikt",
                body: "FSRS-algoritmen räknar ut exakt när du är på väg att glömma ett ord och schemalägger repetitioner automatiskt. Effektivare än att plugga utan system.",
              },
              {
                title: "Kursplan – lär dig i din egna takt",
                body: "Lås upp etapper med 20 ord i taget. Kursplanen säkerställer att du håller repetitionerna à jour innan du introducerar nya ord.",
              },
              {
                title: "Gratis – inget konto, inga annonser",
                body: "Du behöver varken registrera dig eller betala. Inga annonser, inga cookies och ingen datainsamling – nu eller i framtiden.",
              },
              {
                title: "Utvalda ord från riktiga högskoleprov",
                body: "Alla ord är noggrant utvalda utifrån historiska högskoleprov och frekvensdata för att maximera dina chanser att möta dem på ORD-delen.",
              },
            ].map(({ title, body }) => (
              <div
                key={title}
                className="bg-slate-50 rounded-xl p-6 border border-slate-200"
              >
                <h3 className="text-base font-semibold text-slate-900 mb-2">
                  {title}
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── How it works ────────────────────────────────────────────────────── */}
      <div className="bg-slate-50 py-16 px-4">
        <div className="max-w-xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-12 text-center">
            Kom igång på under en minut
          </h2>
          <ol className="space-y-8">
            {[
              {
                title: "Välj quiz eller kursplan",
                body: "Starta ett prov direkt för att testa dina nuvarande kunskaper, eller börja med kursplanen för strukturerad inlärning med spaced repetition.",
              },
              {
                title: "Lär dig ord med kontext",
                body: "Varje ord presenteras med en fullständig definition och exempelmeningar. Du förstår inte bara vad ordet betyder – du ser hur det används på riktigt.",
              },
              {
                title: "Repetera smart och håll orden",
                body: "5 minuter om dagen räcker. Algoritmen håller koll på vilka ord du behöver repetera och när – du behöver bara följa planen.",
              },
            ].map(({ title, body }, i) => (
              <li key={title} className="flex items-start gap-5">
                <div className="w-9 h-9 rounded-full bg-p-100 text-white flex items-center justify-center text-base font-bold shrink-0 mt-0.5">
                  {i + 1}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-1">
                    {title}
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    {body}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>

      {/* ── FAQ ───────────────────────────────────────────────────────────── */}
      <div className="bg-white py-16 px-4" id="faq">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-10 text-center">
            Vanliga frågor
          </h2>
          <dl className="space-y-6">
            {[
              {
                q: "Kostar det något att använda Ordprov.com?",
                a: "Nej, Ordprov.com är helt gratis. Det finns inga betalda funktioner, inga annonser och ingen betalfäll – aldrig.",
              },
              {
                q: "Behöver jag skapa ett konto?",
                a: "Nej. Du kan börja träna direkt utan att registrera dig eller lämna ifrån dig någon personlig information.",
              },
              {
                q: "Hur många ord finns det på Ordprov.com?",
                a: "Ordprov.com har över 10 000 ord noggrant utvalda för att täcka vad som typiskt dyker upp i ORD-delen på Högskoleprovet.",
              },
              {
                q: "Vad är spaced repetition och varför är det effektivt?",
                a: "Spaced repetition är en inlärningsmetod som visar ord igen precis innan du är på väg att glömma dem. Forskning visar att det är ett av de effektivaste sätten att bygga ett långsiktigt ordförråd. Ordprov.com använder FSRS – en av de modernaste spaced repetition-algoritmerna.",
              },
              {
                q: "Hur skiljer sig Ordprov.com från en vanlig ordlista?",
                a: "En vanlig ordlista ger dig bara en förklaring. Ordprov.com ger varje ord en detaljerad definition, ordklass och flera exempelmeningar i autentiska sammanhang – och du lär dig med quiz och spaced repetition, inte bara genom att titta.",
              },
              {
                q: "Hur lång tid tar det att förbereda sig inför ORD-delen?",
                a: "Med Ordprov.com och 5–10 minuter daglig träning kan du introducera och befästa hundratals nya ord på några månader. Konsistens är viktigare än långa pluggsessioner.",
              },
            ].map(({ q, a }) => (
              <div key={q} className="border-b border-slate-200 pb-6">
                <dt className="text-base font-semibold text-slate-900 mb-2">
                  {q}
                </dt>
                <dd className="text-slate-600 text-sm leading-relaxed">{a}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}

// Sektion: Varför ordprov.com? (Dina Unique Selling Points)
// Här lyfter du fram det som gör dig bättre än konkurrenterna. Använd H2-rubriker för SEO.

// Rubrik (H2): Inte bara en ordlista – ett smartare sätt att lära sig.

// Punkt 1: 10 000 ord med sammanhang. Vi har samlat i stort sett alla ord som kan komma på högskoleprovet. Varje ord förklaras på djupet med upp till 10 unika exempelmeningar.

// Punkt 2: Vetenskap i ryggen (Spaced Repetition). Vår algoritm håller koll på när du är sekunder ifrån att glömma ett ord och visar det igen. Det är så du bygger ett permanent ordförråd.

// Punkt 3: Full koll på din statistik. Se exakt hur många ord du har bemästrat och hur många du har kvar till ditt mål. Ingen gissning – bara mätbara framsteg.

export default StartPage;
