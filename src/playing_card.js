// Deck
const PLAYING_CARDS = {
  values: [
    "Ac", "Ad", "Ah", "As", 
    "2c", "2d", "2h", "2s", 
    "3c", "3d", "3h", "3s", 
    "4c", "4d", "4h", "4s", 
    "5c", "5d", "5h", "5s", 
    "6c", "6d", "6h", "6s", 
    "7c", "7d", "7h", "7s", 
    "8c", "8d", "8h", "8s", 
    "9c", "9d", "9h", "9s", 
    "Tc", "Td", "Th", "Ts", 
    "Jc", "Jd", "Jh", "Js", 
    "Qc", "Qd", "Qh", "Qs", 
    "Kc", "Kd", "Kh", "Ks" 
  ],
  ranks: ['A','2','3','4','5','6','7','8','9','T','J','Q','K'],
  suits: ['c', 'd', 'h', 's']
}
export default class PlayingCard {

  constructor(val) {
    let rank = String(val[0]).toUpperCase();
    let suit = String(val[1]).toLowerCase();
    this.rank = rank;
    this.suit = suit;
    this.id   = this.rank + this.suit;
    if ((PLAYING_CARDS.ranks.indexOf(rank) == -1) || 
       (PLAYING_CARDS.suits.indexOf(suit) == -1)) {
      console.error(val + " is invalid");
      alert("Invalid card " + val);
    }
  }

  get color() { 
    return (this.suit == 'c' || this.suit == 's') ? 'black' : 'red';
  }
  get value() {
    return PLAYING_CARDS.values.indexOf(this.id);
  }
  get rank_val() {
    return PLAYING_CARDS.ranks.indexOf(this.rank);
  }

  // return true if card is one lower and different color than 
  validParentfor(card) {
    return (this.color != card.color) && (this.rank_val == card.rank_val + 1);
  }
}