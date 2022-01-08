suits = {
  0: 'spades',
  1: 'hearts',
  2: 'clubs',
  3: 'diamonds'
}
values = {
  1: 'A',
  11: 'J',
  12: 'Q',
  13: 'K'
}
imgValuesMap = {
  'A': 'ace',
  'J': 'king',
  'Q': 'queen',
  'K': 'king'
}

class Player {
  constructor(){
    this.hand = []
    this.splitHand = []
    this.splitHandTemp = '' //carries the split card
  }

  draw(card){
    this.hand.push(card)
  }

  reset(){
    this.hand = []
  }
}

class Card {
  constructor(val, suit){
    this.val = val;
    this.suit = suit;
    this.pos = 'up';
    this.img = `${imgValuesMap[val] || val}_of_${suit}.png`;
  }
}

class Deck {
  constructor(){
    this.deck = []
    //suits
    for (let decks = 0; decks < 4; decks++){
      for (let i = 1; i < 14; i++){
        for (let j = 0; j < 4; j++){
          this.deck.push(new Card(values[i] || i, suits[j]))
        }
      }
    }
  }

  draw(pos){
    const randomIndex = Math.floor(Math.random() * (this.deck.length));
    let card = this.deck.splice(randomIndex, 1);
    card[0].pos = pos
    return card[0];
  }

  reset(){
    // deck resets at ~2 decks left
    if (this.deck.length < 100){
      this.deck = []
      //suits
      for (let decks = 0; decks < 4; decks++){
        for (let i = 1; i < 14; i++){
          for (let j = 0; j < 4; j++){
            this.deck.push(new Card(values[i] || i, suits[j]))
          }
        }
      }
    }
  }
}