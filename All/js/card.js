function Card(id, point) {
    this.id = id;
    this.point = point;
};

function GuardCard(id, point) {
    Card.call(this, id, point);
	this.id=id;
    this.type = "Guard";
};

GuardCard.prototype = Object.create(Card.prototype);
GuardCard.prototype.constructor = GuardCard;

GuardCard.prototype.description = function() {
    return "Name a non-Guard card and choose a player, if that player has that card, he or she is out of the round.";
}

GuardCard.prototype.template = function() {
    var template =  '<li>' +
                    '<div class="card" data-id="' + this.id + '">' +
                    '<h4>1</h4>' + 
                    '<header>' + this.type + '</header>' +
					'<img src="./images/GuardPerson.png" alt="Guard">' +
                    '<p class="desc">' + this.description() + '</p>' +
                    '</div>' +
                    '</li>';

    return template;
}

function PriestCard(id, point) {
    Card.call(this, id, point);
	this.point=point;
	this.id=id;
    this.type = "Priest";
};

PriestCard.prototype = Object.create(Card.prototype);
PriestCard.prototype.constructor = PriestCard;

PriestCard.prototype.description = function() {
    return "Look at another player's hand.";
}

PriestCard.prototype.template = function() {
    var template =  '<li>' +
                    '<div class="card" data-id="' + this.id + '">' +
                    '<h4>2</h4>' + 
                    '<header>' + this.type + '</header>' +
					'<img src="./images/PriestPerson.png" alt="Guard" style="height:110px;">' +
                    '<p class="desc">' + this.description() + '</p>' +
                    '</div>' +
                    '</li>';

    return template;
}

function BaronCard(id, point) {
    Card.call(this, id, point);
	this.id=id;
    this.type = "Baron";
};

BaronCard.prototype = Object.create(Card.prototype);
BaronCard.prototype.constructor = BaronCard;

BaronCard.prototype.description = function() {
    return "You and another player secretly compare hands. The player with the lower value looses.";
}

BaronCard.prototype.template = function() {
    var template =  '<li>' +
                    '<div class="card" data-id="' + this.id + '">' +
                    '<h4>3</h4>' + 
                    '<header>' + this.type + '</header>' +
					'<img src="./images/BaronPerson.png" alt="Baron" style="height:110px;">' +
                    '<p class="desc">' + this.description() + '</p>' +
                    '</div>' +
                    '</li>';

    return template;
}

function HandmaidCard(id, point) {
    Card.call(this, id, point);
	this.id=id;
    this.type = "Handmaid";
};

HandmaidCard.prototype = Object.create(Card.prototype);
HandmaidCard.prototype.constructor = HandmaidCard;

HandmaidCard.prototype.description = function() {
    return "Until your next turn, ignore all effects from other players' cards.";
}

HandmaidCard.prototype.template = function() {
    var template =  '<li>' +
                    '<div class="card" data-id="' + this.id + '">' +
                    '<h4>4</h4>' + 
                    '<header>' + this.type + '</header>' +
					'<img src="./images/'+this.type+'Person.png" alt="'+this.type+'" style="width:90px;height:110px;">' +
                    '<p class="desc">' + this.description() + '</p>' +
                    '</div>' +
                    '</li>';

    return template;
}

function PrinceCard(id, point) {
    Card.call(this, id, point);
	this.id=id;
    this.type = "Prince";
};

PrinceCard.prototype = Object.create(Card.prototype);
PrinceCard.prototype.constructor = PrinceCard;

PrinceCard.prototype.description = function() {
    return "Choose any player (including yourself) to discard his or her hand and draw a new card.";
}

PrinceCard.prototype.template = function() {
    var template =  '<li>' +
                    '<div class="card" data-id="' + this.id + '">' +
                    '<h4>5</h4>' + 
                    '<header>' + this.type + '</header>' +
					'<img src="./images/'+this.type+'Person.png" alt="'+this.type+'" style="height:100px;">' +
                    '<p class="desc">' + this.description() + '</p>' +
                    '</div>' +
                    '</li>';

    return template;
}

function KingCard(id, point) {
    Card.call(this, id, point);
	this.id=id;
    this.type = "King";
};

KingCard.prototype = Object.create(Card.prototype);
KingCard.prototype.constructor = KingCard;

KingCard.prototype.description = function() {
    return "Trade Hands with another player";
}

KingCard.prototype.template = function() {
    var template =  '<li>' +
                    '<div class="card" data-id="' + this.id + '">' +
                    '<h4>6</h4>' + 
                    '<header>' + this.type + '</header>' +
					'<img src="./images/'+this.type+'Person.png" alt="'+this.type+'" style="height:115px;">' +
                    '<p class="desc">' + this.description() + '</p>' +
                    '</div>' +
                    '</li>';

    return template;
}

function CountessCard(id, point) {
    Card.call(this, id, point);
	this.id=id;
    this.type = "Countess";
};

CountessCard.prototype = Object.create(Card.prototype);
CountessCard.prototype.constructor = CountessCard;

CountessCard.prototype.description = function() {
    return "If you have this card and the King or Prince in your hand, you must discard this card";
}

CountessCard.prototype.template = function() {
    var template =  '<li>' +
                    '<div class="card" data-id="' + this.id + '">' +
                    '<h4>7</h4>' + 
                    '<header>' + this.type + '</header>' +
					'<img src="./images/'+this.type+'Person.png" alt="'+this.type+'">' +
                    '<p class="desc">' + this.description() + '</p>' +
                    '</div>' +
                    '</li>';

    return template;
}

function PrincessCard(id, point) {
    Card.call(this, id, point);
	this.id=id;
    this.type = "Princess";
};

PrincessCard.prototype = Object.create(Card.prototype);
PrincessCard.prototype.constructor = PrincessCard;

PrincessCard.prototype.description = function() {
    return "If you discard this card, you lose.";
}

PrincessCard.prototype.template = function() {
    var template =  '<li>' +
                    '<div class="card" data-id="' + this.id + '">' +
                    '<h4>8</h4>' + 
                    '<header>' + this.type + '</header>' +
					'<img src="./images/'+this.type+'Person.png" alt="'+this.type+'" style="height:115px;">' +
                    '<p class="desc">' + this.description() + '</p>' +
                    '</div>' +
                    '</li>';

    return template;
}