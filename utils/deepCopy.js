/**
  * Because the FreeSO API gives us arrays, we need to use this method with our skeletons.
  *
  * Object.assign and the spread syntax do not deep copy types
  * such as objects and arrays.
  *
  * Since our skeletons mirror JSON, this method is fine to use, but using it on a more
  * complex JS object may have unintended consequences.
  */

const deepCopy = complexObject => (
  JSON.parse(JSON.stringify(complexObject))
);

module.exports = deepCopy;
