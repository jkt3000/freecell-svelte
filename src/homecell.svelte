<script>
  import Card from './card.svelte';
  
  export let cards = [];
  export let index;  
</script>

<div class='cell homecell' data-index={index}>
  {#each cards as card}
    <Card id={card}/>
  {/each}
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