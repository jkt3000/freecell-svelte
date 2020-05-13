

<script>
  import { createEventDispatcher } from 'svelte';
  export let display = true;

  let gameId;

  console.log("display modal ", display)
  const dispatch = createEventDispatcher();
  function newGame() {
    dispatch('command', {command: 'newgame', gameId: gameId});
  };
</script>

<div class='modal bg-dark {display ? "d-block" : ""}' id='new-game-modal'>
  <div class='modal-dialog' style='top: 30%'>
    <div class='modal-content alert alert-success'>
      <div class='modal-header justify-content-center'>
        <div>
          <h3>FreeCell</h3>
          <h4>
            <i class='fas fa-heart text-danger'></i>
            <i class='fas fa-spade'></i>
            <i class='fas fa-diamond text-danger'></i>
            <i class='fas fa-club'></i>
          </h4>
        </div>
      </div>
      <div class='modal-body justify-content-center alert alert-success'>
        <div class='input-group align-items-center mr-auto ml-auto mt-3' style='width:50%'>
          <input type='number' bind:value={gameId} class='form-control' placeholder="Game # (optional)">
        </div>
        <div class='input-group justify-content-center mt-3'>
          <button class='btn btn-success btn-lg' on:click={newGame}>Start New Game</button>
        </div>
      </div>
    </div>
  </div>
</div>

<style type="text/scss">
.modal.bg-dark {
  background: rgba(0,0,0,0.5) !important;
}  
</style>
