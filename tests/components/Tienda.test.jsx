// Prueba de integración de componentes: la tienda completa con servicios simulados.
import { render, screen, fireEvent, within } from '@testing-library/react';
import Tienda from '@/components/Tienda';

const productos = [
  { id: 1, nombre: 'Mochila urbana', categoria: 'Accesorios', precio: 29.99, stock: 8 },
  { id: 2, nombre: 'Camiseta Retos', categoria: 'Ropa', precio: 15.5, stock: 20 },
  { id: 6, nombre: 'Monitor 24 pulgadas', categoria: 'Tecnología', precio: 180, stock: 1 },
];

function crearServicios(aprobado = true) {
  return {
    pasarela: { cobrar: jest.fn(() => ({ aprobado })) },
    correo: { enviar: jest.fn() },
  };
}

function agregar(nombre) {
  const tarjeta = screen.getByRole('article', { name: nombre });
  fireEvent.click(within(tarjeta).getByRole('button', { name: 'Agregar al carrito' }));
}

function comprar() {
  fireEvent.change(screen.getByLabelText('Nombre completo'), { target: { value: 'Ana López' } });
  fireEvent.change(screen.getByLabelText('Correo electrónico'), { target: { value: 'ana@correo.com' } });
  fireEvent.change(screen.getByLabelText('Código postal'), { target: { value: '1101' } });
  fireEvent.click(screen.getByRole('button', { name: 'Confirmar compra' }));
}

describe('Tienda', () => {
  test('empieza con el carrito vacío y sin formulario de compra', () => {
    render(<Tienda productos={productos} servicios={crearServicios()} />);
    expect(screen.getByText('Carrito: 0')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Confirmar compra' })).not.toBeInTheDocument();
  });

  test('agregar productos actualiza el contador y el carrito', () => {
    render(<Tienda productos={productos} servicios={crearServicios()} />);
    agregar('Mochila urbana');
    agregar('Mochila urbana');
    expect(screen.getByText('Carrito: 2')).toBeInTheDocument();
    const carrito = screen.getByRole('complementary', { name: 'Carrito' });
    expect(within(carrito).getByText('Mochila urbana')).toBeInTheDocument();
  });

  test('el buscador filtra la lista de productos', () => {
    render(<Tienda productos={productos} servicios={crearServicios()} />);
    fireEvent.change(screen.getByLabelText('Buscar'), { target: { value: 'camis' } });
    expect(screen.getAllByRole('article')).toHaveLength(1);
    expect(screen.getByRole('article', { name: 'Camiseta Retos' })).toBeInTheDocument();
  });

  test('muestra un aviso si se intenta pasar del stock', () => {
    render(<Tienda productos={productos} servicios={crearServicios()} />);
    agregar('Monitor 24 pulgadas');
    agregar('Monitor 24 pulgadas');
    expect(screen.getByRole('alert')).toHaveTextContent('No hay suficiente stock de Monitor 24 pulgadas');
    expect(screen.getByText('Carrito: 1')).toBeInTheDocument();
  });

  test('compra completa: cobra, envía el correo y vacía el carrito', () => {
    const servicios = crearServicios(true);
    render(<Tienda productos={productos} servicios={servicios} />);
    agregar('Camiseta Retos');
    comprar();
    expect(servicios.pasarela.cobrar).toHaveBeenCalledWith(22.52);
    expect(servicios.correo.enviar).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('status')).toHaveTextContent('¡Pedido confirmado!');
    expect(screen.getByText('Carrito: 0')).toBeInTheDocument();
  });

  test('si el pago se rechaza, el carrito se conserva', () => {
    const servicios = crearServicios(false);
    render(<Tienda productos={productos} servicios={servicios} />);
    agregar('Camiseta Retos');
    comprar();
    expect(screen.getByRole('status')).toHaveTextContent('El pago fue rechazado');
    expect(servicios.correo.enviar).not.toHaveBeenCalled();
    expect(screen.getByText('Carrito: 1')).toBeInTheDocument();
  });
});
