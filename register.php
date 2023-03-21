<?php

session_start();

$invalid_set = "!@#%&*()+=ˆ{}[]—;:“’<>?/";
$uname = $_POST['uname'];
$avatar = $_FILES['avatar'];

# Error handling block
if (empty($uname)) {
    header("Location: registration.php?signup=empty");
    exit;
} else {
    foreach (str_split($uname) as $uname_char) {
        if (str_contains($invalid_set, $uname_char)) {
            header("Location: registration.php?signup=setmatch");
            exit;
        }
    }
}

if (!$avatar) {
    header("Location: registration.php?signup=empty");
    exit;
} else {
    if ($avatar['error'] == 1) {
        header("Location: registration.php?signup=format");
    }

    // Extract the file extension
    $imageFileType = strtolower(
        pathinfo($avatar['name'], PATHINFO_EXTENSION));

    $extensions = array("jpeg","jpg","png");

    if (!in_array($imageFileType, $extensions)) {
        header("Location: registration.php?signup=format");
        exit;
    } elseif ($avatar['error'] != UPLOAD_ERR_OK) {
        header("Location: registration.php?signup=error");
    }
}

# If valid, sign up.
$uploaddir = './uploads/';
$uploadfile = $uploaddir . sha1($uname) . ".jpg"; # ./uploads/rg8dry9h9sg8.jpg
# Using a hash to avoid clashes when two users share the same file name
# Also provides an easy way to sign in the user

if (move_uploaded_file($avatar['tmp_name'], $uploadfile)) {
    # File and username have been successfully validated, continue to landing page.
    $_SESSION["uname"] = $uname;
    header("Location: index.php?signup=success");
    exit;
} else {
    header("Location: registration.php?signup=error");
}

