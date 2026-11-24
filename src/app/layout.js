import './globals.css';

export const metadata = {
  title: 'TiendaYa · Proyecto de pruebas',
  description: 'Tienda de práctica para el Módulo 21: Aplicación de Testing y QA · Instituto RETOS',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
