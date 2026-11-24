// Reglas de precios de TiendaYa: IVA, cupones y envío.
export const TASA_IVA = 0.13;
export const MINIMO_ENVIO_GRATIS = 50;
export const COSTO_ENVIO = 5;
export const CUPONES = {
  RETOS10: 0.1,
  RETOS20: 0.2,
};

export function redondear(valor) {
  return Math.round((valor + Number.EPSILON) * 100) / 100;
}

export function calcularIVA(monto) {
  if (monto < 0) {
    throw new Error('El monto no puede ser negativo');
  }
  return redondear(monto * TASA_IVA);
}

export function obtenerTasaDescuento(cupon = '') {
  return CUPONES[cupon.trim().toUpperCase()] ?? 0;
}

export function esCuponValido(cupon = '') {
  return obtenerTasaDescuento(cupon) > 0;
}

export function costoEnvio(monto, esPremium = false) {
  if (monto < 0) {
    throw new Error('El monto no puede ser negativo');
  }
  return monto >= MINIMO_ENVIO_GRATIS || esPremium ? 0 : COSTO_ENVIO;
}

export function formatearMoneda(valor) {
  return `$${valor.toFixed(2)}`;
}
