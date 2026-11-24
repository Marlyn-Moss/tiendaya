import { render, screen, fireEvent } from '@testing-library/react';
import FiltroProductos from '@/components/FiltroProductos';

function renderFiltro(props = {}) {
  const funciones = { onBuscar: jest.fn(), onCategoria: jest.fn(), onOrdenar: jest.fn() };
  render(
    <FiltroProductos
      busqueda=""
      categoria="todas"
      categorias={['Accesorios', 'Ropa', 'Tecnología']}
      orden="relevancia"
      {...funciones}
      {...props}
    />
  );
  return funciones;
}

describe('FiltroProductos', () => {
  test('avisa lo que el usuario escribe en el buscador', () => {
    const { onBuscar } = renderFiltro();
    fireEvent.change(screen.getByLabelText('Buscar'), { target: { value: 'mochila' } });
    expect(onBuscar).toHaveBeenCalledWith('mochila');
  });

  test('muestra "Todas" más una opción por categoría', () => {
    renderFiltro();
    const select = screen.getByLabelText('Categoría');
    expect(select.querySelectorAll('option')).toHaveLength(4);
  });

  test('avisa la categoría elegida', () => {
    const { onCategoria } = renderFiltro();
    fireEvent.change(screen.getByLabelText('Categoría'), { target: { value: 'Ropa' } });
    expect(onCategoria).toHaveBeenCalledWith('Ropa');
  });

  test('avisa el orden elegido', () => {
    const { onOrdenar } = renderFiltro();
    fireEvent.change(screen.getByLabelText('Ordenar por'), { target: { value: 'precio-asc' } });
    expect(onOrdenar).toHaveBeenCalledWith('precio-asc');
  });

  test('muestra el texto de búsqueda actual', () => {
    renderFiltro({ busqueda: 'termo' });
    expect(screen.getByLabelText('Buscar')).toHaveValue('termo');
  });
});
