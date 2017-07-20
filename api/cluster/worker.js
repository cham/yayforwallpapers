const express = require('express');
const bodyParser = require('body-parser');
const routemaster = require('routemaster');
const config = require('../config');

const app = express();
const port = config.get('port');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true,
}));

app.use('/v1/', routemaster({
  directory: '../routes',
  Router: express.Router
}));

app.listen(port, () => {
  console.log(`Worker listening on port ${port}`);
});
