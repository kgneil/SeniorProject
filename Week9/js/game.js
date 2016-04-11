var	game = {
	COMPUTER_DELAY: 3000,
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
		$(document).on("click", "#GHandmaid", game.GuessHandmaid); 
		$(document).on("click", "#GPrince", game.GuessPrince); 
		$(document).on("click", "#PlayerPrinced", game.PlayerPrinced); 
		$(document).on("click", "#ComputerPrinced", game.ComputerPrinced); 
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
		$.growl.warning({ title: "DECK EMPTY", message: "There are no more cards left", location: "br" });
		var compCard = game.computer.hand;
		var playCard = game.player.hand;
		if(compCard[0].point<playCard[0].point){
			$.growl.notice({ title: "DECK EMPTY", message: "You have a higher Card", location: "br" });
			setTimeout(game.win, game.COMPUTER_DELAY);
		}
		else if(compCard[0].point>playCard[0].point){
			$.growl.error({ title: "DECK EMPTY", message: "The computer has a higher Card", location: "br" });
			setTimeout(game.lose, game.COMPUTER_DELAY);
		}
		else if(compCard[0].point==playCard[0].point){
			$.growl.warning({ title: "TIE BREAKER", message: "You guys have the same card!", location: "br" });
			setTimeout(game.tie, game.COMPUTER_DELAY);
		}
	}
	
	game.tie = function(){
		var playerCards = game.player.justPlayedTotal();
		var compCards = game.computer.justPlayedTotal();
		
		if(playerCards>compCards){
			$.growl.notice({ title: "TIE BREAKER", message: "YOU WIN!!", location: "br" });
			setTimeout(game.win, game.COMPUTER_DELAY);
		}
		else{
			$.growl.error({ title: "TIE BREAKER", message: "YOU LOSE", location: "br" });
			setTimeout(game.lose, game.COMPUTER_DELAY);
		}
		
	}

	game.card_click = function() {
		if (!$(this).hasClass("selected")) {

			$(".card").removeClass("selected");
			$(this).addClass("selected");	
		} else {
			if (game.playerTurn) {
				var id = $(this).data("id");
				console.log("id: "+id);
				var card = game.player.playCard(id);
				if (card) {
					
					game.player.applyCard(card);
			
					game.update_display();
				}
			}
		}		
	};
	
	game.computer_turn = function(){
		game.computer.handmaid=false;
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
		setTimeout(f, 3500);
		
	}
	
	game.computer_play = function(card){
		var id = card.id;
		var Pcard = game.computer.playCard(id);
		
		if (Pcard) {
			if (card.type === "Guard") {
				$.growl.error({ title: "Guard", message: "Computer is playing a guard", location: "br" });
			} else if (card.type === "Priest") {
				$.growl.error({ title: "Priest", message: "Computer is playing a priest", location: "br" });
			}
			else if (card.type === "Baron") {
				$.growl.error({ title: "Baron", message: "Computer is playing a Baron", location: "br" });
			}
			game.computer.applyCard(Pcard);

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
		game.player.handmaid=false;
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
				if(game.computer.hand[0].type=='Priest'  && game.computer.handmaid==false ){
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
				if(game.player.hand[0].type=="Priest"  && computer.player.handmaid==false ){
					$.growl.error({ title: "Guard", message: "You have a Priest! You Lose!!!!!", location: "br" });
					setTimeout(game.lose, game.COMPUTER_DELAY);
				}
				else if (game.player.handmaid==true){
					$.growl.notice({ title: "Active Handmaid", message: "You have an active handmaid", location: "br" });
					setTimeout(game.begin_turn, 5000);
				}
				else{
					setTimeout(game.begin_turn, 4000);
				}
			}
		
	};
	
	game.GuessBaron = function(){
			$.colorbox.close();
			
			if(game.playerTurn==true){
				
				$.growl({ title: "Guard", message: "You used a Guard and guessed a Baron", location: "br" });
				if(game.computer.hand[0].type=='Baron'  && game.computer.handmaid==false ){
					
					$.growl.notice({ title: "Baron", message: "The Computer has a Baron! You WON!!!!!", location: "br" });
					
					setTimeout(game.win, game.COMPUTER_DELAY);
				}
				else if (game.computer.handmaid==true){
					$.growl.warning({ title: "Active Handmaid", message: "The Computer has an active handmaid", location: "br" });
					setTimeout(game.computer_turn, 2000);
				}
				else{
					setTimeout(game.computer_turn, 2000);
				}
			}
			else{
				
				$.growl({ title: "Guard", message: "Computer used a Guard and guessed a Baron", location: "br" });
				if(game.player.hand[0].type=="Baron"  && game.player.handmaid==false ){
					$.growl.error({ title: "Guard", message: "You have a Baron! You Lost!!!!", location: "br" });
					setTimeout(game.lose,3500);
				}
				else if (game.player.handmaid==true){
					$.growl.notice({ title: "Active Handmaid", message: "You have an active handmaid", location: "br" });
					setTimeout(game.begin_turn, 4000);
				}
				else{
					setTimeout(game.begin_turn, 3000);
				}
			}
		
	};
	
	game.GuessHandmaid = function(){
			$.colorbox.close();
			
			if(game.playerTurn==true){
				
				//$.growl.notice({ title: "Guard", message: "You used a Guard and guessed a Handmaid", location: "br" });
				if(game.computer.hand[0].type=='Handmaid'  && game.computer.handmaid==false ){
					
					$.growl.notice({ title: "Guard", message: "The Computer has a Handmaid! You WON!!!!!", location: "br" });
					
					setTimeout(game.win, game.COMPUTER_DELAY);
				}
				else if (game.computer.handmaid==true){
					$.growl.warning({ title: "Active Handmaid", message: "The Computer has an active handmaid", location: "br" });
					setTimeout(game.computer_turn, 2000);
				}
				else{
					$.growl.error({ title: "Guard", message: "The computer does not have a Handmaid", location: "br" });
					setTimeout(game.computer_turn, 4000);
				}
			}
			else{
				
				$.growl.warning({ title: "Guard", message: "Computer used a Guard and guessed a Handmaid", location: "br" });
				if(game.player.hand[0].type=="Handmaid"  && game.player.handmaid==false ){
					$.growl.error({ title: "Guard", message: "You have a Handmaid! You Lost!!!!", location: "br" });
					setTimeout(game.lose,3500);
				}
				else if (game.player.handmaid==true){
					$.growl.notice({ title: "Active Handmaid", message: "You have an active handmaid", location: "br" });
					setTimeout(game.begin_turn, 4000);
				}
				else{
					setTimeout(game.begin_turn, 3000);
				}
			}
		
	};

	game.GuessPrince = function(){
		$.colorbox.close();
			
			if(game.playerTurn==true){
				
			//$.growl.notice({ title: "Guard", message: "You used a Guard and guessed a Prince", location: "br" });
			if(game.computer.hand[0].type=='Prince'  && game.computer.handmaid==false ){
				
				$.growl.notice({ title: "Guard", message: "The Computer has a Prince! You WON!!!!!", location: "br" });
				
				setTimeout(game.win, game.COMPUTER_DELAY);
			}
			else if (game.computer.handmaid==true){
				$.growl.warning({ title: "Active Handmaid", message: "The Computer has an active handmaid", location: "br" });
				setTimeout(game.computer_turn, 2000);
			}
			else{
				$.growl.error({ title: "Guard", message: "The computer does not have a Prince", location: "br" });
				setTimeout(game.computer_turn, 4000);
			}
		}
		else{
			
			$.growl.warning({ title: "Guard", message: "Computer used a Guard and guessed a Prince", location: "br" });
			if(game.player.hand[0].type=="Prince"  && game.player.handmaid==false ){
				$.growl.error({ title: "Guard", message: "You have a Prince! You Lost!!!!", location: "br" });
				setTimeout(game.lose,3500);
			}
			else if (game.player.handmaid==true){
				$.growl.notice({ title: "Active Handmaid", message: "You have an active handmaid", location: "br" });
				setTimeout(game.begin_turn, 4000);
			}
			else{
				$.growl.notice({ title: "Guard", message: "You do not have a Prince", location: "br" });
				setTimeout(game.begin_turn, 5000);
			}
		}
		
	};
	
	game.GuessKing = function(){
		$.colorbox.close();
			
			if(game.playerTurn==true){
				
			//$.growl.notice({ title: "Guard", message: "You used a Guard and guessed a Prince", location: "br" });
			if(game.computer.hand[0].type=='King'  && game.computer.handmaid==false ){
				
				$.growl.notice({ title: "Guard", message: "The Computer has a King! You WON!!!!!", location: "br" });
				
				setTimeout(game.win, game.COMPUTER_DELAY);
			}
			else if (game.computer.handmaid==true){
				$.growl.warning({ title: "Active Handmaid", message: "The Computer has an active handmaid", location: "br" });
				setTimeout(game.computer_turn, 2000);
			}
			else{
				$.growl.error({ title: "Guard", message: "The computer does not have a King", location: "br" });
				setTimeout(game.computer_turn, 4000);
			}
		}
		else{
			
			$.growl.warning({ title: "Guard", message: "Computer used a Guard and guessed a King", location: "br" });
			if(game.player.hand[0].type=="King"  && game.player.handmaid==false ){
				$.growl.error({ title: "Guard", message: "You have a King! You Lost!!!!", location: "br" });
				setTimeout(game.lose,3500);
			}
			else if (game.player.handmaid==true){
				$.growl.notice({ title: "Active Handmaid", message: "You have an active handmaid", location: "br" });
				setTimeout(game.begin_turn, 4000);
			}
			else{
				$.growl.notice({ title: "Guard", message: "You do not have a King", location: "br" });
				setTimeout(game.begin_turn, 5000);
			}
		}
		
	};
	
	game.applyGuard = function() {
		if ( game.playerTurn==true ){
			game.paused = true;
			$.colorbox({
				href:"Guess.php",
				onClosed: game.hide_guess,
				title:"Game is paused."
			});
		}
		else{
			
			var guesses = [2,2,3,3,4,5,6,7];
			var guess = guesses[Math.floor(Math.random() * guesses.length)];
			if (guess == 2){
				game.GuessPriest();
			}
			else if (guess == 3){
				game.GuessBaron();
			}
			else if (guess == 4){
				game.GuessHandmaid();
			}
			else if (guess == 5){
				game.GuessPrince();
			}
			else if (guess == 6){
				game.GuessKing();
			}
			game.update_display();
		}
		
	};
	
	game.applyPriest = function() {
		
		if ( game.playerTurn==true ){
			if (game.computer.handmaid==true){
				$.growl.warning({ title: "Active Handmaid", message: "Computer has a handmaid active.", location: "br" });
				setTimeout(game.computer_turn, 4000);
			}
			else {
				$.colorbox({
					href: game.computer.hand[0].type+".jpg",
					onClosed: game.hide_guess,
					title:"The computer has..."
				});
				setTimeout(game.computer_turn, game.COMPUTER_DELAY);
			}
		}
		else {
			if (game.player.handmaid==true){
				$.growl.notice({ title: "Active Handmaid", message: "You have a handmaid active.", location: "br" });
				setTimeout(game.begin_turn, 5000);
			}
			else{
				$.growl.error({ title: "SHOWED COMPUTER", message: "You just showed your card to the computer", location: "br" });
				setTimeout(game.begin_turn, 5000);
			}
		}
	};
	
	game.applyBaron = function() {
		
		if ( game.playerTurn==true ){
			if (game.computer.handmaid==true){
				$.growl.warning({ title: "Active Handmaid", message: "The computer has an active handmaid", location: "br" });
				setTimeout(game.computer_turn, 4000);
			} 
			else{
				$.colorbox({
					href: game.computer.hand[0].type+".jpg",
					onClosed: game.hide_guess,
					title:"The computer has..."
				});
				if ( game.computer.hand[0].point == game.player.hand[0].point ) {
					setTimeout(game.computer_turn, game.COMPUTER_DELAY);
				}
				else if ( game.computer.hand[0].point > game.player.hand[0].point ) {
					setTimeout(game.lose, game.COMPUTER_DELAY);
				}
				else{
					setTimeout(game.win, game.COMPUTER_DELAY);
				}
			}
		}
		else {
			if (game.player.handmaid==true){
				$.growl.notice({ title: "Handmaid", message: "You have an active Handmaid", location: "br" });
				setTimeout(game.begin_turn, 4000);
			} 
			else{
				$.colorbox({
					href: game.computer.hand[0].type+".jpg",
					onClosed: game.hide_guess,
					title:"Compare with the computer"
				});
				if ( game.computer.hand[0].point == game.player.hand[0].point ) {
					setTimeout(game.begin_turn, 4000);
				}
				else if ( game.computer.hand[0].point > game.player.hand[0].point ) {
					setTimeout(game.lose, 5000);
				}
				else{
					setTimeout(game.win, 5000);
				}
			}
		}
		
		
	};

	game.applyHandmaid = function() {
		if(game.playerTurn==true){
			game.player.handmaid=true;
			setTimeout(game.computer_turn, game.COMPUTER_DELAY);
		}
		else{
			game.computer.handmaid=true;
			$.growl.error({ title: "Handmaid", message: "The computer has played a Handmaid", location: "br" });
			setTimeout(game.begin_turn, 4000);
			
		}
	}
	
	game.applyPrince = function() {
		if(game.playerTurn==true){
			$.colorbox({
				href:"PlayPrince.php",
				onClosed: game.hide_guess,
				title:"Who Would you like to Use this on?"
			});
		}
		else{
			$.growl.error({ title: "Prince", message: "The computer is Playing a Prince", location: "br" });
			game.PlayerPrinced();
			
		}
	}
	
	game.applyKing = function() {
		console.log("apply king");
		if(game.playerTurn==true){
			if(game.computer.handmaid == false){
				$.growl.notice({ title: "King", message: "You traded Cards with the computer", location: "br" });
				var playerCard = game.player.hand[0];
				var compCard = game.computer.hand[0];
				game.player.kinged(compCard);
				game.computer.kinged(playerCard);
				game.update_display();
				setTimeout(game.computer_turn, 4000);
			}
			else{
				$.growl.warning({ title: "Active Handmaid", message: "The computer has an active handmaid", location: "br" });
				setTimeout(game.computer_turn, 4000);
			}
		}
		else{
			$.growl.error({ title: "King", message: "The computer is Playing a King", location: "br" });
			if(game.player.handmaid == false){
				$.growl.error({ title: "King", message: "You traded Cards with the computer", location: "br" });
				var playerCard = game.player.hand[0];
				var compCard = game.computer.hand[0];
				game.player.kinged(compCard);
				game.computer.kinged(playerCard);
				game.update_display();
				setTimeout(game.begin_turn, 4000);
			}
			else{
				$.growl.notice({ title: "Active Handmaid", message: "You have an active handmaid", location: "br" });
				setTimeout(game.begin_turn, 4000);
			}
			
		}
	}
	
	game.PlayerPrinced = function() {
		$.colorbox.close();
		if(game.player.handmaid == false ){
			game.player.princed();
			game.update_display();
			if(game.playerTurn==true){
				//$.growl.notice({ title: "Princed", message: "You have Princed yourself", location: "br" });
				setTimeout(game.computer_turn, 4000);
			}
			else{
				$.growl.error({ title: "Princed", message: "You have been princed", location: "br" });
				setTimeout(game.begin_turn, 4000);
			}
				
		}
		else{
			$.growl.notice({ title: "Active Handmaid", message: "You have an active handmaid", location: "br" });
			if(game.playerTurn==true){
				setTimeout(game.computer_turn, 4000);
			}
			else{
				setTimeout(game.begin_turn, 4000);
			}
		}
	}
	
	game.ComputerPrinced = function() {
		$.colorbox.close();
		if(game.computer.handmaid == false ){
			game.computer.princed();
			game.update_display();
			if(game.playerTurn==true){
				//$.growl.notice({ title: "Princed", message: "You have Princed yourself", location: "br" });
				setTimeout(game.computer_turn, 4000);
			}
			else{
				$.growl.error({ title: "Princed", message: "The computer Princed themeself", location: "br" });
				setTimeout(game.begin_turn, 4000);
			}
				
		}
		else{
			$.growl.notice({ title: "Active HandmaidLA", message: "You have an active handmaid", location: "br" });
			if(game.playerTurn==true){
				setTimeout(game.computer_turn, 4000);
			}
			else{
				setTimeout(game.begin_turn, 4000);
			}
		}
	}
	
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
	game.lose = function() {
		game.compWins = game.compWins +1;
		$.colorbox({
					href:"lost.jpg",
					onClosed: game.reset,
					title:"YOU LOSE!!"
		});
		setTimeout(game.reset, game.COMPUTER_DELAY);
	}
	game.win = function(){
	
		game.playerWins= game.playerWins +1;
		$.colorbox({
					href:"won.jpg",
					onClosed: game.reset,
					title:"YOU WIN!!"
		});		
		setTimeout(game.reset, game.COMPUTER_DELAY);
	}
	game.init();
});