const wordDisplay = document.querySelector(".word-display");
const guessesText = document.querySelector(".guesses-text b");
const keyboardDiv = document.querySelector(".keyboard");
const hangmanImage = document.querySelector(".hangman-box img");
const gameModal = document.querySelector(".game-modal");
const playAgainBtn = gameModal.querySelector("button");
// Initializing game variables
let currentWord, correctLetters, wrongGuessCount;
const maxGuesses = 6;
const resetGame = () => {
    // Ressetting game variables and UI elements
    correctLetters = [];
    wrongGuessCount = 0;
    hangmanImage.src = "images/hangman-0.svg";
    guessesText.innerText = `${wrongGuessCount} / ${maxGuesses}`;
    wordDisplay.innerHTML = currentWord.split("").map(() => `<li class="letter"></li>`).join("");
    keyboardDiv.querySelectorAll("button").forEach(btn => btn.disabled = false);
    gameModal.classList.remove("show");
}
const getRandomWord = () => {
    // Selecting a random word and hint from the wordList
    const { word, hint } = wordList[Math.floor(Math.random() * wordList.length)];
    currentWord = word; // Making currentWord as random word
    document.querySelector(".hint-text b").innerText = hint;
    resetGame();
}
const gameOver = (isVictory) => {
    // After game complete.. showing modal with relevant details
    const modalText = isVictory ? `You Saved Great Britain!` : 'The correct word was:';
    const howToPlayButton = document.querySelector(".how-to-play"); // Select the "How to Play" button

    gameModal.querySelector("img").src = `images/${isVictory ? 'victory' : 'lost'}.gif`;
    gameModal.querySelector("h4").innerText = isVictory ? 'You Saved Great Britain!' : 'The War is Lost!';
    gameModal.querySelector("p").innerHTML = isVictory ? `<b>${currentWord}</b>` : `${modalText} <b>${currentWord}</b>`;

    // Hide the "How to Play" button when the player wins
    howToPlayButton.style.display = isVictory ? 'none' : 'block';
    
    gameModal.classList.add("show");
    
}
const initGame = (button, clickedLetter) => {
    // Checking if clickedLetter is exist on the currentWord
    if(currentWord.includes(clickedLetter)) {
        // Showing all correct letters on the word display
        [...currentWord].forEach((letter, index) => {
            if(letter === clickedLetter) {
                correctLetters.push(letter);
                wordDisplay.querySelectorAll("li")[index].innerText = letter;
                wordDisplay.querySelectorAll("li")[index].classList.add("guessed");
            }
        });
    } else {
        // If clicked letter doesn't exist then update the wrongGuessCount and hangman image
        wrongGuessCount++;
        hangmanImage.src = `images/hangman-${wrongGuessCount}.svg`;
    }
    button.disabled = true; // Disabling the clicked button so user can't click again
    guessesText.innerText = `${wrongGuessCount} / ${maxGuesses}`;
    // Calling gameOver function if any of these condition meets
    if(wrongGuessCount === maxGuesses) return gameOver(false);
    if(correctLetters.length === currentWord.length) return gameOver(true);
}
// Creating keyboard buttons and adding event listeners
for (let i = 97; i <= 122; i++) {
    const button = document.createElement("button");
    button.innerText = String.fromCharCode(i);
    keyboardDiv.appendChild(button);
    button.addEventListener("click", (e) => initGame(e.target, String.fromCharCode(i)));
}
getRandomWord();
playAgainBtn.addEventListener("click", getRandomWord);

// Leaderboard Button Creation and Event
const createLeaderboardButton = () => {
    const contentDiv = gameModal.querySelector(".content");
    let leaderboardButton = contentDiv.querySelector(".view-leaderboards");
    if (!leaderboardButton) {
        leaderboardButton = document.createElement("button");
        leaderboardButton.textContent = "View Leaderboards";
        leaderboardButton.classList.add("modal-button", "view-leaderboards");
        contentDiv.appendChild(leaderboardButton);
    }
    return leaderboardButton;
};

const showLeaderboards = () => {
    // Logic to display the leaderboards goes here
    console.log('Leaderboard view requested');
    // You'll replace the console.log with your actual code to show leaderboards
};

// Add this line inside the resetGame function, right before `gameModal.classList.remove("show");`
const viewLeaderboardsBtn = createLeaderboardButton();

// And this line right after creating the button inside the resetGame function
viewLeaderboardsBtn.addEventListener("click", showLeaderboards);

// Call `resetGame` at the end of the script to make sure the button is created when the page loads
resetGame();



const startingMinutes = 4;
let time = startingMinutes * 60;

const countdownEl = document.getElementById('countdown');

setInterval(updateCountdown, 1000);

function updateCountdown() {
    const minutes = Math.floor(time / 60);
    let seconds = time % 60;

    seconds = seconds < 10 ? '0' + seconds : seconds;
    countdownEl.textContent = `${minutes}:${seconds}`;
    if (time <= 0) {
        clearInterval(updateCountdownInterval);
        countdownEl.textContent = '0:00';
        gameOver(false); // Display game over when the timer reaches zero
        return;
    }
    time--;

}