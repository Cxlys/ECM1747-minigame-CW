<nav class="navbar">
    <div class="nav-group">
        <a class="nav-option" name="home" href=".">Home</a>
    </div>
    <div class="nav-group">
        <a class="nav-option" name="memory" href="./pairs.php">Play Pairs</a>
        <a class="nav-option" name="leaderboard" href="./leaderboard.php">Leaderboard</a>
        <?php if (!isset($_SESSION["uname"])) { ?><a class="nav-option" name="register" href="./registration.php">Register</a>
        <?php } else { ?> <span class="nav-option"> <?php echo $_SESSION['uname'] ?> </span><a class="nav-option" name="logout" href="./logout.php">Logout</a> <?php } ?>
    </div>
</nav>