const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(`./kafe.db`);

//READ
function lihatMenu() {
    const query = `SELECT * FROM menu`;
    db.all(query, [], (err, rows)=>{
        if (err) {
            console.error(`Gagal menampilkan menu`, err.message);
            return;
        }
        console.log(`\n--- MENU KAFE ---`);
        console.table(rows);
    });
}

//UPDATE
function updateHarga(id, hargaBaru) {
    const query = "UPDATE menu SET harga = ? WHERE id = ?";
    db.run(query, [hargaBaru, id], function(err) {
        if (err) {
            console.error(`Gagal mengupdate harga menu`, err.message);
            return;
        }
        console.log(`\n Berhasil memperbarui data`);
        lihatMenu();
    });
}

//DELETE
function hapusMenu(id) {
    const query = "DELETE FROM menu WHERE id = ?";
    db.run(query, [id], function(err) {
        if (err) {
            console.error(`Gagal menghapus menu`, err.message);
            return;
        }
        console.log(`\n Berhasil menghapus data`);
        lihatMenu();
    });
}

db.serialize(() => {
    hapusMenu(3);
});