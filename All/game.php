<head>
	<title>LoveLetter</title>
	<link href='https://fonts.googleapis.com/css?family=Merriweather' rel='stylesheet' type='text/css'>
	<link href="//maxcdn.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min.css" rel="stylesheet">
	<link href="css/external/jquery.growl.css" rel="stylesheet" type="text/css" />
	<link href="css/external/colorbox.css" rel="stylesheet" type="text/css" />
	<link href="css/game.css" rel="stylesheet" type="text/css" />
	<link href="css/hover.css" rel="stylesheet" type="text/css" />
	
	<link href='https://fonts.googleapis.com/css?family=Dancing+Script|Satisfy|Cookie|Pinyon+Script|Niconne|Homemade+Apple' rel='stylesheet' type='text/css'>

	<script src="//ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js"></script>
	<script src="js/external/jquery.growl.js" type="text/javascript"></script>
	<script src="js/external/jquery.bootstrap-growl.min.js" type="text/javascript"></script>
	<script src="js/external/jquery.colorbox-min.js"></script>
	<script src="js/game.js"></script>
	<script src="js/deck.js"></script>
	<script src="js/player.js"></script>
	<script src="js/card.js"></script>
	<script src="http://anijs.github.io/lib/anijs/anijs.js"></script>
	<link href="css/note.css" rel="stylesheet" type="text/css" />
	<link rel="stylesheet" href="http://anijs.github.io/lib/anicollection/anicollection.css" />
</head>


<header id="head">
	<h1>Love Letter</h1>
	<div class="Menu">
		<div id="dropdown" class="ddmenu">

			<i class="fa fa-plus hvr-bob" aria-hidden="true"></i>

			<ul>
				<li><a href="Love_Letter_Rules.pdf" target="_blank"><i class="fa fa-book" aria-hidden="true"></i> Rules</a>
				</li>
				<li><a href="https://github.com/kgneil/SeniorProject"  target="_blank"><i class="fa fa-github" aria-hidden="true"></i> Github</a>
				</li>
				<li><a href="http://turing.plymouth.edu/~kgneil/SeniorProject/WriteUp.html"  target="_blank"><i class="fa fa-file-text" aria-hidden="true"></i> Report</a>
				</li>
				<li><a href="http://turing.plymouth.edu/~kgneil/LoveLetter/game.php" ><i class="fa fa-refresh" aria-hidden="true"></i> Restart</a>
				</li>
				
			</ul>
		</div>
	</div>

</header>

<body>
	<div id="wrapper">
		<div id="everything">
			<div class="middle">
				<div class="table">
					<div class="deck">
						<h2> Deck </h2>
						<img src="images/backgroundCard.jpg" alt="Card Back" />
						<div class="deckSize"></div>
					</div>
					<div class="unknown">
						<h3>&nbspRemoved Cards</h3>
						<ul class="UK"></ul>
					</div>

				</div>
				<div class="computerSpace">
					<ul class="PlayedCards"></ul>
					<ul class="hand"></ul>
					<div class="handmaid"></div>
					<ul class="tokens"></ul>
				</div>
			</div>
			
			<div class="userSpace">
				<ul class="PlayedCards"></ul>
				<ul class="hand"></ul>
				<div class="handmaid"></div>
				<ul class="tokens"></ul>
			</div>

			<div class="referenceCard">
				<img src="images/ListOfCards.png" alt="Reference Card" />
			</div>
			<!--delete this -->
			<div id="demo-notification">
    <div id="notification">
      <div class="toolbar">
        <div class="delete">
          <i class="fa fa-trash"></i>
        </div>
		<div class="app-icon load-more">
          <i class="fa fa-lightbulb-o"></i>
        </div>
      </div>
      <div class="container">


    </div>
  </div>
  <!--delete this -->
		</div>

		<footer>Kelsey Neil Senior Project</footer>
	</div>
	</div>
</body>

</html>