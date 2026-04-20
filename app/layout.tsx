import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'KOLEKTIF — Rejoignez le Mouvement',
  description: 'Mouvement collectif pour un financement auto direct en Côte d\'Ivoire, sans les 18% des banques.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400;1,600;1,700&family=Jost:wght@200;300;400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
