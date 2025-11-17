import React, { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'

type Member = {
  name: string
  role: string
  src?: string
  curriculum: string[]
  initials?: string
}

const members: Member[] = [
  {
    name: 'Ángela Ortiz Morales',
    role: 'Directora artística y fundadora',
    src: '/angieTeam.jpg',
    curriculum: [
      'Profesora de Lengua y Literatura',
      'Coach Ontológico de Vida (Newfield Network)',
      'Coach Ontológico Organizacional (Liedtke Coaching School)',
      'Magíster en Dirección y Liderazgo Educacional',
      'Bailarina de ‘Ori Tahiti desde 2010',
      'Nivel 1, Conservatorio Artístico de la Polinesia Francesa “Te Fare ‘Upa Rau” (2019)',
      '2° lugar, profesional Heiva ‘Ori Tahiti Competition Online (2020)',
      '2° lugar, profesional E Nua No Fetia – Online (2021)',
      '3° lugar, categoría maestra Te Varua O Te ‘Ori – Online (2021)',
      '1° lugar, profesional Heiva I San Diego – Online (2021)',
      "1° lugar categoría Mehura, 'Aito International Competition Online (2022)",
      'Bailarina Ballet Cultural Kari Kari de Santiago (2023 a la fecha)'
    ]
  },
  {
    name: 'Jorge Toledo Carvajal',
    role: 'Director musical y cofundador',
    src: '/KokeTeam.jpg',
    curriculum: [
      'Profesor de Educación Física',
      'Magíster en Gestión Educacional',
      'Ingeniero en Computación e Informática',
      'Músico de ‘Ori Tahiti desde 2017',
      "1° lugar orquesta creación Te Varua o Te 'Ori Online 2021",
      'Músico en Ballet Cultural Kari Kari de Santiago (2023 a la fecha)'
    ]
  },
  {
    name: 'Matarena Rapu Gazmuri',
    role: 'Profesora de danza y coreógrafa',
    src: '/MataTeam.jpg',
    curriculum: [
      'Estudiante de Ingeniería Comercial e Ingeniería en Diseño',
      'Bailarina en Ballet Cultural Kari Kari desde 2017 ',
      'Intensivo de Ori Tahiti en Ecole de danse Manohiva (2022)',
      '3° lugar, categoría Hura Tau, grupo Hei Tahiti, Heiva I Tahiti (2025)',
      '1° lugar ‘Aparima grupal Toahiti, Dir Ranitea Laughlin, Ori Tahiti CompetitionI Matavai (2025)'  
    ]
  },
  {
    name: 'Bárbara Macías Aravena ',
    role: 'Comunicaciones',
    src: '/BarbieTeam.jpg',
    curriculum: [
      'Ingeniera en comercio y negocios internacionales ',
      "Alumna Te Fare Mo'a  'Ori Tahiti desde 2024 ",
      "Alumna de ‘Ori Rapa Nui desde 2019",
      "Bailarina en Ori Manu Hiva desde 2025"
    ]
  }
]

const Team: React.FC = () => {
  const [openMember, setOpenMember] = useState<Member | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  const close = useCallback(() => setOpenMember(null), [])

  useEffect(() => {
    if (!openMember) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [openMember, close])

  return (
    <section className="mx-auto py-12 overflow-x-hidden">
      {/* Título */}
      <div className="text-center max-w-5xl mx-auto px-6">
        <h2 className="mb-6 text-white tracking-widest text-5xl md:text-7xl uppercase">Team</h2>
      </div>

      {/* Párrafo */}
      <div className="max-w-4xl mx-auto px-6">
        <p className="text-base md:text-lg leading-relaxed text-gray-200 text-center">
          Te Fare Mo’a es dirigida por Ángela y Jorge, ambos comprometidos profundamente con la cultura polinesia, especialmente con la danza y la música. El equipo se complementa con Matarena, destacada bailarina rapanui que aporta con su experiencia, autenticidad y conexión cultural, y Bárbara, encargada del área de comunicaciones, quien contribuye con su experiencia en difusión y desarrollo de proyectos. Juntos, formamos un equipo que une arte, identidad y propósito, fortaleciendo la presencia del ‘Ori Tahiti y su legado en Chile.
        </p>
      </div>

      {/* Galería */}
      <div className="max-w-6xl mx-auto px-6 mt-12">
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {members.map((m, idx) => (
            <button
              key={m.name}
              onClick={() => setOpenMember(m)}
              className="group relative w-full aspect-[3/4] overflow-hidden rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 focus:ring-offset-black bg-neutral-800"
              aria-haspopup="dialog"
              aria-label={`Ver currículum de ${m.name}`}
            >
              {m.src ? (
                <Image
                  src={m.src}
                  alt={m.name}
                  fill
                  sizes="(max-width: 768px) 50vw, (max-width: 1280px) 25vw, 20vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  priority={idx < 2}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-500/60 via-amber-500/50 to-pink-500/40 text-white text-5xl font-bold">
                  {m.initials || m.name.charAt(0)}
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90" />
              <div className="absolute bottom-0 left-0 p-4 w-full text-left">
                <p className="text-white font-semibold text-lg leading-tight drop-shadow-sm">{m.name}</p>
                <p className="text-white/80 text-sm mb-2">{m.role}</p>
                <span className="inline-block text-xs uppercase tracking-wide bg-white/10 text-white px-3 py-1 rounded-full border border-white/20 group-hover:bg-orange-500/80 group-hover:border-orange-400 transition">Ver currículum</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Modal Currículum */}
      {mounted && openMember && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
          role="dialog"
          aria-modal="true"
          aria-label={`Currículum de ${openMember.name}`}
        >
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={close} />
          <div className="relative w-full sm:max-w-2xl max-h-[90vh] overflow-hidden rounded-t-3xl sm:rounded-2xl bg-neutral-900 border border-white/10 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-start gap-4 p-6">
              <div className="relative w-32 h-40 rounded-xl overflow-hidden flex-shrink-0 bg-neutral-700">
                {openMember.src ? (
                  <Image
                    src={openMember.src}
                    alt={openMember.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-500 via-amber-500 to-pink-500 text-white text-4xl font-bold">
                    {openMember.initials || openMember.name.charAt(0)}
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-white text-2xl font-semibold leading-snug">{openMember.name}</h3>
                <p className="text-orange-300 text-sm font-medium mb-4">{openMember.role}</p>
                <ul className="space-y-2 pr-2 max-h-56 overflow-y-auto custom-scrollbar text-sm text-gray-200">
                  {openMember.curriculum.map((line, i) => (
                    <li key={i} className="pl-4 relative">
                      <span className="absolute left-0 top-2 w-1.5 h-1.5 rounded-full bg-orange-400" />
                      {line}
                    </li>
                  ))}
                </ul>
              </div>
              <button
                onClick={close}
                className="text-gray-400 hover:text-white transition ml-2"
                aria-label="Cerrar"
              >
                ✕
              </button>
            </div>
            <div className="px-6 pb-6 pt-2 flex justify-end">
              <button
                onClick={close}
                className="px-5 py-2 rounded-md bg-orange-600 hover:bg-orange-500 text-white text-sm font-medium shadow focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 focus:ring-offset-neutral-900"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

export default Team
