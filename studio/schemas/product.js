export default {
    name: 'product',
    title: 'Producto',
    type: 'document',
    fields: [
        {
            name: 'name',
            title: 'Nombre del producto',
            type: 'string',
            validation: Rule => Rule.required().min(2).error('El nombre es obligatorio'),
        },
        {
            name: 'slug',
            title: 'URL amigable (slug)',
            type: 'slug',
            options: { source: 'name', maxLength: 96 },
            validation: Rule => Rule.required(),
        },
        {
            name: 'price',
            title: 'Precio (€)',
            type: 'number',
            validation: Rule => Rule.required().min(0),
        },
        {
            name: 'originalPrice',
            title: 'Precio original / antes de oferta (€)',
            type: 'number',
            description: 'Rellena solo si el producto está en oferta',
        },
        {
            name: 'category',
            title: 'Categoría',
            type: 'string',
            options: {
                list: [
                    { title: 'Nueva Colección', value: 'Nueva Colección' },
                    { title: 'Invitada Talla Grande', value: 'Invitada Talla Grande' },
                    { title: 'Casual', value: 'Casual' },
                    { title: 'Fiesta', value: 'Fiesta' },
                    { title: 'Complementos', value: 'Complementos' },
                    { title: 'Bolsos', value: 'Bolsos' },
                    { title: 'Special Price', value: 'Special Price' },
                ],
                layout: 'dropdown',
            },
            validation: Rule => Rule.required(),
        },
        {
            name: 'subcategory',
            title: 'Subcategoría',
            type: 'string',
            options: {
                list: [
                    { title: 'Camisas y Chalecos', value: 'casual-camisas-chalecos' },
                    { title: 'Camisetas y Tops', value: 'casual-camisetas-tops' },
                    { title: 'Chaquetas', value: 'casual-chaquetas' },
                    { title: 'Faldas y Shorts', value: 'casual-faldas-shorts' },
                    { title: 'Pantalones y Monos', value: 'casual-pantalones-monos' },
                    { title: 'Total Casual Look', value: 'casual-total-look' },
                    { title: 'Vestidos Casuales', value: 'casual-vestidos' },
                    { title: 'Conjunto Dos Piezas', value: 'fiesta-conjunto-dos-piezas' },
                    { title: 'Vestidos Fiesta', value: 'fiesta-vestidos' },
                    { title: 'Vestidos Largos Fiesta', value: 'fiesta-vestidos-largos' },
                    { title: 'Anillos', value: 'complementos-anillos' },
                    { title: 'Cinturones', value: 'complementos-cinturones' },
                    { title: 'Collares', value: 'complementos-collares' },
                    { title: 'Pendientes', value: 'complementos-pendientes' },
                    { title: 'Pulseras', value: 'complementos-pulseras' },
                    { title: 'Tocados', value: 'complementos-tocados' },
                ],
                layout: 'dropdown',
            },
        },
        {
            name: 'tags',
            title: 'Etiquetas',
            type: 'array',
            of: [{ type: 'string' }],
            options: {
                list: [
                    'Nueva Colección', 'Destacado', 'Exclusivo', 'Oferta',
                    'Fiesta', 'Casual', 'Invitada Talla Grande', 'Complementos', 'Bolsos',
                ],
                layout: 'tags',
            },
        },
        {
            name: 'image',
            title: 'Imagen principal',
            type: 'image',
            options: { 
                hotspot: true,
                storeOriginalFilename: true,
                accept: 'image/*'
            },
            description: 'Sube la imagen en su máxima calidad. Cualquier formato es válido (JPG, PNG, WebP, SVG, etc.)',
            validation: Rule => Rule.required(),
        },
        {
            name: 'gallery',
            title: 'Galería de fotos adicionales',
            type: 'array',
            of: [{ 
                type: 'image', 
                options: { 
                    hotspot: true,
                    storeOriginalFilename: true,
                    accept: 'image/*'
                } 
            }],
            description: 'Fotos adicionales del producto en máxima calidad. Puedes seleccionar varias a la vez (Arrastrar y Soltar).',
        },
        {
            name: 'description',
            title: 'Descripción',
            type: 'text',
            rows: 4,
        },
        {
            name: 'sizes',
            title: 'Tallas disponibles',
            type: 'array',
            of: [{ type: 'string' }],
            options: {
                list: ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL', '4XL', 'S/M', 'L/XL', 'Única'],
                layout: 'tags',
            },
        },
        {
            name: 'colors',
            title: 'Colores disponibles',
            type: 'array',
            of: [{ type: 'string' }],
            options: {
                layout: 'tags',
            },
            description: 'Escribe los colores disponibles separados por coma o Intro (ej. Rojo, Azul marino, Blanco)',
        },
        {
            name: 'active',
            title: 'Visible en la tienda',
            type: 'boolean',
            initialValue: true,
        },
        {
            name: 'featured',
            title: 'Producto destacado (mostrar en inicio)',
            type: 'boolean',
            initialValue: false,
        },
    ],
    preview: {
        select: {
            title: 'name',
            subtitle: 'category',
            media: 'image',
        },
    },
};
