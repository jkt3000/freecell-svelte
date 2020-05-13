<script>
  import Card from './card.svelte';

  export let cards = [];
  export let index;  
  export let type;
  export let draggable = true;


</script>

<div class='cell {type}' data-index={index}>
  <img src='/images/blank.png' class='blank'>
  {#each cards as card, pos}
    <Card id={card} draggable={draggable}/>
  {/each}
</div>


<style type="text/scss">
.cell {
  display: block; position:relative;
  width: 24%;
  height: auto;
  background: rgba(0,64,0);
  border: 1px solid #161; 
  margin: 1px;
  .blank {
    margin:0; padding:0;
    width: 100%;
    height: auto;
  }
}

:global(.cell) {
  :global(.playing-card) {
    position:absolute !important;
    top:0; left:0;
  }
}
</style>