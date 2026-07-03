const fs = require('fs');
const ejs = require('ejs');
const templates = [
  'views/home.ejs',
  'views/comprar-ticket.ejs',
  'views/admin-peliculas.ejs',
  'views/admin-reportes.ejs',
  'views/admin-pelicula-form.ejs',
  'views/detalle-pelicula.ejs',
  'views/pago-ticket.ejs',
  'views/mis-tickets.ejs',
  'views/login.ejs'
];
let failed = false;
templates.forEach((file) => {
  try {
    const text = fs.readFileSync(file, 'utf8');
    ejs.compile(text, { filename: file });
    console.log(`${file} ok`);
  } catch (error) {
    console.error(`ERROR in ${file}:`, error.message);
    failed = true;
  }
});
process.exit(failed ? 1 : 0);
