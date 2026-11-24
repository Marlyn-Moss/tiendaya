import { confirmarPedido, siguienteEstado } from '@/lib/pedidos';

const mochila = { id: 1, nombre: 'Mochila urbana', precio: 29.99, stock: 8 };
const camiseta = { id: 2, nombre: 'Camiseta Retos', precio: 15.5, stock: 20 };

describe('confirmarPedido · con dobles de prueba', () => {
  const pedido = {
    items: [
      { producto: mochila, cantidad: 2 },
      { producto: camiseta, cantidad: 1 },
    ],
    cliente: { nombre: 'Ana López', correo: 'ana@correo.com' },
  };
  let servicios;

  beforeEach(() => {
    servicios = {
      // Stub: la pasarela siempre aprueba
      pasarela: { cobrar: jest.fn(() => ({ aprobado: true })) },
      // Mock: verificamos después cómo lo llamaron
      correo: { enviar: jest.fn() },
    };
  });

  test('si el pago se aprueba, el pedido pasa a Pagado', () => {
    const resultado = confirmarPedido(pedido, servicios);
    expect(resultado).toEqual({ aprobado: true, estado: 'Pagado', total: 85.29, mensaje: '¡Pedido confirmado!' });
  });

  test('cobra el total correcto, una sola vez', () => {
    confirmarPedido(pedido, servicios);
    expect(servicios.pasarela.cobrar).toHaveBeenCalledWith(85.29);
    expect(servicios.pasarela.cobrar).toHaveBeenCalledTimes(1);
  });

  test('aplica el cupón antes de cobrar', () => {
    confirmarPedido({ ...pedido, cupon: 'RETOS10' }, servicios);
    expect(servicios.pasarela.cobrar).toHaveBeenCalledWith(76.76);
  });

  test('envía el correo de confirmación al cliente', () => {
    confirmarPedido(pedido, servicios);
    expect(servicios.correo.enviar).toHaveBeenCalledWith('ana@correo.com', 'Pedido confirmado por $85.29');
  });

  test('si el pago se rechaza, no envía correo y el pedido sigue en Creado', () => {
    servicios.pasarela.cobrar.mockReturnValue({ aprobado: false });
    const resultado = confirmarPedido(pedido, servicios);
    expect(resultado.estado).toBe('Creado');
    expect(resultado.aprobado).toBe(false);
    expect(servicios.correo.enviar).not.toHaveBeenCalled();
  });

  test('un carrito vacío no llega a la pasarela', () => {
    expect(() => confirmarPedido({ ...pedido, items: [] }, servicios)).toThrow('El carrito está vacío');
    expect(servicios.pasarela.cobrar).not.toHaveBeenCalled();
  });
});

describe('siguienteEstado · transición de estados', () => {
  test.each([
    ['Creado', 'pagar', 'Pagado'],
    ['Creado', 'cancelar', 'Cancelado'],
    ['Pagado', 'despachar', 'Enviado'],
    ['Pagado', 'cancelar', 'Cancelado'],
    ['Enviado', 'entregar', 'Entregado'],
  ])('%s + %s → %s', (estado, evento, destino) => {
    expect(siguienteEstado(estado, evento)).toBe(destino);
  });

  test('transición inválida: no se puede pagar un pedido entregado', () => {
    expect(() => siguienteEstado('Entregado', 'pagar')).toThrow('No se puede pagar un pedido en estado Entregado');
  });

  test('transición inválida: no se puede cancelar un pedido enviado', () => {
    expect(() => siguienteEstado('Enviado', 'cancelar')).toThrow();
  });
});
