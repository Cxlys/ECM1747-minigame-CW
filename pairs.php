<?php
session_start();
?>

<html lang="en">
<head>
    <title>ECM1417 - Pairs</title>
    <link rel="stylesheet" href="css/style.css">
    <link rel="stylesheet" href="css/cards.css">
</head>
<body>
    <?php include_once "./includes/inc_navbar.php" ?>

    <div id="main" class="flex-center flex-column">
        <button onclick="gameLevel += 1; startNewRound()">Clear</button>
        <button onclick="endGame()">Kill self</button>
        <button onclick="resetGame()">Reset game</button>
        <div class="game-container flex-center flex-column" id="container">
            <div class="game-ui-container" id="game-ui-container">
                <h3 id="level">Level: 0</h3>
                <h3 id="lives">Lives: 10</h3>
                <h3 id="score">Score: 0</h3>
            </div>
            <div class="game-play-container flex-center flex-column" id="game-play-container">
                <div class="start-screen flex-column flex-center" id="start-screen"
                     onclick="startGame(this, <?php
                     if (isset($_SESSION['uname'])) { echo "'{$_SESSION['uname']}'"; }
                     else { echo "null"; }?>)">
                    <h1>Welcome to Pairs!</h1>
                    <?php if (isset($_SESSION['uname']) && isset($_COOKIE[$_SESSION['uname']])) {
                        echo "<h5>Your current high score: {placeholder}</h5>";
                    } ?>
                    <p>Start the game!</p>
                    <button class="game-button" id="start-game"><strong>Start</strong></button>
                </div>
                <!-- Card animation states: ready, turning, turned -->
                <!-- Game states: inactive, active -->
                <div class="card-set-container" id="card-pool" data-game-state="inactive">

                </div>
            </div>
        </div>
    </div>
</body>

<script src="./js/cards.js" type="text/javascript"></script>
<script src="./js/papaparse.min.js" type="text/javascript"></script>
</html>