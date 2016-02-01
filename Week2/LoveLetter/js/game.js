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
		$(document).on("click", "#reset", game.reset); // Bind reset button
		$(document).on("click", "#save", game.save); // Bind save button
		$(document).on("click", "#load", game.load); // Bind load button
		$(document).on('click', '#logout', game.logout); // Bind logout button
		$(document).on("click", ".playerbar button", game.end_turn); // Bind end turn button
		$(document).on("click", ".card", game.card_click); // Bind clicking on player cards
		// Initialize both players
		game.player = new Player();
		game.computer = new Player();

		game.begin_turn();
	};

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