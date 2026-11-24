'use client';
// Componente principal: guarda el estado y conecta la lógica con la interfaz.
import { useState } from 'react';
import { agregarItem, cambiarCantidad, contarUnidades, quitarItem } from '@/lib/carrito';
import { buscarProductos, filtrarPorCategoria, obtenerCategorias, ordenarProductos } from '@/lib/catalogo';
import { confirmarPedido } from '@/lib/pedidos';
import { serviciosSimulados } from '@/services/serviciosSimulados';
import FiltroProductos from './FiltroProductos';
import FormularioCheckout from './FormularioCheckout';
import ListaProductos from './ListaProductos';
import ResumenCarrito from './ResumenCarrito';

export default function Tienda({ productos, servicios = serviciosSimulados }) {
  const [items, setItems] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [categoria, setCategoria] = useState('todas');
  const [orden, setOrden] = useState('relevancia');
  const [cupon, setCupon] = useState('');
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');

  const visibles = ordenarProductos(
    buscarProductos(filtrarPorCategoria(productos, categoria), busqueda),
    orden
  );

  // Ejecuta una acción y muestra su error en pantalla si falla
  function intentar(accion) {
    try {
      accion();
      setError('');
    } catch (e) {
      setError(e.message);
    }
  }

  function confirmar(cliente) {
    intentar(() => {
      const resultado = confirmarPedido({ items, cliente, cupon }, servicios);
      setMensaje(resultado.mensaje);
      if (resultado.aprobado) {
        setItems([]);
        setCupon('');
      }
    });
  }

  return (
    <div className="tienda">
      <header className="encabezado">
        <h1>TiendaYa</h1>
        <p aria-label="Unidades en el carrito">{`Carrito: ${contarUnidades(items)}`}</p>
      </header>

      {error && <p role="alert" className="aviso error">{error}</p>}
      {mensaje && <p role="status" className="aviso ok">{mensaje}</p>}

      <div className="contenido">
        <main>
          <FiltroProductos
            busqueda={busqueda}
            onBuscar={setBusqueda}
            categoria={categoria}
            onCategoria={setCategoria}
            categorias={obtenerCategorias(productos)}
            orden={orden}
            onOrdenar={setOrden}
          />
          <ListaProductos
            productos={visibles}
            onAgregar={(producto) => intentar(() => setItems(agregarItem(items, producto)))}
          />
        </main>

        <div className="lateral">
          <ResumenCarrito
            items={items}
            cupon={cupon}
            onAplicarCupon={setCupon}
            onQuitar={(id) => setItems(quitarItem(items, id))}
            onCambiarCantidad={(id, cantidad) => intentar(() => setItems(cambiarCantidad(items, id, cantidad)))}
          />
          {items.length > 0 && <FormularioCheckout onConfirmar={confirmar} />}
        </div>
      </div>
    </div>
  );
}
