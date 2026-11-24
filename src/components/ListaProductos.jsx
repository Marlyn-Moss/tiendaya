import TarjetaProducto from './TarjetaProducto';

export default function ListaProductos({ productos, onAgregar }) {
  if (productos.length === 0) {
    return <p className="vacio">No encontramos productos con esa búsqueda.</p>;
  }

  return (
    <section className="grid" aria-label="Productos">
      {productos.map((producto) => (
        <TarjetaProducto key={producto.id} producto={producto} onAgregar={onAgregar} />
      ))}
    </section>
  );
}
