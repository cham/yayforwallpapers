const positiveInteger = (str) => {
  const int = parseInt(str, 10);
  if (isNaN(int) || int < 1 || int.toString() !== str) {
    return false;
  }
  return int;
};

const username = (str) => {
  if (str && str.length && /^[a-z0-9_-]{3,20}$/i.test(str)) {
    return str;
  }
  return false;
};

const password = (str) => {
  if (str && str.length > 5) {
    return str;
  }
  return false;
};

exports.positiveInteger = positiveInteger;
exports.username = username;
exports.password = password;
