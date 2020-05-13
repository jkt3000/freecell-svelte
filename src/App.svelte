<script>	
  import interact from 'interactjs';
  import { onMount } from 'svelte';
  /* partials */
  import GameCell from './gamecell.svelte';
  import Tableau from './tableau.svelte';
  import Footer from './footer.svelte';
  import {timeToString} from './time_to_string.js';
  import {columns, history, moves, settings, timeElapsed} from './stores.js'; /* data store */
  
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
      $moves = $moves + 1;
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
      $history = [...$history, record];
      $moves = $moves + 1;
      console.log(`[move:${$history.length}]`,record);
    },

    undo() {
      let record = $history.pop();
      $history = $history;
      if (!record) return;
      console.log("Undo last move", record);
      Game.moveCards(record.to, record.from, record.cards, false);
    },

    Deck: class {
      // generates a new random deck based on unique game_id
      constructor(seed) {
        this.cards = [];
        this.seed = parseInt(seed,10) || parseInt((Math.random() * 1000000), 10);
        this.shuffle();
      }

      // MS random shuffle for FreeCell https://rosettacode.org/wiki/Deal_cards_for_FreeCell
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
          tableaus[i++ % tableaus.length].unshift(this.cards.pop());
        }
        return tableaus;
      }

      get empty() { return this.cards.length === 0; }
    }
  };

  /* listeners for cards/cells */
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
        cards.forEach(card => {
          let el = document.getElementById(card);
          el.style.zIndex = 10000;
        });
      },
      onmove: function(event) {
        let card  = event.target.id;
        let index = event.target.parentNode.dataset.index;
        let cards = selectCards(card, index);
        cards.forEach(card => {
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
        cards.forEach(card => {
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
      let cards = selectCards(card, index);
      if (cards.length > 1) return;

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

	// app deals with handling game options, starting new game, etc.
	// Gameboard handles running the actual game

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

  function startGame(id) {
    gameId = id || parseInt((Math.random() * 1000000), 10);
    console.log("Start new game with id ", gameId);
    let deck = new Game.Deck(gameId);
    let cards = deck.toTableau();
    $history = [];
    $columns = cards.concat([[],[],[],[],[],[],[],[]]);
    $moves = 0;
    if (timer) { resetTimer(); } 
    timer = startTimer();
  };

  function startTimer() {
    return setInterval(function() {
      $timeElapsed += 1;
    }, 1000);
  };

  function resetTimer() {
    clearInterval(timer);
    $timeElapsed = 0;
  };

  function getHint(){};

  function setGameSettings() {};

  let gameId;

  function handleAction(event) {
    let command = event.detail.command;
    switch(command) {
      case 'undo':
        Game.undo();
        break;
      case 'settings':
        console.log("change settings");
        break;
      case 'newgame':
        let id = event.detail.gameId;
        startGame(id);
        break;
      case 'restart':
        console.log("Restart same game");
        startGame(gameId);
        break;
      case 'hint':
        console.log("Hint for next move");
        break;
      default:
    }
  };

  /* init settings for new game */
  let timer;
</script>

<nav class="navbar navbar-dark bg-dark m-0 p-1 header">
  <div class='navsection text-left'>
    <a href='/' class='text-danger'><i class='fas fa-diamond'></i></a>&nbsp;
  Game: {gameId || ' '}</div>
  <div class='navsection text-center'>{timeToString($timeElapsed)}</div>
  <div class='navsection text-right'>Moves: {$moves}</div>
</nav>

<div class='container board'>
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

<Footer disableUndo={($history.length === 0)} on:command={handleAction}/>

<style type="text/scss">
@media (min-width: 400px) { 
  .board {width: 400px; }
}
@media (min-width: 992px) { 
  .board { width: 70vh; height: 100vh;}
  .header { font-size: 1.5em; }


}
@media (min-width: 1200px) {  
  .board { width: 70vh; height: 100vh;}
  .header { font-size: 1.5em; }
}

.header {
  width: 100%;
  height: 40px;
  justify-content: space-between;
  .navsection {
    width: 30%;
    flex-grow: 1;
  }
}

.board {
  height: 90%;
  overflow:hidden;
}
.headboard {
  padding: 0.2vh 0;
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;  
  .cells-board {
    display: flex;
    flex-flow: row nowrap;
    margin: .2vh 0;
    padding:0;
    height: 100%;
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
  height: 100%;
  padding: 0.5vh 0;
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;  
}
</style>