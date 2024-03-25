document.addEventListener('DOMContentLoaded', () => {
    let usedWords = []; // Initializes an empty array to track words used in the current session

    // Selects various elements from the DOM for manipulation
    const wordDisplay = document.querySelector(".word-display");
    const guessesText = document.querySelector(".guesses-text b");
    const keyboardDiv = document.querySelector(".keyboard");
    const hangmanImage = document.querySelector(".hangman-box img");
    const gameModal = document.querySelector(".game-modal");
    const playAgainBtn = gameModal.querySelector("button");
    const countdownEl = document.getElementById('countdown');

    // Initial game state variables
    let roundsCompleted = 0;
    let currentWord, correctLetters = [], wrongGuessCount, updateCountdownInterval;
    const maxGuesses = 6; // The maximum number of incorrect guesses allowed
    const startingMinutes = 2; // Starting countdown time in minutes
    let time = startingMinutes * 60; // Converts starting time to seconds

    // Function to update the countdown timer display
    function updateCountdown() {
        const minutes = Math.floor(time / 60);
        let seconds = time % 60;
        seconds = seconds < 10 ? '0' + seconds : seconds; // Ensures two digits for seconds
        countdownEl.textContent = `${minutes}:${seconds}`;
        if (time <= 0) {
            clearInterval(updateCountdownInterval); // Stops the timer
            countdownEl.textContent = '0:00'; // Sets display to zero
            gameOver(false); // Ends the game as a loss
        } else {
            time--;
            if (time <= 10) {
                countdownEl.style.color = 'red'; // Changes the countdown color to red in the last 10 seconds
            } else {
                countdownEl.style.color = ''; // Resets the countdown color
            }
        }
    }

    // Resets the game state, optionally resetting the timer
    function resetGame(resetTimer = true) {
        if (roundsCompleted === 0 || resetTimer) {
            usedWords = []; // Resets used words list
            time = startingMinutes * 60; // Resets the timer
            clearInterval(updateCountdownInterval); // Stops any existing timer
            updateCountdownInterval = setInterval(updateCountdown, 1000); // Starts a new timer
        }

        // Resets game variables
        correctLetters = Array(currentWord ? currentWord.length : 0).fill(null);
        wrongGuessCount = 0;
        hangmanImage.src = "images/hangman-0.svg"; // Resets the hangman image
        guessesText.textContent = `Incorrect guesses: ${wrongGuessCount} / ${maxGuesses}`;
        gameModal.classList.remove("show"); // Hides the game over modal
        getRandomWord(); // Fetches a new word to guess
        createKeyboardButtons(); // Re-generates the keyboard buttons
    }

    // Selects a new word from the list that hasn't been used in the current session
    function getRandomWord() {
        const availableWords = wordList.filter(wordData => !usedWords.includes(wordData.word));
        if (availableWords.length === 0) {
            gameOver(true, true); // Ends the game with a victory if all words are guessed
            return;
        }
        const wordData = availableWords[Math.floor(Math.random() * availableWords.length)];
        currentWord = wordData.word.toUpperCase(); // Ensures the word is in uppercase
        usedWords.push(wordData.word); // Adds the new word to the list of used words
        document.querySelector(".hint-text b").textContent = wordData.hint; // Displays the hint
        // Updates the word display with underscores for each letter in the new word
        wordDisplay.innerHTML = currentWord.split("").map(letter => `<li class="letter">_</li>`).join("");
    }

    // Handles the end of a game, displaying the game over modal with appropriate messaging
    function gameOver(isVictory, noMoreWords = false) {
        clearInterval(updateCountdownInterval); // Stops the countdown timer
        // Selects the appropriate message and image for the game outcome
        const modalText = noMoreWords ? 'Amazing! You guessed all words!' : isVictory ? 'Congratulations! You won this round!' : 'Game over. Time\'s up!';
        const imageFile = isVictory ? 'victory.gif' : 'lost.gif';
        // Updates the game modal with the game outcome
        gameModal.querySelector("img").src = `./images/${imageFile}`;
        gameModal.querySelector("h4").textContent = modalText;
        gameModal.querySelector("p").textContent = `The correct word was: ${currentWord}`;

        if (isVictory && !noMoreWords) {
            if (roundsCompleted < 2) {
                roundsCompleted++;
                setTimeout(() => resetGame(false), 1000); // Prepares for the next round without resetting the timer
                return;
            }
        }

        roundsCompleted = 0; // Resets rounds completed count
        gameModal.classList.add("show"); // Displays the game over modal
    }

    // Processes a letter guess, updating the game state accordingly
    function initGame(button, clickedLetter) {
        button.disabled = true; // Disables the guessed letter button
        if (currentWord.includes(clickedLetter)) {
            let allFound = true; // Tracks whether all letters have been found
            // Updates the display for correctly guessed letters
            document.querySelectorAll(".word-display .letter").forEach((letterEl, index) => {
                const letter = currentWord.charAt(index);
                if (letter === clickedLetter) {
                    correctLetters[index] = clickedLetter;
                    letterEl.textContent = clickedLetter;
                }
                if (!correctLetters[index]) allFound = false; // Checks if any letters are still missing
            });

            if (allFound) {
                time += 5; // Adds extra time for a correct guess
                updateCountdown(); // Immediately updates the countdown display
                
                if (roundsCompleted < 2) {
                    roundsCompleted++;
                    resetGame(false); // Continues to the next word without resetting the timer
                } else {
                    setTimeout(() => gameOver(true), 500); // Delays the victory modal to allow UI updates
                }
            }
        } else {
            wrongGuessCount++;
            hangmanImage.src = `images/hangman-${wrongGuessCount}.svg`; // Updates the hangman image based on the number of wrong guesses
            if (wrongGuessCount >= maxGuesses) gameOver(false); // Ends the game if max guesses are reached
        }
        // Updates the text displaying the number of incorrect guesses
        guessesText.textContent = `Incorrect guesses: ${wrongGuessCount} / ${maxGuesses}`;
    }

    // Generates the alphabet buttons for letter guesses
    function createKeyboardButtons() {
        keyboardDiv.innerHTML = ''; // Clears any existing buttons
        for (let i = 97; i <= 122; i++) { // Loops through ASCII values for lowercase letters
            const letter = String.fromCharCode(i).toUpperCase(); // Converts ASCII to letter and makes it uppercase
            const button = document.createElement("button");
            button.textContent = letter; // Sets the button text to the letter
            button.addEventListener("click", (e) => {
                e.target.disabled = true
                                // When a letter button is clicked, disable it and process the guess
                                initGame(e.target, letter);
                            });
                            keyboardDiv.appendChild(button); // Adds the button to the keyboard display
                        }
                    }
                
                    // Adds an event listener to the 'Play Again' button to reset the game when clicked
                    playAgainBtn.addEventListener("click", resetGame);
                    // Initial call to set up the game when the document is ready
                    resetGame();
                });
                
