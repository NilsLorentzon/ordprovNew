import { useQuery } from "@tanstack/react-query";
import { axios } from "../lib/axios";
import { PartOfSpeech } from "../Quiz";
import { Link, useParams } from "react-router-dom";

// export interface WordList {
//   word: string;
//   partsOfSpeech: string[];
//   definition: string;
// }

export interface Word {
  word: string;
  createdTime: Date;
  definitions: {
    definition: string;
    shortDefinition: string;
    longDefinition: string;
  };
  sentences: string[];
  partsOfSpeech: string[];
}
export default function WordListWrapperDetail() {
  const { word: wordParam } = useParams();
  const { data: word, isLoading: isWordListLoading } = useQuery({
    queryKey: ["wordList", wordParam],
    queryFn: (): Promise<Word> => axios.get(`word/${wordParam}`),
  });
  if (isWordListLoading || word === undefined) {
    return <div></div>;
  }
  return (
    <div className="p-8 ">
      <Link
        to={`/ordlista?location=${word.word}`}
        className="text-blue-500 mb-4 inline-block"
      >
        &larr; Tillbaka till ordlistan
      </Link>
      {[word].map((word) => (
        <div className="border-2 rounded-md bg-white pt-3 p-4 mb-4 max-w-2xl">
          <div className="flex  gap-2  ">
            <h2 className="text-2xl mb-0">
              {/* <span className=" text-xl ">{index + 1}. </span> */}
              <span>{word.word}</span>
            </h2>
            <div className=" flex gap-1 mb-4">
              {word.partsOfSpeech.map((pos, idx) => (
                <div className=" gap-2 mb-1" key={idx}>
                  <PartOfSpeech part={pos} />
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-end ">
            <h4 className="text-lg font-medium mb-0 h-full">Definition</h4>
          </div>
          <div className=" mb-4">{word.definitions.definition}</div>
        </div>
      ))}
    </div>
  );
}
