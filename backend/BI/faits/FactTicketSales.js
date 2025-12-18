const FactTicketSales = sequelize.define('fact_ticket_sales', {
  factId: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  eventId: { type: DataTypes.UUID, allowNull: false },
  organizerId: { type: DataTypes.UUID, allowNull: false },
  ticketsSold: { type: DataTypes.INTEGER, allowNull: false },
  revenue: { type: DataTypes.FLOAT, allowNull: false },
  dateId: { type: DataTypes.DATE, allowNull: false }
}, { timestamps: false });
export { FactTicketSales };