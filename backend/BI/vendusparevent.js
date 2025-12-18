import db from '../../../backend/src/models/index.js';

const ticketsByEvent = await db.Ticket.findAll({
  attributes: [
    'eventId',
    [sequelize.fn('COUNT', sequelize.col('id')), 'ticketsSold'],
    [sequelize.fn('SUM', sequelize.col('price')), 'revenue']
  ],
  group: ['eventId'],
  include: [
    {
      model: Event,
      as: 'event',
      attributes: ['name', 'category']
    }
  ]
});

console.log(JSON.stringify(ticketsByEvent, null, 2));
