
function Player() {
    this.hand = [];
	this.justPlayed = [];
	this.tokens;

    
    this.init = function() {        
		this.dealCards();
    };

	 this.dealCards = function() {
		 this.hand = game.deck.getHand();
	 }

	this.tokenSize = function() {
        return this.token;
    }
	
	this.playedSize = function() {
        return this.justPlayed.length;
    }
	
	this.drawCard = function() {
		console.log(this);
        return game.deck.drawCard(this);
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
			this.justPlayed.push(card);
            return card;
            
        }
    };
	

    // Apply card to player
    this.applyCard = function(card) {
		// Take card and apply it depending on type
        if (card.type === "Guard") {
            game.applyGuard();
        } else if (card.type === "Priest") {
			console.log("Player apply priest");
            game.applyPriest();
        }
		else if (card.type === "Baron") {
			console.log("Player apply Baron");
            game.applyBaron();
        }
    };


    this.init();
};

