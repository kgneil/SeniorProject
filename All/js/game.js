var game = {
	COMPUTER_DELAY: 4000,
	possibleGuesses: null,
	player: null,
	computer: null,
	deck: null,
	playerTurn: true,
	paused: false,
	compWins: 0,
	playerWins: 0,
};

$(function() {

	"use strict";

	game.init = function() {

		$(".fa-plus").on("click", function(e) {
			e.preventDefault();
			console.log($("#dropdown"));
			if ($("#dropdown").hasClass("open")) {
				$("#dropdown").removeClass("open");
				$("#dropdown").children("ul").slideUp();
			} else {
				$("#dropdown").addClass("open");
				$("#dropdown").children("ul").slideDown();
			}
		});

		$(document).on("click", ".card", game.card_click);
		$(document).on("click", ".fa-trash", game.delete_messages);
		$(document).on("click", ".fa-lightbulb-o", game.suggest);
		$(document).on("click", ".fa-close", game.close_message);
		$(document).on("click", "#GPriest", function() {
			game.guessCard("Priest");
		});
		$(document).on("click", "#GBaron", function() {
			game.guessCard("Baron");
		});
		$(document).on("click", "#GHandmaid", function() {
			game.guessCard("Handmaid");
		});
		$(document).on("click", "#GPrince", function() {
			game.guessCard("Prince");
		});
		$(document).on("click", "#GKing", function() {
			game.guessCard("King");
		});
		$(document).on("click", "#GCountess", function() {
			game.guessCard("Countess");
		});
		$(document).on("click", "#GPrincess", function() {
			game.guessCard("Princess");
		});
		$(document).on("click", "#PlayerPrinced", game.PlayerPrinced);
		$(document).on("click", "#ComputerPrinced", game.ComputerPrinced);
		game.deck = new Deck();
		game.player = new Player();
		game.computer = new Player();


		game.begin_turn();
	};

	//Resets the game after every round
	game.reset = function() {
		game.checkEnd();
		game.message("New", "New Round");
		game.deck = new Deck();
		game.player = new Player();
		game.computer = new Player();
		game.paused = false;
		game.update_display();
		game.begin_turn(false);
	};

	//Resets the game after someone has 4 tokens
	game.resetGame = function() {
		console.log("Lost");
		game.playerWins = 0;
		game.compWins = 0;
		game.delete_messages();
		game.deck = new Deck();
		game.player = new Player();
		game.computer = new Player();
		game.paused = false;
		game.update_display();
		game.begin_turn(false);
	};

	//Checks to see if someone has 4 tokens after every win
	game.checkEnd = function() {
		if (this.compWins == 4) {
			$.colorbox({
				href: "./images/lostlost.png",
				onClosed: game.resetGame,
				title: "YOU LOST THE GAME!!"
			});
		} else if (this.playerWins == 4) {
			$.colorbox({
				href: "./images/wonwon.png",
				onClosed: game.resetGame,
				title: "YOU WON THE GAME!!"
			});
		} else {
			return;
		}
	}

	//Checks to see what each player has when there are no more cards left
	game.deckEmpty = function() {
		game.message("Info", "The Deck is empty");
		
		var compCard = game.computer.hand;
		var playCard = game.player.hand;
		if (compCard[0].point < playCard[0].point) {
			game.message("Info", "You have a higher Card");
			game.win();
		} else if (compCard[0].point > playCard[0].point) {
			game.message("Info", "The computer has a higher Card");
			game.lose();
		} else if (compCard[0].point == playCard[0].point) {
			setTimeout(game.tie, game.COMPUTER_DELAY);
		}
	}

	//if the deck is empty and both the players have the same card
	//The game looks at the player to see their total played cards
	game.tie = function() {
		var playerCards = game.player.justPlayedTotal();
		console.log("Player cards total: " + playerCards);
		var compCards = game.computer.justPlayedTotal();
		console.log("Computer cards total: " + compCards);

		if (playerCards > compCards) {
			game.message("Info", "Tie Breaker: You Win!!!");
			setTimeout(game.win, game.COMPUTER_DELAY);
		} else {
			game.message("Info", "Tie Breaker: You Lose!");
			setTimeout(game.lose, game.COMPUTER_DELAY);
		}

	}

	//A toggle class for when it is the players turn and they click a card
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
				}
			}
		}
	};

	//To start the computer's turn and chooses what card the computer must play
	game.computer_turn = function() {
		game.computer.handmaid = false;
		game.playerTurn = false;
		game.message("Comp", "The computer's turn");
		var cardDrawn = game.computer.drawCard();
		if (cardDrawn) {
			game.update_display();
			var hand = game.computer.hand;
			var card1 = hand[0];
			var card2 = hand[1];
			var card;
			//if the first card is countess
			if (card1.point == 7) {
				//second card is either a prince or a king
				if (card2.point == 5 || card2.point == 6) {
					card = card1;
				} else if (card1.point < card2.point) {
					card = card1;
				} else {
					card = card2;
				}
			//if the second card is a countess 
			} else if (card2.point == 7) {
				//checks to see if it is a prince or king
				if (card1.point == 5 || card1.point == 6) {
					card = card2;
				} else if (card1.point < card2.point) {
					card = card1;
				} else {
					card = card2;
				}
			//else just pick the card that is the lower card
			} else if (card1.point < card2.point) {
				card = card1;
			} else {
				card = card2;
			}
			
			var f = function() {
				game.computer_play(card);
			}
			setTimeout(f, 3000);
		}
	}

	//computer card that they chose to play
	game.computer_play = function(card) {
		var id = card.id;
		var Pcard = game.computer.playCard(id);
		game.computer.applyCard(Pcard);

	}

	//To start the players turn
	game.begin_turn = function() {
		game.player.handmaid = false;
		var cardDrawn = game.player.drawCard();
		game.update_display();
		game.message("User", "Your Turn");

		game.playerTurn = true;

	};

	//Game pauses as a colorbox is up
	game.hide_guess = function() {
		game.paused = false;
	};

	//Logic of when a guard is used and checks eachothers hand
	game.guessCard = function(card) {
		//console.log("Guess a " + card);
		$.colorbox.close();
		if (game.playerTurn == true) {
			game.message("User", "You played a guard and guessed a " + card);
			if (game.computer.hand[0].type == card && game.computer.handmaid == false) {
				game.message("User", "The Computer has a " + card + "! You WON!!!!!");
				setTimeout(game.win, game.COMPUTER_DELAY);
			} else if (game.computer.handmaid === true) {
				game.message("Comp", "The Computer has an active handmaid.");
				setTimeout(game.computer_turn, game.COMPUTER_DELAY);
			}
			else {
				game.message("User", "The Computer does not have a " + card + "!");
				setTimeout(game.computer_turn, game.COMPUTER_DELAY);
			}
			//The computers turn
		} else {
			game.message("Comp", "Computer used a Guard and guessed a " + card + ".");
			if (game.player.hand[0].type == card && game.player.handmaid == false) {
				game.message("Comp", "You have a " + card + ". You Lose!");
				setTimeout(game.lose, game.COMPUTER_DELAY);
			} else if (game.player.handmaid === true) {
				game.message("User", "You have an active handmaid");
				setTimeout(game.begin_turn, 4000);
			} else {
				game.message("Comp", "You do not have a " + card + ".");
				setTimeout(game.begin_turn, 4000);
			}
		}
	};

	//Applying a guard
	game.applyGuard = function() {
		if (game.playerTurn == true) {
			game.paused = true;
			$.colorbox({
				href: "Guess.php",
				onClosed: game.hide_guess,
				title: "Game is paused.",
				escKey: false,
				overlayClose: false
			});
		} else {

			this.possibleGuesses = game.computer.computerGuess();
			var guess = this.possibleGuesses[Math.floor(Math.random() * this.possibleGuesses.length)];
			if (guess == 2 || guess == 1) {
				game.guessCard("Priest");
			} else if (guess == 3) {
				game.guessCard("Baron");
			} else if (guess == 4) {
				game.guessCard("Handmaid");
			} else if (guess == 5) {
				game.guessCard("Prince");
			} else if (guess == 6) {
				game.guessCard("King");
			} else if (guess == 7) {
				game.guessCard("Countess");
			} else if (guess == 8) {
				game.guessCard("Princess");
			}
			game.update_display();
		}

	};

	//Applies a priest
	//The priest just makes the other player look at their card
	game.applyPriest = function() {

		if (game.playerTurn == true) {
			game.message("User", "You used a Priest");
			if (game.computer.handmaid == true) {
				game.message("Comp", "Computer has a handmaid active.");
				setTimeout(game.computer_turn, 3000);
			} else {
				var f = function() {
					game.showCard("Priest");
				}
				setTimeout(f, 1000);
			}
		} else {
			game.message("Comp", "The computer just played a Priest");
			if (game.player.handmaid == true) {
				game.message("User", "You have a handmaid active.");
				setTimeout(game.begin_turn, 3000);
			} else {
				game.message("Comp", "You just showed your card to the computer");
				setTimeout(game.begin_turn, 3000);
			}
		}
	};

	//Called when a player or a computer uses a priest or a baron
	//It quickly shows the computers card and continues the logic
	game.showCard = function(card) {
		game.display_hand("computer", true);
		if (card == "Priest") {
			setTimeout(game.computer_turn, 3000);
		} else {
			if (game.playerTurn == true) {
				if (game.computer.hand[0].point == game.player.hand[0].point) {
					setTimeout(game.computer_turn, game.COMPUTER_DELAY);
				} else if (game.computer.hand[0].point > game.player.hand[0].point) {
					setTimeout(game.lose, 2500);
				} else {
					setTimeout(game.win, 2500);
				}
			} else {
				if (game.computer.hand[0].point == game.player.hand[0].point) {
					setTimeout(game.begin_turn, 3000);
				} else if (game.computer.hand[0].point > game.player.hand[0].point) {
					setTimeout(game.lose, 2500);
				} else {
					setTimeout(game.win, 2500);
				}
			}

		}
	}

	//Applies the baron
	//Baron also calls show card and the players compare and the winner wins
	game.applyBaron = function() {
		if (game.playerTurn == true) {
			game.message("User", "You Played Baron");
			if (game.computer.handmaid == true) {
				game.message("Comp", "Computer has a handmaid active.");
				setTimeout(game.computer_turn, 3000);
			} else {
				var f = function() {
					game.showCard("Baron");
				}
				setTimeout(f, 1000);
			}
		} else {
			game.message("Comp", "The computer has played a Baron");
			if (game.player.handmaid == true) {
				game.message("User", "You have a handmaid active.");
				setTimeout(game.begin_turn, 3000);
			} else {
				var f = function() {
					game.showCard("Baron");
				}
				setTimeout(f, 1000);
			}
		}
	}

	//Applies the handmaid calling the player class and making a handmaid true
	game.applyHandmaid = function() {
		if (game.playerTurn == true) {
			game.player.handmaid = true;
			game.message("User", "You have played a Handmaid");
			setTimeout(game.computer_turn, 2000);
		} else {
			game.computer.handmaid = true;
			game.message("Comp", "The computer has played a Handmaid");
			setTimeout(game.begin_turn, 2000);

		}
	}

	//Applies a prince. When a prince is used a player may choose themeself or 
	//The other player and may pick them to discard
	game.applyPrince = function() {
		if (game.playerTurn == true) {
			if (game.computer.handmaid == true) {
				$.colorbox({
					href: "PlayPrinceYou.php",
					onClosed: game.hide_guess,
					title: "Who would you like to Prince?",
					escKey: false,
					overlayClose: false
				});
			} else {
				$.colorbox({
					href: "PlayPrince.php",
					onClosed: game.hide_guess,
					title: "Who would you like to Prince?",
					escKey: false,
					overlayClose: false
				});
			}
		} else {
			if (game.player.handmaid) {
				game.ComputerPrinced();
			} else {
				game.PlayerPrinced();
			}

		}
	}

	//Applies princess
	game.applyPrincess = function() {
		if (game.playerTurn == true) {
			game.message("User", "You have played a Princess");
			game.lose();
		} else {
			game.message("Comp", "The computer has played a Princess");
			game.win();
		}
	}

	//Applies Princess
	game.applyCountess = function() {
		if (game.playerTurn == true) {
			game.message("User", "You have played a Countess");
			setTimeout(game.computer_turn, game.COMPUTER_DELAY);
		} else {
			game.message("Comp", "The computer has played a Countess");
			setTimeout(game.begin_turn, 4000);

		}
	}

	//Applies king
	game.applyKing = function() {
		//console.log("apply king");
		if (game.playerTurn == true) {
			if (game.computer.handmaid == false) {
				game.message("User", "You have played a King and traded Cards with the computer");
				var playerCard = game.player.hand[0];
				var compCard = game.computer.hand[0];
				game.player.kinged(compCard);
				game.computer.kinged(playerCard);
				game.update_display();
				setTimeout(game.computer_turn, 4000);
			} else {
				game.message("Comp", "The computer has an active handmaid");
				setTimeout(game.computer_turn, 4000);
			}
		} else {
			
			if (game.player.handmaid == false) {
				game.message("Comp", "The computer has played a King and traded cards with you.");
				var playerCard = game.player.hand[0];
				var compCard = game.computer.hand[0];
				game.player.kinged(compCard);
				game.computer.kinged(playerCard);
				game.update_display();
				setTimeout(game.begin_turn, 4000);
			} else {
				game.message("User", "You have an active handmaid");
				setTimeout(game.begin_turn, 4000);
			}

		}
	}

	//If the player is chose to be princed 
	game.PlayerPrinced = function() {
		$.colorbox.close();
		if (game.player.handmaid == false) {
			var card = game.player.hand[0];
			game.player.princed();
			game.update_display();
			if (card.type == "Princess") {
				game.message("User", "You have been Princed and were forced to discard the Princess");
				setTimeout(game.lose, 4000);
			} else if (game.playerTurn == true) {
				game.message("User", "You have Princed yourself and discarded your card");
				setTimeout(game.computer_turn, 4000);
			} else {
				game.message("Comp", "The computer played a prince and chose to prince you.");
				setTimeout(game.begin_turn, 4000);
			}

		}
	}
	
	//If the computer is picked to be princed
	game.ComputerPrinced = function() {
		$.colorbox.close();
		var card = game.computer.hand[0];
		game.computer.princed();
		game.update_display();
		if (card.type == "Princess") {
			game.message("Comp", "The computer has been princed and was forced to discard the Princess");
			setTimeout(game.win, 4000);
		}
		if (game.playerTurn == true) {
			game.message("User", "You have princed the computer.");
			//$.growl.notice({ title: "Princed", message: "You have Princed yourself", location: "br" });
			setTimeout(game.computer_turn, 4000);
		} else {
			game.message("Comp", "The computer Princed themeself");
			setTimeout(game.begin_turn, 4000);
		}

	}

	game.display_decksize = function() {
		var $deck = $(".deck .deckSize");
		$deck.empty();
		var deckSize;
		deckSize = game.deck.deckSize();
		$deck.append('<h3>Cards Left: ' + deckSize + '</h3>');
	};

	game.display_unknown = function() {
		var $unknown = $(".unknown .UK");
		$unknown.empty();
		var unknown = game.deck.getUnknown();

		$unknown.append('<li><div class="UKcard"><header> ???????? </header><img src="./images/Qmark.png"></img></div></li>');
		for (i = 1; i < unknown.length; i++) {
			$unknown.append('<li><div class="UKcard"><header> ' + unknown[i][0].point + ' ' + unknown[i][0].type + '</header><img src="./images/' + unknown[i][0].type + 'Person.png"></img></div></li>');
		}
	};
	
	game.display_handmaid = function() {
		var $handmaid = $(".computerSpace .handmaid");
		$handmaid.empty();
		var hm = game.computer.handmaid;
		if(hm==true){
			$handmaid.append('<i class="fa fa-shield" aria-hidden="true"></i>');
		}
		
		var $handmaid = $(".userSpace .handmaid");
		$handmaid.empty();
		var hm = game.player.handmaid;
		if(hm==true){
			$handmaid.append('<i class="fa fa-shield" aria-hidden="true"></i>');
		}
		
		
	};

	game.display_hand = function(who, show) {
		if (who === "computer") {
			var $hand = $(".computerSpace .hand");
			var hand = game.computer.hand;
			$hand.empty();

			for (i = 0; i < hand.length; i++) {
				if (show == true) {
					$hand.html(hand[i].template());
					//console.log(hand[i]);
				} else {
					$hand.append('<li><img src="./images/backgroundCard.jpg" alt="Card Back"/></li>');
					//$hand.append(hand[i].template());

				}
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
				$played.append('<li><div class="justPlayed">' + playedCards[i].point + '</div></li>');
			}
		} else {
			var playedSize = game.player.playedSize();
			var $played = $(".userSpace .PlayedCards");
			$played.empty();
			var playedCards = game.player.justPlayed;

			for (i = 0; i < playedSize; i++) {
				$played.append('<li><div class="justPlayed">' + playedCards[i].point + '</div></li>');
			}
		}
	};

	game.display_tokens = function(who) {

		if (who === "computer") {

			var $token = $(".computerSpace .tokens");
			$token.empty();

			for (i = 0; i < game.compWins; i++) {
				$token.append('<li><img src="./images/token.png" alt="Card Back"/></li>');
			}
		} else {
			var $token = $(".userSpace .tokens");
			$token.empty();

			for (i = 0; i < game.playerWins; i++) {
				$token.append('<li><img src="./images/token.png" alt="Card Back"/></li>');
			}
		}
	};

	// Update all display components
	game.update_display = function() {
		// Update deck size
		game.display_decksize();

		// Update hands
		game.display_hand("player", false);
		game.display_hand("computer", false);
		
		game.display_handmaid();

		game.display_just_played("player");
		game.display_just_played("computer");

		game.display_tokens("player");
		game.display_tokens("computer");

		game.display_unknown();
	};
	
	game.message = function(type, mess){
		console.log(mess);
		var $message = $("#notification .container");
		if(type=="User"){
			$message.prepend('<div class="item note note-success">'+
					'<div class="item-image note-icon">'+
					'<i class="fa fa-user" ></i></div>'+
					'<div class="item-body note-text">'+mess+'</div>'+
					'<a href="#" class="note-close"><i class="fa fa-close"></i></a></div>');			
		}
		else if(type=="Comp"){
			$message.prepend('<div class="item note note-secondary">'+
					'<div class="item-image note-icon">'+
					'<i class="fa fa-desktop" style="padding-right:3px;padding-left:3px;"></i></div>'+
					'<div class="item-body note-text">'+mess+'</div>'+
					'<a href="#" class="note-close"><i class="fa fa-close"></i></a></div>');
			
		}
		else if(type=="Info"){
			$message.prepend('<div class="item note note-gray">'+
					'<div class="item-image note-icon">'+
					'<i class="fa fa-exclamation-circle" style="padding-right:7px;padding-left:6px;"></i></div>'+
					'<div class="item-body note-text">'+mess+'</div>'+
					'<a href="#" class="note-close"><i class="fa fa-close"></i></a></div>');
			
		}
		else{
			$message.prepend('<div class="item note note-info">'+
					'<div class="item-image note-icon">'+
					'<i class="fa fa-magic" style="padding-right:4px;padding-left:7px;"></i></div>'+
					'<div class="item-body note-text">'+mess+'</div>'+
					'<a href="#" class="note-close"><i class="fa fa-close"></i></a></div>');
			
		}
		
	}
	
	game.delete_messages = function(){
		var $messages = $("#notification .container");
		$messages.empty();
		
	}
	
	game.suggest = function(){
		
		console.log("hi");
		if(game.playerTurn==true){
			var $messages = $("#notification .container");
			var hand = game.player.hand;
			var card1 = hand[0];
			var card2 = hand[1];
			var card;
			if (card1.point == 7) {
				//second card is either a prince or a king
				if (card2.point == 5 || card2.point == 6) {
					card = card1;
				} else if (card1.point < card2.point) {
					card = card1;
				} else {
					card = card2;
				}
			//if the second card is a countess 
			} else if (card2.point == 7) {
				//checks to see if it is a prince or king
				if (card1.point == 5 || card1.point == 6) {
					card = card2;
				} else if (card1.point < card2.point) {
					card = card1;
				} else {
					card = card2;
				}
			} else if (card1.point == 2 && card2.point==1) {
				card=card1;
			}else if (card1.point == 1 && card2.point==2) {
				card=card2;
			//else just pick the card that is the lower card
			}else if (card1.point < card2.point) {
				card = card1;
			} else {
				card = card2;
			}
			$messages.prepend('<div class="item note note-info">'+
					'<div class="item-image note-icon">'+
					'<i class="fa fa-lightbulb-o" style="padding-right:11px;padding-left:10px;"></i></div>'+
					'<div class="item-body note-text">You should play the '+card.type+' card</div>'+
					'<a href="#" class="note-close"><i class="fa fa-close"></i></a></div>');
		}
		else{
			//nothing
		}
		
		
		
	}
	
	game.close_message = function(){
		var $message = this.parentElement.parentElement;
		console.log($message);
		$message.remove();

		
	}
	
	game.lose = function() {
		game.compWins = game.compWins + 1;
		game.message("Info", "You have lost this round");
		$.colorbox({
			href: "./images/lose.jpg",
			onClosed: game.reset,
			title: "You have lost this round"
		});
	}
	
	game.win = function() {

		game.playerWins = game.playerWins + 1;
		game.message("Info", "You have won this round!!!");
		$.colorbox({
			href: "./images/won.jpg",
			onClosed: game.reset,
			title: "You have won this round"
		});

	}
	game.init();
});