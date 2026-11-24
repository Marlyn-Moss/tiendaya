import { validarCheckout } from '@/lib/validaciones';

const datosValidos = { nombre: 'Ana López', correo: 'ana@correo.com', codigoPostal: '1101' };

describe('validarCheckout', () => {
  test('datos correctos no tienen errores', () => {
    expect(validarCheckout(datosValidos)).toEqual({ valido: true, errores: {} });
  });

  test('un formulario vacío tiene tres errores', () => {
    const { valido, errores } = validarCheckout({});
    expect(valido).toBe(false);
    expect(Object.keys(errores)).toHaveLength(3);
  });

  describe('nombre · valores límite', () => {
    test('2 letras no es suficiente', () => {
      expect(validarCheckout({ ...datosValidos, nombre: 'Al' }).errores.nombre).toBe('Escribe tu nombre completo');
    });

    test('3 letras es válido', () => {
      expect(validarCheckout({ ...datosValidos, nombre: 'Ana' }).valido).toBe(true);
    });

    test('los espacios no cuentan como letras', () => {
      expect(validarCheckout({ ...datosValidos, nombre: '   ' }).valido).toBe(false);
    });
  });

  describe('correo · particiones', () => {
    test.each(['anacorreo.com', 'ana@correo', 'ana @correo.com', ''])('"%s" no es válido', (correo) => {
      expect(validarCheckout({ ...datosValidos, correo }).errores.correo).toBe('Escribe un correo válido');
    });
  });

  describe('código postal · valores límite', () => {
    test.each(['110', '11011', '11A1', ''])('"%s" no es válido', (codigoPostal) => {
      expect(validarCheckout({ ...datosValidos, codigoPostal }).errores.codigoPostal).toBeDefined();
    });

    test('4 dígitos es válido', () => {
      expect(validarCheckout({ ...datosValidos, codigoPostal: '0000' }).valido).toBe(true);
    });
  });
});
