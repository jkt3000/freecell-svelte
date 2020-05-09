import { writable } from 'svelte/store';

let cells   = [[], [], [], []];
let columns = cells.concat(cells);


// contents of each column and cell

export const homecells = writable(cells);
export const freecells = writable(cells);
export const tableaus  = writable(columns);