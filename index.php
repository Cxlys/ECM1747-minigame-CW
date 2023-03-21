<?php
session_start();
?>

<html lang="en">

<head>
    <title>ECM1417 - Minigames</title>
    <link rel="stylesheet" href="css/style.css">
</head>

<body>
    <?php include_once "./includes/inc_navbar.php" ?>

    <div class="flex-center" id="main">
        <div class="center-container flex-center">
            <?php if (isset($_SESSION['uname'])) { ?>
            <h1>Welcome to Pairs!</h1>
            <a href="pairs.php">Click here to continue...</a>
            <?php } else { ?>
            <h1>You're not using a registered session?</h1>
            <a href="registration.php">Register now!</a>
            <?php } ?>
        </div>
    </div>
</body>

</html>