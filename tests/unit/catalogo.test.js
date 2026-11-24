import {
  buscarProductos,
  filtrarPorCategoria,
  obtenerCategorias,
  ordenarProductos,
} from '@/lib/catalogo';

const catalogo = [
  { id: 1, nombre: 'Mochila urbana', categoria: 'Accesorios', precio: 29.99 },
  { id: 3, nombre: 'Audífonos inalámbricos', categoria: 'Tecnología', precio: 45 },
  { id: 5, nombre: 'Mouse óptico', categoria: 'Tecnología', precio: 12 },
  { id: 2, nombre: 'Camiseta Retos', categoria: 'Ropa', precio: 15.5 },
];

const nombres = (lista) => lista.map((p) => p.nombre);

describe('buscarProductos', () => {
  test('encuentra por parte del nombre', () => {
    expect(nombres(buscarProductos(catalogo, 'mochi'))).toEqual(['Mochila urbana']);
  });

  test('no distingue mayúsculas ni tildes', () => {
    expect(nombres(buscarProductos(catalogo, 'AUDIFONOS'))).toEqual(['Audífonos inalámbricos']);
    expect(nombres(buscarProductos(catalogo, 'optico'))).toEqual(['Mouse óptico']);
  });

  test('un texto vacío o con espacios devuelve todo', () => {
    expect(buscarProductos(catalogo, '   ')).toHaveLength(4);
  });

  test('si nada coincide devuelve una lista vacía', () => {
    expect(buscarProductos(catalogo, 'bicicleta')).toEqual([]);
  });
});

describe('filtrarPorCategoria', () => {
  test('filtra por la categoría indicada', () => {
    expect(nombres(filtrarPorCategoria(catalogo, 'Tecnología'))).toEqual([
      'Audífonos inalámbricos',
      'Mouse óptico',
    ]);
  });

  test('"todas" devuelve el catálogo completo', () => {
    expect(filtrarPorCategoria(catalogo, 'todas')).toBe(catalogo);
  });
});

describe('ordenarProductos', () => {
  test('por precio de menor a mayor', () => {
    expect(ordenarProductos(catalogo, 'precio-asc').map((p) => p.precio)).toEqual([12, 15.5, 29.99, 45]);
  });

  test('por precio de mayor a menor', () => {
    expect(ordenarProductos(catalogo, 'precio-desc')[0].nombre).toBe('Audífonos inalámbricos');
  });

  test('por nombre en orden alfabético', () => {
    expect(nombres(ordenarProductos(catalogo, 'nombre'))).toEqual([
      'Audífonos inalámbricos',
      'Camiseta Retos',
      'Mochila urbana',
      'Mouse óptico',
    ]);
  });

  test('no modifica el catálogo original', () => {
    ordenarProductos(catalogo, 'precio-asc');
    expect(catalogo[0].nombre).toBe('Mochila urbana');
  });
});

describe('obtenerCategorias', () => {
  test('devuelve las categorías sin repetir y ordenadas', () => {
    expect(obtenerCategorias(catalogo)).toEqual(['Accesorios', 'Ropa', 'Tecnología']);
  });
});
