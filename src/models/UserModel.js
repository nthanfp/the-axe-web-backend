import { DataTypes } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';
import db from '../config/db.js';

const User = db.define('users', {
    uuid: {
        type: DataTypes.UUID,
        defaultValue: uuidv4,
        primaryKey: true,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: {
                msg: 'Invalid email format',
            },
        },
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: {
                args: [6, 255],
                msg: 'Password must be between 6 and 255 characters',
            },
        },
    },
    first_name: {
        type: DataTypes.STRING,
        validate: {
            len: {
                args: [1, 255],
                msg: 'First name must be between 1 and 255 characters',
            },
        },
    },
    last_name: {
        type: DataTypes.STRING,
        validate: {
            len: {
                args: [1, 255],
                msg: 'Last name must be between 1 and 255 characters',
            },
        },
    },
    phone: {
        type: DataTypes.STRING,
        validate: {
            is: {
                args: /^[0-9]+$/,
                msg: 'Phone must contain only numbers',
            },
        },
    },
    registered_date: {
        type: DataTypes.DATE,
        defaultValue: db.literal('CURRENT_TIMESTAMP'),
    },
    last_login: {
        type: DataTypes.DATE,
    },
    ip_address: {
        type: DataTypes.STRING,
        validate: {
            isIP: {
                msg: 'Invalid IP address format',
            },
        },
    },
});

export default User;
