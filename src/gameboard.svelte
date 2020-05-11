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
    }
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

          let last_card = $columns[toIndex].slice(-1).pop();
          console.log("last card", last_card, "curr card", card_id)          
          // if last card is alternate color and 1 greater than card
          if ((Game.cardColor(last_card) != Game.cardColor(card_id)) && 
              (Game.cardVal(last_card) == Game.cardVal(card_id) + 1)) {
            Game.moveCard(fromIndex, toIndex, card_id);
          }
        } 
      }
    });

    /* card listener */
    interact('.draggable').draggable({     
      onstart: function(event) {
        let card = event.target;
        let index = event.target.parentNode.dataset.index;
        if ($columns[index].indexOf(card.id) !== $columns[index].length - 1) {
          console.log("not last card, don't move");
          return;
        }
        event.target.style.zIndex = 10000;        
      },
      onmove: function(event) {
        // dont move if card is not last item in stack
        let card = event.target;
        let index = event.target.parentNode.dataset.index;
        // console.log($columns[index].indexOf(card.id), $columns[index].length - 1)
        // if ($columns[index].indexOf(card.id) !== $columns[index].length - 1) {
        //   console.log("not last card, don't move");
        //   return;
        // }
        let x = (parseFloat(card.getAttribute('data-x')) || 0) + event.dx;
        let y = (parseFloat(card.getAttribute('data-y')) || 0) + event.dy;
        card.style.transform = `translate(${x}px, ${y}px)`;
        card.setAttribute('data-x',x);
        card.setAttribute('data-y',y);
      },        
      onend: function(event) {
        let card = event.target;
        card.removeAttribute("data-y");
        card.removeAttribute("data-x");
        card.removeAttribute("style");
        console.log(event.type, event.target.id);
        event.target.style.zIndex = undefined;        
      }
    });
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