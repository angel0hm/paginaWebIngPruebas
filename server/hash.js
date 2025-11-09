// generar-hash.js
import bcrypt from 'bcryptjs';

const password = 'Admin123!';
const saltRounds = 10;

const hash = await bcrypt.hash(password, saltRounds);
console.log('Hash generado:', hash);
