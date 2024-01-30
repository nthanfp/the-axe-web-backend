import User from './src/models/UserModel.js';

async function syncDB() {
    try {
        await User.sync({ force: true }); // force: true akan menjatuhkan tabel yang ada
        console.log('Database synchronized successfully');
    } catch (error) {
        console.error('Error synchronizing database:', error);
    } finally {
        process.exit();
    }
}

syncDB();
