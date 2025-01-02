"use client"
import Image from 'next/image';
import React, { useState } from 'react';

const Register = () => {
    const [name, setName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');


    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission logic here
        console.log({ name, lastName, email, password, confirmPassword });
    };

    return (
        <div className="container mx-auto p-4 content-center flex flex-col items-center space-y-4">
            <Image src="/tefaremoa.svg" alt="Danza" width={100} height={100} />
            <h1 className="text-2xl font-bold mb-4">Registro para la Academia de Danza</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium">Nombre</label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="mt-1 block w-full border border-neutral-800 bg-neutral-900 rounded-md p-2"
                    />
                </div>
                <div>
                    <label htmlFor="lastname" className="block text-sm font-medium">Apellidos</label>
                    <input
                        type="text"
                        id="name"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                        className="mt-1 block w-full border border-neutral-800 bg-neutral-900 rounded-md p-2"
                    />
                </div>
                <div>
                    <label htmlFor="email" className="block text-sm font-medium">Correo Electrónico</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="mt-1 block w-full border border-neutral-800 bg-neutral-900 rounded-md p-2"
                    />
                </div>
                <div>
                    <label htmlFor="password" className="block text-sm font-medium">Contraseña</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="mt-1 block w-full border border-neutral-800 bg-neutral-900 rounded-md p-2 tracking-widest"
                    />
                </div>
                <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium">Confirmar Contraseña</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        className="mt-1 block w-full border border-neutral-800 bg-neutral-900 rounded-md p-2 tracking-widest"
                    />
                </div>
                <button type="submit" className="btn-donate mt-4 w-full flex justify-center items-center space-x-2">
                    <p>Registrar</p>
                </button>
            </form>
        </div>
    );
};

export default Register;