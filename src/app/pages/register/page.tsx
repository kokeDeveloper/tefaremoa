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
    const [nickname, setNickname] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [birthDate, setBirthDate] = useState('');
    const [planStartDate, setPlanStartDate] = useState('');
    const [planEndDate, setPlanEndDate] = useState('');
    const [planType, setPlanType] = useState('Basic');
    const [planStatus, setPlanStatus] = useState('Active');
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const validateForm = () => {
        const newErrors: { [key: string]: string } = {};
        if (!name) newErrors.name = "El nombre es obligatorio.";
        if (!lastName) newErrors.lastName = "Los apellidos son obligatorios.";
        if (!email) newErrors.email = "El correo electrónico es obligatorio.";
        if (password !== confirmPassword) newErrors.confirmPassword = "Las contraseñas no coinciden.";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validateEmailExists = async (email: string) => {
        try {
            const response = await fetch(`/api/student/check-email?email=${encodeURIComponent(email)}`);
            if (response.ok) {
                const { exists } = await response.json();
                return exists;
            }
            console.error('Error al verificar el correo:', response.statusText);
            return false;
        } catch (error) {
            console.error('Error de red al verificar el correo:', error);
            return false;
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        // Verificar si el correo ya existe
        const emailExists = await validateEmailExists(email);
        if (emailExists) {
            setErrors((prevErrors) => ({ ...prevErrors, email: 'El correo ya está registrado.' }));
            return;
        }

        const studentData = {
            name,
            lastName,
            email,
            phone,
            nickname,
            address,
            birthDate: birthDate ? new Date(birthDate).toISOString() : null,
            planStartDate: planStartDate ? new Date(planStartDate).toISOString() : null,
            planEndDate: planEndDate ? new Date(planEndDate).toISOString() : null,
            planType,
            planStatus,
            password,
        };

        try {
            const response = await fetch('/api/student', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(studentData),
            });

            if (response.ok) {
                const result = await response.json();
                console.log('Estudiante registrado:', result);
                alert('Registro exitoso');
                // Reset form after successful submission
                setName('');
                setLastName('');
                setEmail('');
                setPhone('');
                setNickname('');
                setAddress('');
                setCity('');
                setBirthDate('');
                setPlanStartDate('');
                setPlanEndDate('');
                setPlanType('Basic');
                setPlanStatus('Active');
                setPassword('');
                setConfirmPassword('');
                setErrors({});
            } else {
                const errorData = await response.json();
                console.error('Error al registrar:', errorData);
                alert('Error al registrar: ' + (errorData.error || 'Error desconocido'));
            }
        } catch (error) {
            console.error('Error de red:', error);
            alert('Error de red. Por favor, inténtalo de nuevo.');
        }
    };

    return (
        <div className="container mx-auto p-4 content-center flex flex-col items-center space-y-4">
            <Image src="/tefaremoa.svg" alt="Danza" width={100} height={100} />
            <h1 className="text-2xl font-bold mb-4">Registro de Alumnas</h1>
            <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-lg">
                {/* Información Personal */}
                <fieldset className="space-y-4">
                    <legend className="text-lg font-semibold">Información Personal</legend>
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
                        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                    </div>
                    <div>
                        <label htmlFor="lastname" className="block text-sm font-medium">Apellidos</label>
                        <input
                            type="text"
                            id="lastname"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            required
                            className="mt-1 block w-full border border-neutral-800 bg-neutral-900 rounded-md p-2"
                        />
                        {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
                    </div>
                    <div>
                        <label htmlFor="birthDate" className="block text-sm font-medium">Fecha de Nacimiento</label>
                        <input
                            type="date"
                            id="birthDate"
                            value={birthDate}
                            onChange={(e) => setBirthDate(e.target.value)}
                            className="mt-1 block w-full border border-neutral-800 bg-neutral-900 rounded-md p-2"
                        />
                    </div>
                </fieldset>

                {/* Información de Contacto */}
                <fieldset className="space-y-4">
                    <legend className="text-lg font-semibold">Información de Contacto</legend>
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
                        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                    </div>
                    <div>
                        <label htmlFor="phone" className="block text-sm font-medium">Teléfono (Opcional)</label>
                        <input
                            type="text"
                            id="phone"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="mt-1 block w-full border border-neutral-800 bg-neutral-900 rounded-md p-2"
                        />
                    </div>
                    <div>
                        <label htmlFor="nickname" className="block text-sm font-medium">Apodo (Opcional)</label>
                        <input
                            type="text"
                            id="nickname"
                            value={nickname}
                            onChange={(e) => setNickname(e.target.value)}
                            className="mt-1 block w-full border border-neutral-800 bg-neutral-900 rounded-md p-2"
                        />
                    </div>
                </fieldset>

                {/* Dirección */}
                <fieldset className="space-y-4">
                    <legend className="text-lg font-semibold">Dirección</legend>
                    <div>
                        <label htmlFor="address" className="block text-sm font-medium">Dirección (Opcional)</label>
                        <input
                            type="text"
                            id="address"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            className="mt-1 block w-full border border-neutral-800 bg-neutral-900 rounded-md p-2"
                        />
                    </div>
                    <div>
                        <label htmlFor="city" className="block text-sm font-medium">Ciudad (Opcional)</label>
                        <input
                            type="text"
                            id="city"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            className="mt-1 block w-full border border-neutral-800 bg-neutral-900 rounded-md p-2"
                        />
                    </div>
                </fieldset>

                {/* Información del Plan */}
                <fieldset className="space-y-4">
                    <legend className="text-lg font-semibold">Información del Plan</legend>
                    <div>
                        <label htmlFor="planStartDate" className="block text-sm font-medium">Fecha de Inicio del Plan</label>
                        <input
                            type="date"
                            id="planStartDate"
                            value={planStartDate}
                            onChange={(e) => setPlanStartDate(e.target.value)}
                            required
                            className="mt-1 block w-full border border-neutral-800 bg-neutral-900 rounded-md p-2"
                        />
                    </div>
                    <div>
                        <label htmlFor="planEndDate" className="block text-sm font-medium">Fecha de Fin del Plan (Opcional)</label>
                        <input
                            type="date"
                            id="planEndDate"
                            value={planEndDate}
                            onChange={(e) => setPlanEndDate(e.target.value)}
                            className="mt-1 block w-full border border-neutral-800 bg-neutral-900 rounded-md p-2"
                        />
                    </div>
                    <div>
                        <label htmlFor="planType" className="block text-sm font-medium">Tipo de Plan</label>
                        <select
                            id="planType"
                            value={planType}
                            onChange={(e) => setPlanType(e.target.value)}
                            required
                            className="mt-1 block w-full border border-neutral-800 bg-neutral-900 rounded-md p-2"
                        >
                            <option value="Basic">Básico</option>
                            <option value="Premium">Premium</option>
                            <option value="VIP">VIP</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="planStatus" className="block text-sm font-medium">Estado del Plan</label>
                        <select
                            id="planStatus"
                            value={planStatus}
                            onChange={(e) => setPlanStatus(e.target.value)}
                            required
                            className="mt-1 block w-full border border-neutral-800 bg-neutral-900 rounded-md p-2"
                        >
                            <option value="Active">Activo</option>
                            <option value="Inactive">Inactivo</option>
                        </select>
                    </div>
                </fieldset>

                {/* Contraseña */}
                <fieldset className="space-y-4">
                    <legend className="text-lg font-semibold">Seguridad</legend>
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
                        {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
                    </div>
                </fieldset>

                {/* Botones */}
                <div className="flex space-x-4">
                    <button type="submit" className="btn-donate mt-4 w-full flex justify-center items-center space-x-2">
                        <p>Registrar</p>
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            setName('');
                            setLastName('');
                            setEmail('');
                            setPhone('');
                            setNickname('');
                            setAddress('');
                            setCity('');
                            setBirthDate('');
                            setPlanStartDate('');
                            setPlanEndDate('');
                            setPlanType('Basic');
                            setPlanStatus('Active');
                            setPassword('');
                            setConfirmPassword('');
                            setErrors({});
                        }}
                        className="btn-reset mt-4 w-full flex justify-center items-center space-x-2"
                    >
                        <p>Limpiar</p>
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Register;