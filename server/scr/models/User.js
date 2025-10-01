module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define("User", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        first_name: {
            type: DataTypes.STRING,
            require: true,
        },
        last_name: {
            type: DataTypes.STRING,
            require: true,
        },
        email: {
            type: DataTypes.STRING,
            require: true,
            unique: true
        },
        password: {
            type: DataTypes.STRING,
            require: true,
            min: 6
        },
        admin: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        avtor: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    }, {});

    User.associate = function(models) {
        User.hasMany(models.Schedules, { foreignKey: "user_id"});
        User.hasMany(models.Rentals, { foreignKey: "user_id" });
        // User.hasMany(models.Schedules, { foreignKey: "user_id" });
    };

    return User;
};