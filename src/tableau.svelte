<script>

  import Card from './card.svelte';

  export let cards = [];
  export let index;  

</script>
          

<div class='tableau' data-index={index}>
  {#each cards as card}
    <Card id={card}/>
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