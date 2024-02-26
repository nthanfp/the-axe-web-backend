import Tool from './src/models/ToolModel.js';
import User from './src/models/UserModel.js';

async function syncDB() {
    try {
        await User.sync({ force: false }); // force: true akan menjatuhkan tabel yang ada
        await Tool.sync({ force: false });
        console.log('Database synchronized successfully');
    } catch (error) {
        console.error('Error synchronizing database:', error);
    } finally {
        process.exit();
    }
}

syncDB();
