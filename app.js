const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(`./kafe.db`);

db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS menu (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nama_makanan TEXT,
            harga INTEGER)
            `);

            console.log('Database and table created successfully.');
});
db.close();