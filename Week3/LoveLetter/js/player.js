
function Player() {
    this.hand = [];
    this.deck = [];

    // Initial player setup and deck setup
    this.init = function() {
        // Set up initial decks and such
        var Guards = [1,1,1,1,1];
        var Priests = [2,2];

        for (i = 0; i < Guards.length; i++) {
            this.deck.push(new GuardCard(i+1, Guards[i], Guards[i])); // Spell cards currently cost the same as the damage they deal
        }

        for (i = 0; i < Priests.length; i++) {
            this.deck.push(new PriestCard(i+21, Priests[i], Priests[i])); // Heal cards currently cost the same as the health they heal
        }

        // Shuffle the deck
        this.shuffle();

        // Deal three cards from deck into hand
        this.hand = this.deck.splice(0, 1);
		
    };



    // Draw a card, return true if successful and false if no cards to draw
    this.drawCard = function() {
        if (this.deck.length === 0) {
            return false; // Deck empty, cannot draw
        } else {
            var card = this.deck.shift(); // Remove card

            if (this.hand.length < 2) {
                this.hand.push(card); // Add card if less than 5 cards in hand
            }
            return true; // Card successfully drawn
        }
    };

    // Get player deck size
    this.deckSize = function() {
        return this.deck.length;
    }
	
	this.drawCard = function() {
        if (this.deck.length === 0) {
            return false; // Deck empty, cannot draw
        } else {
            var card = this.deck.shift(); // Remove card

            if (this.hand.length < 5) {
                this.hand.push(card); // Add card if less than 5 cards in hand
            }

            return true; // Card successfully drawn
        }
    };

    // Get player hand size
    this.handSize = function() {
        return this.hand.length;
    }

    // Play a card, return card if successful and false if not
    this.playCard = function(id) {
		var idx = -1;
        // Find index of card, if in hand
        for (i = 0; i < this.hand.length; i++) {
            if (this.hand[i].id === id) {
                idx = i;
                break;
            }
        }

        // If not found return false
        if (idx === -1) {
            return false;
        } else {
            var card = this.hand[idx];
            this.hand.splice(idx, 1); // Remove card from hand
            return card;
            
        }
    };

    // Apply card to player
    this.applyCard = function(card) {
		// Take card and apply it depending on type
        if (card.type === "Guard") {
            game.applyGuard();
        } else if (card.type === "Priest") {
            
        }
    };
	

	
    // Shuffle deck
    this.shuffle = function() {  
      var currentIndex = this.deck.length, temporaryValue, randomIndex ;

      // While there remain elements to shuffle...
      while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = this.deck[currentIndex];
        this.deck[currentIndex] = this.deck[randomIndex];
        this.deck[randomIndex] = temporaryValue;
      }
    };


    this.init();
};

