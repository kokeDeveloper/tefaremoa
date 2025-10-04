"use client"
import React from 'react'

export default function Modal({open, title, children, onClose}:{open:boolean,title?:string,children:React.ReactNode,onClose:()=>void}){
  if(!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black opacity-40" onClick={onClose} />
      <div className="relative bg-white dark:bg-neutral-900 p-6 rounded shadow-lg w-full max-w-md">
        {title && <h3 className="text-lg font-medium mb-2">{title}</h3>}
        <div>{children}</div>
        <div className="mt-4 flex justify-end gap-2">
          <button onClick={onClose} className="px-3 py-1 border rounded">Cerrar</button>
        </div>
      </div>
    </div>
  )
}
