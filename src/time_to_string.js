export const timeToString = function(seconds) {
  let date = new Date(null);
  date.setSeconds(seconds);
  let hours = date.getUTCHours();
  let mins  = date.getUTCMinutes();
  let secs  = date.getUTCSeconds();

  let str = '';
  if (hours > 0) str += `${hours}:`;
  str += (mins > 9) ? `${mins}:` : `0${mins}:`;
  str += (secs > 9) ? `${secs}` : `0${secs}`;
  return str;
}