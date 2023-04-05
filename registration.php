<?php
session_start();

if (isset($_SESSION['uname'])) {
    header("Location: index.php");
}
?>

<html lang="en">
<head>
    <title>ECM1417 - Registration</title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body>
    <?php include_once "./includes/inc_navbar.php" ?>

    <div class="flex-center" id="main">
        <div class="center-container flex-center">
            <form class="flex-column" method="POST" action="register.php" enctype="multipart/form-data">
                <label>Username: </label>
                <input type="text" name="uname" placeholder="Insert username here!"><br><br>

                <label>Profile Image</label><br>
                <div class="image-generator-container">
                    <div class="image-generator-left flex-column">
                        <div class="selector" id="eyes-select">
                            <button type="button" onclick="cycleArray('eyes', -1)"><</button>
                            <span>Eyes</span>
                            <button type="button" onclick="cycleArray('eyes', 1)">></button>
                        </div>
                        <div class="selector" id="mouth-select">
                            <button type="button" onclick="cycleArray('mouth', -1)"><</button>
                            <span>Mouth</span>
                            <button type="button" onclick="cycleArray('mouth', 1)">></button>
                        </div>
                        <div class="selector" id="color-select">
                            <button type="button" onclick="cycleArray('skin', -1)"><</button>
                            <span>Color</span>
                            <button type="button" onclick="cycleArray('skin', 1)">></button>
                        </div>
                    </div>
                    <div class="image-generator-right flex-center">
                        <div class="emoji-preview">
                            <img alt="eyes" id="eyes" src="./src/emojis/eyes/closed.png">
                            <img alt="mouth" id="mouth" src="./src/emojis/mouth/open.png">
                            <img alt="skin" id="skin" src="./src/emojis/skin/green.png">

                            <input type="hidden" id="e-val" name="eyes" value="closed">
                            <input type="hidden" id="m-val" name="mouth" value="open">
                            <input type="hidden" id="s-val" name="skin" value="green">
                        </div>
                    </div>
                </div>

                <button class="form-button" type="submit">Register</button>
            </form><br>

            <?php
            $fullUrl = "http://$_SERVER[HTTP_HOST]$_SERVER[REQUEST_URI]";

            if (strpos($fullUrl, "signup=empty")) {
                echo "<span class='error'>Username or profile picture was empty!</span>";
            } elseif (strpos($fullUrl, "signup=setmatch")) {
                echo "<span class='error'>Username contained invalid characters!</span>";
            }
            ?>
        </div>
    </div>
</body>

<script src="./js/emoji.js"></script>
</html>