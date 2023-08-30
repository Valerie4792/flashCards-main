import React, { useState, useEffect, useRef, FormEvent } from "react";
import {
  Box,
  Select,
  Input,
  Button,
  Flex,
  ChakraProvider,
} from "@chakra-ui/react";
import FlashCardList from "./Components/FlashCardList";
import axios from "axios";

interface Category {
  id: number;
  name: string;
  
}

function App() {
  const [flashCards, setFlashCards] = useState([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const categoryEl = useRef<HTMLSelectElement | null>(null);
  const amountEl = useRef<HTMLInputElement | null>(null);

  function decodeString(str: string) {
    const textArea = document.createElement("textarea");
    textArea.innerHTML = str;
    return textArea.value;
  }

// added for testing if categories
useEffect(() => {
  // Fetch categories when the component mounts
  axios
    .get("https://opentdb.com/api_category.php")
    .then((response) => {
      setCategories(response.data.trivia_categories);
    })
    .catch((error) => {
      console.error("Error fetching categories:", error);
    });
}, []);

///

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault(); // Prevent the default form submission behavior
    
    axios
      .get("https://opentdb.com/api.php", {
        params: {
          amount: amountEl.current?.value,
          category: categoryEl.current?.value,
        },
      })
      .then((res) => {
        setFlashCards(
          res.data.results.map((questionItem: { correct_answer: string; incorrect_answers: any[]; question: string; }, index: number) => {
            const answer = decodeString(questionItem.correct_answer);
            const options = [
              ...questionItem.incorrect_answers.map((a) => decodeString(a)),
              answer,
            ];
  
            return {
              id: index,
              question: questionItem.question,
              answer: decodeString(questionItem.correct_answer),
              options: options.sort(() => Math.random() - 0.5),
            };
          })
        );
      })
      .catch((error) => {
        console.error("An error occurred:", error);
      });

      console.log(categories)
  }
  


  return (
    <ChakraProvider>
      <Flex
        direction="column"
        alignItems="center"
        bg="purple.400"
        p="1rem"
        boxShadow="0 0 5px 2px rgba(0, 0, 0, 0.3)"
      >
        <form
          className="header"
          onSubmit={handleSubmit}
          style={{ width: "100%" }}
        >
          <Flex justifyContent="center" alignItems="center" mb="1rem">
            <Box flex="1" pr="1rem">
              <label htmlFor="category">Category</label>
              <Select id="category" ref={categoryEl}>
                {categories.map((category) => {
                  return (
                    <option value={category.id} key={category.id}>
                      {category.name}
                    </option>
                  );
                })}
              </Select>
            </Box>

            <Box flex="1" pr="1rem">
              <label htmlFor="amount">Number Of Questions</label>
              <Input
                type="number"
                id="amount"
                min="1"
                step="1"
                defaultValue={10}
                ref={amountEl}
              />
            </Box>

            <Box>
              <Button colorScheme={'cyan'} type="submit">
                Generate
              </Button>
            </Box>
          </Flex>
        </form>

        <Box className="container">
          <FlashCardList flashCards={flashCards} />
        </Box>
      </Flex>
    </ChakraProvider>
  );
}

export default App;
