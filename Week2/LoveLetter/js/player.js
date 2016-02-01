
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

            if (this.hand.length < 5) {
                this.hand.push(card); // Add card if less than 5 cards in hand
            }
            return true; // Card successfully drawn
        }
    };

    // Get player deck size
    this.deckSize = function() {
        return this.deck.length;
    }

    // Get player hand size
    this.handSize = function() {
        return this.hand.length;
    }

    // Play a card, return card if successful and false if not
    this.playCard = function(id) {
      
    };

    // Apply card to player
    this.applyCard = function(card) {

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

