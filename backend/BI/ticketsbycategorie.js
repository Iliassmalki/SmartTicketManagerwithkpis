import db from '../../../backend/src/models/index.js';

const ticketsByCategory = await db.Ticket.findAll({
  attributes: [
    [sequelize.fn('COUNT', sequelize.col('Ticket.id')), 'ticketsSold']
  ],
  include: [
    {
      model: Event,
      as: 'event',
      attributes: ['category']
    }
  ],
  group: ['event.category']
});

console.log(JSON.stringify(ticketsByCategory, null, 2));
