const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Organisation = sequelize.define('Organisation', {
    orgId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  }, {
    tableName: 'Organisations',
  });

  Organisation.associate = (models) => {
    Organisation.belongsToMany(models.User, { through: 'UserOrganisations' });
  };

  return Organisation;
};
