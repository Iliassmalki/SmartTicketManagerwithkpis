'use strict';

export default   (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        firstName: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        lastName: {
            type: DataTypes.STRING(100),
            allowNull: true
        },
        email: {
            type: DataTypes.STRING(255),
            allowNull: false,
            unique: true,
            validate: { isEmail: true }
        },
       revenue: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            defaultValue: 0.00
        },
        password: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        role: {
           type: DataTypes.ENUM('user', 'admin', 'organizer'),
            allowNull: false,
            defaultValue: 'user'
        },
        nbticketssold: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        location:{
            type: DataTypes.STRING(255),
            allowNull: false,
            defaultValue: 'Casablanca'
        },
          latitude: {
            type: DataTypes.DECIMAL(10, 7),
            allowNull: true,
            defaultValue: 33.56121911654841
        },
        longitude: {
            type: DataTypes.DECIMAL(10, 7),
            allowNull: true,
            defaultValue: -7.626197677869365
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
           
        }
    }, {
        tableName: 'users',
        underscored: true,
        scopes: {
            admins:       { where: { role: 'admin' } },
            organizers:   { where: { role: 'organizer' } },
            clients:      { where: { role: 'user' } }
        }
    });

    User.associate = function(models) {
        User.hasMany(models.Ticket, { foreignKey: 'userId', as: 'tickets' });
        User.hasMany(models.Event,{ foreignKey: 'userId', as:'events'});
        User.hasMany(models.Event, {
        foreignKey: 'userId',
        as: 'organizedEvents'
    });

    User.belongsToMany(models.Event, {
        through: 'Purchases',
        as: 'purchasedEvents',
        foreignKey: 'userId',
        otherKey: 'eventId'
    });
    };

    return User;
};
