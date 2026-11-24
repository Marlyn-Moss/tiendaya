'use client';
import { useState } from 'react';
import { calcularResumen } from '@/lib/carrito';
import { esCuponValido, formatearMoneda } from '@/lib/precios';

export default function ResumenCarrito({ items, cupon, onAplicarCupon, onQuitar, onCambiarCantidad }) {
  const [codigo, setCodigo] = useState(cupon);

  if (items.length === 0) {
    return (
      <aside className="carrito" aria-label="Carrito">
        <h2>Tu carrito</h2>
        <p className="vacio">Tu carrito está vacío.</p>
      </aside>
    );
  }

  const resumen = calcularResumen(items, cupon);

  function aplicar(e) {
    e.preventDefault();
    onAplicarCupon(codigo.trim());
  }

  return (
    <aside className="carrito" aria-label="Carrito">
      <h2>Tu carrito</h2>

      <ul className="items">
        {items.map(({ producto, cantidad }) => (
          <li key={producto.id}>
            <span className="nombre">{producto.nombre}</span>
            <div className="cantidad">
              <button
                type="button"
                aria-label={`Disminuir ${producto.nombre}`}
                onClick={() => onCambiarCantidad(producto.id, cantidad - 1)}
              >
                −
              </button>
              <span aria-label={`Cantidad de ${producto.nombre}`}>{cantidad}</span>
              <button
                type="button"
                aria-label={`Aumentar ${producto.nombre}`}
                onClick={() => onCambiarCantidad(producto.id, cantidad + 1)}
              >
                +
              </button>
            </div>
            <span>{formatearMoneda(producto.precio * cantidad)}</span>
            <button
              type="button"
              className="quitar"
              aria-label={`Quitar ${producto.nombre}`}
              onClick={() => onQuitar(producto.id)}
            >
              Quitar
            </button>
          </li>
        ))}
      </ul>

      <form className="cupon" onSubmit={aplicar}>
        <label htmlFor="cupon">Cupón</label>
        <input id="cupon" value={codigo} onChange={(e) => setCodigo(e.target.value)} />
        <button type="submit">Aplicar</button>
      </form>
      {cupon && (
        <p className={esCuponValido(cupon) ? 'ok' : 'error'}>
          {esCuponValido(cupon) ? `Cupón ${cupon.toUpperCase()} aplicado` : 'Cupón no válido'}
        </p>
      )}

      <dl className="totales">
        <div>
          <dt>Subtotal</dt>
          <dd>{formatearMoneda(resumen.subtotal)}</dd>
        </div>
        {resumen.descuento > 0 && (
          <div>
            <dt>Descuento</dt>
            <dd>{`-${formatearMoneda(resumen.descuento)}`}</dd>
          </div>
        )}
        <div>
          <dt>Envío</dt>
          <dd>{resumen.envio === 0 ? 'Gratis' : formatearMoneda(resumen.envio)}</dd>
        </div>
        <div>
          <dt>IVA (13 %)</dt>
          <dd>{formatearMoneda(resumen.iva)}</dd>
        </div>
        <div className="total">
          <dt>Total</dt>
          <dd>{formatearMoneda(resumen.total)}</dd>
        </div>
      </dl>
    </aside>
  );
}
