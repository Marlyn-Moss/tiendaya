import Tienda from '@/components/Tienda';
import { productos } from '@/data/productos';

export default function Inicio() {
  return <Tienda productos={productos} />;
}
