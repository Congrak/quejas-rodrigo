import "./globals.css";

export const metadata = {
  title: "Oficina Nacional de Quejas contra Rodrigo",
  description: "Ventanilla única para reclamos sobre Rodrigo. Atendemos 24/7, resolvemos nunca.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@400;600;800&family=Special+Elite&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
