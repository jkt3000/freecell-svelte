<script>
  import Card from './card.svelte';

  export let cards = [];
  export let index;  
  export let type;
  export let draggable = true;


</script>

<div class='cell {type}' data-index={index}>
  {#each cards as card, pos}
    <Card id={card} draggable={draggable}/>
  {/each}
</div>


<style type="text/scss">
.cell {
  display: block; position:relative;
  width: 11.5vw;
  height: 16.1vw;
  background: rgba(0,64,0);
  border: 1px solid #161; 
  margin: 1px;
  span {
    font-weight: bold;
    font-size: 5vh; 
    color: rgba(0,0,0,0.2);      
  }
}
:global(.cell) {
  :global(.playing-card) {
    position:absolute !important;
    top:0; left:0;
  }
}
</style>