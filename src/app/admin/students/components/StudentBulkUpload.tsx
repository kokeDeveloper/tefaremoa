'use client'
import React, { useRef, useState } from 'react'
import { IconUpload, IconDownload, IconFileTypeCsv, IconX, IconCheck, IconAlertTriangle } from '@tabler/icons-react'
import Button from '@/components/ui/Button'

interface UploadResult {
  row: number
  email: string
  status: 'created' | 'skipped'
  reason?: string
}

interface UploadResponse {
  created: number
  skipped: number
  results: UploadResult[]
}

const TEMPLATE_HEADERS = [
  'nombre', 'apellidos', 'email', 'telefono', 'apodo',
  'direccion', 'ciudad', 'fechaNacimiento', 'inicioPlan', 'finPlan', 'tipoPlan',
]

const TEMPLATE_EXAMPLE = [
  'María', 'González', 'maria@ejemplo.com', '+56912345678', 'Maru',
  'Av. Principal 123', 'Santiago', '1995-03-15', '2026-06-01', '2026-11-30', '2x',
]

function xmlEscape(s: string) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

function downloadTemplate() {
  const toRow = (cells: string[], bold = false) =>
    `<Row>${cells
      .map((c) =>
        `<Cell${bold ? ' ss:StyleID="bold"' : ''}><Data ss:Type="String">${xmlEscape(c)}</Data></Cell>`
      )
      .join('')}</Row>`

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
  xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">
  <Styles>
    <Style ss:ID="bold">
      <Font ss:Bold="1"/>
    </Style>
    <Style ss:ID="note">
      <Font ss:Color="#888888" ss:Italic="1"/>
    </Style>
  </Styles>
  <Worksheet ss:Name="Alumnas">
    <Table>
      <Column ss:Width="110"/>
      <Column ss:Width="110"/>
      <Column ss:Width="180"/>
      <Column ss:Width="120"/>
      <Column ss:Width="100"/>
      <Column ss:Width="150"/>
      <Column ss:Width="100"/>
      <Column ss:Width="110"/>
      <Column ss:Width="100"/>
      <Column ss:Width="100"/>
      <Column ss:Width="100"/>
      ${toRow(TEMPLATE_HEADERS, true)}
      ${toRow(TEMPLATE_EXAMPLE)}
      <Row>
        <Cell ss:StyleID="note"><Data ss:Type="String">// tipoPlan válidos: 1x | 2x | 3x | 4x | Beca — fechas en formato YYYY-MM-DD</Data></Cell>
      </Row>
    </Table>
  </Worksheet>
</Workbook>`

  const blob = new Blob([xml], { type: 'application/vnd.ms-excel;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'plantilla_alumnas.xls'
  a.click()
  URL.revokeObjectURL(url)
}

interface Props {
  onUploaded: () => void
}

export default function StudentBulkUpload({ onUploaded }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [response, setResponse] = useState<UploadResponse | null>(null)

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null
    setFile(f)
    setError(null)
    setResponse(null)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const f = e.dataTransfer.files?.[0]
    if (f && f.name.endsWith('.csv')) {
      setFile(f)
      setError(null)
      setResponse(null)
    } else {
      setError('Solo se aceptan archivos .csv')
    }
  }

  const handleUpload = async () => {
    if (!file) return
    setLoading(true)
    setError(null)
    setResponse(null)

    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await fetch('/api/students/bulk', {
        method: 'POST',
        credentials: 'include',
        body: formData,
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || `Error ${res.status}`)
        return
      }
      setResponse(data as UploadResponse)
      if (data.created > 0) onUploaded()
    } catch (err: any) {
      setError(String(err.message || err))
    } finally {
      setLoading(false)
    }
  }

  const clearFile = () => {
    setFile(null)
    setError(null)
    setResponse(null)
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <div className="space-y-4">
      {/* Header + template download */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Sube un archivo CSV para registrar múltiples alumnas a la vez. Las contraseñas se generan automáticamente.
          </p>
        </div>
        <button
          type="button"
          onClick={downloadTemplate}
          className="flex items-center gap-1.5 rounded-lg border border-emerald-300 bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700 transition hover:bg-emerald-100 dark:border-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 dark:hover:bg-emerald-900/40"
        >
          <IconDownload size={14} />
          Descargar plantilla Excel (.xls)
        </button>
      </div>

      {/* Drop zone */}
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        onClick={() => !file && inputRef.current?.click()}
        className={`relative flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed px-6 py-8 text-center transition
          ${file
            ? 'border-emerald-400 bg-emerald-50 dark:border-emerald-700 dark:bg-emerald-950/20'
            : 'cursor-pointer border-neutral-300 bg-neutral-50 hover:border-emerald-400 hover:bg-emerald-50/40 dark:border-neutral-600 dark:bg-neutral-800/30 dark:hover:border-emerald-600'
          }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".csv"
          className="hidden"
          onChange={handleFile}
        />

        {file ? (
          <>
            <IconFileTypeCsv size={32} className="text-emerald-500" />
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-neutral-800 dark:text-neutral-200">{file.name}</span>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); clearFile() }}
                className="rounded p-0.5 text-neutral-400 hover:text-red-500"
              >
                <IconX size={14} />
              </button>
            </div>
            <span className="text-xs text-neutral-400">{(file.size / 1024).toFixed(1)} KB</span>
          </>
        ) : (
          <>
            <IconUpload size={28} className="text-neutral-400" />
            <div>
              <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                Arrastra tu CSV aquí o haz clic para seleccionar
              </p>
              <p className="mt-0.5 text-xs text-neutral-400">Solo archivos .csv</p>
            </div>
          </>
        )}
      </div>

      {/* Plan reference */}
      <p className="text-xs text-neutral-400 dark:text-neutral-500">
        Valores para <code className="rounded bg-neutral-100 px-1 py-0.5 dark:bg-neutral-800">tipoPlan</code>:
        {' '}1x ($40.000) · 2x ($50.000) · 3x ($62.000) · 4x ($75.000) · Beca ($40.000)
      </p>

      {/* Upload button */}
      {file && !response && (
        <div className="flex justify-end">
          <Button
            disabled={loading}
            onClick={handleUpload}
            className="flex items-center gap-2 bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-500 disabled:opacity-60"
          >
            <IconUpload size={15} />
            {loading ? 'Importando…' : 'Importar alumnas'}
          </Button>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-600 dark:border-red-800/60 dark:bg-red-950/60 dark:text-red-300">
          <IconAlertTriangle size={16} className="mt-0.5 shrink-0" />
          {error}
        </div>
      )}

      {/* Results */}
      {response && (
        <div className="space-y-3">
          <div className="flex flex-wrap gap-3 text-sm">
            <span className="inline-flex items-center gap-1.5 rounded-md bg-emerald-100 px-3 py-1.5 font-medium text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
              <IconCheck size={14} />
              {response.created} creada{response.created !== 1 ? 's' : ''}
            </span>
            {response.skipped > 0 && (
              <span className="inline-flex items-center gap-1.5 rounded-md bg-amber-100 px-3 py-1.5 font-medium text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                <IconAlertTriangle size={14} />
                {response.skipped} omitida{response.skipped !== 1 ? 's' : ''}
              </span>
            )}
          </div>

          {response.skipped > 0 && (
            <div className="overflow-auto rounded-lg border border-neutral-200 dark:border-neutral-700">
              <table className="min-w-full divide-y divide-neutral-100 text-xs dark:divide-neutral-800">
                <thead className="bg-neutral-50 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300">
                  <tr>
                    <th className="px-3 py-2 text-left font-semibold">Fila</th>
                    <th className="px-3 py-2 text-left font-semibold">Email</th>
                    <th className="px-3 py-2 text-left font-semibold">Estado</th>
                    <th className="px-3 py-2 text-left font-semibold">Motivo</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800 bg-white dark:bg-neutral-900">
                  {response.results
                    .filter((r) => r.status === 'skipped')
                    .map((r) => (
                      <tr key={`${r.row}-${r.email}`}>
                        <td className="px-3 py-2 text-neutral-500">{r.row}</td>
                        <td className="px-3 py-2 font-medium text-neutral-800 dark:text-neutral-200">{r.email}</td>
                        <td className="px-3 py-2">
                          <span className="rounded bg-amber-100 px-1.5 py-0.5 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                            Omitida
                          </span>
                        </td>
                        <td className="px-3 py-2 text-neutral-500">{r.reason}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}

          <button
            type="button"
            onClick={clearFile}
            className="text-xs text-neutral-400 underline hover:text-neutral-600"
          >
            Cargar otro archivo
          </button>
        </div>
      )}
    </div>
  )
}
