'use strict';
export default   (sequelize, DataTypes) => {
    const Review = sequelize.define('Review', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true
        },
        userId: {
            type: DataTypes.UUID,
            allowNull: false
        },
        eventId: {
            type: DataTypes.UUID,
            allowNull: false
        },
        rating: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 1,
                max: 5
            }
        },
        comment: {
            type: DataTypes.TEXT,
            allowNull: true
        }
    }, {
        tableName: 'reviews',
        underscored: true
    });

    Review.associate = function (models) {
        Review.belongsTo(models.User, {
            foreignKey: 'userId',
            as: 'User'
        });
        Review.belongsTo(models.Event, {
            foreignKey: 'eventId',
            as: 'Event'
        });
    };

    return Review;
};