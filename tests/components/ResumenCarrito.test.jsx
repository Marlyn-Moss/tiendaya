import { render, screen, fireEvent } from '@testing-library/react';
import ResumenCarrito from '@/components/ResumenCarrito';

const mochila = { id: 1, nombre: 'Mochila urbana', precio: 29.99, stock: 8 };
const camiseta = { id: 2, nombre: 'Camiseta Retos', precio: 15.5, stock: 20 };
const items = [
  { producto: mochila, cantidad: 2 },
  { producto: camiseta, cantidad: 1 },
];

function renderResumen(props = {}) {
  const funciones = { onAplicarCupon: jest.fn(), onQuitar: jest.fn(), onCambiarCantidad: jest.fn() };
  render(<ResumenCarrito items={items} cupon="" {...funciones} {...props} />);
  return funciones;
}

// Busca el valor de una fila de totales por su nombre, por ejemplo "Total"
function valorDe(nombre) {
  const fila = screen.getByText(nombre).closest('div');
  return fila.querySelector('dd').textContent;
}

describe('ResumenCarrito', () => {
  test('un carrito vacío muestra un mensaje', () => {
    renderResumen({ items: [] });
    expect(screen.getByText('Tu carrito está vacío.')).toBeInTheDocument();
  });

  test('calcula los totales sin cupón', () => {
    renderResumen();
    expect(valorDe('Subtotal')).toBe('$75.48');
    expect(valorDe('Envío')).toBe('Gratis');
    expect(valorDe('IVA (13 %)')).toBe('$9.81');
    expect(valorDe('Total')).toBe('$85.29');
  });

  test('muestra el descuento cuando hay un cupón válido', () => {
    renderResumen({ cupon: 'RETOS10' });
    expect(screen.getByText('Cupón RETOS10 aplicado')).toBeInTheDocument();
    expect(valorDe('Descuento')).toBe('-$7.55');
    expect(valorDe('Total')).toBe('$76.76');
  });

  test('avisa cuando el cupón no es válido', () => {
    renderResumen({ cupon: 'FALSO' });
    expect(screen.getByText('Cupón no válido')).toBeInTheDocument();
    expect(screen.queryByText('Descuento')).not.toBeInTheDocument();
  });

  test('envía el cupón escrito al presionar Aplicar', () => {
    const { onAplicarCupon } = renderResumen();
    fireEvent.change(screen.getByLabelText('Cupón'), { target: { value: ' RETOS20 ' } });
    fireEvent.click(screen.getByRole('button', { name: 'Aplicar' }));
    expect(onAplicarCupon).toHaveBeenCalledWith('RETOS20');
  });

  test('el botón Quitar avisa qué producto quitar', () => {
    const { onQuitar } = renderResumen();
    fireEvent.click(screen.getByRole('button', { name: 'Quitar Camiseta Retos' }));
    expect(onQuitar).toHaveBeenCalledWith(2);
  });

  test('los botones + y − cambian la cantidad', () => {
    const { onCambiarCantidad } = renderResumen();
    fireEvent.click(screen.getByRole('button', { name: 'Aumentar Mochila urbana' }));
    expect(onCambiarCantidad).toHaveBeenCalledWith(1, 3);
    fireEvent.click(screen.getByRole('button', { name: 'Disminuir Mochila urbana' }));
    expect(onCambiarCantidad).toHaveBeenCalledWith(1, 1);
  });
});
