let game // 0 = not playing; 1 = in-game
let split = 0 // 0 = not playing; 1 = playing split game, 2 = transition screen
let bet = 0
let betValue = 0
let splitBetValue = 0
let cash = 2000
let endMessage = ''
let splitEndMessage = ''
let win = 0 // draw = 0, win = 1, lose = -1
let activeSideBets = [] // [["betType", amt], ...]

const deck = new Deck();
const player = new Player();
const dealer = new Player();

let playerHandValue
let dealerHandValue

const Reset = (split) => {
  removeSplitDisplay()
  resetSideBets()
  game = 1
  canDouble = 1

  if (split){
    bet = 1
    player.hand = [player.splitHandTemp]
  } else {
    bet = 0
    player.reset()
    // player.draw(new Card(10, 'spades'))
    // player.draw(new Card(10, 'spades'))
    player.draw(deck.draw('up'))
    player.draw(deck.draw('up'))
    canSplit = (player.hand[0].val == player.hand[1].val) ? 1 : 0
  }

  deck.reset()
  dealer.reset()
  dealer.draw(deck.draw('down'))
  dealer.draw(deck.draw('up'))
  // dealer.draw(new Card(9, 'spades', 'down'))
  // dealer.draw(new Card('A', 'spades'))
  updateState()
  updateScreen()
}

const removeSplitDisplay = () => {
  document.getElementById("splitScreen").style.display = "none"
  document.getElementById("splitHand").innerHTML = ''
  document.getElementById("splitValue").innerHTML = ''
}

const resetSideBets = () => {
  for (buttons of document.querySelectorAll("button.initSideBet")){
    buttons.style.display = "inline"
  }
  for (sideBet of document.querySelectorAll("div.sideBet")){
    sideBet.innerHTML = ''
  }
  for (sideBetMessage of document.querySelectorAll("div.sideBetMessage")){
    sideBetMessage.innerHTML = ''
  }
  document.getElementById("insuranceSideBet").style.display = "none"
  document.getElementById("insuranceMessage").innerHTML = ""
}

const updateScreen = () => {
  for (buttons of document.querySelectorAll("button.bets")){
    buttons.style.display = "inline"
  }
  document.getElementById("playerBet").innerHTML = 'bet: ' + betValue
  document.getElementById("splitBet").innerHTML = 'bet: ' + splitBetValue

  if (split) document.getElementById("splitScreen").style.display = "inline"
  document.getElementById("gameScreen").style.display = bet == 0 ? "none" : "block"
  document.getElementById("betScreen").style.display = bet == 1 ? "none" : "block"
  document.getElementById("playerCash").innerHTML = cash
  document.getElementById("nextHand").style.display = "none"

  if (bet){
    for (buttons of document.querySelectorAll("button.initSideBet")){
      buttons.style.display = "none"
    }
  }
}

const evalCard = (cardValue) => {
  if (!isNaN(cardValue)) return cardValue
  if (cardValue == 'A') return 1
  return 10
}

const evalHand = (player, faceDown, splitEval) => {
  let aceCount = 0
  let sum = 0
  for (card of (splitEval ? player.splitHand : player.hand)){
    if (faceDown && card.pos == 'down') continue
    sum += evalCard(card.val)
    if (card.val === 'A') aceCount++    
  }
  while (sum < 21 && aceCount > 0){
    sum = (sum + 10 <= 21) ? sum + 10 : sum
    aceCount--
  }
  return sum
}

const updateState = (stand, insurance) => {
  if (stand) dealerFinish()
  evaluateWinner(stand)

  // reset game board
  document.getElementById("playerHand").innerHTML = ""
  document.getElementById("dealerHand").innerHTML = ""

  // display cards
  for (card of player.hand){
    createCardImage("playerHand");
  }
  for (card of dealer.hand){
    if (card.pos == 'up' || game == 0){
      createCardImage("dealerHand");
    } else {
      createCardImage("dealerHand", 1);
    }
  }

  // in-game values
  document.getElementById("cardsLeft").innerHTML = deck.deck.length
  document.getElementById("playerValue").innerHTML = playerHandValue
  document.getElementById("dealerValue").innerHTML = game == 0 ? dealerHandValue : dealerHandValueFD
  document.getElementById("endMessage").innerHTML = endMessage
  document.getElementById("splitEndMessage").innerHTML = game == 0 ? splitEndMessage : ''

  // buttons
  document.getElementById("hit").style.display = game == 0 ? "none" : "inline"
  document.getElementById("stand").style.display = game == 0 ? "none" : "inline"
  document.getElementById("split").style.display = canSplit == 1 && game == 1 ? "inline" : "none"
  document.getElementById("double").style.display = canDouble == 1 && game == 1 ? "inline" : "none"
  document.getElementById("nextHand").style.display = "none"
  document.getElementById("reset").style.display = split == 1 ? "none" : "inline"
  if (!insurance) document.getElementById("insuranceSideBet").style.display = "none"

  // transition screen for split bust
  if (split == 2){
    let buttons = document.querySelectorAll("button")
    for (button of buttons){
      button.style.display = "none"
    }
    document.getElementById("nextHand").style.display = "inline"
  }
}

// dealer draws until their hand is 17 or greater before game end
const dealerFinish = () => {
  // if split hand, dealer must draw unless both hands bust or blackjack
  if (evalHand(player) >= 21 && (evalHand(player, 0, 1) >= 21 || player.splitHand.length == 0)) return
  while (dealerHandValue < 17){
    dealer.draw(deck.draw('up'))
    dealerHandValue = evalHand(dealer)
  }
}

// checks for game end
const evaluateWinner = (stand, splitEval) => {
  let msg = ''
  playerHandValue = splitEval ? evalHand(player, 0, 1) : evalHand(player)
  dealerHandValue = evalHand(dealer)
  dealerHandValueFD = evalHand(dealer, 1)

  if (splitEval) {
    dealerFinish()
    player.splitHand = []
  }

  if (playerHandValue > 21){
    msg = 'bust'
    win = -1
  } else if (dealerHandValue > 21){
    msg = 'dealer bust, you win!'
    win = 1
  } else if (playerHandValue == dealerHandValue && playerHandValue == 21){
    msg = 'draw'
    win = 0
  } else if (playerHandValue == 21){
    msg = 'blackjack!'
    win = 1
  } else if (stand){
    if (playerHandValue > dealerHandValue){
      msg = 'you win!'
      win = 1
    } else if (playerHandValue < dealerHandValue){
      msg = 'you lose'
      win = -1
    } else {
      msg = 'draw'
      win = 0
    }
  } else {
    endMessage = ''
    return
  }
  if (split == 1){
    game = 1
    split = 2 //transition screen
  } else {
    game = 0
  }
  // evaluate original hand, THEN split hand
  if (player.splitHand.length > 0){
    betReward(1)
    //evaluate value of split hand against dealer's and continue.
    evaluateWinner(1, 1)
    endMessage = msg
    return
  }
  if (!split) betReward()
  if (splitEval) {
    // hack to fix hand value
    playerHandValue = evalHand(player)
    splitEndMessage = msg
  } else {
    endMessage = msg
  }
  updateScreen()
}

const evalSideBets = () => {

  while (activeSideBets.length > 0){
    const [ betType, amount ] = activeSideBets.pop()
    cash -= amount
    message = ''
    payout = 0

    switch (betType){
      case "pokerHand": 
        evalPokerHand(amount)
        break;
      case "perfectPair":
        evalPerfectPair(amount)
        break;
    }
    updateSideBetMessage(betType, message)
    cash += payout
  }

  //insurance is only available dealer has A face up
  if (dealer.hand[1].val == 'A'){
    document.getElementById("insuranceSideBet").style.display = "inline"
  }
}

const updateSideBetMessage = (betType, message) => {
  document.getElementById(`${betType}Message`).innerHTML = message
}

const createCardImage = (playerID, pos) => {
  const img = document.createElement('img');
  img.src = pos ? 'cards/red_joker.png' : `cards/${card.img}`;
  img.style.height = '218px';
  img.style.width = '150px';
  document.getElementById(playerID).appendChild(img);
}

const betReward = (splitBet) => {
  if (win == 1){
    cash += (splitBet ? splitBetValue : betValue) * 2
  } else if (win == 0){
    cash += (splitBet ? splitBetValue : betValue)
  }
}

let toggle = 1
const toggleMusic = () => {
  toggle == 1 ? document.getElementById('player').pause() : document.getElementById('player').play()
  toggle = toggle == 1 ? 0 : 1
}

document.getElementById('player').volume = 0.2

Reset()
updateScreen()