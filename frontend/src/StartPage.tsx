import { useState } from "react";
import { WORDS } from "./allWordsFiltered.ts";
import { useNavigate } from "react-router-dom";

function StartPage() {
  const navigate = useNavigate();

  //   const [data, setData] = useState(0)
  return (
    <div className="h-full w-full justify-center flex items-center ">
      <div className="flex flex-col justify-between max-w-2xl ">
        <div className="flex items-center flex-col">
          <div className=" max-[334px]:text-3xl text-5xl px-4 text-center tracking-tight font-medium text-[#222222]">
            Öka ditt ordförråd och <span className="text-p-400">krossa </span>{" "}
            på Högskoleprovet
          </div>
          <div className="px-4 pt-2 text-center font-medium tracking-wider text-p-200">
            Över 20 000 relevanta ord inför högskoleprovet &ndash; få omedelbar
            feedback på dina svar med detaljerade definitioner och
            exempelmeningar.
          </div>
          <button
            className="mt-8 px-6 py-3 bg-p-200 text-white text-2xl rounded-lg hover:bg-p-200 hover:scale-110 transition duration-300"
            onClick={() => navigate("/quiz")}
          >
            Starta quiz
          </button>
        </div>
        {/* <div className="text-center py-4">footer afaf</div> */}
      </div>
    </div>
  );
}

export default StartPage;
