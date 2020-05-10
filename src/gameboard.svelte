<script>
  import GameCell from './gamecell.svelte';
  import Tableau from './tableau.svelte';
  
  let homecells = [[], [], [], ['Kc']];
  let freecells = [['5d'], [], [], []];
  let tableaus = [
    ['Ac'], ['3d', '5c'], [], [], [], [], [], []
  ];
</script>


<main>
  <div class='container-fluid'>
    <div class='row headboard'>    
      <div class='cells-board homecells'>
        {#each homecells as cards, index}
          <GameCell cards={cards} index={index} />
        {/each}
      </div>
      <div class='cells-board freecells'>
        {#each freecells as cards, index}
          <GameCell cards={cards} index={index} />
        {/each}
      </div>
    </div>
    <div class='row tableaus'>
      {#each tableaus as cards, index}
        <Tableau cards={cards} index={index} />
      {/each}
    </div>
  </div>
</main>


<style type="text/scss">
.headboard {
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  padding: 0 5px;

  .cells-board {
    display: flex;
    flex-flow: row nowrap;
    margin: 1vh 0;
    padding:0;
    width: 50%;
  }
}
.homecells {
  justify-content: flex-start;
}
.freecells {
  justify-content: flex-end;
}
.tableaus {
  height: 100vh;
  padding: 3vh 0;
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;  
}
</style>