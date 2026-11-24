import { render, screen } from '@testing-library/react';
import ListaProductos from '@/components/ListaProductos';

const productos = [
  { id: 1, nombre: 'Mochila urbana', categoria: 'Accesorios', precio: 29.99, stock: 8 },
  { id: 2, nombre: 'Camiseta Retos', categoria: 'Ropa', precio: 15.5, stock: 20 },
];

describe('ListaProductos', () => {
  test('muestra una tarjeta por producto', () => {
    render(<ListaProductos productos={productos} onAgregar={() => {}} />);
    expect(screen.getAllByRole('article')).toHaveLength(2);
  });

  test('sin productos muestra un mensaje', () => {
    render(<ListaProductos productos={[]} onAgregar={() => {}} />);
    expect(screen.getByText('No encontramos productos con esa búsqueda.')).toBeInTheDocument();
    expect(screen.queryByRole('article')).not.toBeInTheDocument();
  });
});
