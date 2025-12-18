'use strict';
export default   (sequelize, DataTypes) => {
    const Purchase = sequelize.define('Purchase', {
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
        }
    }, {
        tableName: 'purchases',
        underscored: true
    });

    // No additional associations needed here since it's a junction table

    return Purchase;
};