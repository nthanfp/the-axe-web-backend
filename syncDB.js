import Tool from './src/models/ToolModel.js';
import User from './src/models/UserModel.js';

async function syncDB() {
    try {
        await User.sync({ alter: true }); // alter: true akan menjatuhkan tabel yang ada
        await Tool.sync({ alter: true, force: true });
        console.log('Database synchronized successfully');
    } catch (error) {
        console.error('Error synchronizing database:', error);
    } finally {
        process.exit();
    }
}

syncDB();
