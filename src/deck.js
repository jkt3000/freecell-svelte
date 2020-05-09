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

export default class Deck {
  // generates a new random deck based on unique game_id
  constructor(seed) {
    this.cards = [];
    this.seed = parseInt(seed,10) || parseInt((Math.random() * 1000000), 10);
    this.shuffle();
  }

  pop() {
    if (this.empty) {
      return;
    } else {
      return this.cards.pop();
    }
  }

  shuffle() {
    if (!this.empty) { return; }
    let deck = Array.from(PLAYING_CARDS.values, function(id) { return id });
    let state = this.seed;
    for (let len = 52; len >= 2; len--) {
      state = ((214013 * state) + 2531011) & 0x7FFFFFFF;
      let index = (state >> 16) % len;
      let last = len - 1;
      [deck[index], deck[last]] = [deck[last], deck[index]];
    }
    this.cards = deck.reverse();
  }

  toTableau() {
    let columns = 8;
    let tableaus = [ 
      new Array(), new Array(), new Array(), new Array(),
      new Array(), new Array(), new Array(), new Array()
    ];
    let i = 0;
    while (!this.empty) {
      tableaus[i++ % columns].unshift(this.pop());
    }
    return tableaus;
  }

  get remaining() {
    return this.cards.length;
  }

  get empty() {
    return this.cards.length == 0;
  }
};
