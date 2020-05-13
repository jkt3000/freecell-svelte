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
      <a class="nav-link btn btn-link text-white" href="#" class:disabled={disableUndo} on:click|preventDefault={undo}>
        <i class="fas fa-backward"></i>
      </a>
    </li>
    <li class="nav-item">
      <a class="nav-link btn btn-link text-white" href="#" on:click|preventDefault={newGame}>
        <i class="fas fa-power-off"></i>
      </a>
    </li>
    <li class="nav-item">
      <a class="nav-link btn btn-link text-white" href="#" on:click|preventDefault={hint}>
        <i class="far fa-lightbulb"></i>
      </a>
    </li>
    <li class="nav-item">
      <a class="nav-link btn btn-link text-white" href="#" on:click|preventDefault={restart}>
        <i class="far fa-undo"></i>
      </a>
    </li>
    <li class="nav-item">
      <a class="nav-link btn btn-link text-white" href="#" on:click|preventDefault={settings}>
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