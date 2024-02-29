import { DataTypes } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';

import db from '../config/db.js';

const User = db.define('users',
    {
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
            allowNull: false,
            validate: {
                len: {
                    args: [1, 255],
                    msg: 'First name must be between 1 and 255 characters',
                },
            },
        },
        last_name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: {
                    args: [1, 255],
                    msg: 'Last name must be between 1 and 255 characters',
                },
            },
        },
        phone: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                is: {
                    args: /^[0-9]+$/,
                    msg: 'Phone must contain only numbers',
                },
            },
        },
        role: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'MEMBER',
            validate: {
                isIn: {
                    args: [['MEMBER', 'ADMIN']],
                    msg: 'Invalid role',
                },
            },
        },
        api_key: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        otp_code: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        otp_expired: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        last_login: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        ip_address: {
            type: DataTypes.STRING,
            allowNull: true,
            validate: {
                isIP: {
                    msg: 'Invalid IP address format',
                },
            },
        },
    },
    {
        underscored: true,
    }
);

export default User;
