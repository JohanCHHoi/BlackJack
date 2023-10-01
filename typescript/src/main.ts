import { Card } from "./card";
import { Deck } from "./deck";
import readline from "readline-promise";
const readConsole = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: true,
});

//Draws a card from the deck
const draw = (deck: Deck) => {
  var card = deck.cards.pop();
  return card;
}

//Calculate the value of the cards in a hand
const calculateHand = (hand: Array<Card | undefined>) => {
  let numberOfAces = 0;
  let value = hand.reduce((total, card) => {
    if(card.rank === 'A'){
      numberOfAces++;
      return total + 11;
    } else if(['J', 'Q', 'K'].includes(card.rank)) {
      return total + 10;
    } else {
      return total + parseInt(card.rank);
    }
  }, 0)
  
  //Handle the value of Aces (1 or 11)
  while(numberOfAces > 0 && value > 21) {
    value -= 10;
    numberOfAces--;
  }

  return value;
}

//Shows the cards in a hand
const showHand = (player: string, hand: Array<Card | undefined>) => {
  let handString = `${player === 'player' ? 'Player\'s' : 'Dealer\'s'} hand: `;

  for (let i = 0; i < hand.length; i++) {
    handString += `${hand[i].Suit} ${hand[i].rank}`;
  
    if (i < hand.length - 1) {
      handString += ", ";
    }
  }
  console.log(handString)
}

//Function to handle the players turn
const playerTurn = async (hand: Array<Card | undefined>, deck: Deck) => {
  let keepDrawing = true;
  let playerTotal = calculateHand(hand);
  console.log(`Player's total is ${playerTotal}\n`)
  
  while( playerTotal < 21 && keepDrawing) {
    await readConsole.questionAsync("Stand, Hit (s/h) \n").then((read) => {
      if (read === "h") {
        const newCard = draw(deck);
        console.log(`\nHit with ${newCard?.Suit} ${newCard?.rank}`)
        hand.push(newCard)
        playerTotal = calculateHand(hand);
        showHand('player', hand);
        console.log(`Player's total is ${playerTotal}\n`)
      } else {
        console.log('')
        keepDrawing = false;
      }
    });
  }

  return playerTotal;
}

//Function to handle the dealers turn
const dealerTurn = (hand: Array<Card | undefined>, deck: Deck) => {
  let dealerTotal = calculateHand(hand);
  //keep drawing if value is under 17
  while(dealerTotal < 17) {
    showHand('dealer', hand);
    const newCard = draw(deck);
    hand.push(newCard);
    console.log(`Dealer drew ${newCard.Suit} ${newCard.rank}`)
    dealerTotal = calculateHand(hand);
  }

  return dealerTotal;
}

const main = async () => {
  const deck = new Deck();
  console.log('Game Starts');
  console.log('-------------')
  //start the game with 2 cards each
  const playerHand = [draw(deck), draw(deck)]
  const dealerHand = [draw(deck), draw(deck)];
  //Show the players hand and one card from dealer
  showHand('player', playerHand) ;
  console.log(`Dealer's upcard: ${dealerHand[0].Suit} ${dealerHand[0].rank}\n`)

  const playerTotal = await playerTurn(playerHand, deck);  
  const dealerTotal = dealerTurn(dealerHand, deck);

  showHand('dealer', dealerHand)
  console.log(`Dealers total: ${dealerTotal}\n`)

  if(playerTotal > 21) {
    console.log('Player busts. Dealer wins');
  } else if(dealerTotal > 21){
    console.log('Dealer busts, Player wins');
  } else if(playerTotal > dealerTotal){
    console.log('Player wins');
  } else if(dealerTotal > playerTotal){
    console.log('Dealer wins');
  } else {
    console.log('Draw');
  };

  //Option to start new game without closing the app
  await readConsole.questionAsync("New game? (y/n) \n").then((read) => {
    if(read === 'y'){
      main();
    } else {
      process.exit();
    }
  });
}

main();
