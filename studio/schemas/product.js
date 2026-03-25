import { SubcategoryInput } from '../src/components/SubcategoryInput'

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
            title: 'Categorías',
            type: 'array',
            of: [{ type: 'string' }],
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
                layout: 'grid',
            },
            validation: Rule => Rule.required().min(1).error('Selecciona al menos una categoría'),
        },
        {
            name: 'subcategory',
            title: 'Subcategorías',
            type: 'array',
            of: [{ type: 'string' }],
            description:
                'Las opciones se cargan automáticamente desde los documentos de Categorías. Si añades una nueva subcategoría allí, aparecerá aquí de inmediato.',
            components: {
                input: SubcategoryInput,
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
            name: 'variants',
            title: 'Variantes por color (tallas por color)',
            type: 'array',
            description: '⚠️ Usa esto SOLO si cada color tiene tallas distintas. Si todos los colores comparten las mismas tallas, usa los campos "Colores" y "Tallas" de arriba.',
            of: [
                {
                    type: 'object',
                    name: 'colorVariant',
                    title: 'Variante',
                    fields: [
                        {
                            name: 'color',
                            title: 'Nombre del color',
                            type: 'string',
                            validation: Rule => Rule.required(),
                        },
                        {
                            name: 'colorHex',
                            title: 'Código hexadecimal del color (ej. #FF0000)',
                            type: 'string',
                            validation: Rule =>
                                Rule.regex(/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/, { name: 'hex color' })
                                    .warning('Formato: #RGB o #RRGGBB'),
                        },
                        {
                            name: 'sizes',
                            title: 'Tallas para este color',
                            type: 'array',
                            of: [{ type: 'string' }],
                            options: {
                                list: ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL', '4XL', 'S/M', 'L/XL', 'Única'],
                                layout: 'tags',
                            },
                        },
                    ],
                    preview: {
                        select: { title: 'color', subtitle: 'sizes', hex: 'colorHex' },
                        prepare({ title, subtitle, hex }) {
                            const sizes = Array.isArray(subtitle) ? subtitle.join(', ') : '';
                            return { title: hex ? `${title} (${hex})` : (title || 'Sin color'), subtitle: sizes || 'Sin tallas' };
                        },
                    },
                },
            ],
        },
        {
            name: 'outOfStock',
            title: 'Agotado',
            type: 'boolean',
            initialValue: false,
            description: 'Actívalo para marcar el producto como agotado en la tienda. Aparecerá el botón "Avísame cuando esté disponible".',
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
            outOfStock: 'outOfStock',
        },
        prepare({ title, subtitle, media, outOfStock }) {
            const cats = Array.isArray(subtitle) ? subtitle.join(', ') : (subtitle || '');
            return {
                title: outOfStock ? `⛔ ${title}` : title,
                subtitle: cats,
                media,
            };
        },
    },
};
