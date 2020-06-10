const randomRange = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
const shuffle = (array) => {
  const arr = array.slice(0);
  for (let i = arr.length - 1; i >= 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
  }
  return arr;
};
const chunk = (array, chunkSize) => {
  const temp = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    temp.push(array.slice(i, i + chunkSize));
  }
  return temp;
};
module.exports = {
  randomRange,
  shuffle,
  chunk,
};
