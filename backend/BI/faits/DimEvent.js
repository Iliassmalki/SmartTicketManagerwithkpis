const DimEvent = sequelize.define('dim_event', {
  eventId: { type: DataTypes.UUID, primaryKey: true },
  name: DataTypes.STRING,
  category: DataTypes.STRING,
  location: DataTypes.STRING,
  price: DataTypes.FLOAT
}, { timestamps: false });

const DimUser = sequelize.define('dim_user', {
  userId: { type: DataTypes.UUID, primaryKey: true },
  firstName: DataTypes.STRING,
  lastName: DataTypes.STRING,
  role: DataTypes.STRING,
  location: DataTypes.STRING
}, { timestamps: false });

const DimDate = sequelize.define('dim_date', {
  dateId: { type: DataTypes.DATE, primaryKey: true },
  day: DataTypes.INTEGER,
  month: DataTypes.INTEGER,
  year: DataTypes.INTEGER,
  weekday: DataTypes.STRING
}, { timestamps: false });
