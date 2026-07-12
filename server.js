const express = require('express');
const {Client} = require('pg');
const app = express();
const port = 3000;

const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres', 
    password: 'Data_P0stS8L',
    port: 5432,
});

client.connect((err) => {
    if (err) {
        console.error('Koneksi ke database gagal:', err.stack);
    } else {
        console.log('Koneksi ke database berhasil.');
    }
});

//middleware : mengizinkan express untuk membaca data json
app.use(express.json());

// DEFINISI ROUTE / ENDPOINT (Alamat URL)

//1. Endpoint homepage
app.get('/', (req, res) => {
    res.send('Selamat datang di API Kafe digital!');
});

//2. endpoint Read Menu
app.get('/api/menu', (req, res) => {
    const query = 'SELECT * FROM menu ORDER BY id ASC;';

    client.query(query, (err, result) => {
        if (err) {
            console.error(err.stack);
            return res.status(500).json({ sukses: false, pesan: '❌ Gagal mengambil data dari database.' });
        }

        // Kirim data asli hasil SELECT dari database (.rows)
        res.status(200).json({
            sukses: true,
            total_data: result.rowCount,
            data: result.rows
        });
    });
});

//3. endpoint Add Menu
app.post('/api/menu', (req, res)=> {
    const{ nama_makanan, harga} = req.body;
    
    if(!nama_makanan || !harga){
        return res.status(400).json({
            sukses : false,
            pesan : `Nama makanan dan harga wajib diisi !`
        });
    }

    if(isNaN(parseInt(harga))){
        return res.status(400).json({
            sukses : false,
            pesan : `Harga harus berupa angka !`
        });
    }

    const query = 'INSERT INTO menu (nama_makanan, harga) VALUES ($1, $2) RETURNING *';

    client.query(query, [nama_makanan, harga], (err, result) => {

        if (err) {
            console.error(err.stack);
            return res.status(500).json({
                sukses : false,
                pesan : `Terjadi kesalahan pada server !`
            });
        }
        res.status(201).json({
        sukses : true,  
        pesan : `data berhasil ditambahkan !`,
        data : result.rows[0]
        });
    });
});

//4. endpoint Update Menu
app.put('/api/menu/:id', (req,res) => {
    const {id} =  req.params;
    const {harga} = req.body;

    if(!harga || isNaN(parseInt(harga))){
        return res.status(400).json({
            sukses : false,
            pesan : `Harga harus berupa angka !`
        });
    }

    const query = 'UPDATE menu SET harga = $1 WHERE id = $2 RETURNING *';

    client.query(query, [harga, id], (err, result) => {
        if (err) {
            console.error(err.stack);
            return res.status(500).json({
                sukses : false,
                pesan : `Gagal update data !`
            });
        }
        if(result.rowCount === 0){
            return res.status(404).json({
                sukses : false,
                pesan : `Data dengan id ${id} tidak ditemukan !`
            });
        }
            
        res.status(200).json({
            sukses : true,
            pesan : `Data berhasil di update!`,
            data : result.rows[0]
        });
    });
});

//5. endpoint Delete Menu
app.post('/api/menu/delete/:id', (req,res) => {
    const {id} = req.params;

    const query = 'DELETE FROM menu WHERE id = $1 RETURNING *';

    client.query(query, [id], (err, result) => {
        if (err) {
            console.error(err.stack);
            return res.status(500).json({
                sukses : false,
                pesan : `Gagal menghapus data !`
            });
        }
        if(result.rowCount === 0) {
            return res.status(404).json({
                sukses : false,
                pesan : `Data dengan id ${id} tidak ditemukan !`
            });
        }

        res.status(200).json({
            sukses : true,
            pesan : `Data berhasil dihapus !`,
            data : result.rows[0]
        });
    });
});

// Run Server
app.listen(port, () => {
    console.log(`Server siap digunakan. http://localhost:${port}`);
});