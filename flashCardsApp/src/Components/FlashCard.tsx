import React, { useState, useEffect, useRef } from "react";
import { Box } from "@chakra-ui/react";

export interface FlashCardProps {
  flashCard: {
    id: string;
    question: string;
    answer: string;
    options: string[];
  };
}

const FlashCard= ({ flashCard }: FlashCardProps) => {
  const [flip, setFlip] = useState(false);
  const [height, setHeight] = useState<number | string>("initial");

  const frontEl = useRef<HTMLDivElement>(null);
  const backEl = useRef<HTMLDivElement>(null);

  function setMaxHeight() {
    const frontHeight =
      frontEl.current?.getBoundingClientRect().height || 0;
    const backHeight = backEl.current?.getBoundingClientRect().height || 0;
    setHeight(Math.max(frontHeight, backHeight, 100));
  }

  useEffect(setMaxHeight, [
    flashCard.question,
    flashCard.answer,
    flashCard.options,
  ]);

  useEffect(() => {
    window.addEventListener("resize", setMaxHeight);
    return () => window.removeEventListener("resize", setMaxHeight);
  }, []);

  return (
    <Box
      className={`card ${flip ? "flip" : ""}`}
      height={height}
      onClick={() => setFlip(!flip)}
      bg={"purple.300"}
      borderRadius=".25rem"
      boxShadow="0 0 5px 2px rgba(0, 0, 0, 0.3)"
      cursor="pointer"
      transform={`perspective(1000px) rotateY(${flip ? 180 : 0}deg)`}
      transition="transform 150ms, box-shadow 150ms"
      _hover={{
        transform: `perspective(1000px) rotateY(${
          flip ? 180 : 0
        }deg) translateY(-2px)`,
        boxShadow: "Dark-lg",
      }}
    >
      <div className="front" ref={frontEl}>
        {flashCard.question}
        <div className="flashcard-options">
          {flashCard.options.map((option) => {
            return (
              <div className="flashcard-option" key={option}>
                {option}
              </div>
            );
          })}
        </div>
      </div>
      <div className="back" ref={backEl}>
        {flashCard.answer}
      </div>
    </Box>
  );
};

export default FlashCard;
