import React from "react";
import { Box } from "@chakra-ui/react";
import FlashCard from "./FlashCard";

interface FlashCardListProps {
  flashCards: {
    id: string;
    question: string;
    answer: string;
    options: string[];
  }[];
}

const FlashCardList = ({ flashCards }: FlashCardListProps) => {
  return (
    <Box className="card-grid" display="grid" gap="1rem">
      {flashCards.map((flashCard) => {
        return <FlashCard flashCard={flashCard} key={flashCard.id} />;
      })}
    </Box>
  );
};

export default FlashCardList;
