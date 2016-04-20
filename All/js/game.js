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

		$("#dropdown").on("click", function(e) {
			e.preventDefault();
			console.log(this);
			if ($(this).hasClass("open")) {
				$(this).removeClass("open");
				$(this).children("ul").slideUp("fast");
			} else {
				$(this).addClass("open");
				$(this).children("ul").slideDown("fast");
			}
		});

		$(document).on("click", ".card", game.card_click);
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
		$.growl.warning({
			title: "DECK EMPTY",
			message: "There are no more cards left",
			location: "br"
		});
		var compCard = game.computer.hand;
		var playCard = game.player.hand;
		if (compCard[0].point < playCard[0].point) {
			$.growl.notice({
				title: "DECK EMPTY",
				message: "You have a higher Card",
				location: "br"
			});
			setTimeout(game.win, game.COMPUTER_DELAY);
		} else if (compCard[0].point > playCard[0].point) {
			$.growl.error({
				title: "DECK EMPTY",
				message: "The computer has a higher Card",
				location: "br"
			});
			setTimeout(game.lose, game.COMPUTER_DELAY);
		} else if (compCard[0].point == playCard[0].point) {
			$.growl.warning({
				title: "TIE BREAKER",
				message: "You guys have the same card!",
				location: "br"
			});
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
			$.growl.notice({
				title: "TIE BREAKER",
				message: "YOU WIN!!",
				location: "br"
			});
			setTimeout(game.win, game.COMPUTER_DELAY);
		} else {
			$.growl.error({
				title: "TIE BREAKER",
				message: "YOU LOSE",
				location: "br"
			});
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
		var cardDrawn = game.computer.drawCard();
		if (cardDrawn) {
			game.update_display();
			var hand = game.computer.hand;
			var card;
			//if the first card is countess
			if (hand[0].point == 7) {
				//second card is either a prince or a king
				if (hand[1].point == 5 || hand[1].point == 6) {
					card = hand[0];
				} else if (hand[0].point < hand[1].point) {
					card = hand[0];
				} else {
					card = hand[1];
				}
				//if the second card is a countess 
			} else if (hand[1].point == 7) {
				//checks to see if it is a prince or king
				if (hand[0].point == 5 || hand[0].point == 6) {
					card = hand[1];
				} else if (hand[0].point < hand[1].point) {
					card = hand[0];
				} else {
					card = hand[1];
				}
				//else just pick the card that is the lower card
			} else if (hand[0].point < hand[1].point) {
				card = hand[0];
			} else {
				card = hand[1];
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
		$.growl.notice({
			title: "Your Turn",
			message: "It is now your turn!",
			location: "br"
		});
		game.playerTurn = true;

	};

	//Game pauses as a colorbox is up
	game.hide_guess = function() {
		game.paused = false;
	};

	//Logic of when a guard is used and checks eachothers hand
	game.guessCard = function(card) {
		console.log("Guess a " + card);
		$.colorbox.close();
		if (game.playerTurn == true) {
			if (game.computer.hand[0].type == card && game.computer.handmaid == false) {
				$.growl.notice({
					title: "Guard",
					message: "The Computer has a " + card + "! You WON!!!!!",
					location: "br"
				});
				setTimeout(game.win, game.COMPUTER_DELAY);
			} else {
				$.growl.error({
					title: "Guard",
					message: "The Computer does not have a " + card + "!",
					location: "br"
				});
				setTimeout(game.computer_turn, game.COMPUTER_DELAY);
			}
		} else {
			$.growl.warning({
				title: "Guard",
				message: "Computer used a Guard and guessed a " + card + ".",
				location: "br"
			});
			if (game.player.hand[0].type == card && game.player.handmaid == false) {
				$.growl.error({
					title: "Guard",
					message: "You have a " + card + "! You Lose!!!!!",
					location: "br"
				});
				setTimeout(game.lose, game.COMPUTER_DELAY);
			} else if (game.player.handmaid == true) {
				$.growl.notice({
					title: "Active Handmaid",
					message: "You have an active handmaid",
					location: "br"
				});
				setTimeout(game.begin_turn, 3000);
			} else {
				setTimeout(game.begin_turn, 3000);
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
				title: "Game is paused."
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
			if (game.computer.handmaid == true) {
				$.growl.warning({
					title: "Active Handmaid",
					message: "Computer has a handmaid active.",
					location: "br"
				});
				setTimeout(game.computer_turn, 3000);
			} else {
				var f = function() {
					game.showCard("Priest");
				}
				setTimeout(f, 1000);
			}
		} else {
			$.growl.error({
					title: "Baron",
					message: "The computer just played a baron",
					location: "br"
				});
			if (game.player.handmaid == true) {
				$.growl.notice({
					title: "Active Handmaid",
					message: "You have a handmaid active.",
					location: "br"
				});
				setTimeout(game.begin_turn, 3000);
			} else {
				$.growl.error({
					title: "Baron",
					message: "You just showed your card to the computer",
					location: "br"
				});
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
			if (game.computer.handmaid == true) {
				$.growl.warning({
					title: "Active Handmaid",
					message: "The computer has an active handmaid",
					location: "br"
				});
				setTimeout(game.computer_turn, 3000);
			} else {
				var f = function() {
					game.showCard("Baron");
				}
				setTimeout(f, 1000);
			}
		} else {
			$.growl.warning({
					title: "Baron",
					message: "The computer has played a Baron",
					location: "br"
			});
			if (game.player.handmaid == true) {
				$.growl.notice({
					title: "Handmaid",
					message: "You have an active Handmaid",
					location: "br"
				});
				setTimeout(game.begin_turn, 3000);
			} else {
				$.growl.warning({
					title: "Baron",
					message: "Computer is playing a Baron",
					location: "br"
				});
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
			setTimeout(game.computer_turn, 2000);
		} else {
			game.computer.handmaid = true;
			$.growl.error({
				title: "Handmaid",
				message: "The computer has played a Handmaid",
				location: "br"
			});
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
					title: "Who would you like to Prince?"
				});
			} else {
				$.colorbox({
					href: "PlayPrince.php",
					onClosed: game.hide_guess,
					title: "Who would you like to Prince?"
				});
			}
		} else {
			$.growl.error({
				title: "Prince",
				message: "The computer is Playing a Prince",
				location: "br"
			});
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
			game.lose();
		} else {
			$.growl.error({
				title: "Princess",
				message: "The computer is Playing a Princess",
				location: "br"
			});
			game.win();
		}
	}

	//Applies Princess
	game.applyCountess = function() {
		if (game.playerTurn == true) {
			setTimeout(game.computer_turn, game.COMPUTER_DELAY);
		} else {
			$.growl.error({
				title: "Countess",
				message: "The computer has played a Countess",
				location: "br"
			});
			setTimeout(game.begin_turn, 4000);

		}
	}

	//Applies king
	game.applyKing = function() {
		//console.log("apply king");
		if (game.playerTurn == true) {
			if (game.computer.handmaid == false) {
				$.growl.notice({
					title: "King",
					message: "You traded Cards with the computer",
					location: "br"
				});
				var playerCard = game.player.hand[0];
				var compCard = game.computer.hand[0];
				game.player.kinged(compCard);
				game.computer.kinged(playerCard);
				game.update_display();
				setTimeout(game.computer_turn, 4000);
			} else {
				$.growl.warning({
					title: "Active Handmaid",
					message: "The computer has an active handmaid",
					location: "br"
				});
				setTimeout(game.computer_turn, 4000);
			}
		} else {
			$.growl.error({
				title: "King",
				message: "The computer is Playing a King",
				location: "br"
			});
			if (game.player.handmaid == false) {
				$.growl.error({
					title: "King",
					message: "You traded Cards with the computer",
					location: "br"
				});
				var playerCard = game.player.hand[0];
				var compCard = game.computer.hand[0];
				game.player.kinged(compCard);
				game.computer.kinged(playerCard);
				game.update_display();
				setTimeout(game.begin_turn, 4000);
			} else {
				$.growl.notice({
					title: "Active Handmaid",
					message: "You have an active handmaid",
					location: "br"
				});
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
				$.growl.error({
					title: "Princed",
					message: "You have been princed and were forced to discard the Princess",
					location: "br"
				});
				setTimeout(game.lose, 4000);
			} else if (game.playerTurn == true) {

				setTimeout(game.computer_turn, 4000);
			} else {
				$.growl.error({
					title: "Princed",
					message: "You have been princed",
					location: "br"
				});
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
			$.growl.notice({
				title: "Princed",
				message: "The computer has been princed and was forced to discard the Princess",
				location: "br"
			});
			setTimeout(game.win, 4000);
		}
		if (game.playerTurn == true) {
			//$.growl.notice({ title: "Princed", message: "You have Princed yourself", location: "br" });
			setTimeout(game.computer_turn, 4000);
		} else {
			$.growl.error({
				title: "Princed",
				message: "The computer Princed themeself",
				location: "br"
			});
			setTimeout(game.begin_turn, 4000);
		}

	}

	game.display_decksize = function() {
		var $deck = $(".deck .deckSize");
		$deck.empty();
		var deckSize;

		if (game.deck.deckSize() <= game.deck.deckSize()) {

			deckSize = game.deck.deckSize();
		} else {
			deckSize = game.deck.deckSize();
		}

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
					console.log(hand[i]);
				} else {
					//$hand.append('<li><img src="./images/backgroundCard.jpg" alt="Card Back"/></li>');
					$hand.append(hand[i].template());

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
	
	game.lose = function() {
		game.compWins = game.compWins + 1;
		$.colorbox({
			href: "./images/lose.jpg",
			onClosed: game.reset,
			title: "You have lost this round"
		});
	}
	
	game.win = function() {

		game.playerWins = game.playerWins + 1;
		$.colorbox({
			href: "./images/won.jpg",
			onClosed: game.reset,
			title: "You have won this round"
		});

	}
	game.init();
});