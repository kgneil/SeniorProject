var	game = {
	COMPUTER_DELAY: 2000,
	player: null,
	computer: null,
	playerTurn: true,
	paused: false,
	compWins: null,
	playerWins: null,
};

$( function() {

	"use strict";

	game.init = function() {

		$(document).on("keyup", game.check_menu); 
		$(document).on("click", ".fa-bars", game.show_menu); 
		$(document).on("click", ".card", game.card_click); 
		$(document).on("click", "#GPriest", game.GuessPriest); 
		$(document).on("click", "#GBaron", game.GuessBaron); 

		game.player = new Player();
		game.computer = new Player();

		game.begin_turn();
	};
	
	game.reset = function() {
    
        game.player = new Player();
		game.computer = new Player();
		
        game.paused = false;
		
        game.update_display();

        game.begin_turn(false);
	};
	

	game.card_click = function() {
		if (!$(this).hasClass("selected")) {

			$(".card").removeClass("selected");
			$(this).addClass("selected");	
		} else {
			if (game.playerTurn) {
				var id = $(this).data("id");
				var card = game.player.playCard(id);
				if (card) {
					
					game.player.applyCard(card);
			
					game.update_display();

					if (card.type === "Guard") {
						$.growl({ title: "Guard", message: "You attack for " + card.damage + " damage", location: "br" });
					} else if (card.type === "Heal") {
						$.growl({ title: "Heal", message: "You heal for " + card.amount + " health", location: "br" });
					}

					if (status === "WIN") {
						$.colorbox({
							href:"images/win.jpg",
							onClosed: game.reset,
				            title:"FRAWRESS VICTORY!!"
						});
					}
				}
			}
		}		
	};
	
	game.computer_turn = function(){
		game.playerTurn = false;
		var cardDrawn = game.computer.drawCard();

		game.update_display();
		var hand = game.computer.hand;
		var card;
		if(hand[0].point<hand[1].point){
			card = hand[0];
		}
		else{
			card = hand[1];
		}
		console.log(card);
		setTimeout(game.computer_play(card), 5000);
		
	}
	
	game.computer_play = function(card){
		var id = card.id;
		var Pcard = game.computer.playCard(id);
		
		if (Pcard) {

			game.computer.applyCard(Pcard);

			if (card.type === "Guard") {
				$.growl({ title: "Guard", message: "Computer is playing a guard", location: "br" });
			} else if (card.type === "Priest") {
				$.growl({ title: "Priest", message: "Computer is playing a priest", location: "br" });
			}
			
		
		}
	}
	
	// Function to process JSON cards back into proper card objects and return their array
	game.process_array = function(items) {
		
		var processed = [];

		items.forEach(function(item) {
			if (item.type === "Guard") {
				processed.push(new GuardCard(item.id, item.cost, item.point));
			} else if (item.type === "Priest") {
				processed.push(new PriestCard(item.id, item.cost, item.point));
			}
			else if (item.type === "Baron") {
				processed.push(new BaronCard(item.id, item.cost, item.point));
			}
		});

		return processed;
	};


	game.logout = function() {
    	// Reload page to process logout
		window.location.href = "index.php?logout";
    }


	game.begin_turn = function() {
		var cardDrawn = game.player.drawCard();
		game.update_display();

		game.playerTurn = true;

	};
	
	game.hide_guess = function() {
        game.paused = false;
	};
	
	game.GuessPriest = function(){
			$.colorbox.close();
			
			if(game.playerTurn==true){
				console.log(game.computer.hand[0].type);
				$.growl({ title: "Guard", message: "You used a Guard and guessed a Priest", location: "br" });
				if(game.computer.hand[0].type=='Priest'){
					console.log("Hi you won");
					$.growl({ title: "Guard", message: "The Computer has a Priest! You WON!!!!!", location: "br" });
					
					setTimeout(game.win, game.COMPUTER_DELAY);
				}
				else{
					setTimeout(game.computer_turn, game.COMPUTER_DELAY);
				}
			}
			else{
				console.log("Computer used a Guard and guessed a Priest");
				$.growl({ title: "Guard", message: "Computer used a Guard and guessed a Priest", location: "br" });
				if(game.player.hand[0].type=="Priest"){
					$.growl({ title: "Guard", message: "You have a Priest! You WON!!!!!", location: "br" });
					game.win();
				}
				else{
					setTimeout(game.begin_turn, game.COMPUTER_DELAY);
				}
			}
		
	};
	
	
	game.GuessBaron = function(){
			$.colorbox.close();
			
			if(game.playerTurn==true){
				console.log(game.computer.hand[0].type);
				$.growl({ title: "Guard", message: "You used a Guard and guessed a Baron", location: "br" });
				if(game.computer.hand[0].type=='Baron'){
					console.log("Hi you won");
					$.growl({ title: "Baron", message: "The Computer has a Baron! You WON!!!!!", location: "br" });
					
					setTimeout(game.win, game.COMPUTER_DELAY);
				}
				else{
					setTimeout(game.computer_turn, game.COMPUTER_DELAY);
				}
			}
			else{
				console.log("Computer used a Guard and guessed a Baron");
				$.growl({ title: "Guard", message: "Computer used a Guard and guessed a Baron", location: "br" });
				if(game.player.hand[0].type=="Baron"){
					$.growl({ title: "Guard", message: "You have a Baron! You Lost!!!!", location: "br" });
					setTimeout(game.win, game.COMPUTER_DELAY);
				}
				else{
					setTimeout(game.begin_turn, game.COMPUTER_DELAY);
				}
			}
		
	};
	game.win = function(){
		if (game.playerTurn == true){
			game.playerWins= game.playerWins +1;
			$.colorbox({
						href:"won.jpg",
						onClosed: game.reset,
			            title:"YOU WIN!!"
			});
		}
		else{
			game.compWins = game.compWins +1;
			$.colorbox({
						href:"lost.jpg",
						onClosed: game.reset,
			            title:"YOU LOSE!!"
			});
		}
		game.reset();
	}
	game.applyGuard = function() {
		if ( game.playerTurn==true ){
			var $played = $(".userSpace .PlayedCards");
			$played.append('<li><div class="justPlayed">1</div></li>');
			game.paused = true;
			$.colorbox({
				href:"Guess.php",
				onClosed: game.hide_guess,
				title:"Game is paused."
			});
		}
		else{
			console.log("applyGueard");
			var guesses = [2];
			var guess = guesses[Math.floor(Math.random() * guesses.length)];
			if (guess == 2){
				game.GuessPriest();
			}
			game.update_display();
		}
		
	};
	
	game.applyPriest = function() {
		console.log("Apply priest");
		if ( game.playerTurn==true ){
			$.colorbox({
				href: game.computer.hand[0].type+".jpg",
				onClosed: game.hide_guess,
				title:"The computer has..."
			});
			setTimeout(game.computer_turn, game.COMPUTER_DELAY);
		}
		else {
			$.colorbox({
				href: game.player.hand[0].type+".jpg",
				onClosed: game.hide_guess,
				title:"Show the computer ..."
			});
			setTimeout(game.begin_turn, game.COMPUTER_DELAY);
		}
	};
	
	game.applyBaron = function() {
		console.log("Apply Baron");
		if ( game.playerTurn==true ){
			$.colorbox({
				href: game.computer.hand[0].type+".jpg",
				onClosed: game.hide_guess,
				title:"The computer has..."
			});
			if ( game.computer.hand[0].point == game.player.hand[0].point ) {
				setTimeout(game.computer_turn, game.COMPUTER_DELAY);
			}
			else if ( game.computer.hand[0].point > game.player.hand[0].point ) {
				game.playerTurn=false;
				setTimeout(game.win, game.COMPUTER_DELAY);
			}
			else{
				setTimeout(game.win, game.COMPUTER_DELAY);
			}
		}
		else {
			$.colorbox({
				href: game.computer.hand[0].type+".jpg",
				onClosed: game.hide_guess,
				title:"Compare with the computer"
			});
			if ( game.computer.hand[0].point == game.player.hand[0].point ) {
				setTimeout(game.begin_turn, game.COMPUTER_DELAY);
			}
			else if ( game.computer.hand[0].point > game.player.hand[0].point ) {
				game.playerTurn=false;
				setTimeout(game.win, game.COMPUTER_DELAY);
			}
			else{
				game.playerTurn=true;
				setTimeout(game.win, game.COMPUTER_DELAY);
			}
		}
		
		
	};


	game.display_decksize = function() {
		var $deck = $(".deck .deckSize");
		$deck.empty();
		var deckSize;
		console.log("Player Deck "+ game.player.deckSize());
		console.log("Comp Deck "+ game.computer.deckSize());
		if(game.player.deckSize()<=game.computer.deckSize()){
			
			deckSize = game.player.deckSize();
		}
		else{
			deckSize = game.computer.deckSize();
		}
		console.log(deckSize);
		$deck.append('<h3>Cards Left: '+deckSize+'</h3>');
	};

	game.display_hand = function(who) {
		if (who === "computer") {
			
			var handSize = game.computer.handSize();
			var $hand = $(".computerSpace .hand");
			$hand.empty();

			for (i = 0; i < handSize; i++) {
				$hand.append('<li><img src="backgroundCard.jpg" alt="Card Back"/></li>');
			}
			
		} else {
			var $hand = $(".userSpace .hand");
			var hand = game.player.hand;
			$hand.empty();

			for (i = 0; i < hand.length; i++) {
				$hand.append(hand[i].template());
			}
		}
	};
	
	// Update the hand for the computer or the player
	game.display_just_played = function(who) {
		
		if (who === "computer") {
			
			var playedSize = game.computer.playedSize();
			var $played = $(".computerSpace .PlayedCards");
			$played.empty();
			var playedCards = game.computer.justPlayed;

			for (i = 0; i < playedSize; i++) {
				$played.append('<li><div class="justPlayed">'+playedCards[i].point+'</div></li>');
			}
		} else {
			var playedSize = game.player.playedSize();
			var $played = $(".userSpace .PlayedCards");
			$played.empty();
			var playedCards = game.player.justPlayed;

			for (i = 0; i < playedSize; i++) {
				$played.append('<li><div class="justPlayed">'+playedCards[i].point+'</div></li>');
			}
		}
	};
	
	game.display_tokens = function(who) {
		
		if (who === "computer") {

			var $token = $(".computerSpace .tokens");
			$token.empty();

			for (i = 0; i < game.compWins; i++) {
				$token.append('<li><img src="token.jpg" alt="Card Back"/></li>');
			}
		} else {
			var $token = $(".userSpace .tokens");
			$token.empty();

			for (i = 0; i < game.playerWins; i++) {
				$token.append('<li><img src="token.jpg" alt="Card Back"/></li>');
			}
		}
	};

	// Update all display components
	game.update_display = function(){
		console.log("Updating");

		// Update deck size
		game.display_decksize();

		// Update hands
		game.display_hand("player");
		game.display_hand("computer");
		
		game.display_just_played("player");
		game.display_just_played("computer");
		
		game.display_tokens("player");
		game.display_tokens("computer");
	
	};

	game.init();
});