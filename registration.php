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
                <input type="file" name="avatar"><br><br>

                <button class="form-button" type="submit">Register</button>
            </form><br>

            <?php
            $fullUrl = "http://$_SERVER[HTTP_HOST]$_SERVER[REQUEST_URI]";

            if (strpos($fullUrl, "signup=empty")) {
                echo "<span class='error'>Username or profile picture was empty!</span>";
            } elseif (strpos($fullUrl, "signup=setmatch")) {
                echo "<span class='error'>Username contained invalid characters!</span>";
            } elseif (strpos($fullUrl, "signup=file")) {
                echo "<span class='error'>File was invalid! Please submit only files of type .jpg or .png</span>";
            } elseif (strpos($fullUrl, "signup=file")) {
                echo "<span class='error'>An unexpected error occured when uploading your file, please try again</span>";
            } elseif (strpos($fullUrl, "signup=filesize")) {
                echo "<span class='error'>File invalid! We enforce a maximum file size of 40kB, and the file must be of type PNG, JPG or JPEG.</span>";
            }
            ?>
        </div>
    </div>
</body>
</html>