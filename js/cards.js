//// Dependencies for spawning cards and HTML pointers
const cardPool = document.getElementById("card-pool")
const levelText = document.getElementById("level")
const livesText = document.getElementById("lives")
const scoreText = document.getElementById("score")
let startScreen = null

// Templates
const element = elementFromHtml (`
    <div class="card-container">
        <div class="card-body" data-anim-state="ready" onclick="handleCardFlip(this)"></div>
    </div>
`)
const endScreen = elementFromHtml (`
<div class="flex-column flex-center" id="end-screen">
    <h1>Game over!</h1>
    <h3>The cards were not in your favour...</h3>
    <button class="game-button" onclick="resetGame()">Retry?</button>
    <button class="game-button" onclick="saveDataToSession()">Submit Score...</button>
    <span class="error" id="error"></span>
</div>
`)

//// Global variables
let gameLevel = 0
let gamePoints = 0
let levelPoints = 0
let pointsPerLevel = []

//// Event callbacks for buttons
// Callback to start game button
const startGame = async (el) => {
    if (startScreen == null) {
        startScreen = el
    }

    el.setAttribute("data-game-state", "started")
    await new Promise(res => setTimeout(res, 300))

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

function startNewRound() {
    // Reset the game board
    resetGameBoard()

    // Give an extra failure for courtesy
    allowedFailFlips += 1

    if (gameLevel >= 3) {
        allowedFlips = 3
    } if (gameLevel >= 6) {
        allowedFlips = 4
    } if (gameLevel > 10) {
        // If level limit has been reached, interrupt the function here and spawn a set limit of cards
        spawnCards(40)
        updateUI()

        return
    }

    // Calculate number of cards to spawn based on stage
    const cardsToSpawn = (allowedFlips * 2) + (allowedFlips * 2) *
        (gameLevel - ((allowedFlips - 2) * 3))

    spawnCards(cardsToSpawn)

    // Update UI interface
    updateUI()
}

//// Card pool spawning and clearing
// Pool stylistically supports 4 cards per row
let flipCollection = []
let allowedFlips = 2
let allowedFailFlips = 4
let correctCardCount = 0
function spawnCards(cardsToSpawn) {
    for (let i = 0; i < cardsToSpawn; i++) cardPool.appendChild(element.cloneNode(true))
    updateUI()
}
async function handleCardFlip(element) {
    if (flipCollection.length >= allowedFlips || element.getAttribute("data-anim-state") === "turned") return
    flipCollection.push(element)

    // Flip card animation
    await flipAnimationState(element)

    // Check if the amount of allowed flips have been flipped
    if (flipCollection.length === allowedFlips) {
        // Give time for the cards to turn
        await new Promise(res => setTimeout(res, 600))

        // If they have been flipped, return true, else false
        const check = checkIfCorrectFlipped()

        // Regardless of if the flips were correct, reset the collection so that more may be flipped
        flipCollection = []

        // If correct, increment the flipped counter.
        if (check) {
            correctCardCount += allowedFlips

            // Calculate more points for each flip, and allocate more when at a higher level
            gamePoints += 100 * allowedFlips * (1 + gameLevel * 0.25)
            levelPoints += 100 * allowedFlips * (1 + gameLevel * 0.25)
            updateUI()

            console.log(correctCardCount + ", " + cardPool.querySelectorAll(".card-container").length)
            if (correctCardCount === cardPool.querySelectorAll(".card-container").length) {
                gameLevel += 1
                if (gameLevel <= 10) {
                    console.log("Pushing " + levelPoints + " to array")
                    pointsPerLevel.push(levelPoints)

                    console.log("Array now consists of " + pointsPerLevel.toString())
                }
                startNewRound()
            }
        }
        // If not, simply reset the animation states, remove points and decrement failCounter
        else {
            flipCollection.forEach(x => x.setAttribute("data-anim-state", "ready"))
            allowedFailFlips--

            if (allowedFailFlips <= 0) {
                console.log("Ending game...")
                endGame()
            }
            gamePoints -= 75 * allowedFlips * (1 + gameLevel * 0.25)
            levelPoints -= 75 * allowedFlips * (1 + gameLevel * 0.25)
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
        x => x.getAttribute("data-card-state") === flipCollection[0].getAttribute("data-card-state")
    )
}
function updateUI() {
    levelText.innerText = "Level: " + ((gameLevel <= 10) ? gameLevel : "Endless!")
    livesText.innerText = "Lives: " + allowedFailFlips

    if (gameLevel <= 10) scoreText.innerText = "Score: " + levelPoints
    else scoreText.innerText = "Total Score: " + gamePoints

    switch (gameLevel) {
        case 5:
            document.documentElement.style.setProperty('--dynamic-card-height', '15%')
            break
        case 8:
            document.documentElement.style.setProperty('--dynamic-card-height', '10%')
            break
        case 9:
            document.documentElement.style.setProperty('--dynamic-card-height', '8%')
            break
        case 10:
            document.documentElement.style.setProperty('--dynamic-card-height', '6%')
            break
    }
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
    allowedFailFlips = 4
    pointsPerLevel = []

    // Handle responsive UI
    cardPool.setAttribute("data-game-state", "inactive")
    document.getElementById("game-play-container").appendChild(startScreen).setAttribute("data-game-state", "")
    document.documentElement.style.setProperty('--dynamic-card-height', '25%')
}
function endGame() {
    // End the game
    resetGameBoard()
    saveDataToSession()

    console.log("Game ended!")
    cardPool.setAttribute("data-game-state", "inactive")

    document.getElementById("game-play-container").appendChild(endScreen)
}
function saveDataToSession() {
    let gameData = {
        "total": gamePoints,
        "level_points": pointsPerLevel.toString()
    }

    let params = {
        'method': "POST",
        'headers': {
            'Content-Type': "application/json; charset=utf-8"
        },
        'body': JSON.stringify(gameData)
    }

    fetch("score.php", params)
        .catch(err => {
            document.getElementById("error").innerText = "Unexpected error occurred.."
            console.log(err)
        })
        .then(code => {
            switch (code) {
                case "100":
                    document.getElementById("error").innerText = "Data has been successfully sent."
                    console.log(code.text())
                    break
                case "101":
                    document.getElementById("error").innerText = "Not logged in! Log in to save your data..."
                    console.log(code.text())
                    break;
                default:
                    console.log(code.text())
                    break;
            }
        })
}

// Utility functions
function elementFromHtml(html) {
    const template = document.createElement("template")
    template.innerHTML = html.trim();

    return template.content.firstElementChild;
}