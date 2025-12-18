
import db from '../../../backend/src/models/index.js';
const topUsers = await db.Ticket.findAll({
  attributes: [
    'userId',
    [sequelize.fn('COUNT', sequelize.col('id')), 'ticketsBought'],
    [sequelize.fn('SUM', sequelize.col('price')), 'totalSpent']
  ],
  group: ['userId'],
  include: [
    {
      model: User,
      as: 'user',
      attributes: ['firstName', 'lastName', 'email']
    }
  ],
  order: [[sequelize.literal('ticketsBought'), 'DESC']],
  limit: 10
});

console.log(JSON.stringify(topUsers, null, 2));
