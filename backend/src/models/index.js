'use strict';

import { Sequelize, DataTypes } from 'sequelize';
import configFile from '../../config/config.js'; // note the .js extension
import UserModel from './user.js';
import EventModel from './event.js';
import ReviewModel from './reviews.js';
import TicketModel from './ticket.js';
import PurchaseModel from './purchase.js';
const env = process.env.NODE_ENV || 'development';
const config = configFile[env];

let sequelize;

if (config.url) {
  sequelize = new Sequelize(config.url, {
    dialect: config.dialect,
    dialectOptions: config.dialectOptions || {},
    logging: console.log
  });
} else {
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    {
      host: config.host,
      port: config.port || 5432,
      dialect: config.dialect,
      dialectOptions: config.dialectOptions || {},
      logging: console.log
    }
  );
}

const db = {};
db.sequelize = sequelize;
db.Sequelize = Sequelize;

// Import models
db.User = UserModel(sequelize, DataTypes);
db.Event = EventModel(sequelize, DataTypes);
db.Review = ReviewModel(sequelize, DataTypes);
db.Ticket = TicketModel(sequelize, DataTypes);
db.Purchases = PurchaseModel(sequelize, DataTypes);

// Setup associations
Object.values(db)
  .filter(model => typeof model.associate === 'function')
  .forEach(model => model.associate(db));

export default db;
