const express = require('express');
const app = express();
const db = require("./scr/models/index.js");
const cookie = require('cookie-parser');
const cors = require('cors');
const bodyParser = require('body-parser');


const ApiRouter = require("./scr/routes/router.js");

global.__basedir = __dirname;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookie());
app.use(bodyParser.json());
app.use(cors());

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
  });

app.use('/', ApiRouter);


const start = async() => {
    // await db.sequelize.sync({ force: true });

    let port = 5000;
    app.listen(port, () => {
        console.log(`Running at localhost:${port}`);
    })
}

start();