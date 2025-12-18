'use strict';
export default  (sequelize, DataTypes) => {
    const Event = sequelize.define('Event', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        price: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        picture: {
            type: DataTypes.STRING(255),
            allowNull: true, // URL to the picture
            validate: {
                isUrl: true
            }
        },
        
        category: {type: DataTypes.ENUM('MUSIC', 'SPORT', 'ART', 'TECH', 'LOISIRS'),
            allowNull: false,
            defaultValue: 'OTHER'
        },
         
        location: {
            type: DataTypes.STRING(255),
            allowNull: false,
             defaultValue: "Casablanca"
        },
        latitude: {
            type: DataTypes.DECIMAL(10, 7),
            allowNull: true,
             defaultValue: "33.56121911654841"
        },
        longitude: {
            type: DataTypes.DECIMAL(10, 7),
            allowNull: true,
            defaultValue: "-7.626197677869365"
        },
        startDate: {
            type: DataTypes.DATE,
            allowNull: false
        }

    }, {
        tableName: 'events',
        underscored: true
    });

    Event.associate = function (models) {
        // Many-to-Many with Users for purchases
        Event.belongsToMany(models.User, {
            through: 'Purchases',
            as: 'Purchasers',
            field:'userId',
            foreignKey: 'eventId',
            otherKey: 'userId'
        });
Event.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'Organizer'           // ← ALIAS OBLIGATOIRE
    });
        // One-to-Many with Reviews
        Event.hasMany(models.Review, {
            foreignKey: 'eventId',
            as: 'Reviews'
        });
    };

    return Event;
};