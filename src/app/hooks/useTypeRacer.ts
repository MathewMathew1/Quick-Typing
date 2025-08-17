import { useState, useEffect } from "react";

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

  const handleInputChange = (value: string) => {
    const currentWord = words[currentWordIndex] || "";

    if (currentWord.startsWith(value)) {
      setIsCurrentWordCorrect(true);
    } else {
      setIsCurrentWordCorrect(false);
    }

    if (value.endsWith(" ") && value.trim() === currentWord) {
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
