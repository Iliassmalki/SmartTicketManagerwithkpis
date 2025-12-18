'use strict';
import { Model } from 'sequelize';


export default   (sequelize, DataTypes) => {
  class Ticket extends Model {
    static associate(models) {
      // Ticket appartient à un User
      Ticket.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });

      // Ticket appartient à un Event
      Ticket.belongsTo(models.Event, { foreignKey: 'eventId', as: 'event' });
    }
  }

  Ticket.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      eventId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
     qrCode: {
    type: DataTypes.TEXT,     // ← TEXT, pas STRING (car DataURL est long)
    allowNull: false,
    unique: true
},
      price: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      used: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: 'Ticket',
      tableName: 'Tickets',
      indexes: [
        { fields: ['userId'] },
        { fields: ['eventId'] },
      ],
    }
  );

  return Ticket;
};
