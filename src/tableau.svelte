<script context="module">
  
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
    }
  }

  /* recursive */
  function validChild(card, cards) {
    if (cards.length === 0) {
      return true; // curr card is last one
    } else {
      let list = [...cards];
      let child_card = list.shift();
      let this_status = (Game.cardVal(card) === Game.cardVal(child_card) + 1) &&
      (Game.cardColor(card) !== Game.cardColor(child_card));
      return validChild(child_card, list) && (this_status);
    }
  }
</script>

<script>
  import Card from './card.svelte';

  export let cards = [];
  export let index;
</script>
          

<div class='tableau' data-index={index}>
  {#each cards as card, pos}
    <Card id={card} draggable={validChild(card, [...cards].slice(pos+1))}/>
  {/each}
</div>

<style type="text/scss">
  .tableau {
    background: rgba(0,0,0,0.2);
    padding: 0; margin:0;
    width: 12vw;
    height: 70vh;
    margin: 0 1px;
    display: flex;
    align-items: center;
    flex-direction: column;
  }
</style>