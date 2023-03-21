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

    <div id="main">
        <!-- ready, turning, turned -->

        <div class="card-container">
            <div class="card-body" data-state="ready" onclick=""></div>
            <div class="card-body" data-state="ready" onclick=""></div>
            <div class="card-body" data-state="ready" onclick=""></div>
            <div class="card-body" data-state="ready" onclick=""></div>
            <div class="card-body" data-state="ready" onclick=""></div>
            <div class="card-body" data-state="ready" onclick=""></div>
        </div>
    </div>
</body>

<script src="./js/cards.js"></script>
</html>