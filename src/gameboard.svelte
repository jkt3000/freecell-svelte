<script>
  import interact from 'interactjs';
  import { onMount } from 'svelte';
  /* partials */
  import GameCell from './gamecell.svelte';
  import Tableau from './tableau.svelte';

  import {columns, history} from './stores.js'; /* data store */
  
  export let gameId = parseInt((Math.random() * 1000000), 10);

  let historyLogs;
  let unsubHistory = history.subscribe(logs => historyLogs = logs);
  console.log(`history`, historyLogs)

  const Game = {
    HOMECELL_OFFSET: 8,
    FREECELL_OFFSET: 12,
    PLAYING_CARDS: [
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
    RANKS: ['A','2','3','4','5','6','7','8','9','T','J','Q','K'],
    cardRank(card) { return card[0] },
    cardSuit(card) { return card[1] },
    cardColor(card) { 
      return (card[1] == 'c' || card[1] == 's') ? 'black' : 'red'; 
    },
    cardVal(card) { 
      return this.RANKS.indexOf(card[0]);
    },
    removeCard(list, card) { 
      return list.filter(item => item !== card);
    },
    addCard(list, card) { 
      return list.concat(card); 
    },
    moveCard(fromIndex, toIndex, card, record = true) {
      $columns[fromIndex] = this.removeCard($columns[fromIndex], card);
      $columns[toIndex]   = this.addCard($columns[toIndex], card);
      if (record) {
        this.recordMove(fromIndex, toIndex, card);
      }
    },

    // returns true if move from one column to other is valid.
    // if toIndex is homecell -> homecell logic
    // if toIndex is freecell -> only if free and single card
    // if toIndex is tableaux -> only if first card of cards is alternate and last card is 1+ than card
    validTableauMove(fromIndex, toIndex, cards) {
      console.log("tableau logic");      
      if (fromIndex === toIndex) { 
        console.log("Can't move to same column."); 
        return; 
      }

      // only allow if # of empty freecells >= selected count
      let free_moves = Game.numEmptyFreeCells();
      if (cards.length - 1 > free_moves) {
        console.log(`Not enough empty freecells: Need ${cards.length-1} spaces, only have ${free_moves}`);
        return;
      }

      // ok if parent is blank
      if ($columns[toIndex].length === 0) {
        return true;
      }

      // check parent vs first card in cards
      let card = cards[0];
      let parent = $columns[toIndex].slice(-1).pop();
      if (Game.alternateColors(parent, card) && Game.descendingRank(parent, card)) {
        return true;
      }
    },
    validCellMove(fromIndex, toIndex, cards) {
      if (cards.length > 1) { return; }

      if (toIndex < Game.FREECELL_OFFSET) {
        // HomeCell        
        let card = cards[0];
        // if empty, only an A
        if ($columns[toIndex].length === 0) {
          return Game.cardRank(card) === 'A';
        }

        // if not empty, only if card is same suit and +1 to last card in stack
        let parent = $columns[toIndex].slice(-1).pop();
        if ((Game.cardSuit(parent) === Game.cardSuit(card)) && 
            (Game.ascendingRank(parent, card))) {
          return true;
        }
      } else {
        // FreeCell
        return ($columns[toIndex].length === 0); 
      }
    },

    // move cards if last card in toIndex is alternate color, +1 to first card in cards
    moveCards(fromIndex, toIndex, cards, record = true) {
      cards.forEach(card => {
        $columns[fromIndex] = this.removeCard($columns[fromIndex], card);
        $columns[toIndex]   = this.addCard($columns[toIndex], card);
      });
      if (record) { this.recordMove(fromIndex, toIndex, cards); }
    },

    alternateColors(c1, c2) { 
      return (this.cardColor(c1) !== this.cardColor(c2));
    },
    descendingRank(c1, c2) { 
      return (this.cardVal(c1) === this.cardVal(c2) + 1);
    },
    ascendingRank(c1, c2) { 
      return this.descendingRank(c2, c1); 
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
      for (let i=offset; i < (4+offset); i++) {
        if ($columns[i].length == 0) return i;
      }
    },
    numEmptyFreeCells() {
      let freecells = $columns.slice(this.FREECELL_OFFSET);
      return freecells.filter(c => { return (c.length === 0); }).length;
    },

    findValidHomeCell(card) {
      for (let i=this.HOMECELL_OFFSET; i < (this.HOMECELL_OFFSET + 4); i++) {
        let last_card = $columns[i].slice(-1).pop();
        if (last_card) {
          if ((Game.cardSuit(card) === Game.cardSuit(last_card)) && 
              (Game.ascendingRank(last_card, card))) {
            return i;
          }
        }
      }
    },
    findValidParent(card, index) {
      for (let i=0; i < 8; i++) {
        if (i === index) continue;
        let parent = [...$columns[i]].slice(-1).pop();
        if (Game.validParent(parent, card)) return i;
      }
    },

    // record moves made to be undone
    // { from: 0..15, to: 0..15, cards: ['Ac', '6c' ]}
    recordMove(fromIndex, toIndex, cards) {
      let record = { from: fromIndex, to: toIndex, cards: cards }
      historyLogs.push(record);
      console.log(`[move:${historyLogs.length}]`,record);
    },

    undo() {
      let record = historyLogs.pop();
      if (!record) return;
      console.log("Undo last move", record);
      Game.moveCards(record.to, record.from, record.cards, false);
      // need to swap from <-> to and reverse order of cards moved
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
        let deck = Array.from(Game.PLAYING_CARDS, function(id) { return id });
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
        let tableaus = [ [],[],[],[], [],[],[],[] ];
        let i = 0;
        while (!this.empty) {
          tableaus[i++ % tableaus.length].unshift(this.pop());
        }
        return tableaus;
      }

      get remaining() {
        return this.cards.length;
      }

      get empty() {
        return this.cards.length == 0;
      }
    }
  };

  /* returns array of selected cards for dragging */
  function selectCards(card, index) {
    let cards = $columns[index];
    let cardIndex = cards.indexOf(card);
    if (cardIndex + 1 === cards.length) {
      return [card];
    } else {
      return cards.slice(cardIndex);
    }
  };


  /* listeners */
  onMount(() => {

    //
    // drop on Cell
    //
    interact('.cell').dropzone({
      accept: '.draggable',
      ondragenter: function(e) {
        e.target.classList.add('drop-active');  
      },
      ondragleave: function(e) {
        e.target.classList.remove('drop-active');
      },
      ondrop: function(e){
        e.target.classList.remove('drop-active');
        let card      = e.relatedTarget.id;
        let fromIndex = e.relatedTarget.parentNode.dataset.index;
        let toIndex   = e.target.dataset.index;
        let cards     = selectCards(card, fromIndex);

        if (Game.validCellMove(fromIndex, toIndex, cards)) {
          Game.moveCards(fromIndex, toIndex, cards);
        }
      }
    });

    //
    // drop on Tableau
    //
    interact('.tableau').dropzone({
      accept: '.draggable',
      listeners: {
        drop (e) {
          let card      = e.relatedTarget.id;
          let fromIndex = e.relatedTarget.parentNode.dataset.index;
          let toIndex   = e.target.dataset.index;
          let cards     = selectCards(card, fromIndex);
          console.log(`[Move] ${cards} from ${fromIndex} => ${toIndex}`);

          if (Game.validTableauMove(fromIndex, toIndex, cards)) {
            Game.moveCards(fromIndex, toIndex, cards);
          }
        } 
      }
    });

    //
    // action on draggable card
    //
    interact('.draggable').draggable({     
      onstart: function(event) {
        let card  = event.target.id;
        let index = event.target.parentNode.dataset.index;
        let cards = selectCards(card, index);
        selected.forEach(card => {
          let el = document.getElementById(card);
          el.style.zIndex = 10000;
        });
      },
      onmove: function(event) {
        let card  = event.target.id;
        let index = event.target.parentNode.dataset.index;
        let cards = selectCards(card, index);
        selected.forEach(card => {
          let el = document.getElementById(card);
          let x = (parseFloat(el.getAttribute('data-x')) || 0) + event.dx;
          let y = (parseFloat(el.getAttribute('data-y')) || 0) + event.dy;
          el.style.transform = `translate(${x}px, ${y}px)`;
          el.setAttribute('data-x',x);
          el.setAttribute('data-y',y);
        });
      },        
      onend: function(event) {
        let card  = event.target.id;
        let index = event.target.parentNode.dataset.index;
        let cards = selectCards(card, index);
        selected.forEach(card => {
          let el = document.getElementById(card);          
          el.removeAttribute("data-y");
          el.removeAttribute("data-x");
          el.removeAttribute("style");
          el.style.zIndex = undefined;
        });
      }      
    });


    // 
    // tap action on last card
    //
    interact('.draggable').on('tap', function(event){
      let card  = event.target.id;
      let index = event.target.parentNode.dataset.index;
      let selected = selectCards(card, index);
      if (selected.length > 1) return;

      console.log(`Autocomplete action for ${card}`);

      // move A to home
      if (Game.cardRank(card) === 'A') {
        let toIndex = Game.findEmptyHomeCell();
        if (toIndex >= 0) {
          console.log("moving card to empty homecell")
          Game.moveCards(index, toIndex, [card]);
          return;
        }
      }

      // find next viable spot
      let toIndex = Game.findValidHomeCell(card) || Game.findValidParent(card) || Game.findEmptyFreeCell();
      if (toIndex > 0) {
        Game.moveCards(index, toIndex, [card]);
      } else {
        console.log("No valid move found");
      }  
    });
  });

  /* start up a new game */
  let deck  = new Game.Deck(gameId);
  let cards = deck.toTableau();
  $columns  = cards.concat([[],[],[],[],[],[],[],[]]);
</script>


<main>
  <div class='container-fluid'>
    <div class='row'>
      <div class='col-12'>
        <h3>{gameId}</h3>
        <button class='btn btn-primary' on:click={Game.undo}><i class="fas fa-undo"></i></button>
      </div>
    </div>

    <div class='row headboard'>    
      <div class='cells-board homecells'>
        {#each Array(4) as _, index}
          <GameCell cards={$columns[index + Game.HOMECELL_OFFSET]} index={index + Game.HOMECELL_OFFSET}  type='homecell' draggable={false}/>
        {/each}
      </div>
      <div class='cells-board freecells'>
        {#each Array(4) as _, index}
          <GameCell cards={$columns[index + Game.FREECELL_OFFSET]} index={index + Game.FREECELL_OFFSET}  type='freecell'/>
        {/each}
      </div>
    </div>
    <div class='row tableaus'>
      {#each Array(8) as _, index}
        <Tableau cards={$columns[index]} index={index} />
      {/each}
    </div>
  </div>
</main>


<style type="text/scss">
.headboard {
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  padding: 0 5px;

  .cells-board {
    display: flex;
    flex-flow: row nowrap;
    margin: 1vh 0;
    padding:0;
    width: 50%;
  }
}
.homecells {
  justify-content: flex-start;
}
.freecells {
  justify-content: flex-end;
}
.tableaus {
  height: 100vh;
  padding: 3vh 0;
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;  
}
</style>