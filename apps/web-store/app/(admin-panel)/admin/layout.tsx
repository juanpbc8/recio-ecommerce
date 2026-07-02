import '@/app/globals.css';
import AdminLayoutClient from './layout.client';
import React from 'react';

export const metadata = {
  title: {
    default: 'Recio Admin',
    template: '%s | Recio Admin',
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-background text-foreground font-sans">
        <AdminLayoutClient>{children}</AdminLayoutClient>
      </body>
    </html>
  );
}

