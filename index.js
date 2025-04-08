const procesarTransacciones = require('./procesarTransacciones');

async function generarReporte() {
  try {
    const resultado = await procesarTransacciones('data.csv');

    console.log('Reporte de Transacciones');
    console.log('---------------------------------------------');
    console.log(`Balance Final: ${resultado.balanceFinal}`);
    console.log(`Transacción de Mayor Monto: ID ${resultado.mayorMonto.id} - ${resultado.mayorMonto.monto}`);
    console.log(`Conteo de Transacciones: Crédito: ${resultado.conteoTransacciones.credito} Débito: ${resultado.conteoTransacciones.debito}`);
  } catch (error) {
    console.error('Error al procesar el archivo:', error);
  }
}

generarReporte();
