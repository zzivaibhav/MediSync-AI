import { DataTypes } from 'sequelize';
import {db} from '../db/db.js';
 
  const Doctor = db.define('Doctor', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
  name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isEmail: true
      },
      unique: true
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: false
    } ,
    cognitoReference:{
      type: DataTypes.STRING,
      allowNull: true
    }
   ,
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'Doctors',
    timestamps: true
  });

 
 

export default Doctor;