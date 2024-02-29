import { DataTypes } from 'sequelize';
import db from '../config/db.js';

const Project = db.define('projects', {
    id_project: {
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
        allowNull: false,
    },
    external_url: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    image_path: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    status: {
        type: DataTypes.ENUM('ON', 'OFF'),
        allowNull: false,
        defaultValue: 'ON',
    },
}, {
    underscored: true,
});

export default Project;
