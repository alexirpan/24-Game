var express = require('express');
var app = express();
app.use(express.static(__dirname + '/static'));
app.use(express.urlencoded());
var mustache = require('mustache');
var decks = require('./24.js');
var fs = require('fs');

var deck = decks();
var deal = deck.deal(); // should always exist
// Maybe using request-response instead of a socket is a bad idea

app.get('/', function (req, res) {
    var template = fs.readFileSync(__dirname + '/24.html', 'utf8');
    var output = mustache.to_html(template, {
        "card1": deal[0],
        "card2": deal[1],
        "card3": deal[2],
        "card4": deal[3],
    });
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

app.post('/verify', function (req, res) {
    // assume this works (such awful, much fail)
    var expression = req.body.expression;
    if (correctSum(expression)) {
        console.log("Correct, dealing new set");
        deal = deck.deal();
        if (deal === undefined) {
            // happens only when deck is out
            deck = decks();
            deal = deck.deal();
        }
    }
    res.redirect("/");
});

app.listen(3000);
console.log("Server running on port 3000");