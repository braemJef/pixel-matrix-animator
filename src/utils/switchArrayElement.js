import insertArrayElement from './insertArrayElement';
import removeArrayElement from './removeArrayElement';

function switchArrayElement(array, from, to) {
  const value = array[from];

  const arrayWithoutFrom = removeArrayElement(array, from);
  return insertArrayElement(arrayWithoutFrom, to, value);
}

export default switchArrayElement;
