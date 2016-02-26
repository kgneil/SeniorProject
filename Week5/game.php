	<head>
		<title>LoveLetter</title>
		<link href='https://fonts.googleapis.com/css?family=Merriweather' rel='stylesheet' type='text/css'>
		<link href="//maxcdn.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min.css" rel="stylesheet">
		<link href="css/external/jquery.growl.css" rel="stylesheet" type="text/css" />
		<link href="css/external/colorbox.css" rel="stylesheet" type="text/css" />
		<link href="css/game.css" rel="stylesheet" type="text/css" />

		<script src="//ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js"></script>
		<script src="js/external/jquery.growl.js" type="text/javascript"></script>
		<script src="js/external/jquery.colorbox-min.js"></script>
		<script src="js/game.js"></script>
		<script src="js/player.js"></script>
		<script src="js/card.js"></script>
	</head>

	<body>
		<header>
			<h1>Love Letter</h1>
			<i class="fa fa-bars fa-3x"></i>

		</header>

		<div id="wrapper">
			<div class="middle">
				<div class="table">
					<div class="deck">
					<h2> Deck </h2>
					<ul class="hand"><li><img src="backgroundCard.jpg" alt="Card Back"/></li></ul>
					<div class="deckSize"></div> 
					</div>
				</div>
				<div class="computerSpace">
					Computer Space 
					<ul class="PlayedCards">
					Played cards</br>
					</ul>
					<ul class="hand">
					</ul>
					<ul class="tokens">
					Tokens
					</ul>
					
					
				</div>
			</div>
			<div class="userSpace">
				User Space
				<ul class="PlayedCards">
				Just Played</br>
				</ul>
				<ul class="hand">
				
				</ul>
				<ul class="tokens">
					Tokens
				</ul>
				
			</div>
			
			<div class="referenceCard">
				<img src="ReferenceCard.jpg" alt="Reference Card"/></li>
			</div>
		</div>
		<footer>&copy; <?php echo date("Y"); ?> Kelsey Neil Senior Project</footer>
	</body>
</html>