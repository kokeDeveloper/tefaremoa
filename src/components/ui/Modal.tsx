"use client"
import React from 'react'
import { motion } from 'motion/react'

export default function Modal({open, title, children, onClose}:{open:boolean,title?:string,children:React.ReactNode,onClose:()=>void}){
  if(!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <motion.div className="absolute inset-0 bg-black/40" onClick={onClose} initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} />
      <motion.div initial={{y:20,opacity:0}} animate={{y:0,opacity:1}} className="relative bg-white dark:bg-neutral-900 p-6 rounded shadow-lg w-full max-w-md">
        {title && <h3 className="text-lg font-medium mb-2">{title}</h3>}
        <div>{children}</div>
      </motion.div>
    </div>
  )
}
