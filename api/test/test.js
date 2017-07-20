const fs = require('fs');

const recursiveRequire = (path) => {
  fs.readdirSync(path).forEach((file) => {
    const fullPath = `${path}/${file}`;
    if (fs.lstatSync(fullPath).isDirectory()) {
      return recursiveRequire(fullPath);
    }
    /* eslint-disable import/no-dynamic-require */
    require(fullPath);
    /* eslint-enable import/no-dynamic-require */
  });
};

recursiveRequire(require('path').join(__dirname, 'spec'));
