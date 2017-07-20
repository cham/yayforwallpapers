const positiveInteger = (str) => {
  const int = parseInt(str, 10);
  if (isNaN(int) || int < 1 || int.toString() !== str) {
    return false;
  }
  return int;
};

exports.positiveInteger = positiveInteger;
