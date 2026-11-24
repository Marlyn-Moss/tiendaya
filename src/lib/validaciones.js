// Validación del formulario de compra.
export function validarCheckout({ nombre = '', correo = '', codigoPostal = '' } = {}) {
  const errores = {};

  if (nombre.trim().length < 3) {
    errores.nombre = 'Escribe tu nombre completo';
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo.trim())) {
    errores.correo = 'Escribe un correo válido';
  }
  if (!/^\d{4}$/.test(codigoPostal.trim())) {
    errores.codigoPostal = 'El código postal debe tener 4 dígitos';
  }

  return { valido: Object.keys(errores).length === 0, errores };
}
