const express = require('express');
const routes = require('./routes');
// import sequelize connection
const sequelize = require('./config/connection'); //Obtains the connection.js, which is responsible for creating the connection to our database.

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(routes);

// sync sequelize models to the database, then turn on the server
//sequelize.sync uses the connection file to syncronize the models. Makes sure the models in our files match the ones in our database.
//force: true- resets the database if there is an error, force false is for just connecting to the database.
sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}!`);
  });
});