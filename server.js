const express = require('express');
const app = express();
const port = 3000;

//middleware : mengizinkan express untuk membaca data json
app.use(express.json());

// DEFINISI ROUTE / ENDPOINT (Alamat URL)

//1. Endpoint homepage
app.get('/', (req, res) => {
    res.send('Selamat datang di API Kafe digital!');
});

//2. endpoint mengambil data menu
app.get('/api/menu', (req, res) => {
    const dataDummy = [
        { id: 1, nama_makanan: 'Nasi Goreng', harga: 15000},
        { id: 2, nama_makanan: 'Mie Goreng', harga: 12000}
    ];

    res.json(dataDummy);
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

    res.status(201).json({
        sukses : true,
        pesan : `data berhasil ditambahkan !`,
        data : {
            nama_menu : nama_makanan,
            harga_menu : parseInt(harga)
        }
    });
});

// Run Server
app.listen(port, () => {
    console.log(`Server siap digunakan. http://localhost:${port}`);
});