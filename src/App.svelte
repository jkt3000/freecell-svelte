<script>
	import FooterBar from './footer.svelte';
</script>


<nav class="navbar navbar-dark bg-dark m-0 p-0 pl-1 pr-1 d-flex justify-content-between align-content-center">
  <a class="navbar-brand" href="/"><span class='text-danger' style='font-size: 30px; line-height:1em; margin:0;padding:0;'>♥️</span></a>
  <span class='navbar-brand'>03:45</span>
  <span class='navbar-brand'>Moves: 21</span>
</nav>
        
<main>
	<div class='container-fluid'>
    <div class='row'>
      <div class='col-6 foundation-frame' id='home-cells'>
          <div class='cell dropzone'><span>A</span></div>
          <div class='cell dropzone'><span>A</span></div>
          <div class='cell dropzone'><span>A</span></div>
          <div class='cell dropzone'><span>A</span></div>
      </div>
      <div class='col-6 freecell-frame' id='free-cells'>
          <div class='cell dropzone'></div>
          <div class='cell dropzone'></div>
          <div class='cell dropzone'></div>
          <div class='cell dropzone'></div>
      </div>
    </div>
    <div class='row'>
      <div class='col-12 tableau-frame'>
        <div class='tableau' id='tableau-1'>
          <img src='/images/jc.png' class='playing-card'>            
          <img src='/images/jd.png' class='playing-card'>            
          <img src='/images/qh.png' class='playing-card'>            
          <img src='/images/7c.png' class='playing-card'>            
          <img src='/images/8d.png' class='playing-card'>            
          <img src='/images/9s.png' class='playing-card'>            
          <img src='/images/th.png' class='playing-card'>            
          <img src='/images/jc.png' class='playing-card active'>            
        </div>
        <div class='tableau' id='tableau-2'>
          <img src='/images/ah.png' class='playing-card'>
        </div>
        <div class='tableau' id='tableau-3'>
          <img src='/images/4s.png' class='playing-card'>
        </div>
        <div class='tableau' id='tableau-4'>
          <img src='/images/7h.png' class='playing-card'>
        </div>
        <div class='tableau' id='tableau-5'>
          <img src='/images/qc.png' class='playing-card'>
        </div>
        <div class='tableau' id='tableau-6'>
          <img src='/images/td.png' class='playing-card'>
        </div>
        <div class='tableau' id='tableau-7'>
          <img src='/images/8h.png' class='playing-card'>
        </div>
        <div class='tableau' id='tableau-8'>
          <img src='/images/ah.png' class='playing-card draggable'>
        </div>
      </div>
    </div>
  </div>
</main>

<FooterBar/>

<style type="text/scss">
.playing-card {
  margin:0; padding:0;
  width: 11.5vw;
  height: 16.1vw;  // 11.5 * 1.4
  border-radius: 0.5vw;
  box-shadow: 0px 0px 4px 1px rgba(0,0,0,0.5);
  &.faded {
    opacity: 0.1;    
  }
  &.active {
    box-shadow: 0px 0px 2vw 1vw rgba(255,255,0,0.5);
  }
}


/* card is 400px x 560px */

.playing-card {
  margin:0; padding:0;
  width: 11.5vw;
  height: 16.1vw;  // 11.5 * 1.4
  border-radius: 0.5vw;
  box-shadow: 0px 0px 4px 1px rgba(0,0,0,0.5);
  &.faded {
    opacity: 0.1;    
  }
  &.active {
    box-shadow: 0px 0px 2vw 1vw rgba(255,255,0,0.5);
  }
}

.freecell-frame, .foundation-frame {
  margin:0;
  padding: 0 0.5vw;
  width: 50%;
  height: 20vw;
  display: flex;
  align-items: center;
  flex-flow: row nowrap;
  justify-content: space-between;
  .cell {
    display: flex;
    justify-content: center;
    align-items: center;
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
  .cell.active {
    border: 1px solid #FFF; 
    background: rbga(255,255,255,0.5);
    box-shadow: 0px 0px 2vw 1vw rgba(255,255,0,0.5);
  }
}
.freecell-frame {
  justify-content: flex-end;
}
.foundation-frame {
  justify-content: flex-start;
}


.tableau-frame {
  height: 80vh;
  padding: 3vh 0;
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
}
.tableau {
  background: rgba(0,0,0,0.2);
  padding: 0; margin:0;
  width: 12vw;
  height: 70vh;
  margin: 0 1px;
  display: flex;
  align-items: center;
  flex-direction: column;
  .playing-card:first-child {
    margin-top: 0;
  }
  .playing-card {
    margin-top: -8vw;
  }
}

/* draggable stuff */

.draggable {
  touch-action: none;
  user-select: none;
}
</style>