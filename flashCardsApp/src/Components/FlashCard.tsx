import React, { useState, useEffect, useRef } from "react";
import { Box, chakra } from "@chakra-ui/react"; // Import chakra instead of background and color

export interface FlashCardProps {
  flashCard: {
    id: string;
    question: string;
    answer: string;
    options: string[];
  };
}

const FlashCard = ({ flashCard }: FlashCardProps) => {
  const [flip, setFlip] = useState(false);
  const [height, setHeight] = useState<number | string>("initial");

  const frontEl = useRef<HTMLDivElement>(null);
  const backEl = useRef<HTMLDivElement>(null);

  function setMaxHeight() {
    const frontHeight =
      frontEl.current?.getBoundingClientRect().height || 0;
    const backHeight = backEl.current?.getBoundingClientRect().height || 0;
    setHeight(Math.max(frontHeight, backHeight, 160));
  }

  useEffect(setMaxHeight, [
    flashCard.question,
    flashCard.answer,
    flashCard.options,
    flip,
  ]);

  useEffect(() => {
    window.addEventListener("resize", setMaxHeight);
    return () => window.removeEventListener("resize", setMaxHeight);
  }, []);

  //array for letter options on trivia
  const alphaOption = ['a', 'b', 'c', 'd', 'e'];

  return (
    <Box
      height={height}
      onClick={() => setFlip(!flip)}
     
      bg="purple.300"
      borderRadius=".25rem"
      boxShadow="0 0 5px 2px rgba(0, 0, 0, 0.3)"
      cursor="pointer"
      overflow={"auto"}
      padding={5}
      margin={5}
    >
      {!flip ? (
        <Box className="front" ref={frontEl}>

          <Box fontWeight={"bold"} fontSize={20} fontFamily='verdana'>{flashCard.question}</Box>

          <div className="flashcard-options">
            {flashCard.options.map((option, index) => {
              const optionLetter = alphaOption[index];
              return (
                <chakra.div
                  className="flashcard-option"
                  key={option}
                  _hover={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }}
                >
                  {`${optionLetter}. ${option}`}
                </chakra.div>
              );
            })}
          </div>
        </Box>
      ) : (
        <Box textAlign='center' className="back" ref={backEl} bgColor={"purple.500"} fontWeight={"bold"} fontSize={20} fontFamily='verdana'>
          {`${alphaOption[flashCard.options.indexOf(flashCard.answer)]}. ${
            flashCard.answer
          }`}
        </Box>
      )}
    </Box>
  );
};

export default FlashCard;
