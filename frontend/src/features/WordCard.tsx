import React from "react";
import type { Word } from "../types/types";
import { MoreVertical } from "lucide-react";
import { Menu, MenuItem, MenuTrigger } from "../Components/Menu";
import { Button } from "../Components/Button";
import { PartOfSpeech } from "../Quiz";
import clsx from "clsx";
import { routePaths } from "../routes/MainRoutes";

export default function WordCard({ wordData }: { wordData: Word }) {
  return (
    <div className="">
      <div className="flex items-top justify-between mb-2">
        <div className="flex items-center gap-2">
          <h2 className="text-2xl mb-0">
            {/* <span className=" text-xl ">{index + 1}. </span> */}
            <span>{wordData.word}</span>
          </h2>
        </div>
        <div className="">
          {/* {auth.email && (
                          <button
                            aria-label={
                              isBookmarked ? "Ta bort bokmärke" : "Bokmärk ordet"
                            }
                            className="p-1"
                            onClick={() => {
                              repetitionUpdateMutation.mutate({
                                repetition: wordObj.word,
                                isBookmarked: !isBookmarked,
                              });
                            }}
                          >
                            <BookmarkIcon
                              className="w-5 h-5 hover:scale-125"
                              isSelected={isBookmarked}
                            />
                          </button>
                        )}
                        <button className="p-1" aria-label="Lyssna på ordet">
                          <SpeakerIcon className="w-5 h-5 fill-white hover:scale-125" />
                        </button> */}
          <MenuTrigger>
            <Button aria-label="Actions" variant="quiet">
              <MoreVertical className="w-5 h-5 stroke-black " />
            </Button>
            <Menu className="bg-amber-300">
              <MenuItem
                onAction={() => {
                  // open new tab with url `${routePaths.report}?word=${wordObj.word}`
                  // navigate(
                  //   `${routePaths.report}?word=${wordObj.word}`,
                  // );
                  window.open(`${routePaths.report}`, "_blank");
                }}
              >
                Anmäl felaktig information
              </MenuItem>
            </Menu>
          </MenuTrigger>
        </div>
      </div>
      <div className="">
        <div className={clsx(" border-0  rounded-md", "border-p-200/40 p-2")}>
          <div className="mb-4">
            <div className="flex items-end ">
              <h4 className="text-lg font-medium mb-0 h-full">Definition</h4>
            </div>
            <div className=" mb-4">{wordData.definitions.definition}</div>
            <h4 className="text-lg font-medium mb-0.5">
              {wordData.partsOfSpeech.length > 1 ? "Ordklasser" : "Ordklass"}
            </h4>
            <div className=" flex gap-1 mb-4">
              {wordData.partsOfSpeech.map((pos, idx) => (
                <div className=" gap-2 mb-1" key={idx}>
                  <PartOfSpeech part={pos} />
                </div>
              ))}
            </div>
            <h4 className="text-lg font-medium mb-1">Exempelmeningar</h4>
            <ul className="list-disc pl-4">
              {wordData.sentences.map((sentence, idx) => (
                <li key={idx} className="mb-2">
                  <div className="inline  ">{sentence}</div>
                </li>
              ))}
            </ul>
            {/* <div className="">
                      <button
                        className=" px-2 py-1 bg-p-100 text-white rounded-md"
                        onClick={() => {
                          if (previousWord) {
                            navigate(`${routePaths.ordlista}/${previousWord}`);
                          }
                        }}
                      >
                        {previousWord}
                      </button>
                      <button
                        className="float-right px-2 py-1 bg-p-100 text-white rounded-md"
                        onClick={() => {
                          if (previousWord) {
                            navigate(`${routePaths.ordlista}/${previousWord}`);
                          }
                        }}
                      >
                        {nextWord}
                      </button>
                    </div> */}
          </div>
        </div>
      </div>
    </div>
  );
}
