const express = require("express");
const prisma = require("../prisma/db.js");
const app = express();

// Menambah atau memanggil data Cart
const userCart = async (req, res) => {
    if (req.method === 'GET') {
        const userItems = await prisma.cart.findMany({
            where: {
                user_id: req.session.user_id,
            },
        });

        res.render('cart.ejs', { userItems });
    } else if (req.method === 'POST') {
        const { product_id, quantity, total } = req.body;

        try {
            // Lakukan operasi upsert ke dalam tabel "cart"
            const upsertedItem = await prisma.cart.upsert({
                where: {
                    user_id_product_id: {
                        user_id: req.session.user_id,
                        product_id: product_id,
                    },
                },
                update: {
                    quantity: {
                        increment: quantity, // Increment jumlah jika item sudah ada
                    },
                    total: {
                        increment: total, // Increment total jika item sudah ada
                    },
                },
                create: {
                    user_id: req.session.user_id,
                    product_id: product_id,
                    quantity: quantity,
                    total: total,
                },
            });

            res.redirect('/cart'); // Redirect ke halaman keranjang setelah upsert
        } catch (error) {
            console.error('Gagal menambah item dalam keranjang:', error);
            // Tangani error sesuai kebutuhan aplikasi Anda
            res.status(500).json({ error: 'Terjadi kesalahan saat menambah item dalam keranjang' });
        }
    }
};

// const updateCartItem = async (req, res) => {
//     const { cart_id } = req.body;
//     if (req.method === 'POST') {
//         try {
//             const updatedCartItem = await prisma.cart.update({
//                 where: {
//                     cart_id: cart_id, // Tentukan cart_id yang sesuai
//                 },
//                 data: {
//                     quantity: newQuantity, // Update quantity baru
//                 },
//             });

//             res.status(200).json({ message: 'Quantity item dalam keranjang berhasil diubah' });
//         } catch (error) {
//             console.error('Gagal mengupdate quantity item dalam keranjang:', error);
//             // Tangani error sesuai kebutuhan aplikasi Anda
//             res.status(500).json({ error: 'Terjadi kesalahan saat mengupdate quantity item dalam keranjang' });
//         }
//     }
// };

const deleteCartItem = async (req, res) => {
    const { cart_id } = req.body;
    if (req.method === 'POST') {
        try {
            const deleteCartItem = await prisma.cart.delete({
                where: {
                    cart_id: cart_id, // Tentukan cart_id yang sesuai
                },
            });
            // Lakukan sesuatu setelah berhasil mengupdate item dalam keranjang

            // Misalnya, memberikan respons ke klien
            res.status(200).json({ message: 'Quantity item dalam keranjang berhasil diubah' });
        } catch (error) {
            console.error('Gagal mengupdate quantity item dalam keranjang:', error);
            // Tangani error sesuai kebutuhan aplikasi Anda
            res.status(500).json({ error: 'Terjadi kesalahan saat mengupdate quantity item dalam keranjang' });
        }
    }
};

module.exports = { userCart, deleteCartItem }