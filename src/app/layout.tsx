import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '../context/AuthContext';
import { EssayProvider } from '../context/EssayContext';

export const metadata: Metadata = {
  title: 'StudyMate — AI Writing & Essay Coach',
  description: 'StudyMate gives you real-time feedback on structure, argumentation, clarity, and grammar — like having a writing coach read over your shoulder.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <EssayProvider>
            {children}
          </EssayProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

