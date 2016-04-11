
function Player() {
    this.hand = [];
	this.justPlayed = [];
	this.tokens;
	this.handmaid = false;

    
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
		//console.log(this);
        return game.deck.drawCard(this);
    };

    // Get player hand size
    this.handSize = function() {
        return this.hand.length;
    }
	
	this.princed = function() {
		var card = this.hand[0];
		this.justPlayed.push(card);
		this.hand.splice(0, 1);
		this.drawCard();
	}
	
	this.kinged = function(card) {
		this.hand[0]=card;
	}

    // Play a card, return card if successful and false if not
    this.playCard = function(id) {
		console.log("Play card");
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
	
	this.justPlayedTotal = function(){
		var total;
		for ( i = 0; i<this.justPlayed.length; i++){
			total= this.justPlayed[i].point+total;
		}
		return total;
	}

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
		else if (card.type === "Handmaid") {
			console.log("Player apply handmaid");
            game.applyHandmaid();
        }
		else if (card.type === "Prince") {
			console.log("Player apply Prince");
            game.applyPrince();
        }
		else if (card.type === "King") {
			console.log("Player apply King");
            game.applyKing();
        }
    };


    this.init();
};

