export default {
    name: 'category',
    title: 'Categoría',
    type: 'document',
    groups: [
        { name: 'general', title: 'General' },
        { name: 'nav', title: 'Menú de navegación' },
        { name: 'block', title: 'Bloque destacado (inicio)' },
    ],
    fields: [
        {
            name: 'name',
            title: 'Nombre',
            type: 'string',
            group: 'general',
            validation: Rule => Rule.required(),
        },
        {
            name: 'slug',
            title: 'URL amigable (slug)',
            type: 'slug',
            group: 'general',
            options: { source: 'name', maxLength: 64 },
            validation: Rule => Rule.required(),
            description: 'Ejemplo: "casual", "fiesta", "complementos"',
        },
        {
            name: 'active',
            title: 'Activa',
            type: 'boolean',
            group: 'general',
            description: 'Si está desactivada no aparece en el menú ni en la web',
            initialValue: true,
        },
        {
            name: 'order',
            title: 'Orden de aparición',
            type: 'number',
            group: 'general',
            description: 'Número menor = aparece antes. Empieza por 1.',
            initialValue: 99,
        },
        {
            name: 'description',
            title: 'Descripción breve',
            type: 'text',
            group: 'general',
            rows: 2,
        },
        {
            name: 'coverImage',
            title: 'Imagen de portada',
            type: 'image',
            group: 'general',
            options: { hotspot: true },
        },

        // ── Menú de navegación ──────────────────────────────────────────
        {
            name: 'subcategories',
            title: 'Subcategorías',
            type: 'array',
            group: 'nav',
            description: 'Subcategorías que aparecen en el desplegable del menú',
            of: [
                {
                    type: 'object',
                    name: 'subcategory',
                    fields: [
                        {
                            name: 'name',
                            title: 'Nombre',
                            type: 'string',
                            validation: Rule => Rule.required(),
                        },
                        {
                            name: 'slug',
                            title: 'Slug (URL)',
                            type: 'string',
                            description: 'Ejemplo: "casual-vestidos"',
                            validation: Rule => Rule.required(),
                        },
                    ],
                    preview: {
                        select: { title: 'name', subtitle: 'slug' },
                    },
                },
            ],
        },

        // ── Bloque destacado en la página de inicio ─────────────────────
        {
            name: 'showInBlocks',
            title: 'Mostrar como bloque destacado en inicio',
            type: 'boolean',
            group: 'block',
            initialValue: false,
        },
        {
            name: 'blockTitle',
            title: 'Título del bloque',
            type: 'string',
            group: 'block',
            description: 'Si se deja vacío se usa el nombre de la categoría',
        },
        {
            name: 'blockDesc',
            title: 'Descripción del bloque',
            type: 'string',
            group: 'block',
            description: 'Texto corto que aparece debajo del título',
        },
        {
            name: 'blockCta',
            title: 'Texto del botón (CTA)',
            type: 'string',
            group: 'block',
            description: 'Ejemplo: "Descubrir", "Ver Accesorios"',
            initialValue: 'Ver colección',
        },
    ],
    preview: {
        select: {
            title: 'name',
            subtitle: 'slug.current',
            media: 'coverImage',
            active: 'active',
        },
        prepare({ title, subtitle, media, active }) {
            return {
                title: `${active === false ? '🔴 ' : ''}${title}`,
                subtitle: `/${subtitle}`,
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
