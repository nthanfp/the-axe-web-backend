import bcrypt from 'bcrypt';
import { faker } from '@faker-js/faker';

import User from '../../models/UserModel.js';

const generateRandomIP = () => {
    // Generate random IP address
    const ipSegments = [];
    for (let i = 0; i < 4; i++) {
        ipSegments.push(Math.floor(Math.random() * 256));
    }
    return ipSegments.join('.');
};

const UserSeeder = async () => {
    try {
        // Generate and save 100 users
        const users = [];
        for (let i = 0; i < 10; i++) {
            const randomEmail = faker.internet.email();
            const hashedPassword = await bcrypt.hash(faker.internet.password(), 10);
            users.push({
                email: randomEmail.toLowerCase(),
                password: hashedPassword,
                first_name: faker.person.firstName(),
                last_name: faker.person.lastName(),
                phone: `08${faker.string.numeric({length: 10})}`,
                role: 'MEMBER',
                ip_address: generateRandomIP(),
            });
        }
        await User.bulkCreate(users);
        console.log('Seed users created successfully');
    } catch (error) {
        console.error('Error creating seed users:', error);
    }
};

export { UserSeeder };