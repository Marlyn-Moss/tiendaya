export default function FiltroProductos({
  busqueda,
  onBuscar,
  categoria,
  onCategoria,
  categorias,
  orden,
  onOrdenar,
}) {
  return (
    <div className="filtros">
      <div className="campo">
        <label htmlFor="buscar">Buscar</label>
        <input
          id="buscar"
          type="search"
          placeholder="Ej. mochila"
          value={busqueda}
          onChange={(e) => onBuscar(e.target.value)}
        />
      </div>
      <div className="campo">
        <label htmlFor="categoria">Categoría</label>
        <select id="categoria" value={categoria} onChange={(e) => onCategoria(e.target.value)}>
          <option value="todas">Todas</option>
          {categorias.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>
      <div className="campo">
        <label htmlFor="orden">Ordenar por</label>
        <select id="orden" value={orden} onChange={(e) => onOrdenar(e.target.value)}>
          <option value="relevancia">Relevancia</option>
          <option value="precio-asc">Precio: menor a mayor</option>
          <option value="precio-desc">Precio: mayor a menor</option>
          <option value="nombre">Nombre</option>
        </select>
      </div>
    </div>
  );
}
