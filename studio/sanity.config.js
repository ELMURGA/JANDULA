import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { schemaTypes } from './schemas';

// ⚠️ PASOS PARA ACTIVAR EL STUDIO:
// 1. Ve a https://sanity.io y crea una cuenta gratuita
// 2. Crea un nuevo proyecto llamado "jandula-moda"
// 3. Copia el Project ID y sustitúyelo abajo donde pone 'TU-PROJECT-ID'
// 4. En el panel de Sanity, ve a API > CORS Origins y añade el dominio de la web

export default defineConfig({
    name: 'jandula-studio',
    title: 'Jándula Moda — Studio',

    projectId: 'wcz82277',
    dataset: 'production',

    plugins: [
        structureTool({
            structure: (S) =>
                S.list()
                    .title('Jándula Moda')
                    .items([
                        S.listItem()
                            .title('🛍️ Productos')
                            .child(S.documentTypeList('product').title('Todos los productos')),
                        S.listItem()
                            .title('📂 Categorías')
                            .child(S.documentTypeList('category').title('Categorías')),
                        S.listItem()
                            .title('🖼️ Banners')
                            .child(S.documentTypeList('banner').title('Banners y destacados')),
                        S.listItem()
                            .title('🏷️ Cupones de Descuento')
                            .child(S.documentTypeList('discount').title('Cupones de Descuento')),
                        S.listItem()
                            .title('⚙️ Configuración')
                            .child(S.documentTypeList('siteSettings').title('Configuración de la Web')),
                    ]),
        }),
        visionTool(),
    ],

    schema: {
        types: schemaTypes,
    },
});
