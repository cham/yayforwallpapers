const requiredVars = [
  'port',
  'psql-connection-string'
];

const argv = process.argv.filter(argStr => argStr.indexOf('--') === 0).reduce((memo, argStr) => {
  const matches = argStr.match(/^--([A-Za-z-]*?)=(.*?)$/);
  if (matches && matches.length) {
    memo[matches[1]] = matches[2];
  } else {
    memo[argStr.replace('--', '')] = undefined;
  }
  return memo;
}, {});

const env = () => {
  const props = {
    port: process.env.NS_Y4W_API_PORT,
    'psql-connection-string': process.env.NS_Y4W_PSQL_CONNECTION_STRING
  };
  Object.keys(props).forEach((key) => {
    if (props[key] === undefined) {
      delete props[key];
    }
  });
  return props;
};

const config = Object.assign({}, env(), argv);

const get = key => config[key];

const has = key => config.hasOwnProperty(key);

const throwIfNotInConfig = (key) => {
  if (!has(key)) {
    throw new Error(`${key} is required`);
  }
};

const required = () => {
  requiredVars.forEach(key => throwIfNotInConfig(key));
};

exports.get = get;
exports.has = has;
exports.required = required;
