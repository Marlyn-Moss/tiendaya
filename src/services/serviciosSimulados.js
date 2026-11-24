// Servicios externos simulados para usar la tienda sin conexión.
// En una tienda real aquí estarían la pasarela de pago y el servicio de correo.
export const pasarelaSimulada = {
  cobrar(total) {
    // Aprueba compras de hasta $1,000
    return { aprobado: total > 0 && total <= 1000 };
  },
};

export const correoSimulado = {
  enviar(destino, mensaje) {
    console.info(`[correo simulado] Para ${destino}: ${mensaje}`);
  },
};

export const serviciosSimulados = {
  pasarela: pasarelaSimulada,
  correo: correoSimulado,
};
