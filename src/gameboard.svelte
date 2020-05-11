<script>
  import interact from 'interactjs';
  import { onMount } from 'svelte';
  /* partials */
  import GameCell from './gamecell.svelte';
  import Tableau from './tableau.svelte';

  import {columns} from './stores.js'; /* data store */
  
  export let gameId = parseInt(Math.random() * 1000000);

  
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
    }
  };

  /* returns array of selected cards for dragging */
  function selectCards(card, index) {
    let selected = [];
    let cards = $columns[index];
    let cardIndex = cards.indexOf(card);
    if (cardIndex + 1 === cards.length) {
      selected.push(document.getElementById(card));
    } else {
      selected = cards.slice(cardIndex).map(id => {
        return document.getElementById(id);
      });
    }
    return selected;
  }


  /* listeners */
  onMount(() => {

    /* free cell */
    interact('.cell').dropzone({
      accept: '.draggable',
      ondragenter: function(e) {
        let zone = e.target;
        let index = zone.dataset.index;
        if ($columns[index].length == 0) zone.classList.add('drop-active');  
      },
      ondragleave: function(e) {
        e.target.classList.remove('drop-active');
      },
      ondrop: function(e){
        e.target.classList.remove('drop-active');
        let card      = e.relatedTarget.id;
        let fromIndex = e.relatedTarget.parentNode.dataset.index;
        let toIndex   = e.target.dataset.index;
        let selected  = selectCards(card, fromIndex);
        let homecell  = e.target.parentNode.classList.contains('homecells');
        if (selected.length > 1) { return; } // don't allow drop if moving more than 1 card

        // if homecell
        if (homecell) {
          if ($columns[toIndex].length === 0) {
            // if empty, accept only A
            if (Game.cardRank(card) === 'A') {
              Game.moveCard(fromIndex, toIndex, card);
            }
          } else if ($columns[toIndex].length > 0) {
            // if not empty, accept only same suit and 1 greater than last card
            let last_card = $columns[toIndex].slice(-1).pop();
            if (!Game.alternateColors(card, last_card) && Game.ascendingRank(last_card, card)) {
              Game.moveCard(fromIndex, toIndex, card);
            }
          }
        } else {
          // else freecell
          if ($columns[toIndex].length === 0) {
            Game.moveCard(fromIndex, toIndex, card);
          }
        }
      }
    });

    /* tableau */
    interact('.tableau').dropzone({
      accept: '.draggable',
      listeners: {
        dragenter (e) { 
          e.target.classList.add('drop-active');  
        },
        dragleave (e) { 
          e.target.classList.remove('drop-active');  
        },
        drop (e) {
          e.target.classList.remove('drop-active');  
          let card      = e.relatedTarget.id;
          let fromIndex = e.relatedTarget.parentNode.dataset.index;
          let toIndex   = e.target.dataset.index;

          //if card is dropped on same column, do nothing
          if (fromIndex === toIndex ) { return; }

          // only allow if # of empty freecells >= selected count
          let selected = selectCards(card, fromIndex);
          if (selected.length - 1 > Game.numEmptyFreeCells()) {
            console.log("Not enough empty slots to make move", Game.numEmptyFreeCells());
            console.log(`Need ${selected.length-1} spaces, only have ${Game.numEmptyFreeCells()}`);
            return;
          }

          let last_card = $columns[toIndex].slice(-1).pop();
          console.log("last card", last_card, "curr card", card)          
          // if last card is alternate color and 1 greater than card
          if (Game.alternateColors(last_card, card) && Game.descendingRank(last_card, card)) {
            selected.forEach(el => Game.moveCard(fromIndex, toIndex, el.id));
          }
        } 
      }
    });

    /* card listener */
    interact('.draggable').draggable({     
      onstart: function(event) {
        console.log('onstart')
        let el = event.target;
        let index = event.target.parentNode.dataset.index;

        // if not last card, get all subsequent cards and move them all
        let selected = selectCards(el.id, index);
        selected.forEach(el => el.style.zIndex = 10000);
      },
      onmove: function(event) {
        let el = event.target;
        let index = event.target.parentNode.dataset.index;

        let selected = selectCards(el.id, index);
        selected.forEach(el => {
          let x = (parseFloat(el.getAttribute('data-x')) || 0) + event.dx;
          let y = (parseFloat(el.getAttribute('data-y')) || 0) + event.dy;
          el.style.transform = `translate(${x}px, ${y}px)`;
          el.setAttribute('data-x',x);
          el.setAttribute('data-y',y);
        });
      },        
      onend: function(event) {
        let el = event.target;
        let index = event.target.parentNode.dataset.index;
        let selected = selectCards(el.id, index);
        selected.forEach(el => {
          el.removeAttribute("data-y");
          el.removeAttribute("data-x");
          el.removeAttribute("style");
          el.style.zIndex = undefined;
        });
      }      
    });

    interact('.draggable').on('tap', function(event){
      let el = event.target;
      let index = event.target.parentNode.dataset.index;
      let selected = selectCards(el.id, index);
      if (selected.length > 1) return;

      console.log(`Autocomplete action for ${el.id}`)
      if (Game.cardRank(el.id) === 'A') {
        let toIndex = Game.findEmptyHomeCell();
        if (toIndex >= 0) {
          console.log("moving card to empty homecell")
          Game.moveCard(index, toIndex, el.id);
          return;
        }
      }

      let toIndex = Game.findValidHomeCell(el.id) || Game.findValidParent(el.id) || Game.findEmptyFreeCell();
      // find valid next homecell spot
      if (toIndex > 0) {
        // if viable parent in tableau, move to that spot
        Game.moveCard(index, toIndex, el.id);
      } else {
        // no valid move found
        console.log("No valid move found");
      }
  
    })
  });

  /* start up a new game */
  let deck = new Game.Deck(gameId);
  let cards = deck.toTableau();
  $columns = cards.concat([[],[],[],[],[],[],[],[]]);
</script>


<main>
  <div class='container-fluid'>
    <h1>{gameId}</h1>
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