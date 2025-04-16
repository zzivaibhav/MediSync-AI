import { DataTypes } from 'sequelize';
import {db} from '../db/db.js';
 
  const Visit = db.define('Visit', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    uniqueID:{
        type : DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    status:{
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "Processing"
    },

    purpose:{
        type: DataTypes.STRING,
        allowNull: false
    },

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
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'Doctors',
        key: 'cognitoReference'
      }
    },
    patientID:{
       type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Patients',
          key: 'id'
        }
    }
  }, {
    tableName: 'Visits',
    timestamps: true
  });

export default Visit;