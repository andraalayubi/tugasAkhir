//app.js
const express = require("express");
const session = require("express-session");
const cookieParser = require("cookie-parser");
// const cors = require("cors");
const prisma = require("./prisma/db.js");
const router = require("./routes/index.js");
const port = 5000;
const app = express();

app.set('view engine', 'ejs');
app.use(express.static("public"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json()); 

async function startServer() {
  try {
    await prisma.$connect();
    console.log("Database connected");
  } catch (error) {
    console.error("Gagal menyinkronkan tabel:", error);
  }

  app.use(
    session({
      secret: "secret-key", // Gantilah dengan kunci rahasia yang lebih kuat
      resave: false,
      saveUninitialized: true,
    })
  );

  // app.use(
  //   cors(
  //     // akses ke frontend
  //     { credentials: true, origin: "http://localhost:5001" }
  //   )
  // );

  app.use(cookieParser());
  app.use(express.json());
  app.use(router); // Pastikan Anda telah mendefinisikan router atau mengimpor router yang sesuai

  app.listen(port, () => {
    console.log(`Server berjalan di http://localhost:${port}`);
  });
}

startServer();