<script>
  export let id = 'Kc';
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