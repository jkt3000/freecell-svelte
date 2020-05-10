<script>
  import interact from 'interactjs';
  import { columns } from './stores.js'; /* data store */
  import { onMount } from 'svelte';


  const HOMECELL_OFFSET = 8;
  const FREECELL_OFFSET = 12;
  /* partials */
  import GameCell from './gamecell.svelte';
  import Tableau from './tableau.svelte';

  /* logic stuff */
  import Deck from './deck.js';
  
  export let gameId = parseInt(Math.random() * 1000000);

  function log(e) { console.log("Log fn: ",e) }

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
    }
  }

  const listeners = {
    log: function (event) {
      console.log("[Log]: ",event);
    },
    trackCardMove: function(event) {
      let card = event.target;
      let x = (parseFloat(card.getAttribute('data-x')) || 0) + event.dx;
      let y = (parseFloat(card.getAttribute('data-y')) || 0) + event.dy;
      card.style.transform = `translate(${x}px, ${y}px)`;
      card.setAttribute('data-x',x);
      card.setAttribute('data-y',y);
    },
    updateCardMove: function(event) {
      let card = event.target;
      card.removeAttribute("data-y");
      card.removeAttribute("data-x");
      card.removeAttribute("style");
      console.log(event.type, event.target.id);
      event.target.style.zIndex = undefined;
    }
  }



  /* listeners */
  onMount(() => {
    /* free cell */
    interact('.freecell').dropzone({
      accept: '.draggable',
      ondragenter: function(e) {
        let cell = e.target;
        let cell_id = cell.dataset.index;
        // highlight drop area if empty
        if ($columns[cell_id].length == 0) cell.classList.add('drop-active');  
      },
      ondragleave: function(e) {
        e.target.classList.remove('drop-active');
      },
      ondrop: function(e){
        e.target.classList.remove('drop-active');

        let card_id = e.relatedTarget.id;
        let tabl_id = e.relatedTarget.parentNode.dataset.index;
        let cell_id = e.target.dataset.index;
        if ($columns[cell_id].length == 0) {
          $columns[tabl_id] = $columns[tabl_id].filter(item => item !== card_id);
          $columns[cell_id] = $columns[cell_id].concat(card_id);
        }
      }
    });

    /* home cell */
    interact('.homecell').dropzone({
      accept: '.draggable',
      ondragenter: function(e) {
        let cell = e.target;
        let cell_id = cell.dataset.index;
        // highlight drop area if empty
        if ($columns[cell_id].length == 0) cell.classList.add('drop-active');        
      },
      ondragleave: function(e) {
        e.target.classList.remove('drop-active');
      },
      ondrop: function(e){
        e.target.classList.remove('drop-active');

        let card_id = e.relatedTarget.id;
        let tabl_id = e.relatedTarget.parentNode.dataset.index;
        let cell_id = e.target.dataset.index;
        console.log("Drop activated on Homcell "+cell_id, card_id, "from " +tabl_id)

        // if empty, accept only A
        if ($columns[cell_id].length == 0) {
          console.log("cell is empty")
          if (Game.cardRank(card_id) == 'A') {
            $columns[tabl_id] = $columns[tabl_id].filter(item => item !== card_id);
            $columns[cell_id] = $columns[cell_id].concat(card_id);
          }
        } else if ($columns[cell_id].length > 0) {
          // if not empty, accept only same suit and 1 greater than last card
          let last_card = $columns[cell_id][$columns[cell_id].length-1];
          if ((Game.cardVal(card_id) == Game.cardVal(last_card) + 1) && 
              (Game.cardSuit(card_id) == Game.cardSuit(last_card))) {
            $columns[tabl_id] = Game.removeCard($columns[tabl_id], card_id);
            $columns[cell_id] = Game.addCard($columns[cell_id], card_id);
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

          let card_id = e.relatedTarget.id;
          let tabl_id = e.relatedTarget.parentNode.dataset.index;
          let cell_id = e.target.dataset.index;
          console.log("target", e.target)
          console.log(e, tabl_id, cell_id, card_id);
          //if card is dropped on same column, do nothing
          if (tabl_id == cell_id ) {
            console.log("trying to drop onto same column - ignore");
            return;
          }
          let last_card = $columns[cell_id][$columns[cell_id].length - 1];
          console.log("Drop column last card", last_card)
          console.log("dragged card", card_id)
          // if last card is alternate color and 1 greater than card
          if ((Game.cardColor(last_card) != Game.cardColor(card_id)) && 
              (Game.cardVal(last_card) == Game.cardVal(card_id) + 1)) {
            $columns[tabl_id] = Game.removeCard($columns[tabl_id], card_id);
            $columns[cell_id] = Game.addCard($columns[cell_id], card_id);
            console.log("moving card " + card_id + " from col " + tabl_id + " to " + cell_id);
          }
        } 
      }
    });

    /* card */
    interact('.draggable').draggable({
      onstart: function(e) {
        e.target.style.zIndex = 10000;
      },
      onmove: listeners.trackCardMove,
      onend: listeners.updateCardMove
    });
  });

  /* start up a new game */
  let deck = new Deck(gameId);
  let cards = deck.toTableau();
  $columns = cards.concat([[],[],[],[],[],[],[],[]]);
</script>


<main>
  <div class='container-fluid'>
    <div class='row headboard'>    
      <div class='cells-board homecells'>
        {#each Array(4) as _, index}
          <GameCell cards={$columns[index + HOMECELL_OFFSET]} index={index + HOMECELL_OFFSET}  type='homecell'/>
        {/each}
      </div>
      <div class='cells-board freecells'>
        {#each Array(4) as _, index}
          <GameCell cards={$columns[index + FREECELL_OFFSET]} index={index + FREECELL_OFFSET}  type='freecell'/>
        {/each}
      </div>
    </div>
    <div class='row tableaus'>
      {#each Array(8) as cards, index}
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