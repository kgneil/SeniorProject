function Deck() {
    this.hand = [];
	this.deck = [];

    
    this.init = function() {
        
        var Guards = [1,1,1,1,1];
        var Priests = [2,2];
		var Barons = [3,3];
		var Handmaid = [4,4];
		var Prince = [5,5];
		var King = [6];

        for (i = 0; i < Guards.length; i++) {
            this.deck.push(new GuardCard(i, Guards[i], Guards[i])); 
        }

        for (i = 0; i < Priests.length; i++) {
            this.deck.push(new PriestCard(i+5, Priests[i], Priests[i]));
        }
		
		for (i = 0; i < Barons.length; i++) {
            this.deck.push(new BaronCard(i+7, Barons[i], Barons[i]));
        }
		
		for (i = 0; i < Handmaid.length; i++) {
           this.deck.push(new HandmaidCard(i+9, Handmaid[i], Handmaid[i]));
        }
		
		for (i = 0; i < Prince.length; i++) {
           this.deck.push(new PrinceCard(i+11, Prince[i], Prince[i]));
		   var p = i+11;
		   console.log(p);
        }
		
         this.deck.push(new KingCard(13, King[0], King[0]));
        


        this.shuffle();
    };
	
	this.getHand = function(){
		return this.deck.splice(0, 1);
	}


    // Draw a card, return true if successful and false if no cards to draw
    this.drawCard = function(player) {
		//console.log("deck: "+this.deck);
        if (this.deck.length === 0) {
			game.deckEmpty();
            return false; // Deck empty, cannot draw
        } else {
            var card = this.deck.shift(); // Remove card
			console.log(player.hand.length);
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
    };


    this.init();
};

