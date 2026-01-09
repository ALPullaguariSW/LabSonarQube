import express from 'express';
import bodyParser from 'body-parser';
import zones from './routes/zones.js';
import spaces from './routes/spaces.js';
import HTTP_STATUS from './utils/httpStatus.js';

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((_req, res, next) => {
  // FIXED: Restricted CORS origin (better than *)
  res.header('Access-Control-Allow-Origin', 'http://localhost:8080');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  next();
});

// Routes
app.use('/zones', zones);
app.use('/spaces', spaces);

// eslint-disable-next-line no-unused-vars
app.use((_err, _req, res, _next) => {
  // FIXED: No stack trace leakage
  res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send('Internal Server Error');
});

app.listen(port, () => {
  // Server started
});