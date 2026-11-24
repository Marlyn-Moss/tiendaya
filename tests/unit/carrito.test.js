import {
  agregarItem,
  calcularResumen,
  cambiarCantidad,
  contarUnidades,
  quitarItem,
} from '@/lib/carrito';

const mochila = { id: 1, nombre: 'Mochila urbana', precio: 29.99, stock: 8 };
const camiseta = { id: 2, nombre: 'Camiseta Retos', precio: 15.5, stock: 20 };
const teclado = { id: 4, nombre: 'Teclado mecánico', precio: 25, stock: 10 };
const monitor = { id: 6, nombre: 'Monitor 24 pulgadas', precio: 180, stock: 2 };

describe('agregarItem', () => {
  test('agrega un producto a un carrito vacío', () => {
    const items = agregarItem([], mochila);
    expect(items).toEqual([{ producto: mochila, cantidad: 1 }]);
  });

  test('suma la cantidad si el producto ya estaba', () => {
    let items = agregarItem([], mochila, 2);
    items = agregarItem(items, mochila, 3);
    expect(items).toHaveLength(1);
    expect(items[0].cantidad).toBe(5);
  });

  test('no modifica el carrito original (función pura)', () => {
    const original = [{ producto: mochila, cantidad: 1 }];
    agregarItem(original, camiseta);
    expect(original).toHaveLength(1);
  });

  test('límite de stock: se puede llegar exactamente al stock', () => {
    expect(agregarItem([], monitor, 2)[0].cantidad).toBe(2);
  });

  test('límite de stock: no se puede pasar del stock', () => {
    const items = agregarItem([], monitor, 2);
    expect(() => agregarItem(items, monitor)).toThrow('No hay suficiente stock de Monitor 24 pulgadas');
  });

  test.each([0, -1, 1.5])('rechaza la cantidad %s', (cantidad) => {
    expect(() => agregarItem([], mochila, cantidad)).toThrow('La cantidad debe ser un entero mayor que cero');
  });
});

describe('quitarItem', () => {
  test('quita solo el producto indicado', () => {
    const items = [
      { producto: mochila, cantidad: 1 },
      { producto: camiseta, cantidad: 2 },
    ];
    expect(quitarItem(items, 1)).toEqual([{ producto: camiseta, cantidad: 2 }]);
  });
});

describe('cambiarCantidad', () => {
  const items = [{ producto: mochila, cantidad: 2 }];

  test('cambia la cantidad de un producto', () => {
    expect(cambiarCantidad(items, 1, 4)[0].cantidad).toBe(4);
  });

  test('con cantidad 0 quita el producto', () => {
    expect(cambiarCantidad(items, 1, 0)).toEqual([]);
  });

  test('no permite pasar del stock', () => {
    expect(() => cambiarCantidad(items, 1, 9)).toThrow('No hay suficiente stock');
  });
});

describe('contarUnidades', () => {
  test('suma las cantidades de todos los productos', () => {
    const items = [
      { producto: mochila, cantidad: 2 },
      { producto: camiseta, cantidad: 3 },
    ];
    expect(contarUnidades(items)).toBe(5);
  });
});

describe('calcularResumen', () => {
  const items = [
    { producto: mochila, cantidad: 2 },
    { producto: camiseta, cantidad: 1 },
  ];

  test('un carrito vacío da todo en cero', () => {
    expect(calcularResumen([])).toEqual({ subtotal: 0, descuento: 0, iva: 0, envio: 0, total: 0 });
  });

  test('sin cupón: subtotal $75.48, IVA $9.81, envío gratis', () => {
    expect(calcularResumen(items)).toEqual({
      subtotal: 75.48,
      descuento: 0,
      iva: 9.81,
      envio: 0,
      total: 85.29,
    });
  });

  test('con RETOS10: descuento de $7.55 y total de $76.76', () => {
    const resumen = calcularResumen(items, 'RETOS10');
    expect(resumen.descuento).toBe(7.55);
    expect(resumen.total).toBe(76.76);
  });

  test('una compra pequeña paga $5 de envío', () => {
    const resumen = calcularResumen([{ producto: camiseta, cantidad: 1 }]);
    expect(resumen.envio).toBe(5);
    expect(resumen.total).toBe(22.52);
  });

  test('el envío se calcula después del descuento', () => {
    // $50 en teclados con RETOS10 quedan en $45: vuelve a pagar envío
    const dosTeclados = [{ producto: teclado, cantidad: 2 }];
    expect(calcularResumen(dosTeclados).envio).toBe(0);
    expect(calcularResumen(dosTeclados, 'RETOS10').envio).toBe(5);
  });

  test('un cliente premium no paga envío', () => {
    expect(calcularResumen([{ producto: camiseta, cantidad: 1 }], '', true).envio).toBe(0);
  });
});
