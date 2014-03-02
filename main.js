var express = require('express');
var app = express();
app.use(express.static(__dirname + '/static'));
app.use(express.urlencoded());
var mustache = require('mustache');
var decks = require('./24.js');
var fs = require('fs');

var deck = decks();
var deal = deck.deal(); // should always exist
var score = 0;
var message = "";
// Maybe using request-response instead of a socket is a bad idea

app.get('/', function (req, res) {
    var template = fs.readFileSync(__dirname + '/24.html', 'utf8');
    var output = mustache.to_html(template, {
        "card1": deal[0],
        "card2": deal[1],
        "card3": deal[2],
        "card4": deal[3],
        "score": score,
        "message": message
    });
    // reset message after first display
    message = "";
    res.send(output);
});

var math = require("mathjs")();
function correctSum (expression) {
    // TODO make sure it matches last deal of deck
    try {
        return math.eval(expression) === 24;
    } catch (e) {
        // Hopefully, only gets here on parse errors
        console.log("Parse error " + expression);
        return false;
    }
}

function validated (expression) {
    // TODO actually make this work right and not be stupid
    var counts = [0,0,0,0,0,0,0,0,0,0];
    var truecounts = [0,0,0,0,0,0,0,0,0,0];
    for (var i = 0; i < deal.length; i++) {
        truecounts[deal[i] % 10] += 1;
        if (deal[i] >= 10) {
            truecounts[1] += 1;
        }
    }
    var t = "";
    for (var i = 0; i < expression.length; i++) {
        try {
            var t = parseInt(expression[i], 10);
            counts[t] += 1;
        } catch (e) {
            return false;
        }
    }
    for (var i = 0; i < 10; i++) {
        if (counts[i] !== truecounts[i]) {
            return false;
        }
    }
    return true;
}

app.post('/verify', function (req, res) {
    // assume this works (such awful, much fail)
    var expression = req.body.expression;
    if (!validated(expression)) {
        console.log("Failed validation");
        message = "Expression did not validate (did you use every number once? Is your expression correct?)";
    } else if (validated(expression) && correctSum(expression)) {
        console.log("Correct, dealing new set");
        score += 1
        deal = deck.deal();
        if (deal === undefined) {
            // happens only when deck is out
            deck = decks();
            deal = deck.deal();
        }
    } else {
        message = "Sum is not 24";
    }
    res.redirect("/");
});

app.listen(3000);
console.log("Server running on port 3000");