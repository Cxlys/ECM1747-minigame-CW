<?php
session_start();
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
            <form class="flex-center flex-column" method="POST" action="register.php">
                <label>Username: </label>
                <input type="text" name="uname" placeholder="Insert username here!"><br>

                <label>Profile Image</label>
                <input type="file" name="avatar">
                <label>Finish this later</label>

                <button type="submit">Register</button>
            </form><br>

            <?php
            $fullUrl = "http://$_SERVER[HTTP_HOST]$_SERVER[REQUEST_URI]";

            if (strpos($fullUrl, "signup=empty")) {
                echo "<span class='error'>Username or profile picture was empty!</span>";
            } elseif (strpos($fullUrl, "signup=setmatch")) {
                echo "<span class='error'>Username contained invalid characters!</span>";
            }
            if (strpos($fullUrl, "signup=file")) {
                echo "<span class='error'>File was invalid! Please submit only files of type .jpg or .png</span>";
            }
            ?>
        </div>
    </div>
</body>
</html>