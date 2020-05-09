<script>	
	import interact from "interactjs";
	import {onMount} from 'svelte';

	import FooterBar from './footer.svelte';
	import HeaderBar from './header.svelte';
	import Tableau from './tableau.svelte';
	import HomeCell from './homecell.svelte';
	import FreeCell from './freecell.svelte';

	import {homecells, freecells, tableaus} from './stores.js';
	import Deck from './deck.js';
	import PlayingCard from './playing_card.js';


	// subscribe to changing cells/tableaus
  let home_cells, free_cells, tableau_cards;
  const unsub_homecells = homecells.subscribe(value => {
  	home_cells = value;
  });
	const unsub_freecells = freecells.subscribe(value => {
  	free_cells = value;
  });
	const unsub_tab = tableaus.subscribe(value => {
  	tableau_cards = value;
  });

	let gameOpts = {
		gameId: 136363,
		settings: {
			sound: true,
			animation: true,
			hints: true,
			level: 'easy',
			autoComplete: true
		}
	};
  let deck  = new Deck(gameOpts.gameId);
	tableau_cards = deck.toTableau();


  onMount(() => {
		//
		// drag action listeners
		//
		interact('.draggable').draggable({
		  listeners: {
		    start (event) {
		    	console.log(event.type, event.target.id);
		    },
		    move (event) {
		    	let target = event.target;
					let x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
					let y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;
		      target.style.transform = `translate(${x}px, ${y}px)`;
		      target.setAttribute('data-x',x);
		      target.setAttribute('data-y',y);
		    },
		    end (event) {
		    	let target = event.target;
		    	target.removeAttribute("data-y");
		    	target.removeAttribute("data-x");
		    	target.removeAttribute("style");
		    	console.log(event.type, event.target.id);
		    }
		  }
		});


		//
		// drop zone listeners
		//

		interact('.homecell').dropzone({
			accept: '.draggable',
			ondragenter (event) {
				let zone = event.target;
				if (zone.childElementCount == 0) {
			    zone.classList.add('drop-active');
				}
			},
			ondragleave (event) {
				event.target.classList.remove('drop-active');
			},
			ondrop (event) {
				event.target.classList.remove('drop-active');

				let card = event.relatedTarget;
				let tCard = new PlayingCard(card.id);
				let zone = event.target;
				console.log(home_cells[zone.dataset.index]);
				// if empty, only an A
				if (home_cells[zone.dataset.index].length == 0) {
					if (tCard.rank != 'A') {
						console.error("not an A ", tCard)
						return;
					}	
				} else {
					let cCard_id = home_cells[zone.dataset.index][home_cells[zone.dataset.index].length -1]
					let cCard = new PlayingCard(cCard_id);
					console.log(tCard.rank_val, cCard.rank_val)
					if ((tCard.suit != cCard.suit) || (tCard.rank_val != (cCard.rank_val + 1))) {
						console.error("Not valid card", tCard, cCard);
						return;
					}
				}

				// ok to add				
				home_cells[zone.dataset.index] = home_cells[zone.dataset.index].concat([card.id]);
				let list = tableau_cards[card.parentNode.dataset.index];
				let updated_list = list.filter(e => e !== card.id);
				tableau_cards[card.parentNode.dataset.index] = updated_list;
			}
		});


		interact('.freecell').dropzone({
			accept: '.draggable',
			ondragenter (event) {
				let zone = event.target;
				if (zone.childElementCount == 0) {
			    zone.classList.add('drop-active');
				}
			},
			ondragleave (event) {
				event.target.classList.remove('drop-active');
			},
			ondrop (event) {
				let card = event.relatedTarget;
				let zone = event.target;
				event.target.classList.remove('drop-active');
				zone.appendChild(card);
			}
		});
	});
</script>

<HeaderBar/>
<main>
	<div class='container-fluid'>
    <div class='row'>
      <div class='col-6 cellbox' id='home-cells'>
      	{#each home_cells as cards, index}
	      	<HomeCell cards={cards} index={index} />
        {/each}
      </div>
      <div class='col-6 cellbox' id='free-cells'>
      	{#each free_cells as cards, index}
	      	<FreeCell cards={cards} index={index} />
        {/each}
      </div>
    </div>
    <div class='row'>
			<div class='col-12 tableau-frame'>
				{#each tableau_cards as column, index}
					<Tableau cards={column} index={index} />
				{/each}
			</div>
    </div>
  </div>
</main>
<FooterBar/>


<style type="text/scss">
:global(.cell) {
	:global(.playing-card) {
		position:absolute !important;
		top:0; left:0;
	}
}

.cellbox {
  margin:0;
  padding: 0 0.5vw;
  width: 50%;
  height: 20vw;
  display: flex;
  align-items: center;
  flex-flow: row nowrap;
  justify-content: space-between;
}

#free-cells {
  justify-content: flex-end;
}
#home-cells {
  justify-content: flex-start;
}

.tableau-frame {
  height: 80vh;
  padding: 3vh 0;
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
}

</style>