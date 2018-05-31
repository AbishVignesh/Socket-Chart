import path from 'path';
import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';

import Router from './routes/index'
import Defines from './config/index'

const app = express();
const server = new http.Server(app);
const port = Defines.APP_PORT;
const Routes = Router(server);

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', Routes);


server.listen(port, () => {
    console.log('Server started on port %d', port);
});

exports.server = server;