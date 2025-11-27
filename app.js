const express = require('express');
const app = express();
const path = require('path');
const homerouter = require('./routes/home');
const uploadrouter = require('./routes/upload');
const bodyparser = require('body-parser');
// const loadrouter = require('./routes/loading')
const topython = require('./routes/image_post');
const resultRoute = require('./routes/result');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/results', express.static(path.join(__dirname, 'result_image'))); 

app.use(uploadrouter);
app.use(homerouter);
app.use(topython);
app.use(resultRoute);





app.listen(3000);