module.exports = (sequelize, DataTypes) => {
    const Schedules = sequelize.define("Schedules", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        name: {
            type: DataTypes.STRING,
            require: true
        },
        classes_time: {
            type: DataTypes.STRING,
            require: true
        },
        
    }, {});
    
    Schedules.associate = function(models) {
        Schedules.hasMany(models.Rentals, { foreignKey: "schedule_id" });
        Schedules.belongsTo(models.User, { foreignKey: "user_id" });
    };


    return Schedules;
};