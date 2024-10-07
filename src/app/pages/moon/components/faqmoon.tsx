import { FC, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

interface FAQItem {
    question: string;
    answer: string;
}

const faqItems: FAQItem[] = [
    {
        question: '¿Qué necesito para el workshop?',
        answer: 'Ven con ropa cómoda, idealmente falda de pareu y una botella de agua.',
    },
    {
        question: '¿Necesito experiencia previa?',
        answer: 'No, todos son bienvenidos, desde principiantes hasta avanzados.',
    },
    {
        question: '¿Cómo pago?',
        answer: 'A través de transferencia bancaria. Te contactaremos con los detalles luego de completar el formulario de inscripción.',
    },
    {
        question: '¿Exísten formas de pago?',
        answer: 'Si, puedes pagar en 2 o 3 cuotas.',
    },
];

const FAQMoon: FC = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const toggleAnswer = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section className="bg-black">
            <div className="container px-6 py-10 mx-auto text-center">
                <h1 className="text-3xl lg:text-4xl text-white main-title uppercase">Preguntas frecuentes</h1>
                <hr className="my-6 border-gray-200 dark:border-gray-700" />

                <div>
                    {faqItems.map((item, index) => (
                        <div key={index}>
                            <button
                                onClick={() => toggleAnswer(index)}
                                className="flex items-center w-full focus:outline-none"
                            >
                                <svg
                                    className="flex-shrink-0 w-6 h-6 text-rose-500"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    {openIndex === index ? (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" />
                                    ) : (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                                    )}
                                </svg>
                                <h1 className="mx-4 text-2xl text-white main-title">{item.question}</h1>
                            </button>

                            <AnimatePresence initial={false}>
                                {openIndex === index && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.5 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="flex mt-8 md:mx-10">
                                            <span className="border text-rose-500 "></span>
                                            <p className="max-w-3xl px-4 text-gray-500 dark:text-gray-300 text-left">
                                                {item.answer}
                                            </p>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <hr className="my-8 border-gray-200 dark:border-gray-700" />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FAQMoon;
