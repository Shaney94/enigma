document.addEventListener('DOMContentLoaded', (event) => {
    const wordDisplay = document.querySelector(".word-display");
    const guessesText = document.querySelector(".guesses-text b");
    const keyboardDiv = document.querySelector(".keyboard");
    const hangmanImage = document.querySelector(".hangman-box img");
    const gameModal = document.querySelector(".game-modal");
    const playAgainBtn = gameModal.querySelector("button");
    const countdownEl = document.getElementById('countdown'); // make sure you have a corresponding element in your HTML

    // Initializing game variables
    let currentWord, correctLetters, wrongGuessCount;
    const maxGuesses = 6;
    const startingMinutes = 4;
    let time = startingMinutes * 60;
    let updateCountdownInterval;

    // Define the updateCountdown function
    function updateCountdown() {
        const minutes = Math.floor(time / 60);
        let seconds = time % 60;
        seconds = seconds < 10 ? '0' + seconds : seconds;
        countdownEl.textContent = `${minutes}:${seconds}`;
        time--;

        if (time < 0) {
            clearInterval(updateCountdownInterval);
            countdownEl.textContent = '0:00';
            gameOver(false);
        }
    }

    // Resets game variables and UI elements
    function resetGame() {
        correctLetters = [];
        wrongGuessCount = 0;
        hangmanImage.src = "images/hangman-0.svg";
        guessesText.innerText = `${wrongGuessCount} / ${maxGuesses}`;
        wordDisplay.innerHTML = '';
        keyboardDiv.querySelectorAll("button").forEach(btn => btn.disabled = false);
        gameModal.classList.remove("show");
        time = startingMinutes * 60; // Reset the timer
        clearInterval(updateCountdownInterval); // Clear any previous intervals
        updateCountdownInterval = setInterval(updateCountdown, 1000); // Restart the countdown
        getRandomWord();
    }

    // Selecting a random word and hint from the wordList
    const getRandomWord = () => {
        const { word, hint } = wordList[Math.floor(Math.random() * wordList.length)];
        currentWord = word.toUpperCase();
        document.querySelector(".hint-text b").innerText = hint;
        resetGame();
    }

    // Show modal with game over message
    const gameOver = (isVictory) => {
        clearInterval(updateCountdownInterval); // Stop the countdown when the game is over
        const modalText = isVictory ? `Congratulations! You won!` : 'Game over. Time\'s up!';
        gameModal.querySelector("h4").innerText = modalText;
        gameModal.querySelector("p").innerText = `The correct word was: ${currentWord}`;
        gameModal.classList.add("show");
    }

    // Handle letter click and check if the letter is in the current word
    const initGame = (button, clickedLetter) => {
        if(currentWord.includes(clickedLetter)) {
            [...currentWord].forEach((letter, index) => {
                if(letter === clickedLetter) {
                    correctLetters.push(letter);
                    wordDisplay.querySelectorAll("li")[index].innerText = letter;
                }
            });
            // Check if the game has been won
            const isComplete = currentWord.split("").every((letter) => correctLetters.includes(letter));
            if(isComplete) {
                gameOver(true);
            }
        } else {
            wrongGuessCount++;
            hangmanImage.src = `images/hangman-${wrongGuessCount}.svg`;
            if(wrongGuessCount >= maxGuesses) {
                gameOver(false);
            }
        }
        button.disabled = true;
        guessesText.innerText = `Incorrect guesses: ${wrongGuessCount} / ${maxGuesses}`;
    }

    // Create keyboard buttons and add event listeners
    for (let i = 97; i <= 122; i++) {
        const button = document.createElement("button");
        button.innerText = String.fromCharCode(i).toUpperCase();
        button.addEventListener("click", (e) => initGame(e.target, e.target.innerText));
        keyboardDiv.appendChild(button);
    }

    // Start the game
    resetGame();
});
