const express = require("express");
const prisma = require("../prisma/db.js");
const app = express();
const bcrypt = require('bcrypt'); // Import library bcrypt untuk hashing password

const userLogin = async (req, res) => {
    if (req.method === 'GET') {
        const alert = '';
        res.render('login.ejs', { alert });
    }
    else if (req.method === 'POST') {
        const { username, password } = req.body;
        console.log('Username:', username);
        console.log('Password:', password);
        try {
            // Ambil data pengguna dari database berdasarkan username
            const user = await prisma.user.findFirst({
                where: {
                    username: username,
                },
                select: {
                    user_id: true,
                    password: true,
                },
            });
            console.log('database:', password);


            let alert = '';

            // Jika pengguna tidak ditemukan
            if (!user) {
                // Mengirim alert jika username salah atau tidak ditemukan
                res.render('login.ejs', { alert: 'Username tidak ditemukan' });
            } else {
                // Jika password tidak valid
                if (user.password !== password) {
                    // Mengirim alert jika password salah
                    res.render('login.ejs', { alert: 'Password Anda Salah' });
                } else {
                    console.log(user);
                    // Simpan ID pengguna dalam sesi
                    req.session.isLoggedIn = true; // Menandai bahwa pengguna telah berhasil login
                    req.session.user_id = user.user_id; // Set user id
                    req.session.username = username; // Set username user

                    // Cek apakah pengguna adalah admin
                    if (username === 'admin' && user.password === 'admin123') {
                        req.session.isAdmin = true;
                    }

                    console.log("login berhasil sebagai", req.session.username);

                    if (req.session.isAdmin) {
                        // Redirect ke halaman admin jika pengguna adalah admin
                        res.redirect('/admin');
                    } else {
                        // Redirect ke halaman home jika pengguna adalah bukan admin
                        res.redirect('/home');
                    }
                }
            }
        } catch (error) {
            console.error('Gagal login', error);
            res.send('Terjadi kesalahan');
        }
    }
};

const userRegister = async (req, res) => {
    if (req.method === 'GET') {
        res.render('register.ejs');
    }
    else if (req.method === 'POST') {
        const { username, email, password } = req.body;

        try {
            // Periksa apakah username sudah ada di database
            const existingUser = await prisma.user.findUnique({
                where: {
                    username: username,
                },
            });

            if (existingUser) {
                // Username sudah ada, mungkin tampilkan pesan kesalahan atau arahkan ke halaman lain
                res.render('register.ejs', { alert: 'Username sudah digunakan' });
            } else {
                // Hash password sebelum menyimpannya
                const hashedPassword = await bcrypt.hash(password, 10);

                // Tambahkan pengguna baru ke database menggunakan Prisma
                const newUser = await prisma.user.create({
                    data: {
                        username: username,
                        email: email,
                        password: hashedPassword,
                    },
                });

                res.redirect('/home');
            }
        } catch (error) {
            console.error('Gagal register', error);
            res.send('Terjadi kesalahan');
        }
    }
};

const userLogout = (req, res) => {
    if(req.method === "GET"){
    // Hapus data sesi atau cookie yang menandakan bahwa pengguna telah login
    if (req.session) {
        req.session.isLoggedIn = false; // Misalnya, Anda bisa mengatur isLoggedIn menjadi false
        req.session.user_id = null; // Menghapus user ID
        req.session.username = null; // Menghapus username
        req.session.isAdmin = false; // Menghapus status admin jika diperlukan
        req.session.destroy((err) => {
            if (err) {
                console.error('Gagal logout:', err);
            }
        });
    }

    // Redirect pengguna ke halaman login atau halaman lain yang sesuai
    res.redirect('/login');

    }
};

module.exports = { userLogin, userRegister, userLogout }