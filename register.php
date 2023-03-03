<?php

session_start();

$invalid_set = "!@#%&*()+=ˆ{}[]—;:“’<>?/";
$uname = $_POST["uname"];
$avatar = $_POST["avatar"];

if (empty($uname) || empty($avatar)) {
    header("Location: registration.php?signup=empty");
    exit;
} else {
    foreach (str_split($uname) as $uname_char) {
        if (str_contains($invalid_set, $uname_char)) {
            header("Location: registration.php?signup=setmatch!");
            exit;
        }
        else {
            $_SESSION["uname"] = $uname;
            $_SESSION["avatar"] = $avatar;

            header("Location: index.php?signup=success");
        }
    }
}