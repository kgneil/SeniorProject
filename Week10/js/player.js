
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
	 
	this.computerGuess = function() {
		return game.deck.computerGuess();
	}
	
	this.getCard = function() {
		return this.hand[0];
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
	
	this.otherCard = function(card) {
		if(this.hand[0].id == card.id){
			return this.hand[1].type;
		}
		else{
			return this.hand[0].type;
		}
	}
	
    // Get player hand size
    this.handSize = function() {
        return this.hand.length;
    }
	
	this.princed = function() {
		var card = this.hand[0];
		this.justPlayed.push(card);
		this.hand.splice(0, 1);
		this.drawCard();
		//TODO: if you end it and there are no more cards take the unknown
	}
	
	this.kinged = function(card) {
		this.hand[0]=card;
	}
	
	this.isPlayable = function(card) {
		console.log("card.type "+card.type);
		if (card.type=="King" || card.type=="Prince"){
			var other = this.otherCard(card);
			if(other=="Countess"){
				return false;
			}
			else{
				return true;
			}
		}
		else{
			return true;
		}
	}
	
    // Play a card, return card if successful and false if not
    this.playCard = function(id) {
		//console.log("Play card");
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
			var playable=this.isPlayable(card);
			if(playable){
				this.hand.splice(idx, 1); // Remove card from hand
				this.justPlayed.push(card);
				return card;
			}
			else{
				$.growl.error({ title: "Countess", message: "You Need to Play the countess", location: "br" });
				return false;
			}
            
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
		console.log(card);
		
        if (card.type === "Guard") {
            game.applyGuard();
        } else if (card.type === "Priest") {
            game.applyPriest();
        }
		else if (card.type === "Baron") {
            game.applyBaron();
        }
		else if (card.type === "Handmaid") {
            game.applyHandmaid();
        }
		else if (card.type === "Prince") {
            game.applyPrince();
        }
		else if (card.type === "King") {
            game.applyKing();
        }
		else if (card.type === "Countess") {
			game.applyCountess();
        }
		else if (card.type === "Princess") {
            game.applyPrincess();
        }
    };


    this.init();
};

