import { writable } from 'svelte/store';

let table = [
  [], [], [], [],[], [], [], [], // tableaus
  [], [], [], [], // homecells
  [], [], [], [], // freecells
]
export const columns  = writable(table);