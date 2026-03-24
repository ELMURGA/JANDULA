import React, { useEffect, useState } from 'react'
import { useClient, set, unset } from 'sanity'

/**
 * Input dinámico para el campo "subcategoría" del producto.
 * Lee las subcategorías directamente desde los documentos de Categoría de Sanity,
 * así cualquier cambio que la clienta haga en el studio de Categorías se refleja
 * automáticamente aquí sin necesidad de tocar código.
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

    const handleChange = (e) => {
        const val = e.target.value
        onChange(val ? set(val) : unset())
    }

    // Comprueba si el valor actual existe en alguna subcategoría cargada
    const valueIsKnown =
        !value ||
        groups.some((g) => (g.subcategories || []).some((s) => s.slug === value))

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
        <div>
            <select
                value={value || ''}
                onChange={handleChange}
                disabled={readOnly}
                style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #ccc',
                    borderRadius: 4,
                    fontSize: 14,
                    backgroundColor: readOnly ? '#f5f5f5' : 'white',
                    cursor: readOnly ? 'not-allowed' : 'default',
                    boxSizing: 'border-box',
                }}
            >
                <option value="">— Sin subcategoría —</option>
                {groups.map((cat) => (
                    <optgroup key={cat.slug} label={cat.name}>
                        {(cat.subcategories || []).map((sub) => (
                            <option key={sub.slug} value={sub.slug}>
                                {sub.name}
                            </option>
                        ))}
                    </optgroup>
                ))}
            </select>

            {/* Aviso si el valor guardado ya no existe en el catálogo de categorías */}
            {!valueIsKnown && (
                <p
                    style={{
                        color: '#b45309',
                        fontSize: 12,
                        marginTop: 4,
                        padding: '4px 8px',
                        background: '#fef3c7',
                        borderRadius: 3,
                    }}
                >
                    ⚠️ El valor guardado <strong>"{value}"</strong> no coincide con
                    ninguna subcategoría activa. Selecciona una opción del listado para
                    corregirlo.
                </p>
            )}
        </div>
    )
}
