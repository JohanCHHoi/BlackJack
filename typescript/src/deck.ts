import { Card } from "./card";
import { Suit } from "./suit";
export class Deck {
  public cards: Array<Card> = [];
  private ranks: string[] = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

  //Shuffle the cards in the deck
  shuffleCards(cards: Array<Card>) {
    for (let i = cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [cards[i], cards[j]] = [cards[j], cards[i]];
    }
  }

  constructor() {
    for (var suit in Object.keys(Suit)) {
      this.ranks.map((rank)=> {
        this.cards.push(new Card(rank, Object.values(Suit)[suit]));
      })
    }
    this.shuffleCards(this.cards);
  }
}
