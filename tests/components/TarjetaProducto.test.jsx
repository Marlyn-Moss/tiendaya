import { render, screen, fireEvent } from '@testing-library/react';
import TarjetaProducto from '@/components/TarjetaProducto';

const mochila = { id: 1, nombre: 'Mochila urbana', categoria: 'Accesorios', precio: 29.99, stock: 8 };

describe('TarjetaProducto', () => {
  test('muestra el nombre, la categoría y el precio', () => {
    render(<TarjetaProducto producto={mochila} onAgregar={() => {}} />);
    expect(screen.getByRole('heading', { name: 'Mochila urbana' })).toBeInTheDocument();
    expect(screen.getByText('Accesorios')).toBeInTheDocument();
    expect(screen.getByText('$29.99')).toBeInTheDocument();
    expect(screen.getByText('Disponibles: 8')).toBeInTheDocument();
  });

  test('al hacer clic avisa qué producto se agregó', () => {
    const onAgregar = jest.fn();
    render(<TarjetaProducto producto={mochila} onAgregar={onAgregar} />);
    fireEvent.click(screen.getByRole('button', { name: 'Agregar al carrito' }));
    expect(onAgregar).toHaveBeenCalledWith(mochila);
  });

  test('un producto agotado no se puede agregar', () => {
    const onAgregar = jest.fn();
    render(<TarjetaProducto producto={{ ...mochila, stock: 0 }} onAgregar={onAgregar} />);
    expect(screen.getByText('Agotado')).toBeInTheDocument();
    const boton = screen.getByRole('button', { name: 'Sin stock' });
    expect(boton).toBeDisabled();
    fireEvent.click(boton);
    expect(onAgregar).not.toHaveBeenCalled();
  });
});
