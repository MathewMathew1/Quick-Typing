import { useState, useEffect } from "react";
import { api } from "~/trpc/react";

export function useTypingRace(quote: string) {
  const [inputValue, setInputValue] = useState("");
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [words, setWords] = useState<string[]>([]);
  const [isCurrentWordCorrect, setIsCurrentWordCorrect] = useState(true);

  useEffect(() => {
    setWords(quote.split(" "));
    setInputValue("");
    setCurrentWordIndex(0);
    setIsCurrentWordCorrect(true);
  }, [quote]);

  const submitWordMutation = api.lobby.submitWord.useMutation();

  const handleInputChange = (value: string) => {
    const currentWord = words[currentWordIndex] || "";

    if (currentWord.startsWith(value)) {
      setIsCurrentWordCorrect(true);
    } else {
      if(!isCurrentWordCorrect){ // not the best to fix 
        submitWordMutation.mutate({ word: value });
      }
      setIsCurrentWordCorrect(false);
    }

    if (value.endsWith(" ") && value.trim() === currentWord) {
      submitWordMutation.mutate({ word: currentWord });
      setCurrentWordIndex((idx) => idx + 1);
      setInputValue("");
      setIsCurrentWordCorrect(true);
    } else {
      setInputValue(value);
    }
  };

  return {
    inputValue,
    handleInputChange,
    currentWordIndex,
    isCurrentWordCorrect,
    words,
  };
}
