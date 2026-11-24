// Búsqueda, filtros y orden del catálogo. Tampoco modifican la lista original.
function normalizar(texto) {
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '');
}

export function buscarProductos(productos, texto = '') {
  const consulta = normalizar(texto.trim());
  if (!consulta) return productos;
  return productos.filter((p) => normalizar(p.nombre).includes(consulta));
}

export function filtrarPorCategoria(productos, categoria = 'todas') {
  if (categoria === 'todas') return productos;
  return productos.filter((p) => p.categoria === categoria);
}

export function ordenarProductos(productos, criterio = 'relevancia') {
  const copia = [...productos];
  switch (criterio) {
    case 'precio-asc':
      return copia.sort((a, b) => a.precio - b.precio);
    case 'precio-desc':
      return copia.sort((a, b) => b.precio - a.precio);
    case 'nombre':
      return copia.sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'));
    default:
      return copia;
  }
}

export function obtenerCategorias(productos) {
  return [...new Set(productos.map((p) => p.categoria))].sort((a, b) => a.localeCompare(b, 'es'));
}
