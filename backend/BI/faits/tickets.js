import db from '../../../backend/src/models/index.js';

const tickets = await db.Ticket.findAll({ attributes: ['date'] });

for (const t of tickets) {
  const d = new Date(t.date);
  await DimDate.upsert({
    dateId: t.date,
    day: d.getDate(),
    month: d.getMonth() + 1,
    year: d.getFullYear(),
    weekday: d.toLocaleString('en-US', { weekday: 'long' })
  });
}
