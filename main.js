var express = require('express');
var app = express();
var mustache = require('mustache');
var decks = require('./24.js');
var fs = require('fs');

var deck = decks();

app.get('/', function (req, res) {
    var deal;
    while (deal === undefined) {
        deal = deck.deal();
        if (deck.gameDone()) {
            deck = decks();
            console.log("new deck");
        }
    }
    var template = fs.readFileSync(__dirname + '/24.html', 'utf8');
    var output = mustache.to_html(template, {
        "card1": deal[0],
        "card2": deal[1],
        "card3": deal[2],
        "card4": deal[3],
    });
    res.send(output);
});

app.post('/verify', function (req, res) {

});

app.listen(3000);
console.log("Server running on port 3000");