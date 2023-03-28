<?php
session_start();
?>

<html lang="en">
<head>
    <title>ECM1417 - Leaderboard</title>
    <link rel="stylesheet" href="css/style.css">
</head>

<body>
    <?php include_once "./includes/inc_navbar.php" ?>

    <div class="flex-center" id="main">
        <div class="leaderboard">
            <table class="leaderboard-table">
                <tr>
                    <th>Player</th>
                    <th>Lv0</th>
                    <th>Lv1</th>
                    <th>Lv2</th>
                    <th>Lv3</th>
                    <th>Lv4</th>
                    <th>Lv5</th>
                    <th>Lv6</th>
                    <th>Lv7</th>
                    <th>Lv8</th>
                    <th>Lv9</th>
                    <th>Lv10</th>
                    <th>High Score</th>
                </tr>
            </table>
        </div>
    </div>
</body>

</html>