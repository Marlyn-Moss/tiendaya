import {
  calcularIVA,
  costoEnvio,
  esCuponValido,
  formatearMoneda,
  obtenerTasaDescuento,
  redondear,
} from '@/lib/precios';

describe('redondear', () => {
  test('deja dos decimales', () => {
    expect(redondear(2.5987)).toBe(2.6);
  });

  test('corrige el error de punto flotante', () => {
    // 0.1 + 0.2 da 0.30000000000000004 en JavaScript
    expect(redondear(0.1 + 0.2)).toBe(0.3);
  });
});

describe('calcularIVA', () => {
  test('el IVA de $100 es $13', () => {
    expect(calcularIVA(100)).toBe(13);
  });

  test('redondea a dos decimales', () => {
    expect(calcularIVA(15.5)).toBe(2.02);
  });

  test('un monto negativo lanza un error', () => {
    expect(() => calcularIVA(-1)).toThrow('El monto no puede ser negativo');
  });
});

describe('obtenerTasaDescuento', () => {
  test.each([
    ['RETOS10', 0.1],
    ['RETOS20', 0.2],
    ['retos10', 0.1],
    ['  RETOS20  ', 0.2],
    ['FALSO', 0],
    ['', 0],
  ])('el cupón "%s" da una tasa de %s', (cupon, tasa) => {
    expect(obtenerTasaDescuento(cupon)).toBe(tasa);
  });

  test('sin argumento no hay descuento', () => {
    expect(obtenerTasaDescuento()).toBe(0);
  });
});

describe('esCuponValido', () => {
  test('reconoce un cupón existente', () => {
    expect(esCuponValido('RETOS10')).toBe(true);
  });

  test('rechaza un cupón inexistente', () => {
    expect(esCuponValido('GRATIS')).toBe(false);
  });
});

describe('costoEnvio · valores límite', () => {
  test.each([
    [0, 5],
    [49.99, 5],
    [50, 0],
    [50.01, 0],
  ])('con $%s el envío cuesta $%s', (monto, esperado) => {
    expect(costoEnvio(monto)).toBe(esperado);
  });

  test('un cliente premium nunca paga envío', () => {
    expect(costoEnvio(10, true)).toBe(0);
  });

  test('un monto negativo lanza un error', () => {
    expect(() => costoEnvio(-5)).toThrow();
  });
});

describe('formatearMoneda', () => {
  test('agrega el signo y dos decimales', () => {
    expect(formatearMoneda(15.5)).toBe('$15.50');
    expect(formatearMoneda(0)).toBe('$0.00');
  });
});
