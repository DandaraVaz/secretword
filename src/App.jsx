// CSS
import './App.css';

// REACT
import { useCallback, useEffect, useState } from 'react';

// DATA
import { wordsList } from "./data/words";

// Componentes
import StartScreen from './components/StartScreen';
import Game from './components/Game';
import GameOver from './components/GameOver';

const stages = [
  { id: 1, name: "start" },
  {id: 2, name: "game"},
  {id: 3, name: "end"},
];

const guessesQty = 5

function App() {
  const [gameStage, setGameStage] = useState(stages[0].name);
  const [words] = useState(wordsList);

  const [pickedWord, setPickedWord] = useState("");
  const [pickedCategory, setPickedCategory] = useState ("");
  const [letters, setLetters] = useState([]);

  const [guessedLetters, setGuessedLetters] = useState([])  // Letras adivinhadas
  const [wrongLetters, setWrongLetters] = useState([])   // Letras erradas
  const [guesses, setGuesses] = useState(guessesQty)  // Quantidade de tentativas
  const [score, setScore] = useState(50)  // Pontuação ao acertar cada palavra. Começa com 0.
  // Passar todos esses dados acima para o componente game dentro de return

  const pickWordAndCategory = useCallback(() => {
    // Pick a random category
    const categories = Object.keys(words);
    const category = 
      categories[Math.floor(Math.random() * Object.keys(categories).length)];

      console.log(category);

      // Pick a random word
      const word = 
        words[category][Math.floor(Math.random() * words[category].length)];

      console.log(category, word);

      return {word, category}
  }, [words]);

  // start the secret word game
  const startGame = useCallback(() => {
    // clear all letters
    clearLetterStates();
    
    // pick word and pick category
    const { word, category } = pickWordAndCategory();

    // Transformar as palavras em letras
    let wordLetters = word.split("");

    wordLetters = wordLetters.map((l) => l.toLowerCase());

    console.log(word, category);
    console.log(wordLetters);

    // Fill states
    setPickedWord(word);
    setPickedCategory(category);
    setLetters(wordLetters);


    setGameStage(stages[1].name);
  }, [pickWordAndCategory]);

  // process de letter input
  const verifyLetter = (letter) => {
    // Para que as letras fiquem minúsculas quando o usuário digitar
    const normalizedLetter = letter.toLowerCase();    

    // check with letter has already been utilized
    console.log(normalizedLetter, guessedLetters, wrongLetters, "guessedLetters")
    if (wrongLetters) {
      wrongLetters.includes(normalizedLetter)
    } {
      return;
    };

    if (guessedLetters && guessedLetters.includes(normalizedLetter)) {
      return;
    }
    console.log("letter")
    // Incluir as letras adivinhadas para acertadas ou erradas
    // push guessed letter or remove a guess
    if (letters.includes(normalizedLetter)) {         // Letras certas
      setGuessedLetters((actualGuessedLetters) => [
        ...actualGuessedLetters,
        normalizedLetter
      ])
    } else {                                        // Letras erradas
      setWrongLetters((actualwrongLetters) => [
        ...actualwrongLetters,
        normalizedLetter
      ]);
      // Diminuir as tentativas 
      setGuesses((actualGuesses) => actualGuesses - 1);
    }
    console.log(normalizedLetter, "normalizedLetter");
    console.log(guessedLetters, "guessedLetters");
    console.log(wrongLetters, "wrongLetters");
  };

  const clearLetterStates = ()  => {
    setGuessedLetters([]);
    setWrongLetters();
  };

  // check if guesses ended
  // Serve para monitorar
  useEffect(() => {
    // Quando as tentativas acabarem ele irá executar está função
    if(guesses <= 0) {
      // reset all states
      clearLetterStates();
      setGameStage(stages[2].name);
    }
  }, [guesses])

  // check win condition
  // para quando tiver duas letras iguais elas apareçam juntas
  useEffect(() => {
    const uniqueLetters = [...new Set(letters)];  //array de letras únicas
    // win condition
    // palavra sendo adivinhada a cada letra colocada
    if(guessedLetters.length === uniqueLetters.length) {  
      // add score
      setScore((actualScore) => actualScore += 100) //emplementar a pontuação
       // restart game with new word
       startGame();
    }
  }, [guessedLetters, letters, startGame]);

  // reiniciar o jogo
  const retry = () => {
    setScore(0);
    setGuesses(guessesQty);
    setGameStage(stages[0].name);
  }

  return (
    <div className="App">
      {gameStage === 'start' && <StartScreen startGame={startGame} />}
      {gameStage === 'game' && (
        <Game 
          verifyLetter={verifyLetter} 
          pickedWord={pickedWord} 
          pickedCategory={pickedCategory} 
          letters={letters} 
          guessedLetters={guessedLetters} // Letras adivinhadas
          wrongLetters={wrongLetters}  // Letras erradas
          guesses={guesses}  // Tentativas que o usuário ainda tem
          score={score} // Pontuação
        />
      )}
      {gameStage === 'end' && <GameOver retry={retry} score={score}/>}
    </div>
  );
}

export default App;
