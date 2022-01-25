function insertArrayElement(array, index, value) {
  return [
    ...array.slice(0, index),
    value,
    ...array.slice(index),
  ];
}

export default insertArrayElement;