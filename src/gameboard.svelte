<script>
  import interact from 'interactjs';
  import { tableaus, freecells, homecells } from './stores.js'; /* data store */
  import { onMount } from 'svelte';

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
    }
  }



  /* listeners */
  onMount(() => {
    /* free cell */
    interact('.freecells .cell').dropzone({
      accept: '.draggable',
      ondragenter: function(e) {
        // highlight drop area if empty
        let cell = e.target;
        let cell_id = cell.dataset.index;

        if ($freecells[cell_id].length == 0) {
          cell.classList.add('drop-active');  
        } else {
          console.log("Cell not empty!");
        }        
      },
      ondragleave: function(e) {
        e.target.classList.remove('drop-active');
      },
      ondrop: function(e){
        e.target.classList.remove('drop-active');

        let card_id = e.relatedTarget.id;
        let tabl_id = e.relatedTarget.parentNode.dataset.index;
        let cell_id = e.target.dataset.index;
        if ($freecells[cell_id].length == 0) {
          $tableaus[tabl_id] = Game.removeCard($tableaus[tabl_id], card_id);
          $freecells[cell_id] = Game.addCard($freecells[cell_id], card_id);
        }
      }
    });

    /* home cell */
    interact('.homecells .cell').dropzone({
      accept: '.draggable',
      ondragenter: function(e) {
        // highlight drop area if empty
        let cell = e.target;
        let cell_id = cell.dataset.index;
        if ($freecells[cell_id].length == 0) cell.classList.add('drop-active');  
        
      },
      ondragleave: function(e) {
        e.target.classList.remove('drop-active');
      },
      ondrop: function(e){
        e.target.classList.remove('drop-active');

        let card_id = e.relatedTarget.id;
        let tabl_id = e.relatedTarget.parentNode.dataset.index;
        let cell_id = e.target.dataset.index;

        // if empty, accept only A
        if ($freecells[cell_id].length == 0) {
          console.log("cell is empty")
          if (Game.cardRank(card_id) == 'A') {
            $tableaus[tabl_id] = Game.removeCard($tableaus[tabl_id], card_id);
            $homecells[cell_id] = Game.addCard($homecells[cell_id], card_id);
          }
        }
        
        // if not empty, accept only same suit and 1 greater than last card
        if ($homecells[cell_id].length > 0) {
          let last_card = $homecells[cell_id][$homecells[cell_id].length-1];
          if ((Game.cardVal(card_id) == Game.cardVal(last_card) + 1) && 
              (Game.cardSuit(card_id) == Game.cardSuit(last_card))) {
            $tableaus[tabl_id] = Game.removeCard($tableaus[tabl_id], card_id);
            $homecells[cell_id] = Game.addCard($homecells[cell_id], card_id);
          }
        }
      }
    });

    /* tableau */
    // interact('.tableau').dropzone({
    //   accept: '.draggable',
    //   listeners: {
    //     dragenter (e) { console.log(e) },
    //     dragleave (e) { console.log(e) },
    //     drop (e) { console.log(e)} 
    //   }
    // });

    /* card */
    interact('.draggable').draggable({
      onstart: listeners.log,
      onmove: listeners.trackCardMove,
      onend: listeners.updateCardMove
    });
  });

  /* start up a new game */
  let deck = new Deck(gameId);
  $tableaus = deck.toTableau();


</script>


<main>
  <div class='container-fluid'>
    <div class='row headboard'>    
      <div class='cells-board homecells'>
        {#each $homecells as cards, index}
          <GameCell cards={cards} index={index} />
        {/each}
      </div>
      <div class='cells-board freecells'>
        {#each $freecells as cards, index}
          <GameCell cards={cards} index={index} />
        {/each}
      </div>
    </div>
    <div class='row tableaus'>
      {#each $tableaus as cards, index}
        <Tableau cards={cards} index={index} />
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