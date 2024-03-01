import { UserSeeder } from "./UserSeeder.js";


const runSeeder = async () => {
    try {
        await UserSeeder(); // Panggil fungsi seeder dari model User
        console.log('User seeder executed successfully');
    } catch (error) {
        console.error('Error executing user seeder:', error);
    }
};

runSeeder();