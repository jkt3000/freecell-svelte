<script>
  export let id = undefined;
  export let draggable = true;
</script>


{#if (id != undefined)}
  <img src='/images/{id}.png' id={id} class='playing-card' class:draggable alt="{draggable}">
{/if}


<style type="text/scss">
  .playing-card {
    margin:0; padding:0;
    width: 100%;
    height: auto;
    border-radius: 0.5vh;
    box-shadow: 0px 0px 4px 1px rgba(0,0,0,0.5);
    z-index:1000;
  }

  :global(.tableau) {
    .playing-card:first-child {
      margin-top: 0;
    }

    .playing-card {
      margin-top: -80%;
    }
  }
</style>