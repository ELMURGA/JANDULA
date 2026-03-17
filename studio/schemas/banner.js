export default {
    name: 'banner',
    title: 'Banner / Destacado',
    type: 'document',
    fields: [
        {
            name: 'title',
            title: 'Título del banner',
            type: 'string',
            validation: Rule => Rule.required(),
        },
        {
            name: 'subtitle',
            title: 'Subtítulo o descripción',
            type: 'string',
        },
        {
            name: 'image',
            title: 'Imagen de fondo',
            type: 'image',
            options: { hotspot: true },
            validation: Rule => Rule.required(),
        },
        {
            name: 'buttonText',
            title: 'Texto del botón',
            type: 'string',
            initialValue: 'VER COLECCIÓN',
        },
        {
            name: 'buttonLink',
            title: 'Enlace del botón (ej: /categoria/fiesta)',
            type: 'string',
        },
        {
            name: 'active',
            title: 'Mostrar este banner',
            type: 'boolean',
            initialValue: true,
        },
        {
            name: 'order',
            title: 'Orden (si hay varios banners)',
            type: 'number',
            initialValue: 1,
        },
    ],
    preview: {
        select: {
            title: 'title',
            subtitle: 'subtitle',
            media: 'image',
        },
    },
};
