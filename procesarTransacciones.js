const fs = require('fs');
const csv = require('csv-parser');

function procesarTransacciones(archivoCSV) {
  return new Promise((resolve, reject) => {
    let balanceFinal = 0;
    let transaccionesCredito = 0;
    let transaccionesDebito = 0;
    let transaccionesMayorMonto = { id: null, monto: 0 };

    fs.createReadStream(archivoCSV)
      .pipe(csv())
      .on('data', (row) => {
        const monto = parseFloat(row.monto);

        balanceFinal += (row.tipo === 'Crédito') ? monto : -monto;

        if (row.tipo === 'Crédito') {
          transaccionesCredito++;
        } else if (row.tipo === 'Débito') {
          transaccionesDebito++;
        }

        if (monto > transaccionesMayorMonto.monto) {
          transaccionesMayorMonto = { id: row.id, monto };
        }
      })
      .on('end', () => {
        resolve({
          balanceFinal: balanceFinal.toFixed(2),
          mayorMonto: {
            id: transaccionesMayorMonto.id,
            monto: transaccionesMayorMonto.monto.toFixed(2),
          },
          conteoTransacciones: {
            credito: transaccionesCredito,
            debito: transaccionesDebito,
          }
        });
      })
      .on('error', (error) => {
        reject(error);
      });
  });
}

module.exports = procesarTransacciones;
