//db.js
require('dotenv').config(); // Mengimpor variabel lingkungan dari .env
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

module.exports = prisma;