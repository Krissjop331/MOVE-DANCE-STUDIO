'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;



module.exports = db;



// const dbConfig = require("../config/db.config");
// const {Sequelize, DataTypes} = require("sequelize");
// const sequelize = new Sequelize("move_dance_studio", "root", "", {
//     host: "localhost",
//     dialect: "mysql",
//     operatorsAliases: false,

//     pool: {
//         max: 5,
//         min: 0,
//         acquire: 30000,
//         idle: 100000,
//     },
// });



// // Проверяем подключение к базе данных
// sequelize.authenticate()
//   .then(() => {
//     console.log('Подключение к базе данных установлено.');
//   })
//   .catch((error) => {
//     console.error('Ошибка подключения к базе данных:', error);
//   });

// const db = {};

// db.Sequelize = Sequelize;
// db.sequelize = sequelize;



// db.users = require('./user')(sequelize, DataTypes);

// db.avtor = require('./avtor')(sequelize, DataTypes);

// module.exports = db;
