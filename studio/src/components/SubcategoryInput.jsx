import React, { useEffect, useState } from 'react'
import { useClient, set, unset } from 'sanity'

/**
 * Input dinámico multi-selección para subcategorías.
 * Lee los datos directamente de los documentos de Categoría de Sanity,
 * por lo que cualquier cambio allí se refleja automáticamente aquí.
 * Permite asignar un producto a VARIAS subcategorías a la vez.
 */
export function SubcategoryInput(props) {
    const { value, onChange, readOnly } = props
    const client = useClient({ apiVersion: '2024-01-01' })
    const [groups, setGroups] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        client
            .fetch(
                `*[_type == "category" && active == true] | order(order asc) {
                    name,
                    "slug": slug.current,
                    subcategories[] { name, slug }
                }`
            )
            .then((cats) => {
                setGroups(cats.filter((c) => (c.subcategories || []).length > 0))
            })
            .catch((err) => {
                console.error('Error cargando subcategorías:', err)
                setError('No se pudieron cargar las subcategorías.')
            })
            .finally(() => setLoading(false))
    }, [])

    // Normalizar value: puede ser string (doc antiguo) o array (doc nuevo)
    const currentValues = Array.isArray(value)
        ? value
        : value ? [value] : []

    const toggle = (slug) => {
        const next = currentValues.includes(slug)
            ? currentValues.filter((v) => v !== slug)
            : [...currentValues, slug]
        onChange(next.length > 0 ? set(next) : unset())
    }

    const allKnownSlugs = groups.flatMap((g) =>
        (g.subcategories || []).map((s) => s.slug)
    )
    const orphaned = currentValues.filter((v) => !allKnownSlugs.includes(v))

    if (loading) {
        return (
            <p style={{ color: '#888', fontSize: 13, margin: '4px 0' }}>
                Cargando subcategorías desde el catálogo…
            </p>
        )
    }

    if (error) {
        return <p style={{ color: '#c53030', fontSize: 13 }}>{error}</p>
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <p style={{ fontSize: 12, color: '#666', margin: 0 }}>
                Haz clic en una o varias subcategorías para seleccionarlas. Las opciones se actualizan automáticamente desde el catálogo de Categorías.
            </p>

            {groups.map((cat) => (
                <div key={cat.slug}>
                    <p style={{ fontWeight: 600, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#555', marginBottom: 6 }}>
                        {cat.name}
                    </p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                        {(cat.subcategories || []).map((sub) => {
                            const checked = currentValues.includes(sub.slug)
                            return (
                                <label
                                    key={sub.slug}
                                    style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: 5,
                                        padding: '5px 12px',
                                        border: `1.5px solid ${checked ? '#7c3aed' : '#ddd'}`,
                                        borderRadius: 20,
                                        backgroundColor: checked ? '#ede9fe' : '#fafafa',
                                        cursor: readOnly ? 'not-allowed' : 'pointer',
                                        fontSize: 13,
                                        color: checked ? '#5b21b6' : '#444',
                                        userSelect: 'none',
                                        transition: 'all 0.15s',
                                        fontWeight: checked ? 600 : 400,
                                    }}
                                    onClick={() => !readOnly && toggle(sub.slug)}
                                >
                                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ opacity: checked ? 1 : 0, transition: 'opacity 0.15s' }}>
                                        <path d="M2 6l3 3 5-5" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                    {sub.name}
                                </label>
                            )
                        })}
                    </div>
                </div>
            ))}

            {currentValues.length > 0 && (
                <p style={{ fontSize: 12, color: '#6b7280', margin: 0 }}>
                    ✓ Seleccionadas: <strong>{currentValues.length}</strong> subcategor{currentValues.length === 1 ? 'ía' : 'ías'}
                </p>
            )}

            {orphaned.length > 0 && (
                <p style={{ color: '#b45309', fontSize: 12, padding: '5px 8px', background: '#fef3c7', borderRadius: 4 }}>
                    ⚠️ Valor{orphaned.length > 1 ? 'es' : ''} guardado{orphaned.length > 1 ? 's' : ''} sin coincidencia activa: <strong>{orphaned.join(', ')}</strong>. Selecciona las opciones correctas del listado.
                </p>
            )}
        </div>
    )
}
