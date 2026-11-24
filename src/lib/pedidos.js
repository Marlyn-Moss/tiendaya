// Confirmación de pedidos y su ciclo de estados.
// La pasarela de pago y el correo llegan como parámetros (inyección de dependencias):
// así las pruebas pueden reemplazarlos por dobles.
import { calcularResumen } from './carrito';
import { formatearMoneda } from './precios';

export const TRANSICIONES = {
  Creado: { pagar: 'Pagado', cancelar: 'Cancelado' },
  Pagado: { despachar: 'Enviado', cancelar: 'Cancelado' },
  Enviado: { entregar: 'Entregado' },
  Entregado: {},
  Cancelado: {},
};

export function siguienteEstado(estadoActual, evento) {
  const destino = TRANSICIONES[estadoActual]?.[evento];
  if (!destino) {
    throw new Error(`No se puede ${evento} un pedido en estado ${estadoActual}`);
  }
  return destino;
}

export function confirmarPedido({ items, cliente, cupon = '' }, { pasarela, correo }) {
  if (!items || items.length === 0) {
    throw new Error('El carrito está vacío');
  }

  const { total } = calcularResumen(items, cupon);
  const pago = pasarela.cobrar(total);

  if (!pago.aprobado) {
    return { aprobado: false, estado: 'Creado', total, mensaje: 'El pago fue rechazado' };
  }

  correo.enviar(cliente.correo, `Pedido confirmado por ${formatearMoneda(total)}`);
  return {
    aprobado: true,
    estado: siguienteEstado('Creado', 'pagar'),
    total,
    mensaje: '¡Pedido confirmado!',
  };
}
