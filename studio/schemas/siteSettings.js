export default {
  name: 'siteSettings',
  title: 'Configuración de la Web',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Título',
      type: 'string',
      description: 'Nombre de la web, ej: Jándula Moda'
    },
    {
      name: 'businessHours',
      title: 'Horario',
      type: 'array',
      of: [{type: 'string'}],
      description: 'Añade líneas de horario, ej: "Lunes a Viernes: 10:00 – 14:00 / 17:30 – 21:00", "Sábados: 10:00 – 14:00"'
    }
  ]
}
