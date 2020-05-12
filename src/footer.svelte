<script>
  export let disableUndo;

  function startGame() {
    console.log("Starting game clicked");
    alert('start game')
  };

  function undoMove() {
    Game.undo();
    alert('Undo last move') 
  };

  console.log("disableUndo", disableUndo)
  function getHint(){};

  function setGameSettings() {};
</script>
      

<nav class="navbar fixed-bottom navbar-dark bg-dark p-0">
  <ul class="nav justify-content-around" style='width:100%'>
    <li class="nav-item">
      <a class="nav-link btn btn-link" href="#" class:disabled={disableUndo === 0} on:click|preventDefault={() => { Game.undo() }}>
        <i class="fas fa-undo"></i>
      </a>
    </li>
    <li class="nav-item">
      <a class="nav-link text-white" href="#" on:click|preventDefault={startGame}>
        <i class="fas fa-plus"></i>
      </a>
    </li>
    <li class="nav-item">
      <a class="nav-link text-white" href="#" on:click|preventDefault={getHint}>
        <i class="far fa-lightbulb"></i>
      </a>
    </li>
    <li class="nav-item">
      <a class="nav-link text-white" href="#" on:click|preventDefault={setGameSettings}>
        <i class="fas fa-cog"></i>
      </a>
    </li>
  </ul>
</nav>
