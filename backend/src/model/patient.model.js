import { DataTypes } from 'sequelize';
import {db} from '../db/db.js';
 
  const Patient = db.define('Patient', {
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
    DOB: {
      type: DataTypes.DATE,
      allowNull: false
    },
    image:{
      type: DataTypes.STRING,
      allowNull: true
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: false
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
    },
    doctorID :{
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Doctor',
        key: 'id'
      }
    }
  }, {
    tableName: 'Patients',
    timestamps: true
  });

export default Patient;