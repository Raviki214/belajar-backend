const { Client } = require('pg');
const readline = require('readline');

// 1. Konfigurasi Kredensial Server PostgreSQL
const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres', 
    password: 'Data_P0stS8L', // ⚠️ GANTI dengan password kamu!
    port: 5432,
});

// Setup input terminal dengan Promise agar bisa di-await
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
const askQuestion = (queryText) => {
    return new Promise((resolve) => rl.question(queryText, resolve));
};

const MAKSIMAL_MENU = 3;

// ==========================================
// 2. DEFINISI FUNGSI CRUD BERBASIS PROMISE
// ==========================================

function buatTabel() {
    const query = `
        CREATE TABLE IF NOT EXISTS menu (
            id SERIAL PRIMARY KEY,
            nama_makanan VARCHAR(100) NOT NULL,
            harga INT NOT NULL
        );
    `;
    return client.query(query);
}

function lihatMenu() {
    const query = 'SELECT * FROM menu ORDER BY id ASC;';
    return client.query(query).then(res => {
        console.log('\n--- DAFTAR MENU DI DATABASE ---');
        console.table(res.rows);
    });
}

function cekDanHapusTerlama() {
    const queryHitung = 'SELECT COUNT(*) FROM menu;';
    return client.query(queryHitung).then(res => {
        // PostgreSQL mengembalikan count dalam bentuk string di res.rows[0].count
        const jumlahData = parseInt(res.rows[0].count);
        
        if (jumlahData > MAKSIMAL_MENU) {
            const queryHapusTerlama = `
                DELETE FROM menu 
                WHERE id = (SELECT id FROM menu ORDER BY id ASC LIMIT 1);
            `;
            return client.query(queryHapusTerlama).then(() => {
                console.log(`\n⚠️ Sistem Otomatis: Batas maksimal ${MAKSIMAL_MENU} menu tercapai. Menu paling awal otomatis dihapus!`);
            });
        }
    });
}

// ==========================================
// 3. LOGIKA UTAMA APLIKASI (LOOPING INTERAKTIF)
// ==========================================
async function mulaiAplikasi() {
    let berjalan = true;

    while (berjalan) {
        // 1. Minta input nama menu
        const nama = await askQuestion('\nMasukkan nama menu baru (atau ketik "exit" untuk keluar): ');
        
        // Cek kondisi keluar secara bersih
        if (nama.trim().toLowerCase() === 'exit') {
            console.log('Keluar dari program. Sampai jumpa!');
            berjalan = false;
            break;
        }

        if (nama.trim() === '') {
            console.log('❌ Nama menu tidak boleh kosong!');
            continue; // Ulangi loop dari atas jika input kosong
        }

        // 2. Minta input harga
        const hargaInput = await askQuestion('Masukkan harga: ');
        const harga = parseInt(hargaInput);
        
        if (isNaN(harga)) {
            console.log('❌ Harga harus berupa angka! Silakan coba lagi dari awal.');
            continue; // Ulangi loop jika harga bukan angka
        }

        try {
            // 3. Jalankan INSERT ke PostgreSQL
            const queryInsert = 'INSERT INTO menu (nama_makanan, harga) VALUES ($1, $2);';
            await client.query(queryInsert, [nama, harga]);
            console.log(`\n✅ Berhasil menambahkan: ${nama}`);

            // 4. Jalankan sistem otomatisasi antrean FIFO
            await cekDanHapusTerlama();

            // 5. Tampilkan tabel terbaru sebelum loop berulang
            await lihatMenu();

        } catch (error) {
            console.error('❌ Terjadi kesalahan pada database:', error.message);
        }
    }

    // Tutup resource secara bersih saat keluar dari loop while
    rl.close();
    await client.end();
}

// ==========================================
// 4. EKSEKUSI UTAMA (ENTRY POINT)
// ==========================================
client.connect()
    .then(() => {
        console.log('⚡ Sukses terhubung ke server PostgreSQL!');
        return buatTabel();
    })
    .then(() => {
        return lihatMenu();
    })
    .then(() => {
        mulaiAplikasi(); // Jalankan loop interaktif aman
    })
    .catch(err => {
        console.error('❌ Koneksi database gagal:', err.stack);
    });
