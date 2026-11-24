// Operaciones del carrito. Son funciones puras: nunca modifican la lista
// que reciben, siempre devuelven una nueva.
import { calcularIVA, costoEnvio, obtenerTasaDescuento, redondear } from './precios';

export function agregarItem(items, producto, cantidad = 1) {
  if (!Number.isInteger(cantidad) || cantidad <= 0) {
    throw new Error('La cantidad debe ser un entero mayor que cero');
  }
  const existente = items.find((item) => item.producto.id === producto.id);
  const nuevaCantidad = (existente ? existente.cantidad : 0) + cantidad;
  if (nuevaCantidad > producto.stock) {
    throw new Error(`No hay suficiente stock de ${producto.nombre}`);
  }
  if (existente) {
    return items.map((item) =>
      item.producto.id === producto.id ? { ...item, cantidad: nuevaCantidad } : item
    );
  }
  return [...items, { producto, cantidad }];
}

export function quitarItem(items, idProducto) {
  return items.filter((item) => item.producto.id !== idProducto);
}

export function cambiarCantidad(items, idProducto, cantidad) {
  if (cantidad <= 0) {
    return quitarItem(items, idProducto);
  }
  return items.map((item) => {
    if (item.producto.id !== idProducto) return item;
    if (cantidad > item.producto.stock) {
      throw new Error(`No hay suficiente stock de ${item.producto.nombre}`);
    }
    return { ...item, cantidad };
  });
}

export function contarUnidades(items) {
  return items.reduce((suma, item) => suma + item.cantidad, 0);
}

export function calcularResumen(items, cupon = '', esPremium = false) {
  const subtotal = redondear(
    items.reduce((suma, item) => suma + item.producto.precio * item.cantidad, 0)
  );
  const descuento = redondear(subtotal * obtenerTasaDescuento(cupon));
  const base = redondear(subtotal - descuento);
  const iva = calcularIVA(base);
  const envio = items.length === 0 ? 0 : costoEnvio(base, esPremium);
  const total = redondear(base + iva + envio);
  return { subtotal, descuento, iva, envio, total };
}
