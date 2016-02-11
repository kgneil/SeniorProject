// Base Card class
function Card(id, point) {
    this.id = id;
    this.point = point;
};

// Spell Card class
function GuardCard(id, point) {
    Card.call(this, id, point);
    this.type = "Guard";
};

// Subclass SpellCard under Card
GuardCard.prototype = Object.create(Card.prototype);
GuardCard.prototype.constructor = GuardCard;

// Add description function to Spellcard for making card description
GuardCard.prototype.description = function() {
    return "<p>Name a non-Guard card and choose a player</p><p>If that player has that card,</p><p>he or she is out of the round</p>";
}

// Add template function to SpellCard for generating html for this card
GuardCard.prototype.template = function() {
    var template =  '<li>' +
                    '<div class="card" data-id="' + this.id + '">' +
                    '<h4>1</h4>' + 
                    '<header>' + this.type + '</header>' +
                    '<p class="desc">' + this.description() + '</p>' +
                    '</div>' +
                    '</li>';

    return template;
}

// Heal Card class
function PriestCard(id, point) {
    Card.call(this, id, point);
	this.point=point;
    this.type = "Priest";
};

// Subclass HealCard under Card
PriestCard.prototype = Object.create(Card.prototype);
PriestCard.prototype.constructor = PriestCard;

// Add type property to HealCard
//HealCard.prototype.type = "Heal";

// Add description function to Healcard for making card description
PriestCard.prototype.description = function() {
    return "Look at another player's hand.";
}

// Add template function to HealCard for generating html for this card
PriestCard.prototype.template = function() {
    var template =  '<li>' +
                    '<div class="card" data-id="' + this.id + '">' +
                    '<h4>2</h4>' + 
                    '<header>' + this.type + '</header>' +
                    '<p class="desc">' + this.description() + '</p>' +
                    '</div>' +
                    '</li>';

    return template;
}
