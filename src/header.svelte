<script>
  export let runTime = 0;
  export let movesCount = 0;
  export let gameId = undefined;
</script>


<nav class="navbar navbar-dark bg-dark m-0 p-0 pl-1 pr-1 d-flex justify-content-between align-content-center">
  <a class="navbar-brand" href="/"><span class='text-danger' style='font-size: 30px; line-height:1em; margin:0;padding:0;'>♥️</span></a>
  {#if (gameId)}
    <span class='navbar-brand'>{gameId}</span>
  {/if}
  <span class='navbar-brand'>{runTime}</span>
  <span class='navbar-brand'>Moves: {movesCount}</span>
</nav>