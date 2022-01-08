const evalPokerHand = (amount) => {
  // Flush – Three cards in the same suit
  // Straight – Three cards of consecutive values, such as 2-3-4. Aces can be high or low
  // Three of a kind – Three cards of the same value/face card
  // Straight flush – Three cards of consecutive values that are all in the same suit
  // Suited three of a Kind – Three cards of the same value/face card and the same suit
  const [ A, B, C ] = [ player.hand[0], player.hand[1], dealer.hand[1] ]
  const consec = consecutiveCheck(valuesReverse[A.val] || A.val, valuesReverse[B.val] || B.val, valuesReverse[C.val] || C.val)
  if (A.suit == B.suit && B.suit == C.suit && A.val == B.val && B.val == C.val){
    message = 'suited three of a kind 100x win'
    payout = 100 * amount
  } else if (consec && A.suit == B.suit && B.suit == C.suit) {
    message = 'straight flush 40x win'
    payout = 40 * amount
  } else if (A.val == B.val && B.val == C.val){
    message = 'three of a kind 30x win'
    payout = 30 * amount
  } else if (consec){
    message = 'straight 10x win'
    payout = 10 * amount
  } else if (A.suit == B.suit && B.suit == C.suit){
    message = 'flush 5x win'
    payout = 5 * amount
  } else {
    message = 'lose'
    payout = 0
  }
}

const evalPerfectPair = (amount) => {
  // Mixed pair = same number/face card value, different suit and colour
  // Coloured pair = same number/face card value, same colour, different suit 
  // Perfect pair = same number/face card value, same colour, same suit
  if (player.hand[0].val == player.hand[1].val && player.hand[0].suit == player.hand[1].suit){
    message = 'perfect pair 30x win'
    payout += 30 * amount
  } else if (player.hand[0].val == player.hand[1].val && colour[player.hand[0].suit] == colour[player.hand[1].suit]){
    message = 'colour pair 10x win'
    payout += 10 * amount
  } else if (player.hand[0].val == player.hand[1].val){
    message = 'mixed pair 5x win'
    payout += 5 * amount
  } else {
    message = 'no perfect pair'
    payout = 0
  }
}

const buyInsurance = () => {
  // if dealer has 21, end the game and return to initial cash amount
  // otherwise, lose 0.5x bet and continue the game
  cash -= betValue * 0.5
  if (evalHand(dealer) == 21) {
    game = 0
    document.getElementById("insuranceMessage").innerHTML = "you win"
    cash += betValue * 1.5
  } else {
    document.getElementById("insuranceMessage").innerHTML = "you lose"
  }
  updateState()
  updateScreen()
}

const consecutiveCheck = (a, b, c) => {
  let min = Math.min(a, Math.min(b, c));
  let max = Math.max(a, Math.max(b, c));
  return max - min == 2 && a != b && a != c && b != c;
}
