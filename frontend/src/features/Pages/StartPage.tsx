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
    { id: 2, text: "Ordlista med alla gamla ord från högskoleproven" },
    { id: 3, text: "Interaktiva quiz med inlärning i fokus" },
    {
      id: 4,
      text: (
        <>
          <a
            href="https://en.wikipedia.org/wiki/Spaced_repetition"
            aria-label="Spaced repetition"
            className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
            target="_blank"
            rel="noopener noreferrer"
          >
            Spaced repetition
          </a>{" "}
          som gör att orden sitter
        </>
      ),
    },
    { id: 5, text: "Full koll på din statistik och dina framsteg" },
    {
      id: 6,
      text: "Helt gratis att använda och att skapa konto",
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
      <div className="h-full w-full justify-center flex items-center relative">
        <div className="flex flex-col justify-between max-w-2xl ">
          <div className="flex items-center flex-col">
            <h1 className=" max-[370px]:text-4xl text-5xl lg:px-4 px-2 text-center tracking-tight font-medium text-[#222222]">
              Öka ditt ordförråd och <span className="text-p-400">spika </span>{" "}
              ORD-delen på högskoleprovet
            </h1>
            <h3 className="px-4 pt-2 text-center font-medium tracking-wider text-p-200">
              10 000 utvalda ord inför högskoleprovet &ndash; interaktiva quiz
              med detaljerade definitioner och exempelmeningar.
            </h3>
            <button
              aria-label="Starta provet"
              className="mt-8 px-6 py-3 bg-p-200 text-white text-2xl rounded-lg hover:bg-p-200 hover:scale-110 transition duration-300"
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
        className="w-full h-full px-4 bg-slate-50 dark:bg-slate-800 relative justify-center flex items-center "
        id="features-section"
      >
        <div className="w-full m-auto max-w-md lg:pl-4 flex flex-col items-start">
          <h2 className="text-3xl sm:text-4xl mb-10 font-medium  text-slate-900 dark:text-white text-left">
            Varför Ordprov.com?
          </h2>

          {/* Features List */}
          <ul className="space-y-5 text-base sm:text-lg text-slate-600 dark:text-slate-300 w-full">
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
                  className={
                    feature.highlight
                      ? "font-medium text-slate-900 dark:text-white"
                      : ""
                  }
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
        className="h-full w-full justify-center flex items-center  "
        id="signup-section"
      >
        <div className="flex flex-col justify-between max-w-sm text-center relative">
          <div className="flex items-center flex-col ">
            <h4 className=" text-xl lg:px-4 px-2 text-center font-medium text-[#222222]">
              <span className=" font-bold text-2xl">{daysDiff}</span> dagar och{" "}
              <span className=" font-bold text-2xl">{hoursDiff}</span> timmar
              kvar till Högskoleprovet &ndash; börja plugga idag!
            </h4>
            {auth.email ? (
              <button
                aria-label="Starta provet"
                className="mt-8 px-6 py-3 bg-p-200 text-white text-2xl rounded-lg hover:bg-p-200 hover:scale-110 transition duration-300"
                onClick={() => navigate(routePaths.provStart)}
              >
                Starta prov
              </button>
            ) : (
              <button
                aria-label="Skapa konto"
                className="mt-8 px-6 py-3 bg-p-200 text-white text-2xl rounded-lg hover:bg-p-200 hover:scale-110 transition duration-300"
                onClick={() => navigate(routePaths.signup)}
              >
                Skapa konto
              </button>
            )}
          </div>
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
