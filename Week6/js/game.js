var	game = {
	COMPUTER_DELAY: 2000,
	player: null,
	computer: null,
	deck: null,
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
		game.deck = new Deck();
		game.player = new Player();
		game.computer = new Player();
		

		game.begin_turn();
	};
	
	game.reset = function() {
    
        game.player = new Player();
		game.computer = new Player();
		game.deck = new Deck();
        game.paused = false;
		
        game.update_display();

        game.begin_turn(false);
	};
	
	game.deckEmpty = function(){
		
	}

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
		var f = function(){ game.computer_play(card); }
		setTimeout(f, 2000);
		
	}
	
	game.computer_play = function(card){
		var id = card.id;
		var Pcard = game.computer.playCard(id);
		
		if (Pcard) {

			game.computer.applyCard(Pcard);

			if (card.type === "Guard") {
				$.growl.error({ title: "Guard", message: "Computer is playing a guard", location: "br" });
			} else if (card.type === "Priest") {
				$.growl.error({ title: "Priest", message: "Computer is playing a priest", location: "br" });
			}
			else if (card.type === "Baron") {
				$.growl.error({ title: "Baron", message: "Computer is playing a Baron", location: "br" });
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
		$.growl.notice({ title: "Your Turn", message: "It is now your turn!", location: "br" });
		game.playerTurn = true;

	};
	
	game.hide_guess = function() {
        game.paused = false;
	};
	
	game.GuessPriest = function(){
			$.colorbox.close();
			
			if(game.playerTurn==true){
				if(game.computer.hand[0].type=='Priest'){
					$.growl.notice({ title: "Guard", message: "The Computer has a Priest! You WON!!!!!", location: "br" });
					
					setTimeout(game.win, game.COMPUTER_DELAY);
				}
				else{
					$.growl.error({ title: "Guard", message: "The Computer does not have a Priest!", location: "br" });
					setTimeout(game.computer_turn, game.COMPUTER_DELAY);
				}
			}
			else{
				
				$.growl.warning({ title: "Guard", message: "Computer used a Guard and guessed a Priest", location: "br" });
				if(game.player.hand[0].type=="Priest"){
					$.growl.error({ title: "Guard", message: "You have a Priest! You Lose!!!!!", location: "br" });
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
				
				$.growl({ title: "Guard", message: "You used a Guard and guessed a Baron", location: "br" });
				if(game.computer.hand[0].type=='Baron'){
					
					$.growl.notice({ title: "Baron", message: "The Computer has a Baron! You WON!!!!!", location: "br" });
					
					setTimeout(game.win, game.COMPUTER_DELAY);
				}
				else{
					setTimeout(game.computer_turn, game.COMPUTER_DELAY);
				}
			}
			else{
				
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
		setTimeout(game.reset, game.COMPUTER_DELAY);
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
			
			var guesses = [2];
			var guess = guesses[Math.floor(Math.random() * guesses.length)];
			if (guess == 2){
				game.GuessPriest();
			}
			game.update_display();
		}
		
	};
	
	game.applyPriest = function() {
		
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
		
		if(game.deck.deckSize()<=game.deck.deckSize()){
			
			deckSize = game.deck.deckSize();
		}
		else{
			deckSize = game.deck.deckSize();
		}
	
		$deck.append('<h3>Cards Left: '+deckSize+'</h3>');
	};

	game.display_hand = function(who) {
		if (who === "computer") {
			var $hand = $(".computerSpace .hand");
			var handsize = game.computer.hand;
			$hand.empty();

			for (i = 0; i < handsize.length; i++) {
				$hand.append(handsize[i].template());
				//$hand.append('<li><img src="backgroundCard.jpg" alt="Card Back"/></li>');
			}
			
		} else {
			var $hand = $(".userSpace .hand");
			var handsize = game.player.hand;
			$hand.empty();

			for (i = 0; i < handsize.length; i++) {
				$hand.append(handsize[i].template());
				//$hand.append('<li><img src="backgroundCard.jpg" alt="Card Back"/></li>');
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