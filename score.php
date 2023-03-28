<?php
session_start();

if (!isset($_SESSION['uname'])) {
    echo "101";
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);

if ($data) {
    if (!isset($_COOKIE[$_SESSION['uname'] . "&high_score"])) {
        setcookie($_SESSION['uname'] . "&high_score", $data['total']);
    } else {
        if ($_COOKIE[$_SESSION['uname'] . "&high_score"] < $data['total']) setcookie($_SESSION['uname'] . "&high_score", $data['total']);
        else setcookie($_SESSION['uname'] . "&high_score", $_COOKIE[$_SESSION['uname'] . "&high_score"]);
    }

    $i = 0;
    $temp = [];
    $arr = explode(",", $data['level_points']);
    if (isset($_COOKIE[$_SESSION['uname'] . "&score_per_level"])) {
        $cookie_arr = json_decode($_COOKIE[$_SESSION['uname'] . "&score_per_level"]);

        foreach ($arr as $point) {
            if (isset($cookie_arr[$i])) {
                if ($cookie_arr[$i] < $point) $temp[$i] = $point;
                else $temp[$i] = $cookie_arr[$i];
            } else {
                $temp[$i] = $point;
            }

            $i++;
        }
    }
    else {
        $temp = $arr;
    }

    setcookie($_SESSION['uname'] . "&score_per_level", json_encode($temp));
    echo "100";
}

// Find out a way to store this (database maybe, CSV stored on server could be an angle

/*
        $_COOKIE[$_SESSION['uname']]["high_score"] =
            ($_COOKIE[$_SESSION['uname']]["high_score"] > $data['total'] && isset($_COOKIE[$_SESSION['uname']]))
                ? $data['total'] : $_COOKIE[$_SESSION['uname']]["high_score"];

        $_COOKIE[$_SESSION['uname']]["scores_per_level"] =
            ($_COOKIE[$_SESSION['uname']]["scores_per_level"] > $data['total'] && isset($_COOKIE[$_SESSION['uname']]))
                ? $data['level_points'] : $_COOKIE[$_SESSION['uname']]["scores_per_level"];

*/