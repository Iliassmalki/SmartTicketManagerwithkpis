import db from '../../../backend/src/models/index.js';

const revenueByOrganizer = await db.Ticket.findAll({
  attributes: [
    [sequelize.fn('SUM', sequelize.col('price')), 'totalRevenue']
  ],
  include: [
    {
      model: Event,
      as: 'event',
      attributes: ['id', 'name'],
      include: [
        {
          model: User,
          as: 'Organizer',
          attributes: ['id', 'firstName', 'lastName']
        }
      ]
    }
  ],
  group: ['event.userId']
});

console.log(JSON.stringify(revenueByOrganizer, null, 2));
