var	game = {
	COMPUTER_DELAY: 2000,
	player: null,
	computer: null,
	playerTurn: true,
	paused: false 
};

$( function() {

	"use strict";
	
	// Initial event bindings and game initialization
	game.init = function() {

		$(document).on("keyup", game.check_menu); // Check key presses for ESC key
		$(document).on("click", ".fa-bars", game.show_menu); // Bind pause button
		$(document).on("click", ".card", game.card_click); // Bind clicking on player cards
		$(document).on("click", "#GPriest", game.GuessPriest); // Bind reset button
		// Initialize both players
		game.player = new Player();
		game.computer = new Player();

		game.begin_turn();
	};
	
	// Handle any click on player cards
	game.card_click = function() {
		console.log("hi");
		if (!$(this).hasClass("selected")) {
			// Card isn't selected, deselect any previously selected cards and select this one
			$(".card").removeClass("selected");
			$(this).addClass("selected");	
		} else {
			// Card is already selected, attempt to play it
			if (game.playerTurn) {
				var id = $(this).data("id");
				var card = game.player.playCard(id);
				console.log(card);
				if (card) {
					// Card was played, apply it to correct player and update
					if (card.type === "Guard") {
						game.player.applyCard(card);
					}

					// Update the displays
					game.update_display();

					// Show status update
					if (card.type === "Guard") {
						$.growl({ title: "Guard", message: "You attack for " + card.damage + " damage", location: "br" });
					} else if (card.type === "Heal") {
						$.growl({ title: "Heal", message: "You heal for " + card.amount + " health", location: "br" });
					}
					
					// Check for winner
					//var status = game.check_win();

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
		// Update display
		game.update_display();
		
	}
	// Function to process JSON cards back into proper card objects and return their array
	game.process_array = function(items) {
		
		var processed = [];

		items.forEach(function(item) {
			if (item.type === "Guard") {
				processed.push(new GuardCard(item.id, item.cost, item.point));
			} else {
				processed.push(new PriestCard(item.id, item.cost, item.point));
			}
		});

		return processed;
	};


	game.logout = function() {
    	// Reload page to process logout
		window.location.href = "index.php?logout";
    }



	// Handle beginning of player's turn
	game.begin_turn = function() {
		var cardDrawn = game.player.drawCard();
		// Update display
		game.update_display();

		game.playerTurn = true;

	};

	// Handle click on end turn button
	game.end_turn = function() {
		// Ignore clicks when not your turn
		if ($("button").hasClass("active")) {

			// Make button inactive
			$("button").removeClass("active").addClass("inactive");

			// Call computer player's turn
			game.playerTurn = false;
			game.computer_turn();
		}
	};
	
	game.hide_guess = function() {
        game.paused = false;
	};
	
	game.GuessPriest = function(){
			$.colorbox.close();
			console.log("Now we can check if they have a priest");
			if(game.playerTurn==true){
				console.log(game.computer.hand[0].type);
				if(game.computer.hand[0].type=="Priest"){
					game.win();
				}
				else{
					game.computer_turn();
				}
			}
		
	};
	game.win = function(){
		console.log("Hey i think you won");
	}
	game.applyGuard = function() {
		game.paused = true;
        $.colorbox({
			href:"Guess.php",
			onClosed: game.hide_guess,
            title:"Game is paused."
		});
		
	};

	// Update the deck size for the computer or the player
	game.display_decksize = function(who) {
		
	};

	// Update the hand for the computer or the player
	game.display_hand = function(who) {
		if (who === "computer") {
			
			var handSize = game.computer.handSize();
			$hand = $(".computerSpace .hand");
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

	// Update all display components
	game.update_display = function(){


		// Update deck size
		game.display_decksize("player");
		game.display_decksize();

		// Update hands
		game.display_hand("player");
		game.display_hand("computer");
	};

	game.init();
});