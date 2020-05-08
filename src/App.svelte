<script context="module">
	import interact from "interactjs";
</script>
<script>
	import { onMount } from 'svelte';
	import FooterBar from './footer.svelte';
	import HeaderBar from './header.svelte';
	import Card from './card.svelte';
	import {Deck} from './deck.js';

	let gameOpts = {
		gameId: 123,
		settings: {
			sound: true,
			animation: true,
			hints: true,
			level: 'easy',
			autoComplete: true
		}
	};

	let deck = new Deck(gameOpts.gameId);
	let cards = deck.toTableau();

	onMount(() => {
		const position = { x: 0, y: 0 }

		//
		// drag action listeners
		//
		interact('.draggable').draggable({
		  listeners: {
		    start (event) {
		    	console.log(event.type, event.target.id);
		    	// if parent card is selected, make sure to drag all cards from
		    	// parent -> child

		    },
		    move (event) {
		    	let target = event.target,
		    			x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
		    			y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

		      target.style.transform = `translate(${x}px, ${y}px)`;
		      target.setAttribute('data-x',x);
		      target.setAttribute('data-y',y);

		    },
		    end (event) {
		    	let target = event.target;
		    	// check if dropped over valid spot
		    		// if ok to leave there, update columns/cells
		    		// if not ok, revert back to original spot

		    	// move back to original spot	
		    	target.removeAttribute("style")
		    }
		  }
		});


		//
		// drop zone listeners
		//
		interact('.dropzone').dropzone({
			accept: '.draggable',
			dropactivate (event) {
				let card = event.relatedTarget;
				let zone = event.target;
				console.log("drop zone activated", zone.id);
				console.log("card is ", card.id);
			},
			ondrop (event) {
				let card = event.relatedTarget;
				let zone = event.target;
				
				console.log("drop zone dropped", zone.id);
				console.log("card is ", card.id);
			}


		});

	});
</script>

<HeaderBar/>
<main>
	<div class='container-fluid'>
    <div class='row'>
      <div class='col-6 foundation-frame' id='home-cells'>
        <div class='cell dropzone' id='homecell-1'><span>A</span></div>
        <div class='cell dropzone' id='homecell-2'><span>A</span></div>
        <div class='cell dropzone' id='homecell-3'><span>A</span></div>
        <div class='cell dropzone' id='homecell-4'><span>A</span></div>
      </div>
      <div class='col-6 freecell-frame' id='free-cells'>
        <div class='cell dropzone' id='freecell-1'></div>
        <div class='cell dropzone' id='freecell-2'></div>
        <div class='cell dropzone' id='freecell-3'></div>
        <div class='cell dropzone' id='freecell-4'></div>
      </div>
    </div>
    <div class='row'>
			<div class='col-12 tableau-frame'>
				{#each cards as column, index}
					<div class='tableau' id="tableau-{index}">
						{#each column as card}
				  		<Card id={card}/>
				  	{/each}
					</div>
				{/each}
			</div>
    </div>
  </div>
</main>
<FooterBar/>


<style type="text/scss">
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
	}

	/* draggable stuff */

	.draggable {
	  touch-action: none;
	  user-select: none;
	}
</style>