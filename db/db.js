const { Sequelize, DataTypes, Op } = require('sequelize')

const {
  DATABASE_URL
  } = process.env


const sequelize = new Sequelize(DATABASE_URL , {
  logging: false,   //Loging disabled
  dialectOptions: {
    ssl:{
      require:true,
      rejectUnauthorized: false
    } 
  }
})


sequelize.authenticate()
  .then(() => console.log('Postgres database connected'))
  .catch(error => console.log('Something goes wrong ' + error.message))

module.exports = { sequelize, DataTypes, Op}
