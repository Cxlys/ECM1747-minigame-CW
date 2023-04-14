<?php
session_start();

if (!isset($_SESSION['uname'])) {
    echo "101: User is not logged in.";
    exit;
}

$score = $_POST['high-score'];
$level_scores = explode(",", $_POST['score-per-level']);
$data_buffer = null;

$data = [];
$i = 0;
if (($handle = fopen("./res/leaderboard.csv", "r")) !== FALSE) {
    while (($csvdata = fgetcsv($handle, 0, ",")) !== FALSE) {
        $data[] = $csvdata;
        if ($csvdata[0] == $_SESSION['uname']) {
            $data_buffer = $csvdata;
            unset($data[$i]);
        }
        $i++;
    }
    fclose($handle);
}
else {
    echo "Catastrophic error, contact server administrator.";
    header("{$_SERVER["SERVER_PROTOCOL"]}. 404 Not Found");
}

$fp = fopen('./res/leaderboard.csv', 'w');
foreach ($data as $row) {
    fputcsv($fp, $row);
}

if ($data_buffer == null)
    fputcsv($fp, explode(",",
            $_SESSION['uname'] . "," .
            $score . "," .
            implode(",", $level_scores))
    );
else {
    $data_buffer[1] = max($score, $data_buffer[1]);
    for ($i = 2; $i < sizeof($data_buffer); $i++) {
        // From 2 to 13 (lv0-lv10), compare values to score-per-level 0 to 10.
        $data_buffer[$i] = max($level_scores[$i - 2], $data_buffer[$i]);
    }

    fputcsv($fp, $data_buffer);
}

echo "Finished.";
header("Location: leaderboard.php");
exit;

?>