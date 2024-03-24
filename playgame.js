document.addEventListener('DOMContentLoaded', () => {
    let usedWords = []; // Tracks words used in the current session to avoid repeats

    const wordDisplay = document.querySelector(".word-display");
    const guessesText = document.querySelector(".guesses-text b");
    const keyboardDiv = document.querySelector(".keyboard");
    const hangmanImage = document.querySelector(".hangman-box img");
    const gameModal = document.querySelector(".game-modal");
    const playAgainBtn = gameModal.querySelector("button");
    const countdownEl = document.getElementById('countdown');

    let roundsCompleted = 0;
    let currentWord, correctLetters = [], wrongGuessCount, updateCountdownInterval;
    const maxGuesses = 6;
    const startingMinutes = 2;
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
            if (time <= 10) {
                countdownEl.style.color = 'red';
            } else {
                countdownEl.style.color = '';
            }
        }
    }

    function resetGame(resetTimer = true) {
        if (roundsCompleted === 0 || resetTimer) {
            usedWords = [];
            time = startingMinutes * 60;
            clearInterval(updateCountdownInterval);
            updateCountdownInterval = setInterval(updateCountdown, 1000);
        }

        correctLetters = Array(currentWord ? currentWord.length : 0).fill(null);
        wrongGuessCount = 0;
        hangmanImage.src = "images/hangman-0.svg";
        guessesText.textContent = `Incorrect guesses: ${wrongGuessCount} / ${maxGuesses}`;
        gameModal.classList.remove("show");
        getRandomWord();
        createKeyboardButtons();
    }

    function getRandomWord() {
        const availableWords = wordList.filter(wordData => !usedWords.includes(wordData.word));
        if (availableWords.length === 0) {
            gameOver(true, true);
            return;
        }
        const wordData = availableWords[Math.floor(Math.random() * availableWords.length)];
        currentWord = wordData.word.toUpperCase();
        usedWords.push(wordData.word);
        document.querySelector(".hint-text b").textContent = wordData.hint;
        wordDisplay.innerHTML = currentWord.split("").map(letter => `<li class="letter">_</li>`).join("");
    }

    function gameOver(isVictory, noMoreWords = false) {
        clearInterval(updateCountdownInterval);
        const modalText = noMoreWords ? 'Amazing! You guessed all words!' : isVictory ? 'Congratulations! You won this round!' : 'Game over. Time\'s up!';
        const imageFile = isVictory ? 'victory.gif' : 'lost.gif';
        gameModal.querySelector("img").src = `./images/${imageFile}`;
        gameModal.querySelector("h4").textContent = modalText;
        gameModal.querySelector("p").textContent = `The correct word was: ${currentWord}`;

        if (isVictory && !noMoreWords) {
            if (roundsCompleted < 2) {
                roundsCompleted++;
                setTimeout(() => resetGame(false), 1000);
                return;
            }
        }

        roundsCompleted = 0;
        gameModal.classList.add("show");
    }

    function initGame(button, clickedLetter) {
        button.disabled = true;
        if (currentWord.includes(clickedLetter)) {
            let allFound = true;
            document.querySelectorAll(".word-display .letter").forEach((letterEl, index) => {
                const letter = currentWord.charAt(index);
                if (letter === clickedLetter) {
                    correctLetters[index] = clickedLetter;
                    letterEl.textContent = clickedLetter;
                }
                if (!correctLetters[index]) allFound = false;
            });

            if (allFound) {
                time += 5; // Add 5 extra seconds upon every correct word guessed
                updateCountdown(); // Update the countdown display immediately
                
                if (roundsCompleted < 2) {
                    roundsCompleted++;
                    resetGame(false); // Do not reset the timer, continue to the next word
                } else {
                    setTimeout(() => gameOver(true), 500); // Small delay for UI update
                }
            }
        } else {
            wrongGuessCount++;
            hangmanImage.src = `images/hangman-${wrongGuessCount}.svg`;
            if (wrongGuessCount >= maxGuesses) gameOver(false);
        }
        guessesText.textContent = `Incorrect guesses: ${wrongGuessCount} / ${maxGuesses}`;
    }

    function createKeyboardButtons() {
        keyboardDiv.innerHTML = '';
        for (let i = 97; i <= 122; i++) {
            const letter = String.fromCharCode(i).toUpperCase();
            const button = document.createElement("button");
            button.textContent = letter;
            button.addEventListener("click", (e) => {
                e.target.disabled = true;
                initGame(e.target, letter);
            });
            keyboardDiv.appendChild(button);
        }
    }

    playAgainBtn.addEventListener("click", resetGame);
    resetGame();

    
});
