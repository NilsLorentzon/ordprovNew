import { useState } from "react";
import { PartOfSpeech } from "../../Quiz";
import { ComboBox, ComboBoxItem } from "./ComboBox";

interface Props {
  wordList: { word: string; partsOfSpeech: string[] }[];
  filterText: string;
  setFilterText: (text: string) => void;
  setCurrentWord: (word: string) => void;
}
export default function Example({
  wordList,
  filterText,
  setFilterText,
  setCurrentWord,
}: Props) {
  return (
    <ComboBox
      id="search-input"
      label=""
      placeholder="Sök"
      inputValue={filterText} // 1. Binds the input text to state
      onInputChange={setFilterText} // 2. Updates state on every keystroke
    >
      {wordList.map((word) => (
        <ComboBoxItem
          key={word.word}
          textValue={word.word}
          onClick={() => setCurrentWord(word.word)}
        >
          <div
            aria-label={`Välj ordet ${word.word}`}
            className="font-normal"
            // onClick={() => {
            //   console.log("Clicked word:", word.word);
            //   setCurrentWord(word.word);
            // }}
          >
            <div className="text-base -tracking-tight">{word.word}</div>
            <div className="flex gap-1">
              {word.partsOfSpeech.map((partOfSpeech) => (
                <div className="text-sm  text-gray-500" key={partOfSpeech}>
                  {partOfSpeech}
                </div>
              ))}
            </div>
          </div>
        </ComboBoxItem>
      ))}
    </ComboBox>
  );
}
