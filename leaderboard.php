<?php
session_start();

$uri = "./res/leaderboard.csv";
$data = [];

if (($handle = fopen($uri, "r")) !== FALSE) {
    while (($csv_data = fgetcsv($handle, 0, ",")) !== FALSE)
        $data[] = $csv_data;
    fclose($handle);
}
?>

<html lang="en">
<head>
    <title>ECM1417 - Leaderboard</title>
    <link rel="stylesheet" href="css/style.css">
    <link rel="stylesheet" href="css/leaderboard.css">
</head>

<body>
    <?php include_once "./includes/inc_navbar.php" ?>

    <div class="flex-center flex-column" id="main">
        <?php
        if (sizeof($data) <= 1) {
        ?>
            <div class="center-container flex-center">
                <h1>No evidence of users detected!</h1>
                <h5>Please at least sign in once for your data to be saved!</h5>
            </div>
        <?php
        } else { ?>
            <h1>Pairs Leaderboard!</h1>
            <div class="leaderboard flex-center">
                <table class="leaderboard-table">
                    <tr>
                        <th>Username</th>
                        <th>0</th>
                        <th>1</th>
                        <th>2</th>
                        <th>3</th>
                        <th>4</th>
                        <th>5</th>
                        <th>6</th>
                        <th>7</th>
                        <th>8</th>
                        <th>9</th>
                        <th>10</th>
                        <th>Best Score</th>
                    </tr>
                    <?php
                    foreach (array_slice($data, 1) as $row) { ?>
                        <tr>
                            <td><?php echo $row[0] ?></td>
                            <?php for ($i = 2; $i < 13; $i++) { ?>
                                <td><?php echo $row[$i] ?></td>
                            <?php } ?>
                            <td><?php echo $row[1] ?></td>
                        </tr>
                    <?php } ?>
                </table>
            </div>
        <?php } ?>
    </div>
</body>

</html>