//// Dependencies for spawning cards and HTML pointers
const cardPool = document.getElementById("card-pool")
const levelText = document.getElementById("level")
const livesText = document.getElementById("lives")
const scoreText = document.getElementById("score")
let startScreen = null

// Templates
const element = elementFromHtml (`
    <div class="card-container" data-message-to-user="Don't look, cheater.">
        <div class="card-body flex-center" data-anim-state="ready" onclick="handleCardFlip(this)"></div>
    </div>
`)
const endScreen = elementFromHtml (`
<div class="flex-column flex-center" id="end-screen">
    <form id="submit" method="POST" action="score.php">
        <h1>Game over!</h1>
        <h3>The cards were not in your favour...</h3>
        <h3>Your score: 0</h3>
        <button class="game-button" onclick="resetGame()">Retry?</button>
        <button class="game-button" onclick="postToLeaderboard(this.parentElement)">Submit Score...</button>
        <span class="error" id="error"></span>
        
        <input id="high-score" name="high-score" type="hidden" value="" />
        <input id="score-per-level" name="score-per-level" type="hidden" value="" />
    </form>
</div>
`)

//// Global variables
let gameLevel = 0
let gamePoints = 0
let levelPoints = 0
let pointsPerLevel = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]

// Player information
let playerUser = ""
let leaderboardData = null

//// Event callbacks for buttons
// Callback to start game button
let timer
const startGame = async (el, user) => {
    if (startScreen == null) {
        startScreen = el
    }

    playerUser = user ?? null
    await fetch("./res/leaderboard.csv")
        .then(res => res.text())
        .then(par => Papa.parse(par))
        .then(json => {
            for (let i = 1; i < json.data.length; i++)
                if (json.data[i][0] === playerUser) {
                    leaderboardData = json.data[i]
                    console.log(leaderboardData)
                    break
                }
        })
        .catch(err =>
            // Leaderboard data will not set if fetch hits error, we can check for this later.
            console.log(err)
        )

    el.setAttribute("data-game-state", "started")
    await new Promise(res => setTimeout(res, 300))

    // Start timer
    timer = setInterval(function() {
        const minutes = Math.floor(180 / 60);
        let seconds = countdown % 60;
        seconds = seconds < 10 ? '0' + seconds : seconds;
        document.getElementById("timer").innerHTML = minutes + ":" + seconds;
        countdown--;
        if (countdown < 0) {
            clearInterval(timer);
            endGame()
        }
    }, 1000); // run the function every second

    el.remove()
    initialise()
}

//// Start the game and begin spawning cards
function initialise() {
    gameLevel = 0
    gamePoints = 0

    cardPool.setAttribute("data-game-state", "active")
    startNewRound()
}

const cardCountPerLevel = [4, 8, 12, 6, 9, 12, 8, 12, 16, 20, 24]
function startNewRound() {

    // Reset the game board
    resetGameBoard()

    // Give an extra few failures for balance based on game level
    if (gameLevel <= 10) {
        allowedFailFlips += 1 + gameLevel;
        resetTimer(180)
    }

    if (gameLevel >= 3) {
        allowedFlips = 3
    } if (gameLevel >= 6) {
        allowedFlips = 4
    } if (gameLevel > 10) {
        // If level limit has been reached, interrupt the function here and spawn a set limit of cards
        spawnCards(40)
        updateUI()

        allowedFailFlips += 5;

        clearInterval(timer)
        document.getElementById("timer").remove()
        return
    }

    // Calculate number of cards to spawn based on stage
    const cardsToSpawn = cardCountPerLevel[gameLevel]
    spawnCards(cardsToSpawn)

    // Update UI interface
    updateUI()
}

//// Card pool spawning and clearing
let flipCollection = []
let allowedFlips = 2
let allowedFailFlips = 9
let correctCardCount = 0
function spawnCards(cardsToSpawn) {
    const emojis = ['🤣', '😍', '👍', '🗿','🥺','🔥','😏','😭','💀','😩']
    let usedEmojis = []
    const generateNewRandomEmoji = () => {
        if (usedEmojis.length === emojis.length)
            usedEmojis = []

        let randomIndex;

        do randomIndex = Math.floor(Math.random() * emojis.length)
        while (usedEmojis.includes(randomIndex))

        usedEmojis.push(randomIndex)

        return emojis[randomIndex]
    }

    if (cardsToSpawn % allowedFlips !== 0) console.log("Help")

    // Generate cards in increments of 2,3 or 4 depending on the allowedFlips value, and append to elementList
    let elementList = []
    for (let i = 0; i < cardsToSpawn / allowedFlips; i++)  {
        const emoji = generateNewRandomEmoji()

        for (let j = 0; j < allowedFlips; j++) {
            let clone = element.cloneNode(true)
            clone.setAttribute("data-card-state", emoji)
            clone.children[0].innerHTML = emoji

            elementList.push(clone)
        }
    }

    // Take elements from the list until the list is depleted
    while (elementList.length > 0) {
        let randomIndex = Math.floor(Math.random() * elementList.length)

        cardPool.appendChild(elementList[randomIndex])
        elementList.splice(randomIndex, 1)
    }

    updateUI()
}
function updateUI() {
    levelText.innerText = "Level: " + ((gameLevel <= 10) ? gameLevel : "Endless!")
    livesText.innerText = "Lives: " + allowedFailFlips

    if (gameLevel <= 10) scoreText.innerText = "Score: " + levelPoints
    else scoreText.innerText = "Total Score: " + gamePoints

    if (leaderboardData !== null) {
        document.documentElement.style.setProperty(
            "--game-background",
            (levelPoints > leaderboardData[gameLevel + 2]) ? "#FFD700" : "grey"
        )
    }

    switch (gameLevel) {
        case 5:
            document.documentElement.style.setProperty('--dynamic-card-height', '20%')
            document.documentElement.style.setProperty('--dynamic-margin', '8%')
            break
        case 9:
            document.documentElement.style.setProperty('--dynamic-margin', '4%')
            break
        case 10:
            document.documentElement.style.setProperty('--dynamic-card-height', '15%')
            document.documentElement.style.setProperty('--dynamic-margin', '4%')
            break
    }
}

//// Game logic
async function handleCardFlip(element) {
    if (flipCollection.length >= allowedFlips || element.getAttribute("data-anim-state") === "turned") return
    flipCollection.push(element)

    // Flip card animation
    await flipAnimationState(element)

    // Check if the amount of allowed flips have been flipped
    if (flipCollection.length === allowedFlips) {
        // Give time for the cards to turn
        await new Promise(res => setTimeout(res, 500))

        // If they have been flipped, return true, else false
        const check = checkIfCorrectFlipped()

        // Regardless of if the flips were correct, reset the collection so that more may be flipped
        const temp = flipCollection
        flipCollection = []

        // If correct, increment the flipped counter.
        if (check) {
            correctCardCount += allowedFlips

            // Calculate more points for each flip, and allocate more when at a higher level
            gamePoints += 100 * allowedFlips * (1 + gameLevel * 0.25)
            levelPoints += 100 * allowedFlips * (1 + gameLevel * 0.25)

            updateUI()

            if (correctCardCount === cardPool.querySelectorAll(".card-container").length) {
                gameLevel += 1
                if (gameLevel <= 10) {
                    // Push level points to array
                    pointsPerLevel[gameLevel - 1] = levelPoints
                }
                startNewRound()
            }
        }
        // If not, simply reset the animation states, remove points and decrement failCounter
        else {
            console.log("Check is false, cards are not the same.\n")
            temp.forEach(x => x.setAttribute("data-anim-state", "ready"))
            allowedFailFlips--

            updateUI()

            if (allowedFailFlips <= 0) {
                console.log("Ending game...")

                endGame()
            }
            gamePoints -= Math.max(0, 10 * allowedFlips * (1 + gameLevel * 0.25))
            levelPoints -= Math.max(0, 10 * allowedFlips * (1 + gameLevel * 0.25))
        }
    }
}
async function flipAnimationState(card) {
    card.setAttribute("data-anim-state", "turning")
    await new Promise(res => setTimeout(res, 200))
    card.setAttribute("data-anim-state", "turned")
}
function checkIfCorrectFlipped() {
    return flipCollection.every(
        // If every element in flipCollection has the same card state (same card)
        x => x.parentElement.getAttribute("data-card-state") === flipCollection[0].parentElement.getAttribute("data-card-state")
    )
}
function resetGameBoard() {
    console.log("\nResetting game board...")

    // Remove all cards in the card pool
    cardPool.querySelectorAll(
        ".card-container").forEach(x => x.remove()
    )

    // Reset card-related global variables to default
    flipCollection = []
    levelPoints = 0
    correctCardCount = 0
}
function resetGame() {
    resetGameBoard()
    try { document.getElementById('end-screen').remove() }
    catch { console.log("No end screen found, continuing...") }

    // Reset game variables
    gameLevel = 0
    gamePoints = 0
    allowedFlips = 2
    allowedFailFlips = 9
    pointsPerLevel = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]

    // Handle responsive UI
    cardPool.setAttribute("data-game-state", "inactive")
    document.getElementById("game-play-container").appendChild(startScreen).setAttribute("data-game-state", "")

    // Reset CSS variables to default
    document.documentElement.style.setProperty('--dynamic-card-height', '25%')
    document.documentElement.style.setProperty('--dynamic-margin', '8%')

}
const endGameQuotes =
    [
        "YOU DIED ⚔️",
        "Better luck next time!",
        "Skill issue.",
        "You lose!",
        "The cards were not in your favour... ♣️"
    ]
function endGame() {
    // Push remaining level points to array
    pointsPerLevel[gameLevel] = levelPoints;

    // End the game
    resetGameBoard()

    console.log("Game ended!")
    cardPool.setAttribute("data-game-state", "inactive")

    let clone = endScreen.cloneNode(true)
    clone.children[0].children[0].innerText = endGameQuotes[Math.floor(Math.random() * endGameQuotes.length)]
    if (leaderboardData != null) clone.children[0].children[2].innerText = "Your score: " + gamePoints + ((gamePoints > leaderboardData[1]) ? " <- NEW HIGH SCORE!!" : "");
    else clone.children[0].children[2].innerText = "Your score: " + gamePoints;

    document.getElementById("game-play-container").appendChild(clone)
}
function postToLeaderboard(formElement) {
    document.getElementById("high-score").value = gamePoints
    document.getElementById("score-per-level").value = pointsPerLevel.toString()

    formElement.submit()
}

// Utility functions
function elementFromHtml(html) {
    const template = document.createElement("template")
    template.innerHTML = html.trim();

    return template.content.firstElementChild;
}
function resetTimer(time) {
    clearInterval(timer);
    countdown = time;
    timer = setInterval(function() {
        const minutes = Math.floor(countdown / 60);
        let seconds = countdown % 60;
        seconds = seconds < 10 ? '0' + seconds : seconds; // add a leading zero if seconds < 10
        document.getElementById("timer").innerHTML = minutes + ":" + seconds;
        countdown--;
        if (countdown < 0) {
            clearInterval(timer);
            endGame()
        }
    }, 1000); // run the function every second
}