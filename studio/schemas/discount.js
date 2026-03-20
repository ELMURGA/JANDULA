export default {
    name: 'discount',
    title: 'Cupón de Descuento',
    type: 'document',
    fields: [
        {
            name: 'code',
            title: 'Código del cupón',
            type: 'string',
            description: 'En mayúsculas, sin espacios. Ej: VERANO20',
            validation: Rule => Rule.required().uppercase().min(3).max(30)
                .regex(/^[A-Z0-9_-]+$/, { name: 'Sin espacios ni caracteres especiales' }),
        },
        {
            name: 'description',
            title: 'Descripción interna',
            type: 'string',
            description: 'Nota interna para identificar el cupón. No la ve el cliente.',
        },
        {
            name: 'type',
            title: 'Tipo de descuento',
            type: 'string',
            options: {
                list: [
                    { title: 'Porcentaje (%) — Ej: 10% de descuento', value: 'percentage' },
                    { title: 'Importe fijo (€) — Ej: 5€ de descuento', value: 'fixed' },
                    { title: 'Envío gratis', value: 'free_shipping' },
                ],
                layout: 'radio',
            },
            validation: Rule => Rule.required(),
        },
        {
            name: 'value',
            title: 'Valor del descuento',
            type: 'number',
            description: 'Para porcentaje: escribe 10 para un 10%. Para importe fijo: escribe 5 para 5€. Para envío gratis déjalo en 0.',
            validation: Rule => Rule.min(0),
        },
        {
            name: 'min_order',
            title: 'Pedido mínimo (€)',
            type: 'number',
            description: 'Importe mínimo del carrito para poder usar el cupón. Déjalo en 0 para sin mínimo.',
            initialValue: 0,
            validation: Rule => Rule.min(0),
        },
        {
            name: 'max_uses',
            title: 'Usos máximos',
            type: 'number',
            description: 'Número máximo de veces que se puede usar este cupón en total. Déjalo vacío para usos ilimitados.',
        },
        {
            name: 'is_active',
            title: 'Activo',
            type: 'boolean',
            description: 'Si está desactivado el cupón no funcionará aunque el cliente lo tenga.',
            initialValue: true,
        },
        {
            name: 'expires_at',
            title: 'Fecha de expiración',
            type: 'datetime',
            description: 'Opcional. Si no se establece, el cupón no caduca.',
        },
    ],
    preview: {
        select: {
            title: 'code',
            subtitle: 'description',
            active: 'is_active',
        },
        prepare({ title, subtitle, active }) {
            return {
                title: `${active ? '✅' : '❌'} ${title}`,
                subtitle: subtitle || '',
            };
        },
    },
};
