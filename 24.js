var mathjs = require('mathjs'), math = mathjs();

function GameState() {
    // holds game state and game logic
    this.time = 0;
    this.score = 0;
}

GameState.prototype.solvable = function(nums) {
    if (nums.length == 1) {
        return Math.round(nums[0]) === 24;
    }
    for (var i = 0; i < nums.length - 1; i++) {
        for (var j = i+1; j < nums.length; j++) {
            var next = nums.slice(0);
            var a = next.splice(i, 1)[0];
            var b = next.splice(j-1, 1)[0];
            // Add
            next.push(a + b);
            if (this.solvable(next)) {
                return true;
            }
            // Subtract
            next.splice(next.length-1, 1);
            next.push(a - b);
            if (this.solvable(next)) {
                return true;
            }
            next.splice(next.length-1, 1);
            next.push(b - a);
            if (this.solvable(next)) {
                return true;
            }
            // Mul
            next.splice(next.length-1, 1);
            next.push(a * b);
            if (this.solvable(next)) {
                return true;
            }
            // Div
            next.splice(next.length-1, 1);
            if (a !== 0) {
                next.push(b / a);
                if (this.solvable(next)) {
                    return true;
                }
                next.splice(next.length-1, 1);
            }
            if (b !== 0) {
                next.push(a / b);
                if (this.solvable(next)) {
                    return true;
                }
            }
        }
    }
    return false;
}


function Deck() {
    this.cards = [];
    for (var i = 0; i < 52; i++) {
        this.cards[i] = Math.floor(i / 4) + 1;
    }
}

Deck.prototype.shuffle = function() {
    for (var i = this.cards.length - 1; i >= 0; i--) {
        var j = Math.floor(Math.random() * i);
        var temp = this.cards[i];
        this.cards[i] = this.cards[j];
        this.cards[j] = temp;
    }
}

var logic = new GameState();

Deck.prototype.deal = function() {
    this.shuffle(); // TODO is this needed?
    for (var i = 0; i < this.cards.length-3; i++) {
        for (var j = i+1; j < this.cards.length-2; j++) {
            for (var k = j+1; k < this.cards.length-1; k++) {
                for (var l = k+1; l < this.cards.length; l++) {
                    if (logic.solvable([this.cards[i], this.cards[j], this.cards[k], this.cards[l]])) {
                        // remove cards
                        var card1 = this.cards.splice(i, 1)[0];
                        var card2 = this.cards.splice(j-1, 1)[0];
                        var card3 = this.cards.splice(k-2, 1)[0];
                        var card4 = this.cards.splice(l-3, 1)[0];
                        this.prevDeal = [card1, card2, card3, card4];
                        return this.prevDeal;
                    }
                }
            }
        }
    }
    this.done = true;
}

Deck.prototype.gameDone = function() {
    return this.done;
}

// on import return deck engine
var deckMaker = module.exports = function() {
    return new Deck();
}