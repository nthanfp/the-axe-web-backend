import Project from './src/models/ProjectModel.js';
import Tool from './src/models/ToolModel.js';
import User from './src/models/UserModel.js';

async function syncDB() {
    try {
        // alter: true akan drop tabel yang ada
        await User.sync({ alter: true, force: false }); 
        await Tool.sync({ alter: true, force: false });
        await Project.sync({ alter: true, force: true });
        console.log('Database synchronized successfully');
    } catch (error) {
        console.error('Error synchronizing database:', error);
    } finally {
        process.exit();
    }
}

syncDB();
