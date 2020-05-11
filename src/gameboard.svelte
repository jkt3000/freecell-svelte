<script>
  import interact from 'interactjs';
  import { onMount } from 'svelte';
  /* partials */
  import GameCell from './gamecell.svelte';
  import Tableau from './tableau.svelte';

  /* logic stuff */
  import { columns } from './stores.js'; /* data store */
  import Deck from './deck.js';
  const HOMECELL_OFFSET = 8;
  const FREECELL_OFFSET = 12;
  
  export let gameId = parseInt(Math.random() * 1000000);

  let Game = {
    ranks: ['A','2','3','4','5','6','7','8','9','T','J','Q','K'],
    cardRank: function(id) {
      return id[0];
    },
    cardColor: function(id){
      return (id[1] == 'c' || id[1] == 's') ? 'black' : 'red';
    },
    cardSuit: function(id){
      return id[1];
    },
    cardVal: function(id) {
      return this.ranks.indexOf(id[0]);
    },
    removeCard: function(list, cardId) {
      return list.filter (item => item !== cardId);      
    },
    addCard: function(list, cardId) {
      return list.concat(cardId);
    },
    moveCard: function(fromIndex, toIndex, card) {
      $columns[fromIndex] = $columns[fromIndex].filter(i => i !== card);
      $columns[toIndex] = $columns[toIndex].concat(card);
    },
    alternateColors: function(c1, c2) {
      return (this.cardColor(c1) !== this.cardColor(c2));
    },
    descendingRank: function(c1, c2) {
      return (this.cardVal(c1) === this.cardVal(c2) + 1);
    },
    ascendingRank: function(c1, c2) {
      return this.descendingRank(c2, c1);
    },

    // return true if parentCard is ok for child
    validParent: function(parentCard, childCard) {
      return (this.descendingRank(parentCard, childCard)) && 
             (this.alternateColors(parentCard, childCard));
    },
    // returns index of first empty homecell, or undefined
    findEmptyHomeCell: function(){
      for (let i=0; i < 4; i++) {
        let index = HOMECELL_OFFSET + i;
        if ($columns[index].length == 0) return index;
      }
    },

    // returns index of first empty freecell, or -1 if not found
    findEmptyFreeCell: function(){
      for (let i=0; i < 4; i++) {
        let index = FREECELL_OFFSET + i;
        if ($columns[index].length == 0) return index;
      }      
    },
    // returns index of first tableau not of column that can accept card
    // or -1 if invalid
    findValidParent: function(card_id, column) {
      for (let i=0; i < 8; i++) {
        if (i === column) continue;
        let parentCard = [...$columns[i]].slice(-1).pop();
        console.log("checking parent ", parentCard, card_id)
        if (Game.validParent(parentCard, card_id)) {
          return i;
        }
      }
    }
  }

  /* returns array of selected cards for dragging */
  function selectCards(card, index) {
    let selected = [];
    let cardIndex = $columns[index].indexOf(card);
    if (cardIndex + 1 == $columns[index].length) {
      selected.push(document.getElementById(card));
    } else {
      selected = $columns[index].slice(cardIndex).map(card => {
        return document.getElementById(card);
      });
    }
    return selected;
  }


  function emptyFreeCells() {
    let freecells = $columns.slice(FREECELL_OFFSET);
    console.log(freecells.map(e => e.length));
    return freecells.filter(c => { return (c.length == 0); }).length;
  }

  /* listeners */
  onMount(() => {
    /* free cell */
    interact('.freecell').dropzone({
      accept: '.draggable',
      ondragenter: function(e) {
        let zone = e.target;
        let index = zone.dataset.index;
        // highlight drop area if empty
        if ($columns[index].length == 0) zone.classList.add('drop-active');  
      },
      ondragleave: function(e) {
        e.target.classList.remove('drop-active');
      },
      ondrop: function(e){
        e.target.classList.remove('drop-active');
        let card_id   = e.relatedTarget.id;
        let fromIndex = e.relatedTarget.parentNode.dataset.index;
        let toIndex   = e.target.dataset.index;

        let selected = selectCards(card_id, fromIndex);
        if (selected.length > 1) { return; } // don't allow drop onto freecell if more than 1 card

        if ($columns[toIndex].length == 0) {
          Game.moveCard(fromIndex, toIndex, card_id);
        }
      }
    });

    /* home cell */
    interact('.homecell').dropzone({
      accept: '.draggable',
      ondragenter: function(e) {
        let zone = e.target;
        let index = zone.dataset.index;
        // highlight drop area if empty
        if ($columns[index].length == 0) zone.classList.add('drop-active');        
      },
      ondragleave: function(e) {
        e.target.classList.remove('drop-active');
      },
      ondrop: function(e){
        e.target.classList.remove('drop-active');
        
        let card_id   = e.relatedTarget.id;
        let fromIndex = e.relatedTarget.parentNode.dataset.index;
        let toIndex   = e.target.dataset.index;

        let selected = selectCards(card_id, fromIndex);
        if (selected.length > 1) { return; } // don't allow drop onto freecell if more than 1 card

        // if empty, accept only A
        if ($columns[toIndex].length == 0) {
          console.log("cell is empty")
          if (Game.cardRank(card_id) == 'A') {
            Game.moveCard(fromIndex, toIndex, card_id);
          }
        } else if ($columns[toIndex].length > 0) {
          // if not empty, accept only same suit and 1 greater than last card
          let last_card = $columns[toIndex].slice(-1).pop();
          if ((Game.cardVal(card_id) == Game.cardVal(last_card) + 1) && 
              (Game.cardSuit(card_id) == Game.cardSuit(last_card))) {
            Game.moveCard(fromIndex, toIndex, card_id);
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

          let card_id   = e.relatedTarget.id;
          let fromIndex = e.relatedTarget.parentNode.dataset.index;
          let toIndex   = e.target.dataset.index;

          //if card is dropped on same column, do nothing
          if (fromIndex == toIndex ) {
            console.log("trying to drop onto same column - ignore");
            return;
          }
          // only allow if # of empty freecells >= selected count
          let selected = selectCards(card_id, fromIndex);
          if (selected.length - 1 > emptyFreeCells()) {
            console.log("Not enough empty slots to make move", emptyFreeCells());
            return;
          }

          let last_card = $columns[toIndex].slice(-1).pop();
          console.log("last card", last_card, "curr card", card_id)          
          // if last card is alternate color and 1 greater than card
          if ((Game.cardColor(last_card) != Game.cardColor(card_id)) && 
              (Game.cardVal(last_card) == Game.cardVal(card_id) + 1)) {
            selected.forEach(el => Game.moveCard(fromIndex, toIndex, el.id));
          }
        } 
      }
    });

    /* card listener */
    interact('.draggable').draggable({     
      onstart: function(event) {
        console.log('onstart')
        let card = event.target;
        let index = event.target.parentNode.dataset.index;

        // if not last card, get all subsequent cards and move them all
        let selected = selectCards(card.id, index);
        selected.forEach(el => {
          el.style.zIndex = 10000;
        });
      },
      onmove: function(event) {
        let card = event.target;
        let index = event.target.parentNode.dataset.index;

        let selected = selectCards(card.id, index);
        selected.forEach(el => {
          let x = (parseFloat(card.getAttribute('data-x')) || 0) + event.dx;
          let y = (parseFloat(card.getAttribute('data-y')) || 0) + event.dy;
          el.style.transform = `translate(${x}px, ${y}px)`;
          el.setAttribute('data-x',x);
          el.setAttribute('data-y',y);
        });
      },        
      onend: function(event) {
        let card = event.target;
        let index = event.target.parentNode.dataset.index;
        let selected = selectCards(card.id, index);
        selected.forEach(el => {
          el.removeAttribute("data-y");
          el.removeAttribute("data-x");
          el.removeAttribute("style");
          el.style.zIndex = undefined;
        });
      }      
    });

    interact('.draggable').on('tap', function(event){
      let card = event.target;
      let index = event.target.parentNode.dataset.index;
      let selected = selectCards(card.id, index);
      if (selected.length > 1) return;
      console.log(`autocomplete ${card.id}`)
      if (Game.cardRank(card.id) == 'A') {
        let toIndex = Game.findEmptyHomeCell();
        if (toIndex >= 0) {
          console.log("moving A to empty homecell")
          Game.moveCard(index, toIndex, card.id);
          return;
        }
      }

      let toIndex = Game.findValidParent(card.id) || Game.findEmptyFreeCell();
      if (toIndex > 0) {
        // if viable parent in tableau, move to that spot
        Game.moveCard(index, toIndex, card.id);
      } else {
        // no valid move found
        console.log("No valid move found")
      }
  
    })
  });

  /* start up a new game */
  let deck = new Deck(gameId);
  let cards = deck.toTableau();
  $columns = cards.concat([[],[],[],[],[],[],[],[]]);
</script>


<main>
  <div class='container-fluid'>
    <h1>{gameId}</h1>
    <div class='row headboard'>    
      <div class='cells-board homecells'>
        {#each Array(4) as _, index}
          <GameCell cards={$columns[index + HOMECELL_OFFSET]} index={index + HOMECELL_OFFSET}  type='homecell' draggable={false}/>
        {/each}
      </div>
      <div class='cells-board freecells'>
        {#each Array(4) as _, index}
          <GameCell cards={$columns[index + FREECELL_OFFSET]} index={index + FREECELL_OFFSET}  type='freecell'/>
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