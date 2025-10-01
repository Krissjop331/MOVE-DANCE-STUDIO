module.exports = (sequelize, DataTypes) => {
    const Rentals = sequelize.define("Rentals", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        }
    }, {});

    Rentals.associate = function(models) {
        Rentals.belongsTo(models.User, { foreignKey: "user_id" });
        Rentals.belongsTo(models.Schedules, { foreignKey: "schedule_id" });
    };

    return Rentals;
};