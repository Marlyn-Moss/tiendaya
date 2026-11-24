import { formatearMoneda } from '@/lib/precios';

export default function TarjetaProducto({ producto, onAgregar }) {
  const agotado = producto.stock === 0;

  return (
    <article className="tarjeta" aria-label={producto.nombre}>
      <p className="categoria">{producto.categoria}</p>
      <h3>{producto.nombre}</h3>
      <p className="precio">{formatearMoneda(producto.precio)}</p>
      {agotado ? (
        <p className="agotado">Agotado</p>
      ) : (
        <p className="stock">{`Disponibles: ${producto.stock}`}</p>
      )}
      <button type="button" onClick={() => onAgregar(producto)} disabled={agotado}>
        {agotado ? 'Sin stock' : 'Agregar al carrito'}
      </button>
    </article>
  );
}
