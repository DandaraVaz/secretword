import { useState, useRef } from "react";
import "./Game.css";

const Game = ({
  verifyLetter, 
  pickedCategory,
  pickedWord,
  letters,
  guessedLetters,
  wrongLetters,
  guesses,
  score,
}) => {
    const [letter, setLetter] = useState("");
    const letterInputRef = useRef(null);
    const handleSubmit = (e) => {
      e.preventDefault();
      verifyLetter(letter);
      setLetter("");
      letterInputRef.current.focus();  // Digitar as letras mais rápido
    };

  return (
    <div className="game">
      <p className="points">
        <span>Pontuação: {score}</span>
      </p>
      <h1>Adivinhe a palavra:</h1>
      <h3 className="tip">
        Dica sobre a palavra: <span>{pickedCategory}</span>
      </h3>
      <p>Você ainda tem {guesses} tentativa(s).</p>
      <div className="wordContainer">
        {/* Se a letra for adivinhada ela vai ser impressa, se não, vai ser impresso o blankSquare */}
        {letters.map((letter, i) => 
          guessedLetters.includes(letter) ? (
            <span key={i} className="letter">
              {letter}
            </span>
          ) : (
            <span key={i} className="blankSquare"></span>
          )
        )}
      </div>
      <div className="letterContainer">
        <p>Tente adivinhar uma letra da palavra:</p>
        <form onSubmit={handleSubmit}>
          <input 
            type="text" 
            name="letter" 
            maxLength="1" 
            required 
            onChange={(e) => setLetter(e.target.value)}
            value={letter}
            ref={letterInputRef}
          />
          <button>Jogar!</button>
        </form>
      </div> 
      <div className="wrongLettersContainer">
      <p>Letras já utilizadas: </p>
        {wrongLetters && wrongLetters.map((i) => (
          <li key={i}>{i}</li>
        ))}
      </div>
    </div>
  ); 
};

export default Game;