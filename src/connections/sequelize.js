const { Sequelize } = require('sequelize');
const { MYSQL_DB_HOST, MYSQL_DB_USER, MYSQL_DB_PASSWORD, MYSQL_DB_NAME } = require("../../config/key");

// Define your database configuration
const sequelize = new Sequelize({
    database: MYSQL_DB_NAME,
    username: MYSQL_DB_USER,
    password: MYSQL_DB_PASSWORD,
    host: MYSQL_DB_HOST,
    dialect: 'mysql',
});

// Test the database connection
const testConnection = async() => {
    try {
        await sequelize.authenticate();
        console.log('Database connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

// Export the Sequelize instance and the testConnection function
module.exports = { 
    sequelize,
    testConnection
};