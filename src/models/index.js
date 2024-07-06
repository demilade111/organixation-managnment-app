const { Sequelize } = require('sequelize');
const sequelize = require('../config/database');

// Models
const User = require('./user')(sequelize, Sequelize.DataTypes);
const Organisation = require('./organisation')(sequelize, Sequelize.DataTypes);

// Relationships
const defineRelationships = () => {
  User.belongsToMany(Organisation, { through: 'UserOrganisations' });
  Organisation.belongsToMany(User, { through: 'UserOrganisations' });
};

defineRelationships();

// Database synchronization
const syncDatabase = async () => {
  try {
    if (process.env.NODE_ENV !== 'test') {
      await sequelize.sync({ alter: true }); // Use 'alter: true' for safe schema changes
      console.log('Database synced successfully');
    }
  } catch (error) {
    console.error('Error syncing database:', error);
  }
};

syncDatabase();

module.exports = {
  sequelize,
  User,
  Organisation,
};
