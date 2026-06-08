import { useNavigate } from "react-router-dom";
import FeaturesSection from "./FeatureSection";

function StartPage() {
  const navigate = useNavigate();
  return (
    <div className="min-h-full h-full">
      <div className="h-full w-full justify-center flex items-center ">
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
              onClick={() => navigate("/quiz")}
            >
              Starta provet
            </button>
          </div>
          {/* <div className="text-center py-4">footer afaf</div> */}
        </div>
      </div>
      {/* <div className="w-full pb-20 px-2">
        <div className="w-full m-auto max-w-2xl flex flex-col items-center">
          <h2 className="text-4xl mb-5 font-medium tracking-tight ">
            Varför Ordprov.com?
          </h2>
          <ul className="text-xl text-center leading-6">
            <li className="pb-5 pl-1 ">
              <h2 className="">Detaljerade definitioner och exempelmeningar</h2>
            </li>
            <li className="pb-5 pl-1 ">
              <h2 className="">
                Ordlista med alla gamla ord från högskoleproven
              </h2>
            </li>
            <li className="pb-5 pl-1 ">
              <h2 className="">Interaktiva quiz med inlärning i fokus</h2>
            </li>
            <li className="pb-5 pl-1 ">
              <h2 className="">
                <a
                  href="https://en.wikipedia.org/wiki/Spaced_repetition"
                  aria-label="Spaced repetition"
                  className="text-p-300"
                  // blank="_blank"
                  target="_blank"
                >
                  Spaced repetition
                </a>{" "}
                som gör att orden sitter
              </h2>
            </li>
            <li className="pb-5 pl-1 ">
              <h2 className="">Full koll på din statistik och dina framsteg</h2>
            </li>
            <li className="pb-5 pl-1 ">
              <h2 className="">Helt gratis att använda och att skapa konto</h2>
            </li>
          </ul>
        </div>
      </div> */}
      <FeaturesSection />
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
