<script>
  import Card from './card.svelte';

  export let cards = [];
  export let index;  
</script>

<div class='cell freecell' data-index={index}>
  {#if cards.length != 0}
    <Card id={card[0]}/>
  {/if}
</div>


<style type="text/scss">
.cell {
  display: block; position:relative;
  width: 11.5vw;
  height: 16.1vw;
  background: rbga(255,0,0);
  border: 1px solid #161; 
  margin: 1px;
  span {
    font-weight: bold;
    font-size: 5vh; 
    color: rgba(0,0,0,0.2);      
  }
}
</style>