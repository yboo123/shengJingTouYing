
import initSqlJs, { type Database } from 'sql.js'
interface DatabaseSingleton {
    instance: Database | null;
    init: () => Promise<void>;
}

const databaseSingleton: DatabaseSingleton = ((): DatabaseSingleton => {
    let _instance: Database | null = null;

    const init = async () => {
        if (_instance) return;

        const SQL = await initSqlJs({
            locateFile: (file) => `./${file}`,
        });

        const dbFilePath = 'bible.db';
        const response = await fetch(dbFilePath);
        const data = await response.arrayBuffer();
        _instance = new SQL.Database(new Uint8Array(data));
    };

    return {
        get instance() {
            return _instance;
        },
        init,
    };
})();

export default databaseSingleton;
