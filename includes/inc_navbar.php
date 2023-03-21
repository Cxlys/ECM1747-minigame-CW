<nav class="navbar">
    <div class="nav-group">
        <a class="nav-option" name="home" href=".">Home</a>
    </div>
    <div class="nav-group">
        <a class="nav-option" name="memory" href="./pairs.php">Play Pairs</a>
        <a class="nav-option" name="leaderboard" href="./leaderboard.php">Leaderboard</a>
        <?php if (!isset($_SESSION["uname"])) { ?><a class="nav-option" name="register" href="./registration.php">Register</a>
        <?php } else { ?>
                <div class="register-group">
                    <img class="nav-option flex-center" src="./uploads/<?php echo sha1($_SESSION['uname']); ?>.jpg">
                    <a class="nav-option" name="logout" href="./logout.php">Logout</a>
                </div>
        <?php } ?>
    </div>
</nav>