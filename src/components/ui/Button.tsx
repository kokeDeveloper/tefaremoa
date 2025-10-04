"use client"
import React from 'react'

export default function Button({children, className, ...props}:{children:React.ReactNode, className?:string} & React.ButtonHTMLAttributes<HTMLButtonElement>){
  return <button {...props} className={`px-3 py-1 rounded ${className||'bg-blue-600 text-white'}`}>{children}</button>
}
