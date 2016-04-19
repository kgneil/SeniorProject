function Deck() {
    this.hand = [];
	this.deck = [];
	this.computerGuesses = [];
	this.unknown = [];
    
    this.init = function() {
        
        var Guards = 5;
        var Priests = 2;
		var Barons = 2;
		var Handmaid = 2;
		var Prince = 2;
		var King = 1;
		var Countess = 1;
		var Princess = 1;
		var id = -1;
		
        for (i = 0; i < Guards; i++) {
			id=id+1;
            this.deck.push(new GuardCard(id, 1, 1)); 
        }

        for (i = 0; i < Priests; i++) {
			id=id+1;
            this.deck.push(new PriestCard(id, 2, 2));
        }
		
		for (i = 0; i < Barons; i++) {
			id=id+1;
            this.deck.push(new BaronCard(id, 3, 3));
        }
		
		for (i = 0; i < Handmaid; i++) {
			id=id+1;
           this.deck.push(new HandmaidCard(id, 4, 4));
        }
		
		for (i = 0; i < Prince; i++) {
			id=id+1;
           this.deck.push(new PrinceCard(id, 5, 5));
        }
		
		for (i = 0; i < King; i++) {
			id=id+1;
            this.deck.push(new KingCard(id, 6, 6)); 
        }
		
		for (i = 0; i < Countess; i++) {
			id=id+1;
            this.deck.push(new CountessCard(id, 7, 7)); 
        }
		
		for (i = 0; i < Princess; i++) {
			id=id+1;
            this.deck.push(new PrincessCard(id, 8, 8)); 
        }

        this.shuffle();
    };
	
	this.getHand = function(){
		return this.deck.splice(0, 1);
	}
	
	this.print = function() {
		console.log("DECK" );
		var size = this.deck.length;
		for (var i = 0; i < size; i++) {
			console.log("this.deck["+i+"].type: "+this.deck[i].type );
			console.log("this.deck["+i+"].id: "+this.deck[i].id );
		}
	}


    // Draw a card, return true if successful and false if no cards to draw
    this.drawCard = function(player) {
		//this.print();
        if (this.deck.length === 0) {
			game.deckEmpty();
            return false; // Deck empty, cannot draw
        } else {
            var card = this.deck.shift(); // Remove card
			//console.log(player.hand.length);
            if (player.hand.length < 2) {
                player.hand.push(card); // Add card if less than 5 cards in hand
            }
            return true; // Card successfully drawn
        }
    };

    // Get player deck size
    this.deckSize = function() {
		return this.deck.length;
    }
	
	
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
	  	this.unknown.push(this.deck.splice(0, 1));
		this.unknown.push(this.deck.splice(0, 1));
		this.unknown.push(this.deck.splice(0, 1));
		this.unknown.push(this.deck.splice(0, 1));	
    };
	
	this.getUnknown = function(){
		//console.log(this.unknown[1]);
		return this.unknown;
	}
	
	this.computerGuess = function() {
		var size = this.deck.length;
		for (var i = 0; i < size; i++) {
			if(this.deck[i].point==1){
				//nothing
			}
			else{
				this.computerGuesses.push(this.deck[i].point);
			}
		}
		var userCard = game.player.hand[0].point;
		this.computerGuesses.push(userCard);
		console.log(this.computerGuesses);
		return this.computerGuesses;
	}

    this.init();
};

