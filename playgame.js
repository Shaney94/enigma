document.addEventListener('DOMContentLoaded', () => {
    const wordDisplay = document.querySelector(".word-display");
    const guessesText = document.querySelector(".guesses-text b");
    const keyboardDiv = document.querySelector(".keyboard");
    const hangmanImage = document.querySelector(".hangman-box img");
    const gameModal = document.querySelector(".game-modal");
    const playAgainBtn = gameModal.querySelector("button");
    const countdownEl = document.getElementById('countdown');

    let currentWord, correctLetters, wrongGuessCount, updateCountdownInterval;
    const maxGuesses = 6;
    const startingMinutes = 4;
    let time = startingMinutes * 60;

    function updateCountdown() {
        const minutes = Math.floor(time / 60);
        let seconds = time % 60;
        seconds = seconds < 10 ? '0' + seconds : seconds;
        countdownEl.textContent = `${minutes}:${seconds}`;
        if (time <= 0) {
            clearInterval(updateCountdownInterval);
            countdownEl.textContent = '0:00';
            gameOver(false);
        } else {
            time--;
        }
                // Change the countdown timer's color to red when 10 seconds or less remain
                if (time <= 10) {
                    countdownEl.style.color = 'red';
                } else {
                    // Reset to the default color if more than 10 seconds remain
                    countdownEl.style.color = ''; // Use your default font color or leave it as '' if it's already defined in your CSS
                }
    }

    const resetGame = () => {
        correctLetters = [];
        wrongGuessCount = 0;
        time = startingMinutes * 60;
        clearInterval(updateCountdownInterval);
        updateCountdownInterval = setInterval(updateCountdown, 1000);

        hangmanImage.src = "images/hangman-0.svg";
        guessesText.textContent = `Incorrect guesses: ${wrongGuessCount} / ${maxGuesses}`;
        gameModal.classList.remove("show");

        getRandomWord();
        createKeyboardButtons();
    };

    const getRandomWord = () => {
        const wordData = wordList[Math.floor(Math.random() * wordList.length)];
        currentWord = wordData.word.toUpperCase();
        document.querySelector(".hint-text b").textContent = wordData.hint;
        wordDisplay.innerHTML = currentWord.split("").map(letter => `<li class="letter">_</li>`).join("");
    };

    const gameOver = (isVictory) => {
        clearInterval(updateCountdownInterval);
        const modalText = isVictory ? 'Congratulations! You won!' : 'Game over. Time\'s up!';
        const imageFile = isVictory ? 'victory.gif' : 'lost.gif';
        const gameOverImage = gameModal.querySelector("img");
    
        gameOverImage.src = `./images/${imageFile}`; // Assuming your images folder is in the root directory.
        gameOverImage.alt = isVictory ? 'Victory image' : 'Defeat image';
    
        gameModal.querySelector("h4").textContent = modalText;
        gameModal.querySelector("p").textContent = `The correct word was: ${currentWord}`;
        gameModal.classList.add("show");
    };

    function initGame(button, clickedLetter) {
        if (currentWord.includes(clickedLetter)) {
            [...currentWord].forEach((letter, index) => {
                if (letter === clickedLetter) {
                    correctLetters.push(letter);
                    const letters = wordDisplay.querySelectorAll("li");
                    letters[index].textContent = letter;
                }
            });
            const isComplete = currentWord.split("").every(letter => correctLetters.includes(letter));
            if (isComplete) gameOver(true);
        } else {
            wrongGuessCount++;
            hangmanImage.src = `images/hangman-${wrongGuessCount}.svg`;
            if (wrongGuessCount >= maxGuesses) gameOver(false);
        }
        button.disabled = true;
        guessesText.textContent = `Incorrect guesses: ${wrongGuessCount} / ${maxGuesses}`;
    }

    function createKeyboardButtons() {
        keyboardDiv.innerHTML = ''; // Clear out any existing buttons
        for (let i = 97; i <= 122; i++) {
            const letter = String.fromCharCode(i).toUpperCase();
            const button = document.createElement("button");
            button.textContent = letter;
            button.addEventListener("click", (e) => initGame(e.target, letter));
            keyboardDiv.appendChild(button);
        }
    }

    playAgainBtn.addEventListener("click", resetGame);
    resetGame();
});
