
  import { columns } from './stores.js'; /* data store */
  export let Game = {
    HOMECELL_OFFSET: 8,
    FREECELL_OFFSET: 12,

    ranks: ['A','2','3','4','5','6','7','8','9','T','J','Q','K'],
    cardRank(card) { return card[0] },
    cardSuit(card) { return card[1] },
    cardColor(card) { 
      return (card[1] == 'c' || card[1] == 's') ? 'black' : 'red'; 
    },
    cardVal(card) { 
      return this.ranks.indexOf(card[0]) 
    },
    removeCard(list, card) { 
      return list.filter(item => item !== card) 
    },
    addCard(list, card) { 
      return list.concat(card) 
    },
    moveCard(fromIndex, toIndex, card) {
      $columns[fromIndex] = this.removeCard($columns[fromIndex], card);
      $columns[toIndex]   = this.addCard($columns[toIndex], card);
    },
    alternateColors(c1, c2) { 
      return (this.cardColor(c1) !== this.cardColor(c2)) 
    },
    descendingRank(c1, c2) { 
      return (this.cardVal(c1) === this.cardVal(c2) + 1) 
    },
    ascendingRank(c1, c2) { 
      return this.descendingRank(c2, c1) 
    },
    validParent(parent, child) {
      return (this.descendingRank(parent, child)) && 
             (this.alternateColors(parent, child));
    },
    findEmptyHomeCell() {
      return this.findEmptyCell(this.HOMECELL_OFFSET);
    },
    findEmptyFreeCell() {
      return this.findEmptyCell(this.FREECELL_OFFSET);
    },
    findEmptyCell(offset) {
      for (let i=0; i < 4; i++) {
        let index = offset + i;
        if ($columns[index].length == 0) return index;
      }
    },
    numEmptyFreeCells() {
      let freecells = $columns.slice(this.FREECELL_OFFSET);
      return freecells.filter(c => { return (c.length === 0); }).length;
    },

    findValidHomeCell(card) {
      return;
    },
    findValidParent: function(card, index) {
      for (let i=0; i < 8; i++) {
        if (i === index) continue;
        let parent = [...$columns[i]].slice(-1).pop();
        if (Game.validParent(parent, card)) return i;
      }
    },
    Deck: class {
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

  }