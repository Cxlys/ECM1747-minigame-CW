<nav class="navbar">
    <div class="nav-group">
        <a class="nav-option" name="home" href=".">Home</a>
    </div>
    <div class="nav-group">
        <a class="nav-option" name="memory" href="./pairs.php">Play Pairs</a>
        <?php if (!isset($_SESSION["uname"])) { ?>
            <a class="nav-option" name="register" href="./registration.php">Register</a>
        <?php } else { ?>
            <a class="nav-option" name="leaderboard" href="./leaderboard.php">Leaderboard</a>
            <div class="register-group">
                <div class="emoji">
                    <img class="" src="./src/emojis/skin/<?php echo $_SESSION['skin']; ?>.png">
                    <img class="" src="./src/emojis/eyes/<?php echo $_SESSION['eyes']; ?>.png">
                    <img class="" src="./src/emojis/mouth/<?php echo $_SESSION['mouth']; ?>.png">
                </div>

                <a class="nav-option" name="logout" href="./logout.php">Logout</a>
            </div>
        <?php } ?>
    </div>
</nav>