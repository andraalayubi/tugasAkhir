const express = require("express");
const prisma = require("../prisma/db.js");
const app = express();

const dataAdmin = async (req, res) => {
    if (req.method === 'GET') {
        try {
          const cartData = {}; // Objek yang akan berisi data dari tiga query

          // Query untuk mengambil jumlah penjualan per item
          const products = await prisma.product.findMany();
          cartData.products = products;
          
          // Query untuk mengambil penjualan terbaru
          const latestSalesWithUser = await prisma.cart.findMany({
            orderBy: {
              date: 'desc',
            },
            take: 5,
            include: {
              user: {
                select: {
                  username: true,
                },
              },
            },
          });
          
          cartData.latestSales = latestSalesWithUser;
          
          const produk1 = await prisma.cart.groupBy({
            by: ['date'],
            where: {
              product_id: 1,
            },
            _sum: {
              total: true,
            },
          });

          const produk2 = await prisma.cart.groupBy({
            by: ['date'],
            where: {
              product_id: 2,
            },
            _sum: {
              total: true,
            },
          });
                  
        
        //Mengirim data ke berkas admin.ejs
        res.render('admin.ejs', {
          dataAdmin: {
            cartData,
            produk1,
            produk2
            // tambahkan data lain jika diperlukan
          },
        });
        
        } catch (error) {
            console.error('Gagal mengambil data untuk admin', error);
        }
    }else if(req.method === 'POST'){
        const { product_id, quantity } = req.body;
        try {
            const updatedProduct = await prisma.product.update({
                where: { product_id: product_id },
                data: {
                  stock_quantity: {
                    increment: quantity,
                  },
                },
              });
        } catch (error) {
            console.error('Gagal menambah stock product', error);
        }
    }
}

module.exports = { dataAdmin }
