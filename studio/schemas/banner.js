export default {
    name: 'banner',
    title: 'Banner / Destacado',
    type: 'document',
    groups: [
        { name: 'content', title: 'Contenido' },
        { name: 'buttons', title: 'Botones' },
        { name: 'settings', title: 'Configuración' },
    ],
    fields: [
        // ── Contenido ────────────────────────────────────────────────────
        {
            name: 'eyebrow',
            title: 'Texto pequeño superior (eyebrow)',
            type: 'string',
            group: 'content',
            description: 'Texto muy pequeño que aparece encima del título. Ejemplo: "Jándula Moda — Tienda Online"',
        },
        {
            name: 'title',
            title: 'Título principal',
            type: 'string',
            group: 'content',
            validation: Rule => Rule.required(),
        },
        {
            name: 'titleEm',
            title: 'Segunda línea del título (resaltada)',
            type: 'string',
            group: 'content',
            description: 'Se muestra en cursiva/color destacado. Ejemplo: "Nuestra Pasión"',
        },
        {
            name: 'subtitle',
            title: 'Subtítulo / descripción',
            type: 'string',
            group: 'content',
        },
        {
            name: 'image',
            title: 'Imagen de fondo',
            type: 'image',
            group: 'content',
            options: { hotspot: true },
            description: 'Imagen principal del banner. Recomendado: 2000×1200 px mínimo.',
        },
        {
            name: 'imageAlt',
            title: 'Texto alternativo de la imagen (accesibilidad)',
            type: 'string',
            group: 'content',
            description: 'Describe la imagen brevemente. Importante para SEO y accesibilidad.',
        },

        // ── Botones ──────────────────────────────────────────────────────
        {
            name: 'buttonText',
            title: 'Botón principal — Texto',
            type: 'string',
            group: 'buttons',
            initialValue: 'VER COLECCIÓN',
        },
        {
            name: 'buttonLink',
            title: 'Botón principal — Enlace',
            type: 'string',
            group: 'buttons',
            description: 'Ejemplo: /categoria/fiesta  o  /categoria/todos',
        },
        {
            name: 'secondButtonText',
            title: 'Botón secundario — Texto',
            type: 'string',
            group: 'buttons',
            description: 'Déjalo vacío para que no aparezca',
        },
        {
            name: 'secondButtonLink',
            title: 'Botón secundario — Enlace',
            type: 'string',
            group: 'buttons',
            description: 'Ejemplo: /contacto',
        },

        // ── Configuración ────────────────────────────────────────────────
        {
            name: 'active',
            title: 'Visible en la web',
            type: 'boolean',
            group: 'settings',
            initialValue: true,
            description: 'Si está desactivado el banner no se muestra',
        },
        {
            name: 'order',
            title: 'Orden (si hay varios banners)',
            type: 'number',
            group: 'settings',
            initialValue: 1,
            description: 'Número menor = aparece primero',
        },
    ],
    preview: {
        select: {
            title: 'title',
            subtitle: 'subtitle',
            media: 'image',
            active: 'active',
        },
        prepare({ title, subtitle, media, active }) {
            return {
                title: `${active === false ? '🔴 ' : ''}${title}`,
                subtitle,
                media,
            };
        },
    },
    orderings: [
        {
            title: 'Orden de aparición',
            name: 'orderAsc',
            by: [{ field: 'order', direction: 'asc' }],
        },
    ],
};
