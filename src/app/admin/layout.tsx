import React from 'react'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  // No header/footer aquí — solo renderiza la página admin
  return <>{children}</>
}