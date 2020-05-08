<script>
  const PLAYING_CARDS = {
  values: [
    "Ac", "Ad", "Ah", "As", 
    "2c", "2d", "2h", "2s", 
    "3c", "3d", "3h", "3s", 
    "4c", "4d", "4h", "4s", 
    "5c", "5d", "5h", "5s", 
    "6c", "6d", "6h", "6s", 
    "7c", "7d", "7h", "7s", 
    "8c", "8d", "8h", "8s", 
    "9c", "9d", "9h", "9s", 
    "Tc", "Td", "Th", "Ts", 
    "Jc", "Jd", "Jh", "Js", 
    "Qc", "Qd", "Qh", "Qs", 
    "Kc", "Kd", "Kh", "Ks" 
  ],
  ranks: ['A','2','3','4','5','6','7','8','9','T','J','Q','K'],
  suits: ['c', 'd', 'h', 's']
  }

  export let id = PLAYING_CARDS.values[Math.floor(Math.random() * 52) - 1];


</script>

<img src='/images/{id}.png' class='playing-card'>

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

:global(.tableau) {
  .playing-card:first-child {
    margin-top: 0;
  }

  .playing-card {
    margin-top: -8vw;
  }
}
</style>