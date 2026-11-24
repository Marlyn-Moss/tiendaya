'use client';
import { useState } from 'react';
import { validarCheckout } from '@/lib/validaciones';

const VACIO = { nombre: '', correo: '', codigoPostal: '' };

export default function FormularioCheckout({ onConfirmar }) {
  const [datos, setDatos] = useState(VACIO);
  const [errores, setErrores] = useState({});

  function cambiar(e) {
    setDatos({ ...datos, [e.target.name]: e.target.value });
  }

  function enviar(e) {
    e.preventDefault();
    const resultado = validarCheckout(datos);
    setErrores(resultado.errores);
    if (resultado.valido) {
      onConfirmar(datos);
    }
  }

  return (
    <form className="checkout" onSubmit={enviar} noValidate>
      <h2>Datos de entrega</h2>

      <label htmlFor="nombre">Nombre completo</label>
      <input id="nombre" name="nombre" value={datos.nombre} onChange={cambiar} />
      {errores.nombre && <p role="alert">{errores.nombre}</p>}

      <label htmlFor="correo">Correo electrónico</label>
      <input id="correo" name="correo" type="email" value={datos.correo} onChange={cambiar} />
      {errores.correo && <p role="alert">{errores.correo}</p>}

      <label htmlFor="codigoPostal">Código postal</label>
      <input id="codigoPostal" name="codigoPostal" value={datos.codigoPostal} onChange={cambiar} />
      {errores.codigoPostal && <p role="alert">{errores.codigoPostal}</p>}

      <button type="submit">Confirmar compra</button>
    </form>
  );
}
