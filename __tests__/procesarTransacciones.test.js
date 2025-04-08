const procesarTransacciones = require('../procesarTransacciones');

jest.mock('fs');
jest.mock('csv-parser');
const fs = require('fs');
const csv = require('csv-parser');

describe('Procesamiento de transacciones', () => {
  test('debería calcular el balance final, el mayor monto y el conteo de transacciones', async () => {
    const mockStream = {
      pipe: jest.fn().mockReturnThis(),
      on: jest.fn().mockImplementation(function (event, callback) {
        if (event === 'data') {
          callback({ id: '1', tipo: 'Crédito', monto: '100.00' });
          callback({ id: '2', tipo: 'Débito', monto: '50.00' });
          callback({ id: '3', tipo: 'Crédito', monto: '200.00' });
          callback({ id: '4', tipo: 'Débito', monto: '75.00' });
          callback({ id: '5', tipo: 'Crédito', monto: '150.00' });
        }
        if (event === 'end') {
          callback();
        }
        return this;
      }),
    };

    fs.createReadStream.mockReturnValue(mockStream);

    const resultado = await procesarTransacciones('data.csv');

    expect(resultado.balanceFinal).toBe('325.00');
    expect(resultado.mayorMonto.id).toBe('3');
    expect(resultado.mayorMonto.monto).toBe('200.00');
    expect(resultado.conteoTransacciones.credito).toBe(3);
    expect(resultado.conteoTransacciones.debito).toBe(2);
  });

  test('debería manejar errores correctamente', async () => {
    fs.createReadStream.mockImplementation(() => {
      throw new Error('Error al leer el archivo');
    });

    await expect(procesarTransacciones('data.csv')).rejects.toThrow('Error al leer el archivo');
  });
});
