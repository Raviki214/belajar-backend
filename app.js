function hitunganDiskon(harga, diskon) {
    let hargaDiskon = harga - diskon ;
    return hargaDiskon;
}

let HargaGamepass = hitunganDiskon(100000, 20000);

console.log(`harga Gamepass setelah diskon adalah ${HargaGamepass}`);

console.log(`fitur diskon aktif`);