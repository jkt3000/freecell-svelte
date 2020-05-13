<script>
  import { createEventDispatcher } from 'svelte';

  export let disableUndo = false;


  const dispatch = createEventDispatcher();
  function undo() {
    dispatch('command', {command: 'undo'});
  };

  function newGame() {
    dispatch('command', {command: 'newgame'});
  };

  function hint() {
    dispatch('command', {command: 'hint'});
  };

  function settings() {
    dispatch('command', {command: 'settings'});
  };
  function restart() {
    dispatch('command', {command: 'restart'});
  };

</script>
      

<nav class="navbar fixed-bottom navbar-dark bg-dark p-0" id='footer'>
  <ul class="nav justify-content-around" style='width:100%'>
    <li class="nav-item">
      <a class="nav-link btn btn-link text-white" class:disabled={disableUndo} on:click|preventDefault={undo} title="Undo last move">
        <i class="fas fa-backward"></i>
      </a>
    </li>
    <li class="nav-item">
      <a class="nav-link btn btn-link text-white" on:click|preventDefault={newGame} title='New Game'>
        <i class="fas fa-power-off"></i>
      </a>
    </li>
    <li class="nav-item">
      <a class="nav-link btn btn-link text-white" on:click|preventDefault={hint} title="Get Hint (not implemented)">
        <i class="far fa-lightbulb"></i>
      </a>
    </li>
    <li class="nav-item">
      <a class="nav-link btn btn-link text-white" on:click|preventDefault={restart} title="Restart this game">
        <i class="far fa-undo"></i>
      </a>
    </li>
    <li class="nav-item">
      <a class="nav-link btn btn-link text-white" on:click|preventDefault={settings} title="Settings (not implemented)">
        <i class="fas fa-cog"></i>
      </a>
    </li>
  </ul>
</nav>

<style type="text/scss">
  #footer {
    bottom:  20px !important;
  }
</style>