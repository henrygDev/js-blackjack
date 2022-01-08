const Bet = (val) => {
  bet = 1
  cash -= val
  betValue = val
  calculateSideBets()
  updateState(0, 1)
  updateScreen()
}

const Hit = () => {
  canDouble = 0
  player.draw(deck.draw('up'))
  updateState()
}

const Stand = () => {
  split == 1 ? nextHand() : updateState(1)
}

const Double = () => {
  if (split == 1){
    cash -= splitBetValue
    splitBetValue *= 2
    canDouble = 1
  } else {
    cash -= betValue
    betValue *= 2
    canDouble = 0
  }
  player.draw(deck.draw('up'))
  split == 1 ? nextHand() : updateState(1)
}

const Split = () => {
  cash -= betValue
  splitBetValue = betValue
  canSplit = 0
  split = 1
  player.splitHandTemp = player.hand.pop()
  updateState()
  updateScreen()
}

const nextHand = () => {
  split = 0
  canDouble = 1
  moveSplitHand()
  updateState()
  updateScreen()
}

const moveSplitHand = () => {
  for (card of player.hand){
    createCardImage("splitHand");
  }
  document.getElementById("splitValue").innerHTML = evalHand(player)
  player.splitHand = player.hand
  player.hand = [player.splitHandTemp]
}

const modifySideBet = (sideBetType, reset) => {
  // running innerHTML as code... is this dangerous??? i should store more variables on the server side probably
  sideBetValue = parseInt(document.getElementById(sideBetType).innerHTML) || 0
  sideBetValue += 100
  if (reset) sideBetValue = 0
  document.getElementById(sideBetType).innerHTML = sideBetValue
}

const calculateSideBets = () => {
  for (sideBet of document.querySelectorAll("div.sideBet")){
    // running innerHTML as code again...
    if (sideBet.innerHTML > 0) activeSideBets.push([sideBet.id, sideBet.innerHTML])
  }
  evalSideBets()
}