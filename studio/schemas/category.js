export default {
    name: 'category',
    title: 'Categoría',
    type: 'document',
    fields: [
        {
            name: 'name',
            title: 'Nombre',
            type: 'string',
            validation: Rule => Rule.required(),
        },
        {
            name: 'slug',
            title: 'URL amigable (slug)',
            type: 'slug',
            options: { source: 'name', maxLength: 64 },
            validation: Rule => Rule.required(),
        },
        {
            name: 'description',
            title: 'Descripción breve',
            type: 'text',
            rows: 2,
        },
        {
            name: 'coverImage',
            title: 'Imagen de portada',
            type: 'image',
            options: { hotspot: true },
        },
        {
            name: 'order',
            title: 'Orden de aparición',
            type: 'number',
            description: 'Número menor = aparece antes',
            initialValue: 99,
        },
    ],
    preview: {
        select: {
            title: 'name',
            media: 'coverImage',
        },
    },
};
