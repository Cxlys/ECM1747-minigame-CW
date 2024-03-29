<?php

session_start();

$invalid_set = "~[!@#%&*()+=ˆ{}\[\]—;:“’<>?/]~";
$uname = $_POST['uname'];

$eyes = $_POST['eyes'];
$mouth = $_POST['mouth'];
$skin = $_POST['skin'];

# Error handling block
if (empty($uname) || empty($eyes) || empty($mouth) || empty($skin)) {
    header("Location: registration.php?signup=empty");
    exit;
} else {
    if (preg_match($invalid_set, $uname)) {
        header("Location: registration.php?signup=setmatch");
        exit;
    }

    # If valid, sign up.
    $_SESSION["uname"] = $uname;

    $_SESSION['eyes'] = $eyes;
    $_SESSION['mouth'] = $mouth;
    $_SESSION['skin'] = $skin;

    header("Location: index.php?signup=success");
}



