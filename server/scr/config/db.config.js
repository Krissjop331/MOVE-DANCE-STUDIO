module.exports.db = {
    HOST: "localhost",
    USER: "root",
    PASSWORD: "",
    DB: "move_dance_studio",
    dialect: "mysql",
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
};

module.exports = {
    secret: "SECRET_KEY_RANDOM"
}