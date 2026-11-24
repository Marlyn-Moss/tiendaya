import { render, screen, fireEvent } from '@testing-library/react';
import FormularioCheckout from '@/components/FormularioCheckout';

function llenar(etiqueta, valor) {
  fireEvent.change(screen.getByLabelText(etiqueta), { target: { value: valor } });
}

describe('FormularioCheckout', () => {
  test('al enviar vacío muestra los tres errores y no confirma', () => {
    const onConfirmar = jest.fn();
    render(<FormularioCheckout onConfirmar={onConfirmar} />);
    fireEvent.click(screen.getByRole('button', { name: 'Confirmar compra' }));
    expect(screen.getAllByRole('alert')).toHaveLength(3);
    expect(onConfirmar).not.toHaveBeenCalled();
  });

  test('muestra el error específico de cada campo', () => {
    render(<FormularioCheckout onConfirmar={() => {}} />);
    llenar('Nombre completo', 'Ana López');
    llenar('Correo electrónico', 'ana@correo');
    llenar('Código postal', '1101');
    fireEvent.click(screen.getByRole('button', { name: 'Confirmar compra' }));
    expect(screen.getByRole('alert')).toHaveTextContent('Escribe un correo válido');
  });

  test('con datos válidos envía los datos del cliente', () => {
    const onConfirmar = jest.fn();
    render(<FormularioCheckout onConfirmar={onConfirmar} />);
    llenar('Nombre completo', 'Ana López');
    llenar('Correo electrónico', 'ana@correo.com');
    llenar('Código postal', '1101');
    fireEvent.click(screen.getByRole('button', { name: 'Confirmar compra' }));
    expect(onConfirmar).toHaveBeenCalledWith({
      nombre: 'Ana López',
      correo: 'ana@correo.com',
      codigoPostal: '1101',
    });
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });
});
