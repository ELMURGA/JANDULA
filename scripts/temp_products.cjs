export const CATEGORIES = [
  'Todos',
  'Nueva Colección',
  'Invitada Talla Grande',
  'Casual',
  'Fiesta',
  'Complementos',
  'Bolsos',
  'Special Price',
];

export const SUBCATEGORIES = {
  'casual': [
    { name: 'Camisas y Chalecos', slug: 'casual-camisas-chalecos' },
    { name: 'Camisetas y Tops', slug: 'casual-camisetas-tops' },
    { name: 'Chaquetas', slug: 'casual-chaquetas' },
    { name: 'Faldas y Shorts', slug: 'casual-faldas-shorts' },
    { name: 'Pantalones y Monos', slug: 'casual-pantalones-monos' },
    { name: 'Total Casual Look', slug: 'casual-total-look' },
    { name: 'Vestidos', slug: 'casual-vestidos' },
  ],
  'fiesta': [
    { name: 'Conjunto Dos Piezas', slug: 'fiesta-conjunto-dos-piezas' },
    { name: 'Vestidos Fiesta', slug: 'fiesta-vestidos' },
    { name: 'Vestidos Largos Fiesta', slug: 'fiesta-vestidos-largos' },
  ],
  'complementos': [
    { name: 'Anillos', slug: 'complementos-anillos' },
    { name: 'Cinturones', slug: 'complementos-cinturones' },
    { name: 'Collares', slug: 'complementos-collares' },
    { name: 'Pendientes', slug: 'complementos-pendientes' },
    { name: 'Pulseras', slug: 'complementos-pulseras' },
    { name: 'Tocados', slug: 'complementos-tocados' },
  ],
};

module.exports = { products: [
  {
    id: 1,
    name: "VESTIDO LENTEJUELA ANA",
    price: 119.99,
    originalPrice: null,
    category: "Invitada Talla Grande",
    subcategory: null,
    tags: [
      "Invitada Talla Grande",
      "Destacado"
    ],
    image: "https://jandulamodautrera.es/wp-content/uploads/2026/01/IMG_6737.jpeg",
    description: "Vestido adornado con lentejuelas, perfecto para bodas y celebraciones.",
    sizes: [
      "XL",
      "XXL",
      "3XL"
    ]
  },
  {
    id: 2,
    name: "VESTIDO LUISA",
    price: 129.99,
    originalPrice: null,
    category: "Invitada Talla Grande",
    subcategory: null,
    tags: [
      "Invitada Talla Grande"
    ],
    image: "https://jandulamodautrera.es/wp-content/uploads/2026/01/8975-1.jpg",
    description: "Vestido elegante con corte favorecedor para todas las siluetas.",
    sizes: [
      "XL",
      "XXL",
      "3XL",
      "4XL"
    ]
  },
  {
    id: 3,
    name: "VESTIDO NUDE",
    price: 149.99,
    originalPrice: null,
    category: "Invitada Talla Grande",
    subcategory: null,
    tags: [
      "Invitada Talla Grande",
      "Fiesta"
    ],
    image: "https://jandulamodautrera.es/wp-content/uploads/2025/09/IMG_7165.jpg",
    description: "Vestido en tono nude con detalles sofisticados para eventos formales.",
    sizes: [
      "XL",
      "XXL",
      "3XL"
    ]
  },
  {
    id: 4,
    name: "VESTIDO CURVI ANA",
    price: 59.99,
    originalPrice: null,
    category: "Invitada Talla Grande",
    subcategory: null,
    tags: [
      "Invitada Talla Grande"
    ],
    image: "https://jandulamodautrera.es/wp-content/uploads/2025/09/18026.jpg",
    description: "Vestido curvy con corte moderno y favorecedor. Elegancia sin límites.",
    sizes: [
      "XL",
      "XXL",
      "3XL",
      "4XL"
    ]
  },
  {
    id: 5,
    name: "VESTIDO CURVI SONIA",
    price: 89.99,
    originalPrice: null,
    category: "Invitada Talla Grande",
    subcategory: null,
    tags: [
      "Invitada Talla Grande"
    ],
    image: "https://jandulamodautrera.es/wp-content/uploads/2025/09/25259-1.jpg",
    description: "Vestido curvy elegante con diseño favorecedor.",
    sizes: [
      "XL",
      "XXL",
      "3XL",
      "4XL"
    ]
  },
  {
    id: 6,
    name: "VESTIDO CURVI MARIA",
    price: 135,
    originalPrice: null,
    category: "Invitada Talla Grande",
    subcategory: null,
    tags: [
      "Invitada Talla Grande"
    ],
    image: "https://jandulamodautrera.es/wp-content/uploads/2025/09/7930.jpg",
    description: "Vestido curvy con acabado premium para realzar tu belleza.",
    sizes: [
      "XL",
      "XXL",
      "3XL",
      "4XL"
    ]
  },
  {
    id: 7,
    name: "VESTIDO CURVI LUCIA",
    price: 75.99,
    originalPrice: null,
    category: "Invitada Talla Grande",
    subcategory: null,
    tags: [
      "Invitada Talla Grande"
    ],
    image: "https://jandulamodautrera.es/wp-content/uploads/2025/09/jr2252.jpg",
    description: "Vestido curvy con estilo moderno y sofisticado.",
    sizes: [
      "XL",
      "XXL",
      "3XL",
      "4XL"
    ]
  },
  {
    id: 8,
    name: "VESTIDO TORONTO",
    price: 230,
    originalPrice: null,
    category: "Fiesta",
    subcategory: "fiesta-vestidos-largos",
    tags: [
      "Invitada Talla Grande",
      "Fiesta"
    ],
    image: "https://jandulamodautrera.es/wp-content/uploads/2025/04/IMG_3558.jpg",
    description: "Vestido largo de alta costura para grandes eventos.",
    sizes: [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ]
  },
  {
    id: 9,
    name: "VESTIDO VALENTINA",
    price: 189,
    originalPrice: null,
    category: "Fiesta",
    subcategory: "fiesta-vestidos-largos",
    tags: [
      "Invitada Talla Grande",
      "Fiesta"
    ],
    image: "https://jandulamodautrera.es/wp-content/uploads/2025/04/IMG_2681.jpg",
    description: "Vestido largo con diseño exclusivo. Elegancia atemporal.",
    sizes: [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ]
  },
  {
    id: 10,
    name: "BOLSO NEGRO ASA DE MADERA",
    price: 22.99,
    originalPrice: null,
    category: "Bolsos",
    subcategory: null,
    tags: [
      "Bolsos"
    ],
    image: "https://jandulamodautrera.es/wp-content/uploads/2026/01/IMG_6668.jpeg",
    description: "Bolso negro con asa de madera. Elegante y práctico.",
    sizes: []
  },
  {
    id: 13,
    name: "BOLSO PISA",
    price: 39.99,
    originalPrice: null,
    category: "Bolsos",
    subcategory: null,
    tags: [
      "Bolsos"
    ],
    image: "https://jandulamodautrera.es/wp-content/uploads/2025/03/IMG_2544.jpg",
    description: "Bolso elegante con acabado premium.",
    sizes: []
  },
  {
    id: 14,
    name: "BOLSO MYKONOS",
    price: 24,
    originalPrice: null,
    category: "Bolsos",
    subcategory: null,
    tags: [
      "Nueva Colección",
      "Bolsos"
    ],
    image: "https://jandulamodautrera.es/wp-content/uploads/2026/02/IMG_1528.jpeg",
    description: "Bolso de mano en tonos mediterráneos.",
    sizes: []
  },
  {
    id: 15,
    name: "BOLSO ORLEANS",
    price: 24.99,
    originalPrice: null,
    category: "Bolsos",
    subcategory: null,
    tags: [
      "Nueva Colección",
      "Bolsos"
    ],
    image: "https://jandulamodautrera.es/wp-content/uploads/2026/02/IMG_1526.jpeg",
    description: "Bolso estilo clásico con acabado premium.",
    sizes: []
  },
  {
    id: 16,
    name: "BOLSO BOHO",
    price: 28,
    originalPrice: null,
    category: "Bolsos",
    subcategory: null,
    tags: [
      "Nueva Colección",
      "Bolsos"
    ],
    image: "https://jandulamodautrera.es/wp-content/uploads/2026/02/IMG_1507.jpeg",
    description: "Bolso estilo boho con detalles artesanales.",
    sizes: []
  },
  {
    id: 17,
    name: "PENDIENTES NURIA",
    price: 7.99,
    originalPrice: null,
    category: "Complementos",
    subcategory: "complementos-pendientes",
    tags: [
      "Complementos"
    ],
    image: "https://jandulamodautrera.es/wp-content/uploads/2026/01/IMG_6322.jpeg",
    description: "Pendientes colgantes con detalle de cristal.",
    sizes: []
  },
  {
    id: 18,
    name: "PENDIENTES NADIA",
    price: 7.99,
    originalPrice: null,
    category: "Complementos",
    subcategory: "complementos-pendientes",
    tags: [
      "Complementos"
    ],
    image: "https://jandulamodautrera.es/wp-content/uploads/2026/01/IMG_6323.jpeg",
    description: "Pendientes elegantes con diseño moderno.",
    sizes: []
  },
  {
    id: 19,
    name: "PENDIENTE SOL",
    price: 7.99,
    originalPrice: null,
    category: "Complementos",
    subcategory: "complementos-pendientes",
    tags: [
      "Complementos"
    ],
    image: "https://jandulamodautrera.es/wp-content/uploads/2025/04/IMG_2566.jpg",
    description: "Pendientes con forma de sol, luminosos y perfectos.",
    sizes: []
  },
  {
    id: 20,
    name: "PENDIENTES FLORENCIA",
    price: 6.99,
    originalPrice: null,
    category: "Complementos",
    subcategory: "complementos-pendientes",
    tags: [
      "Complementos"
    ],
    image: "https://jandulamodautrera.es/wp-content/uploads/2025/03/IMG_2086.jpg",
    description: "Pendientes con inspiración florentina.",
    sizes: []
  },
  {
    id: 21,
    name: "PENDIENTES GUEPARDO",
    price: 7.99,
    originalPrice: null,
    category: "Complementos",
    subcategory: "complementos-pendientes",
    tags: [
      "Complementos"
    ],
    image: "https://jandulamodautrera.es/wp-content/uploads/2025/03/IMG_8428.jpg",
    description: "Pendientes con estampado animal print.",
    sizes: []
  },
  {
    id: 22,
    name: "PENDIENTES ZEBRA",
    price: 7.99,
    originalPrice: null,
    category: "Complementos",
    subcategory: "complementos-pendientes",
    tags: [
      "Complementos"
    ],
    image: "https://jandulamodautrera.es/wp-content/uploads/2025/03/IMG_8432.jpg",
    description: "Pendientes con estampado de cebra.",
    sizes: []
  },
  {
    id: 23,
    name: "PENDIENTES MARIPOSA",
    price: 10,
    originalPrice: null,
    category: "Complementos",
    subcategory: "complementos-pendientes",
    tags: [
      "Complementos"
    ],
    image: "https://jandulamodautrera.es/wp-content/uploads/2024/07/1-21.jpg",
    description: "Pendientes en forma de mariposa, delicados y encantadores.",
    sizes: []
  },
  {
    id: 24,
    name: "PENDIENTES HOJA",
    price: 10,
    originalPrice: null,
    category: "Complementos",
    subcategory: "complementos-pendientes",
    tags: [
      "Complementos"
    ],
    image: "https://jandulamodautrera.es/wp-content/uploads/2024/07/2-18.jpg",
    description: "Pendientes con diseño de hoja natural.",
    sizes: []
  },
  {
    id: 25,
    name: "ARGOLLAS BEA",
    price: 7.99,
    originalPrice: null,
    category: "Complementos",
    subcategory: "complementos-pendientes",
    tags: [
      "Complementos"
    ],
    image: "https://jandulamodautrera.es/wp-content/uploads/2024/07/1.jpg",
    description: "Argollas clásicas con acabado brillante.",
    sizes: []
  },
  {
    id: 26,
    name: "COLLAR ESTRELLA",
    price: 20,
    originalPrice: null,
    category: "Complementos",
    subcategory: "complementos-collares",
    tags: [
      "Complementos"
    ],
    image: "https://jandulamodautrera.es/wp-content/uploads/2025/09/IMG_6637.jpg",
    description: "Collar con colgante de estrella.",
    sizes: []
  },
  {
    id: 27,
    name: "COLLAR FLOR",
    price: 12.99,
    originalPrice: null,
    category: "Complementos",
    subcategory: "complementos-collares",
    tags: [
      "Complementos"
    ],
    image: "https://jandulamodautrera.es/wp-content/uploads/2025/08/IMG_5116.jpg",
    description: "Collar con colgante de flor, delicado y femenino.",
    sizes: []
  },
  {
    id: 28,
    name: "COLLAR PAQUI",
    price: 11,
    originalPrice: null,
    category: "Complementos",
    subcategory: "complementos-collares",
    tags: [
      "Complementos"
    ],
    image: "https://jandulamodautrera.es/wp-content/uploads/2025/05/IMG_8180.jpg",
    description: "Collar con diseño artesanal, pieza única.",
    sizes: []
  },
  {
    id: 29,
    name: "COLLAR PRAGA",
    price: 9.99,
    originalPrice: null,
    category: "Complementos",
    subcategory: "complementos-collares",
    tags: [
      "Complementos"
    ],
    image: "https://jandulamodautrera.es/wp-content/uploads/2025/03/IMG_9361.jpg",
    description: "Collar con inspiración centroeuropea.",
    sizes: []
  },
  {
    id: 30,
    name: "COLLAR CORAZON",
    price: 11,
    originalPrice: null,
    category: "Complementos",
    subcategory: "complementos-collares",
    tags: [
      "Complementos"
    ],
    image: "https://jandulamodautrera.es/wp-content/uploads/2025/03/IMG_8450-1.jpg",
    description: "Collar con colgante de corazón.",
    sizes: []
  },
  {
    id: 31,
    name: "COLLAR MODELO CORBATA",
    price: 10,
    originalPrice: null,
    category: "Complementos",
    subcategory: "complementos-collares",
    tags: [
      "Complementos"
    ],
    image: "https://jandulamodautrera.es/wp-content/uploads/2025/03/IMG_8463.jpg",
    description: "Collar tipo corbata con diseño vanguardista.",
    sizes: []
  },
  {
    id: 32,
    name: "COLLAR AFRICANO",
    price: 12,
    originalPrice: null,
    category: "Complementos",
    subcategory: "complementos-collares",
    tags: [
      "Complementos"
    ],
    image: "https://jandulamodautrera.es/wp-content/uploads/2025/03/IMG_8470.jpg",
    description: "Collar con inspiración africana, colores vibrantes.",
    sizes: []
  },
  {
    id: 33,
    name: "COLLAR MULTI",
    price: 8.99,
    originalPrice: null,
    category: "Complementos",
    subcategory: "complementos-collares",
    tags: [
      "Complementos"
    ],
    image: "https://jandulamodautrera.es/wp-content/uploads/2025/02/image00003.jpeg",
    description: "Collar multicapa versátil.",
    sizes: []
  },
  {
    id: 34,
    name: "COLLAR MONEDA",
    price: 6,
    originalPrice: null,
    category: "Complementos",
    subcategory: "complementos-collares",
    tags: [
      "Complementos"
    ],
    image: "https://jandulamodautrera.es/wp-content/uploads/2025/02/image00001.jpeg",
    description: "Collar con colgante de moneda, estilo bohemio.",
    sizes: []
  },
  {
    id: 35,
    name: "COLLAR INSPIRACIÓN OSO",
    price: 7.99,
    originalPrice: null,
    category: "Complementos",
    subcategory: "complementos-collares",
    tags: [
      "Complementos"
    ],
    image: "https://jandulamodautrera.es/wp-content/uploads/2025/02/image00002.jpeg",
    description: "Collar con colgante de osito.",
    sizes: []
  },
  {
    id: 36,
    name: "COLLAR PERRITO",
    price: 7.99,
    originalPrice: null,
    category: "Complementos",
    subcategory: "complementos-collares",
    tags: [
      "Complementos"
    ],
    image: "https://jandulamodautrera.es/wp-content/uploads/2024/07/3-5.jpg",
    description: "Collar con colgante de perrito.",
    sizes: []
  },
  {
    id: 37,
    name: "COLLAR NÁCAR",
    price: 6.99,
    originalPrice: null,
    category: "Complementos",
    subcategory: "complementos-collares",
    tags: [
      "Complementos"
    ],
    image: "https://jandulamodautrera.es/wp-content/uploads/2024/07/1-7.jpg",
    description: "Collar con detalles de nácar.",
    sizes: []
  },
  {
    id: 38,
    name: "COLLAR BABERO",
    price: 19,
    originalPrice: null,
    category: "Complementos",
    subcategory: "complementos-collares",
    tags: [
      "Complementos"
    ],
    image: "https://jandulamodautrera.es/wp-content/uploads/2025/04/IMG_2746.jpg",
    description: "Collar tipo babero statement.",
    sizes: []
  },
  {
    id: 39,
    name: "COLLAR BOLAS",
    price: 7.99,
    originalPrice: null,
    category: "Complementos",
    subcategory: "complementos-collares",
    tags: [
      "Nueva Colección",
      "Complementos"
    ],
    image: "https://jandulamodautrera.es/wp-content/uploads/2026/02/IMG_0593-1.jpeg",
    description: "Collar de bolas con acabado brillante.",
    sizes: []
  },
  {
    id: 40,
    name: "ROSARIO MEDIANO BOLA",
    price: 7.99,
    originalPrice: null,
    category: "Complementos",
    subcategory: "complementos-collares",
    tags: [
      "Complementos"
    ],
    image: "https://jandulamodautrera.es/wp-content/uploads/2024/07/2-25.jpg",
    description: "Rosario mediano con cuentas de bola.",
    sizes: []
  },
  {
    id: 41,
    name: "ROSARIO MEDIANO",
    price: 7.99,
    originalPrice: null,
    category: "Complementos",
    subcategory: "complementos-collares",
    tags: [
      "Complementos"
    ],
    image: "https://jandulamodautrera.es/wp-content/uploads/2024/07/1-24.jpg",
    description: "Rosario mediano clásico.",
    sizes: []
  },
  {
    id: 42,
    name: "ANILLO FANTASI",
    price: 6.99,
    originalPrice: null,
    category: "Complementos",
    subcategory: "complementos-anillos",
    tags: [
      "Nueva Colección",
      "Complementos"
    ],
    image: "https://jandulamodautrera.es/wp-content/uploads/2026/02/IMG_1167.jpeg",
    description: "Anillo de fantasía con piedra semipreciosa.",
    sizes: []
  },
  {
    id: 43,
    name: "CINTURÓN TURQUÍA",
    price: 7.99,
    originalPrice: null,
    category: "Complementos",
    subcategory: "complementos-cinturones",
    tags: [
      "Complementos"
    ],
    image: "https://jandulamodautrera.es/wp-content/uploads/2025/03/IMG_1068.jpg",
    description: "Cinturón con diseño turco artesanal.",
    sizes: []
  },
  {
    id: 44,
    name: "CINTURÓN ESTRECHO",
    price: 11.99,
    originalPrice: null,
    category: "Complementos",
    subcategory: "complementos-cinturones",
    tags: [
      "Complementos"
    ],
    image: "https://jandulamodautrera.es/wp-content/uploads/2026/02/IMG_0593.jpeg",
    description: "Cinturón estrecho con hebilla dorada.",
    sizes: []
  },
  {
    id: 45,
    name: "CUELLO DE PELO",
    price: 12.99,
    originalPrice: null,
    category: "Complementos",
    subcategory: null,
    tags: [
      "Complementos"
    ],
    image: "https://jandulamodautrera.es/wp-content/uploads/2025/12/IMG_5388.jpeg",
    description: "Cuello de pelo suave y cálido.",
    sizes: []
  },
  {
    id: 46,
    name: "MEDIA REDUCTORA ITALIANA",
    price: 15,
    originalPrice: null,
    category: "Complementos",
    subcategory: null,
    tags: [
      "Complementos",
      "Fiesta",
      "Casual"
    ],
    image: "https://jandulamodautrera.es/wp-content/uploads/2025/03/IMG_2026.jpg",
    description: "Media reductora italiana. Confort y estilización.",
    sizes: [
      "S/M",
      "L/XL"
    ]
  },
  {
    id: 47,
    name: "VESTIDO RELIEVE",
    price: 160,
    originalPrice: null,
    category: "Fiesta",
    subcategory: "fiesta-vestidos",
    tags: [
      "Nueva Colección",
      "Fiesta"
    ],
    image: "https://jandulamodautrera.es/wp-content/uploads/2026/02/IMG_1080.jpeg",
    description: "Vestido con tejido de relieve para eventos especiales.",
    sizes: [
      "S",
      "M",
      "L",
      "XL"
    ]
  },
  {
    id: 48,
    name: "VESTIDO BRILLO CON TERERA",
    price: 139.99,
    originalPrice: null,
    category: "Fiesta",
    subcategory: "fiesta-vestidos",
    tags: [
      "Nueva Colección",
      "Fiesta",
      "Destacado"
    ],
    image: "https://jandulamodautrera.es/wp-content/uploads/2026/02/IMG_1011.jpeg",
    description: "Vestido con tejido brillante y detalles de pedrería.",
    sizes: [
      "S",
      "M",
      "L"
    ]
  },
  {
    id: 49,
    name: "VESTIDO DIAMANTE RAJA",
    price: 120,
    originalPrice: null,
    category: "Fiesta",
    subcategory: "fiesta-vestidos",
    tags: [
      "Nueva Colección",
      "Fiesta"
    ],
    image: "https://jandulamodautrera.es/wp-content/uploads/2026/02/IMG_1029.jpeg",
    description: "Vestido con detalles de diamante y raja elegante.",
    sizes: [
      "S",
      "M",
      "L",
      "XL"
    ]
  },
  {
    id: 50,
    name: "VESTIDO FLECOS REME",
    price: 150,
    originalPrice: null,
    category: "Fiesta",
    subcategory: "fiesta-vestidos",
    tags: [
      "Fiesta",
      "Exclusivo"
    ],
    image: "https://jandulamodautrera.es/wp-content/uploads/2026/02/IMG_0380.jpeg",
    description: "Vestido con flecos y movimiento. Pieza única.",
    sizes: [
      "S",
      "M",
      "L"
    ]
  },
  {
    id: 51,
    name: "VESTIDO ROJO NEOPRENO MANGAS",
    price: 140,
    originalPrice: null,
    category: "Fiesta",
    subcategory: "fiesta-vestidos",
    tags: [
      "Nueva Colección",
      "Fiesta"
    ],
    image: "https://jandulamodautrera.es/wp-content/uploads/2026/02/IMG_0549.jpeg",
    description: "Vestido rojo de neopreno con mangas. Impactante y estructurado.",
    sizes: [
      "S",
      "M",
      "L",
      "XL"
    ]
  },
  {
    id: 52,
    name: "VESTIDO NEOPRENO AMARILLO MANGAS",
    price: 140,
    originalPrice: null,
    category: "Fiesta",
    subcategory: "fiesta-vestidos",
    tags: [
      "Nueva Colección",
      "Fiesta"
    ],
    image: "https://jandulamodautrera.es/wp-content/uploads/2026/02/IMG_0504.jpeg",
    description: "Vestido neopreno amarillo con mangas. Luminoso y moderno.",
    sizes: [
      "S",
      "M",
      "L",
      "XL"
    ]
  },
  {
    id: 53,
    name: "VESTIDO NEOPRENO AMARILLO",
    price: 150,
    originalPrice: null,
    category: "Fiesta",
    subcategory: "fiesta-vestidos",
    tags: [
      "Nueva Colección",
      "Fiesta"
    ],
    image: "https://jandulamodautrera.es/wp-content/uploads/2026/02/IMG_0522.jpeg",
    description: "Vestido neopreno amarillo sin mangas. Estructura perfecta.",
    sizes: [
      "S",
      "M",
      "L",
      "XL"
    ]
  },
  {
    id: 54,
    name: "VESTIDO NEOPRENO ROSA",
    price: 160,
    originalPrice: null,
    category: "Fiesta",
    subcategory: "fiesta-vestidos",
    tags: [
      "Nueva Colección",
      "Fiesta"
    ],
    image: "https://jandulamodautrera.es/wp-content/uploads/2026/02/IMG_0418.jpeg",
    description: "Vestido de neopreno rosa vibrante.",
    sizes: [
      "S",
      "M",
      "L",
      "XL"
    ]
  },
  {
    id: 55,
    name: "VESTIDO NEOPRENO LILA",
    price: 155,
    originalPrice: null,
    category: "Fiesta",
    subcategory: "fiesta-vestidos-largos",
    tags: [
      "Nueva Colección",
      "Fiesta",
      "Exclusivo"
    ],
    image: "https://jandulamodautrera.es/wp-content/uploads/2026/02/IMG_0464.jpeg",
    description: "Vestido largo neopreno en tono lila.",
    sizes: [
      "S",
      "M",
      "L"
    ]
  },
  {
    id: 56,
    name: "VESTIDO ANASTASIA ROJO NEOPRENO",
    price: 156,
    originalPrice: null,
    category: "Fiesta",
    subcategory: "fiesta-vestidos",
    tags: [
      "Nueva Colección",
      "Fiesta"
    ],
    image: "https://jandulamodautrera.es/wp-content/uploads/2026/01/IMG_0488.jpeg",
    description: "Vestido rojo neopreno modelo Anastasia.",
    sizes: [
      "S",
      "M",
      "L",
      "XL"
    ]
  },
  {
    id: 57,
    name: "VESTIDO LAZO",
    price: 117,
    originalPrice: null,
    category: "Fiesta",
    subcategory: "fiesta-vestidos",
    tags: [
      "Fiesta"
    ],
    image: "https://jandulamodautrera.es/wp-content/uploads/2025/10/IMG_9286.jpg",
    description: "Vestido con detalle de lazo elegante.",
    sizes: [
      "S",
      "M",
      "L",
      "XL"
    ]
  },
  {
    id: 58,
    name: "VESTIDO ALICIA",
    price: 137.5,
    originalPrice: 274.99,
    category: "Fiesta",
    subcategory: "fiesta-vestidos",
    tags: [
      "Fiesta",
      "Special Price"
    ],
    image: "https://jandulamodautrera.es/wp-content/uploads/2025/09/IMG_8440.jpg",
    description: "Vestido de fiesta con detalles únicos. Precio irresistible.",
    sizes: [
      "S",
      "M",
      "L"
    ]
  },
  {
    id: 59,
    name: "VESTIDO ESTRELLA",
    price: 117,
    originalPrice: null,
    category: "Fiesta",
    subcategory: "fiesta-vestidos",
    tags: [
      "Fiesta"
    ],
    image: "https://jandulamodautrera.es/wp-content/uploads/2025/09/IMG_7159.jpg",
    description: "Vestido con detalles de estrella, diseño luminoso.",
    sizes: [
      "S",
      "M",
      "L",
      "XL"
    ]
  },
  {
    id: 60,
    name: "VESTIDO PANDORA",
    price: 140.99,
    originalPrice: null,
    category: "Fiesta",
    subcategory: "fiesta-vestidos",
    tags: [
      "Fiesta"
    ],
    image: "https://jandulamodautrera.es/wp-content/uploads/2025/09/IMG_7135-1.jpg",
    description: "Vestido de fiesta con diseño sofisticado.",
    sizes: [
      "S",
      "M",
      "L",
      "XL"
    ]
  },
  {
    id: 61,
    name: "VESTIDO OLIVIA",
    price: 199,
    originalPrice: null,
    category: "Fiesta",
    subcategory: "fiesta-vestidos-largos",
    tags: [
      "Fiesta"
    ],
    image: "https://jandulamodautrera.es/wp-content/uploads/2025/05/IMG_4647.jpg",
    description: "Vestido largo con acabado premium.",
    sizes: [
      "S",
      "M",
      "L"
    ]
  },
  {
    id: 62,
    name: "VESTIDO LORENA",
    price: 110,
    originalPrice: null,
    category: "Fiesta",
    subcategory: "fiesta-vestidos",
    tags: [
      "Fiesta"
    ],
    image: "https://jandulamodautrera.es/wp-content/uploads/2025/05/IMG_4617.jpg",
    description: "Vestido de fiesta con diseño exclusivo.",
    sizes: [
      "S",
      "M",
      "L",
      "XL"
    ]
  },
  {
    id: 63,
    name: "VESTIDO ESTRELLA VARIANTE",
    price: 125,
    originalPrice: null,
    category: "Fiesta",
    subcategory: "fiesta-vestidos",
    tags: [
      "Fiesta"
    ],
    image: "https://jandulamodautrera.es/wp-content/uploads/2025/05/IMG_4634.jpg",
    description: "Vestido estrella en versión especial.",
    sizes: [
      "S",
      "M",
      "L",
      "XL"
    ]
  },
  {
    id: 64,
    name: "VESTIDO PISTACHO",
    price: 100,
    originalPrice: null,
    category: "Fiesta",
    subcategory: "fiesta-vestidos",
    tags: [
      "Fiesta"
    ],
    image: "https://jandulamodautrera.es/wp-content/uploads/2025/05/IMG_4602.jpg",
    description: "Vestido en tono pistacho. Frescura y elegancia.",
    sizes: [
      "S",
      "M",
      "L",
      "XL"
    ]
  },
  {
    id: 65,
    name: "VESTIDO AMOR",
    price: 28.99,
    originalPrice: null,
    category: "Fiesta",
    subcategory: "fiesta-vestidos",
    tags: [
      "Fiesta",
      "Casual"
    ],
    image: "https://jandulamodautrera.es/wp-content/uploads/2025/05/IMG_4625.jpg",
    description: "Vestido con diseño romántico y femenino.",
    sizes: [
      "S",
      "M",
      "L",
      "XL"
    ]
  },
  {
    id: 66,
    name: "VESTIDO ESPE",
    price: 32,
    originalPrice: null,
    category: "Fiesta",
    subcategory: "fiesta-vestidos",
    tags: [
      "Fiesta",
      "Casual"
    ],
    image: "https://jandulamodautrera.es/wp-content/uploads/2025/05/IMG_4559.jpg",
    description: "Vestido versátil para ocasiones especiales.",
    sizes: [
      "S",
      "M",
      "L",
      "XL"
    ]
  },
  {
    id: 67,
    name: "VESTIDO LOLA",
    price: 50,
    originalPrice: 99,
    category: "Fiesta",
    subcategory: "fiesta-vestidos",
    tags: [
      "Fiesta",
      "Casual",
      "Special Price"
    ],
    image: "https://jandulamodautrera.es/wp-content/uploads/2025/05/IMG_3955-1.jpg",
    description: "Vestido midi con escote favorecedor. A mitad de precio.",
    sizes: [
      "S",
      "M",
      "L",
      "XL"
    ]
  },
  {
    id: 68,
    name: "VESTIDO CIELO",
    price: 115,
    originalPrice: null,
    category: "Fiesta",
    subcategory: "fiesta-vestidos",
    tags: [
      "Fiesta"
    ],
    image: "https://jandulamodautrera.es/wp-content/uploads/2025/05/IMG_3356.jpg",
    description: "Vestido en tono cielo, etéreo y luminoso.",
    sizes: [
      "S",
      "M",
      "L"
    ]
  },
  {
    id: 69,
    name: "VESTIDO REME",
    price: 35,
    originalPrice: null,
    category: "Fiesta",
    subcategory: "fiesta-vestidos",
    tags: [
      "Fiesta",
      "Casual"
    ],
    image: "https://jandulamodautrera.es/wp-content/uploads/2025/05/IMG_3409.jpeg",
    description: "Vestido con diseño fresco y moderno.",
    sizes: [
      "S",
      "M",
      "L",
      "XL"
    ]
  },
  {
    id: 70,
    name: "VESTIDO VICHY",
    price: 135,
    originalPrice: null,
    category: "Fiesta",
    subcategory: "fiesta-vestidos",
    tags: [
      "Fiesta"
    ],
    image: "https://jandulamodautrera.es/wp-content/uploads/2025/04/IMG_7465.jpg",
    description: "Vestido vichy con acabado de lujo.",
    sizes: [
      "S",
      "M",
      "L",
      "XL"
    ]
  },
  {
    id: 71,
    name: "VESTIDO DULCE",
    price: 150,
    originalPrice: null,
    category: "Fiesta",
    subcategory: "fiesta-vestidos",
    tags: [
      "Fiesta"
    ],
    image: "https://jandulamodautrera.es/wp-content/uploads/2025/04/IMG_9262.jpg",
    description: "Vestido con detalles dulces y románticos.",
    sizes: [
      "S",
      "M",
      "L"
    ]
  },
  {
    id: 72,
    name: "VESTIDO BIANCA",
    price: 179,
    originalPrice: null,
    category: "Fiesta",
    subcategory: "fiesta-vestidos-largos",
    tags: [
      "Fiesta"
    ],
    image: "https://jandulamodautrera.es/wp-content/uploads/2025/04/IMG_1221-1.jpg",
    description: "Vestido largo con diseño italiano.",
    sizes: [
      "S",
      "M",
      "L"
    ]
  },
  {
    id: 73,
    name: "VESTIDO MALENA",
    price: 189,
    originalPrice: null,
    category: "Fiesta",
    subcategory: "fiesta-vestidos-largos",
    tags: [
      "Fiesta"
    ],
    image: "https://jandulamodautrera.es/wp-content/uploads/2025/04/IMG_1155.jpg",
    description: "Vestido largo con acabado premium.",
    sizes: [
      "S",
      "M",
      "L"
    ]
  },
  {
    id: 74,
    name: "VESTIDO MELANI",
    price: 145,
    originalPrice: null,
    category: "Fiesta",
    subcategory: "fiesta-vestidos",
    tags: [
      "Fiesta"
    ],
    image: "https://jandulamodautrera.es/wp-content/uploads/2025/04/IMG_1248.jpg",
    description: "Vestido de fiesta con corte moderno.",
    sizes: [
      "S",
      "M",
      "L",
      "XL"
    ]
  },
  {
    id: 75,
    name: "VESTIDO COSMOS",
    price: 129,
    originalPrice: null,
    category: "Fiesta",
    subcategory: "fiesta-vestidos",
    tags: [
      "Fiesta"
    ],
    image: "https://jandulamodautrera.es/wp-content/uploads/2025/03/IMG_2419.jpg",
    description: "Vestido inspirado en el cosmos.",
    sizes: [
      "S",
      "M",
      "L"
    ]
  },
  {
    id: 76,
    name: "VESTIDO JARA",
    price: 119,
    originalPrice: null,
    category: "Fiesta",
    subcategory: "fiesta-vestidos",
    tags: [
      "Fiesta"
    ],
    image: "https://jandulamodautrera.es/wp-content/uploads/2025/03/IMG_2408-1.jpg",
    description: "Vestido con estilo natural y elegante.",
    sizes: [
      "S",
      "M",
      "L",
      "XL"
    ]
  },
  {
    id: 77,
    name: "VESTIDO MACARENA",
    price: 28,
    originalPrice: null,
    category: "Fiesta",
    subcategory: "fiesta-vestidos",
    tags: [
      "Fiesta",
      "Casual"
    ],
    image: "https://jandulamodautrera.es/wp-content/uploads/2025/03/IMG_2357.jpg",
    description: "Vestido fresco y cómodo.",
    sizes: [
      "S",
      "M",
      "L",
      "XL"
    ]
  },
  {
    id: 78,
    name: "VESTIDO ESPERANZA",
    price: 29.99,
    originalPrice: null,
    category: "Fiesta",
    subcategory: "fiesta-vestidos",
    tags: [
      "Fiesta",
      "Casual"
    ],
    image: "https://jandulamodautrera.es/wp-content/uploads/2025/03/IMG_2354.jpg",
    description: "Vestido con diseño esperanzador.",
    sizes: [
      "S",
      "M",
      "L",
      "XL"
    ]
  },
  {
    id: 79,
    name: "VESTIDO CALA",
    price: 110,
    originalPrice: null,
    category: "Fiesta",
    subcategory: "fiesta-vestidos",
    tags: [
      "Fiesta"
    ],
    image: "https://jandulamodautrera.es/wp-content/uploads/2025/03/IMG_0642.jpg",
    description: "Vestido con inspiración floral.",
    sizes: [
      "S",
      "M",
      "L"
    ]
  },
  {
    id: 80,
    name: "VESTIDO NARCISO",
    price: 89.99,
    originalPrice: null,
    category: "Fiesta",
    subcategory: "fiesta-vestidos",
    tags: [
      "Fiesta"
    ],
    image: "https://jandulamodautrera.es/wp-content/uploads/2025/03/IMG_9150.jpg",
    description: "Vestido con detalles de narciso.",
    sizes: [
      "S",
      "M",
      "L",
      "XL"
    ]
  },
  {
    id: 81,
    name: "VESTIDO VIOLETA",
    price: 129.99,
    originalPrice: null,
    category: "Fiesta",
    subcategory: "fiesta-vestidos",
    tags: [
      "Fiesta"
    ],
    image: "https://jandulamodautrera.es/wp-content/uploads/2025/03/IMG_9156.jpg",
    description: "Vestido en tono violeta intenso.",
    sizes: [
      "S",
      "M",
      "L"
    ]
  },
  {
    id: 82,
    name: "VESTIDO LOTUS",
    price: 99.99,
    originalPrice: null,
    category: "Fiesta",
    subcategory: "fiesta-vestidos",
    tags: [
      "Fiesta"
    ],
    image: "https://jandulamodautrera.es/wp-content/uploads/2025/03/IMG_9152.jpg",
    description: "Vestido inspirado en la flor de loto.",
    sizes: [
      "S",
      "M",
      "L",
      "XL"
    ]
  },
  {
    id: 83,
    name: "VESTIDO IRIS",
    price: 100,
    originalPrice: null,
    category: "Fiesta",
    subcategory: "fiesta-vestidos",
    tags: [
      "Fiesta"
    ],
    image: "https://jandulamodautrera.es/wp-content/uploads/2025/03/IMG_9146-e1741426704304.png",
    description: "Vestido multicolor con estilo iris.",
    sizes: [
      "S",
      "M",
      "L"
    ]
  },
  {
    id: 84,
    name: "VESTIDO PASTEL",
    price: 110,
    originalPrice: null,
    category: "Fiesta",
    subcategory: "fiesta-vestidos",
    tags: [
      "Fiesta"
    ],
    image: "https://jandulamodautrera.es/wp-content/uploads/2025/03/IMG_9148.png",
    description: "Vestido en tonos pastel suaves.",
    sizes: [
      "S",
      "M",
      "L",
      "XL"
    ]
  },
  {
    id: 85,
    name: "VESTIDO FLECOS CORAZON",
    price: 150,
    originalPrice: null,
    category: "Fiesta",
    subcategory: "fiesta-vestidos",
    tags: [
      "Fiesta"
    ],
    image: "https://jandulamodautrera.es/wp-content/uploads/2025/02/3A144B85-B6B9-4D73-A21B-F838872C9417.jpeg",
    description: "Vestido con flecos y corazones.",
    sizes: [
      "S",
      "M",
      "L"
    ]
  },
  {
    id: 86,
    name: "VESTIDO FLORAL",
    price: 169.99,
    originalPrice: null,
    category: "Fiesta",
    subcategory: "fiesta-vestidos",
    tags: [
      "Fiesta"
    ],
    image: "https://jandulamodautrera.es/wp-content/uploads/2025/03/IMG_9139.jpg",
    description: "Vestido con estampado floral premium.",
    sizes: [
      "S",
      "M",
      "L",
      "XL"
    ]
  },
  {
    id: 87,
    name: "VESTIDO PÉTALO",
    price: 169.99,
    originalPrice: null,
    category: "Fiesta",
    subcategory: "fiesta-vestidos",
    tags: [
      "Fiesta"
    ],
    image: "https://jandulamodautrera.es/wp-content/uploads/2025/03/IMG_9140.jpg",
    description: "Vestido con diseño de pétalos.",
    sizes: [
      "S",
      "M",
      "L"
    ]
  },
  {
    id: 88,
    name: "VESTIDO PEONIA",
    price: 135,
    originalPrice: null,
    category: "Fiesta",
    subcategory: "fiesta-vestidos",
    tags: [
      "Fiesta"
    ],
    image: "https://jandulamodautrera.es/wp-content/uploads/2025/03/IMG_9124.jpg",
    description: "Vestido inspirado en la peonía.",
    sizes: [
      "S",
      "M",
      "L",
      "XL"
    ]
  },
  {
    id: 89,
    name: "VESTIDO PEONIA VARIANTE",
    price: 160,
    originalPrice: null,
    category: "Fiesta",
    subcategory: "fiesta-vestidos",
    tags: [
      "Fiesta"
    ],
    image: "https://jandulamodautrera.es/wp-content/uploads/2025/02/IMG_6344.jpg",
    description: "Vestido peonía en versión especial.",
    sizes: [
      "S",
      "M",
      "L"
    ]
  },
  {
    id: 90,
    name: "VESTIDO IRINA",
    price: 119.99,
    originalPrice: null,
    category: "Fiesta",
    subcategory: "fiesta-vestidos",
    tags: [
      "Fiesta"
    ],
    image: "https://jandulamodautrera.es/wp-content/uploads/2025/03/IMG_9122.jpg",
    description: "Vestido con diseño elegante.",
    sizes: [
      "S",
      "M",
      "L",
      "XL"
    ]
  },
  {
    id: 91,
    name: "VESTIDO ORQUÍDEA",
    price: 199.99,
    originalPrice: null,
    category: "Fiesta",
    subcategory: "fiesta-vestidos-largos",
    tags: [
      "Fiesta"
    ],
    image: "https://jandulamodautrera.es/wp-content/uploads/2025/03/AMOON25-0043.jpg",
    description: "Vestido largo inspirado en la orquídea.",
    sizes: [
      "S",
      "M",
      "L"
    ]
  },
  {
    id: 92,
    name: "VESTIDO AZUCENA",
    price: 214.99,
    originalPrice: null,
    category: "Fiesta",
    subcategory: "fiesta-vestidos-largos",
    tags: [
      "Fiesta"
    ],
    image: "https://jandulamodautrera.es/wp-content/uploads/2025/03/IMG_1089.jpg",
    description: "Vestido largo con diseño de azucena.",
    sizes: [
      "S",
      "M",
      "L"
    ]
  },
  {
    id: 93,
    name: "VESTIDO GERANIO",
    price: 107.95,
    originalPrice: 214.95,
    category: "Fiesta",
    subcategory: "fiesta-vestidos",
    tags: [
      "Fiesta",
      "Special Price"
    ],
    image: "https://jandulamodautrera.es/wp-content/uploads/2025/03/IMG_9107.jpg",
    description: "Vestido largo con estampado floral.",
    sizes: [
      "S",
      "M",
      "L",
      "XL"
    ]
  },
  {
    id: 94,
    name: "VESTIDO ALAS",
    price: 175,
    originalPrice: 249.95,
    category: "Fiesta",
    subcategory: "fiesta-vestidos",
    tags: [
      "Fiesta",
      "Special Price"
    ],
    image: "https://jandulamodautrera.es/wp-content/uploads/2025/03/IMG_9105.jpg",
    description: "Vestido con mangas efecto ala de ángel.",
    sizes: [
      "S",
      "M",
      "L"
    ]
  },
  {
    id: 95,
    name: "VESTIDO AMAPOLA",
    price: 199,
    originalPrice: null,
    category: "Fiesta",
    subcategory: "fiesta-vestidos",
    tags: [
      "Fiesta"
    ],
    image: "https://jandulamodautrera.es/wp-content/uploads/2025/03/IMG_9094.jpg",
    description: "Vestido con diseño de amapola.",
    sizes: [
      "S",
      "M",
      "L"
    ]
  },
  {
    id: 96,
    name: "VESTIDO LIRIO",
    price: 199.99,
    originalPrice: null,
    category: "Fiesta",
    subcategory: "fiesta-vestidos-largos",
    tags: [
      "Fiesta"
    ],
    image: "https://jandulamodautrera.es/wp-content/uploads/2025/02/IMG_6367.jpg",
    description: "Vestido largo inspirado en el lirio.",
    sizes: [
      "S",
      "M",
      "L"
    ]
  },
  {
    id: 97,
    name: "VESTIDO PETUNIA",
    price: 185.99,
    originalPrice: null,
    category: "Fiesta",
    subcategory: "fiesta-vestidos-largos",
    tags: [
      "Fiesta"
    ],
    image: "https://jandulamodautrera.es/wp-content/uploads/2025/02/IMG_6298.jpg",
    description: "Vestido largo con diseño de petunias.",
    sizes: [
      "S",
      "M",
      "L"
    ]
  },
  {
    id: 98,
    name: "VESTIDO ROSA",
    price: 110,
    originalPrice: null,
    category: "Fiesta",
    subcategory: "fiesta-vestidos",
    tags: [
      "Fiesta"
    ],
    image: "https://jandulamodautrera.es/wp-content/uploads/2025/02/image00003-1.jpeg",
    description: "Vestido en tono rosa elegante.",
    sizes: [
      "S",
      "M",
      "L",
      "XL"
    ]
  },
  {
    id: 99,
    name: "MODELO JAZMÍN",
    price: 125.99,
    originalPrice: null,
    category: "Fiesta",
    subcategory: "fiesta-vestidos",
    tags: [
      "Fiesta"
    ],
    image: "https://jandulamodautrera.es/wp-content/uploads/2025/02/image00100.jpeg",
    description: "Modelo exclusivo inspirado en el jazmín.",
    sizes: [
      "S",
      "M",
      "L"
    ]
  },
  {
    id: 100,
    name: "CONJUNTO LAZO CHOCOLATE",
    price: 147.99,
    originalPrice: null,
    category: "Fiesta",
    subcategory: "fiesta-conjunto-dos-piezas",
    tags: [
      "Fiesta"
    ],
    image: "https://jandulamodautrera.es/wp-content/uploads/2025/10/IMG_8365.jpg",
    description: "Conjunto dos piezas en tono chocolate.",
    sizes: [
      "S",
      "M",
      "L"
    ]
  },
  {
    id: 101,
    name: "CONJUNTO LIMA FLOR",
    price: 181.99,
    originalPrice: null,
    category: "Fiesta",
    subcategory: "fiesta-conjunto-dos-piezas",
    tags: [
      "Fiesta"
    ],
    image: "https://jandulamodautrera.es/wp-content/uploads/2025/10/IMG_8352.jpg",
    description: "Conjunto lima con detalles florales.",
    sizes: [
      "S",
      "M",
      "L"
    ]
  },
  {
    id: 102,
    name: "TRAJE ESPERANZA",
    price: 142.99,
    originalPrice: null,
    category: "Fiesta",
    subcategory: "fiesta-conjunto-dos-piezas",
    tags: [
      "Fiesta"
    ],
    image: "https://jandulamodautrera.es/wp-content/uploads/2025/09/IMG_7177.jpg",
    description: "Traje de fiesta elegante y sofisticado.",
    sizes: [
      "S",
      "M",
      "L",
      "XL"
    ]
  },
  {
    id: 103,
    name: "CONJUNTO CORDOBA",
    price: 169,
    originalPrice: null,
    category: "Fiesta",
    subcategory: "fiesta-conjunto-dos-piezas",
    tags: [
      "Fiesta"
    ],
    image: "https://jandulamodautrera.es/wp-content/uploads/2025/04/IMG_9260.jpg",
    description: "Conjunto inspirado en Córdoba.",
    sizes: [
      "S",
      "M",
      "L"
    ]
  },
  {
    id: 104,
    name: "CONJUNTO MANDARINA",
    price: 99,
    originalPrice: null,
    category: "Fiesta",
    subcategory: "fiesta-conjunto-dos-piezas",
    tags: [
      "Fiesta"
    ],
    image: "https://jandulamodautrera.es/wp-content/uploads/2025/04/64ffaa15-2921-460e-b128-f45ad3eec117.jpeg",
    description: "Conjunto en tono mandarina vibrante.",
    sizes: [
      "S",
      "M",
      "L",
      "XL"
    ]
  },
  {
    id: 105,
    name: "CONJUNTO JENNIFER",
    price: 150,
    originalPrice: null,
    category: "Fiesta",
    subcategory: "fiesta-conjunto-dos-piezas",
    tags: [
      "Fiesta"
    ],
    image: "https://jandulamodautrera.es/wp-content/uploads/2025/04/IMG_1492.jpg",
    description: "Conjunto elegante modelo Jennifer.",
    sizes: [
      "S",
      "M",
      "L"
    ]
  },
  {
    id: 106,
    name: "CONJUNTO SONIA",
    price: 150,
    originalPrice: null,
    category: "Fiesta",
    subcategory: "fiesta-conjunto-dos-piezas",
    tags: [
      "Fiesta"
    ],
    image: "https://jandulamodautrera.es/wp-content/uploads/2025/04/IMG_1410.jpg",
    description: "Conjunto sofisticado modelo Sonia.",
    sizes: [
      "S",
      "M",
      "L"
    ]
  },
  {
    id: 107,
    name: "CONJUNTO LISA",
    price: 150,
    originalPrice: null,
    category: "Fiesta",
    subcategory: "fiesta-conjunto-dos-piezas",
    tags: [
      "Fiesta"
    ],
    image: "https://jandulamodautrera.es/wp-content/uploads/2025/04/IMG_1429.jpg",
    description: "Conjunto premium modelo Lisa.",
    sizes: [
      "S",
      "M",
      "L"
    ]
  },
  {
    id: 108,
    name: "TRAJE LEIRE",
    price: 130,
    originalPrice: null,
    category: "Fiesta",
    subcategory: "fiesta-conjunto-dos-piezas",
    tags: [
      "Fiesta"
    ],
    image: "https://jandulamodautrera.es/wp-content/uploads/2025/04/IMG_1076.jpg",
    description: "Traje elegante modelo Leire.",
    sizes: [
      "S",
      "M",
      "L",
      "XL"
    ]
  },
  {
    id: 109,
    name: "TRAJE RIANNA",
    price: 129,
    originalPrice: null,
    category: "Fiesta",
    subcategory: "fiesta-conjunto-dos-piezas",
    tags: [
      "Fiesta"
    ],
    image: "https://jandulamodautrera.es/wp-content/uploads/2025/04/IMG_1031.jpg",
    description: "Traje moderno modelo Rianna.",
    sizes: [
      "S",
      "M",
      "L"
    ]
  },
  {
    id: 110,
    name: "TRAJE ROSALIA",
    price: 130,
    originalPrice: null,
    category: "Fiesta",
    subcategory: "fiesta-conjunto-dos-piezas",
    tags: [
      "Fiesta"
    ],
    image: "https://jandulamodautrera.es/wp-content/uploads/2025/04/IMG_1011.jpg",
    description: "Traje sofisticado modelo Rosalia.",
    sizes: [
      "S",
      "M",
      "L",
      "XL"
    ]
  },
  {
    id: 111,
    name: "TRAJE ANASTASIA",
    price: 149.99,
    originalPrice: null,
    category: "Fiesta",
    subcategory: "fiesta-conjunto-dos-piezas",
    tags: [
      "Fiesta"
    ],
    image: "https://jandulamodautrera.es/wp-content/uploads/2025/04/IMG_0983.jpg",
    description: "Traje de fiesta modelo Anastasia.",
    sizes: [
      "S",
      "M",
      "L"
    ]
  },
  {
    id: 112,
    name: "TRAJE CHAQUETA FLOR",
    price: 165,
    originalPrice: null,
    category: "Fiesta",
    subcategory: "fiesta-conjunto-dos-piezas",
    tags: [
      "Fiesta"
    ],
    image: "https://jandulamodautrera.es/wp-content/uploads/2025/03/IMG_9126.jpg",
    description: "Traje chaqueta con estampado floral.",
    sizes: [
      "S",
      "M",
      "L",
      "XL"
    ]
  },
  {
    id: 113,
    name: "CONJUNTO CHAQUETA TULIPAN",
    price: 239,
    originalPrice: null,
    category: "Fiesta",
    subcategory: "fiesta-conjunto-dos-piezas",
    tags: [
      "Fiesta"
    ],
    image: "https://jandulamodautrera.es/wp-content/uploads/2025/03/IMG_9099.jpg",
    description: "Conjunto chaqueta con diseño de tulipán.",
    sizes: [
      "S",
      "M",
      "L"
    ]
  },
  {
    id: 114,
    name: "CONJUNTO AMAPOLA",
    price: 159,
    originalPrice: null,
    category: "Fiesta",
    subcategory: "fiesta-conjunto-dos-piezas",
    tags: [
      "Fiesta"
    ],
    image: "https://jandulamodautrera.es/wp-content/uploads/2025/02/IMG_7555.jpg",
    description: "Conjunto con estampado de amapolas.",
    sizes: [
      "S",
      "M",
      "L",
      "XL"
    ]
  },
  {
    id: 115,
    name: "CAPA DE PLUMA",
    price: 45,
    originalPrice: null,
    category: "Fiesta",
    subcategory: null,
    tags: [
      "Fiesta"
    ],
    image: "https://jandulamodautrera.es/wp-content/uploads/2025/04/IMG_1356.jpg",
    description: "Capa con plumas, accesorio de lujo.",
    sizes: []
  },
  {
    id: 116,
    name: "MEDIA ISABEL MORA",
    price: 2.99,
    originalPrice: null,
    category: "Fiesta",
    subcategory: null,
    tags: [
      "Fiesta",
      "Casual"
    ],
    image: "https://jandulamodautrera.es/wp-content/uploads/2025/04/IMG_2925-1.jpg",
    description: "Media Isabel Mora de calidad premium.",
    sizes: [
      "S/M",
      "L/XL"
    ]
  },
  {
    id: 117,
    name: "MEDIA REDUCTORA ISABEL MORA",
    price: 6.5,
    originalPrice: null,
    category: "Fiesta",
    subcategory: null,
    tags: [
      "Fiesta",
      "Casual"
    ],
    image: "https://jandulamodautrera.es/wp-content/uploads/2025/04/IMG_2923.jpg",
    description: "Media reductora Isabel Mora.",
    sizes: [
      "S/M",
      "L/XL"
    ]
  },
  {
    id: 118,
    name: "CONJUNTO FALDA CREMA",
    price: 48,
    originalPrice: null,
    category: "Casual",
    subcategory: "casual-faldas-shorts",
    tags: [
      "Nueva Colección"
    ],
    image: "https://jandulamodautrera.es/wp-content/uploads/2026/02/IMG_1904.jpeg",
    description: "Conjunto de falda en tono crema.",
    sizes: [
      "S",
      "M",
      "L",
      "XL"
    ]
  },
  {
    id: 119,
    name: "VESTIDO NUDO CON ESCOTE",
    price: 39.99,
    originalPrice: null,
    category: "Casual",
    subcategory: "casual-vestidos",
    tags: [
      "Nueva Colección"
    ],
    image: "https://jandulamodautrera.es/wp-content/uploads/2026/02/IMG_1848.jpeg",
    description: "Vestido con detalle de nudo y escote favorecedor.",
    sizes: [
      "S",
      "M",
      "L",
      "XL"
    ]
  },
  {
    id: 120,
    name: "VESTIDO CREMA",
    price: 39.99,
    originalPrice: null,
    category: "Casual",
    subcategory: "casual-vestidos",
    tags: [
      "Nueva Colección"
    ],
    image: "https://jandulamodautrera.es/wp-content/uploads/2026/02/IMG_1597-1.jpeg",
    description: "Vestido elegante en color crema.",
    sizes: [
      "S",
      "M",
      "L",
      "XL"
    ]
  },
  {
    id: 121,
    name: "VESTIDO CUADROS CELESTE CON CINTURÓN DE LAZO",
    price: 38,
    originalPrice: null,
    category: "Casual",
    subcategory: "casual-vestidos",
    tags: [
      "Nueva Colección"
    ],
    image: "https://jandulamodautrera.es/wp-content/uploads/2026/02/IMG_1806.jpeg",
    description: "Vestido de cuadros celeste con cinturón de lazo.",
    sizes: [
      "S",
      "M",
      "L",
      "XL"
    ]
  },
  {
    id: 122,
    name: "VESTIDO ROSA NUDO",
    price: 29.99,
    originalPrice: null,
    category: "Casual",
    subcategory: "casual-vestidos",
    tags: [
      "Nueva Colección"
    ],
    image: "https://jandulamodautrera.es/wp-content/uploads/2026/02/IMG_1835.jpeg",
    description: "Vestido en tono rosa con detalle de nudo.",
    sizes: [
      "S",
      "M",
      "L"
    ]
  },
  {
    id: 123,
    name: "VESTIDO ESCOTE BOHO FRUNCIDO EN LA CINTURA",
    price: 29.99,
    originalPrice: null,
    category: "Casual",
    subcategory: "casual-vestidos",
    tags: [
      "Nueva Colección"
    ],
    image: "https://jandulamodautrera.es/wp-content/uploads/2026/02/IMG_1928.jpeg",
    description: "Vestido boho con fruncido en la cintura.",
    sizes: [
      "S",
      "M",
      "L",
      "XL"
    ]
  },
  {
    id: 124,
    name: "VESTIDO COMBINADO NUDO",
    price: 29.99,
    originalPrice: null,
    category: "Casual",
    subcategory: "casual-vestidos",
    tags: [
      "Nueva Colección"
    ],
    image: "https://jandulamodautrera.es/wp-content/uploads/2026/02/IMG_1657.jpeg",
    description: "Vestido combinado con detalle de nudo.",
    sizes: [
      "S",
      "M",
      "L",
      "XL"
    ]
  },
  {
    id: 125,
    name: "VESTIDO COMBINADO SERENA",
    price: 35,
    originalPrice: null,
    category: "Casual",
    subcategory: "casual-vestidos",
    tags: [
      "Nueva Colección"
    ],
    image: "https://jandulamodautrera.es/wp-content/uploads/2026/02/IMG_1689.jpeg",
    description: "Vestido combinado con tejidos contrastantes.",
    sizes: [
      "S",
      "M",
      "L",
      "XL"
    ]
  },
  {
    id: 126,
    name: "VESTIDO TUL MANGA LARGA",
    price: 32,
    originalPrice: null,
    category: "Casual",
    subcategory: "casual-vestidos",
    tags: [
      "Nueva Colección"
    ],
    image: "https://jandulamodautrera.es/wp-content/uploads/2026/02/IMG_1778.jpeg",
    description: "Vestido con detalles de tul y manga larga.",
    sizes: [
      "S",
      "M",
      "L"
    ]
  },
  {
    id: 127,
    name: "VESTIDO CASACA",
    price: 39.99,
    originalPrice: null,
    category: "Casual",
    subcategory: "casual-vestidos",
    tags: [
      "Nueva Colección"
    ],
    image: "https://jandulamodautrera.es/wp-content/uploads/2026/02/IMG_1141-1.jpg",
    description: "Vestido tipo casaca con toque militar chic.",
    sizes: [
      "S",
      "M",
      "L",
      "XL"
    ]
  },
  {
    id: 128,
    name: "VESTIDO CINTURÓN PLISADO TONOS AMARILLOS",
    price: 39.99,
    originalPrice: null,
    category: "Casual",
    subcategory: "casual-vestidos",
    tags: [
      "Nueva Colección"
    ],
    image: "https://jandulamodautrera.es/wp-content/uploads/2026/02/IMG_0566-1.jpeg",
    description: "Vestido plisado en tonos amarillos con cinturón.",
    sizes: [
      "S",
      "M",
      "L",
      "XL"
    ]
  },
  {
    id: 129,
    name: "VESTIDO CINTURÓN GASA",
    price: 39.99,
    originalPrice: null,
    category: "Casual",
    subcategory: "casual-vestidos",
    tags: [
      "Nueva Colección"
    ],
    image: "https://jandulamodautrera.es/wp-content/uploads/2026/02/IMG_0537.jpeg",
    description: "Vestido de gasa con cinturón elegante.",
    sizes: [
      "S",
      "M",
      "L",
      "XL"
    ]
  },
  {
    id: 130,
    name: "VESTIDO CALDERA",
    price: 28,
    originalPrice: null,
    category: "Casual",
    subcategory: "casual-vestidos",
    tags: [
      "Nueva Colección"
    ],
    image: "https://jandulamodautrera.es/wp-content/uploads/2026/02/IMG_0453-1.jpeg",
    description: "Vestido en tono caldera, cálido y elegante.",
    sizes: [
      "S",
      "M",
      "L",
      "XL"
    ]
  },
  {
    id: 131,
    name: "VESTIDO ESTAMPADO GEOMÉTRICO",
    price: 52,
    originalPrice: null,
    category: "Casual",
    subcategory: "casual-vestidos",
    tags: [
      "Nueva Colección"
    ],
    image: "https://jandulamodautrera.es/wp-content/uploads/2026/02/IMG_0612.jpeg",
    description: "Vestido con estampado geométrico moderno.",
    sizes: [
      "S",
      "M",
      "L",
      "XL"
    ]
  },
  {
    id: 132,
    name: "VESTIDO CORAL",
    price: 48,
    originalPrice: null,
    category: "Casual",
    subcategory: "casual-vestidos",
    tags: [
      "Nueva Colección"
    ],
    image: "https://jandulamodautrera.es/wp-content/uploads/2026/01/IMG_1565.jpg",
    description: "Vestido en tono coral vibrante.",
    sizes: [
      "S",
      "M",
      "L",
      "XL"
    ]
  },
  {
    id: 133,
    name: "VESTIDO LEONOR",
    price: 52,
    originalPrice: null,
    category: "Casual",
    subcategory: "casual-vestidos",
    tags: [
      "Nueva Colección"
    ],
    image: "https://jandulamodautrera.es/wp-content/uploads/2026/01/IMG_6808.jpeg",
    description: "Vestido Leonor con diseño elegante.",
    sizes: [
      "S",
      "M",
      "L",
      "XL"
    ]
  },
  {
    id: 134,
    name: "VESTIDO LEONOR VARIANTE",
    price: 33.99,
    originalPrice: null,
    category: "Casual",
    subcategory: "casual-vestidos",
    tags: [],
    image: "https://jandulamodautrera.es/wp-content/uploads/2025/05/IMG_4326-1.jpg",
    description: "Vestido Leonor en versión especial.",
    sizes: [
      "S",
      "M",
      "L",
      "XL"
    ]
  },
  {
    id: 135,
    name: "VESTIDO BAJO ENCAJE",
    price: 26.99,
    originalPrice: null,
    category: "Casual",
    subcategory: "casual-vestidos",
    tags: [],
    image: "https://jandulamodautrera.es/wp-content/uploads/2026/01/IMG_6238-1.jpeg",
    description: "Vestido con bajo de encaje delicado.",
    sizes: [
      "S",
      "M",
      "L",
      "XL"
    ]
  },
  {
    id: 136,
    name: "VESTIDO PASTEL FLECO",
    price: 43.99,
    originalPrice: null,
    category: "Casual",
    subcategory: "casual-vestidos",
    tags: [],
    image: "https://jandulamodautrera.es/wp-content/uploads/2026/01/IMG_6012.jpeg",
    description: "Vestido en tono pastel con flecos.",
    sizes: [
      "S",
      "M",
      "L",
      "XL"
    ]
  },
  {
    id: 137,
    name: "VESTIDO FIESTA LORENA",
    price: 139,
    originalPrice: null,
    category: "Casual",
    subcategory: "casual-vestidos",
    tags: [
      "Fiesta"
    ],
    image: "https://jandulamodautrera.es/wp-content/uploads/2025/11/0F0B7909-0207-40EA-83A9-B43F12FD5537.webp",
    description: "Vestido de fiesta con diseño exclusivo.",
    sizes: [
      "S",
      "M",
      "L",
      "XL"
    ]
  },
  {
    id: 138,
    name: "VESTIDO ABERTURA",
    price: 32,
    originalPrice: null,
    category: "Casual",
    subcategory: "casual-vestidos",
    tags: [],
    image: "https://jandulamodautrera.es/wp-content/uploads/2025/10/IMG_8852.jpg",
    description: "Vestido con abertura lateral elegante.",
    sizes: [
      "S",
      "M",
      "L",
      "XL"
    ]
  },
  {
    id: 139,
    name: "VESTIDO TERCIOPELO NUDO",
    price: 28.99,
    originalPrice: null,
    category: "Casual",
    subcategory: "casual-vestidos",
    tags: [],
    image: "https://jandulamodautrera.es/wp-content/uploads/2025/10/IMG_0325.jpg",
    description: "Vestido de terciopelo con detalle de nudo.",
    sizes: [
      "S",
      "M",
      "L",
      "XL"
    ]
  },
  {
    id: 140,
    name: "VESTIDO NOCHE DIAMANTE",
    price: 59.99,
    originalPrice: null,
    category: "Casual",
    subcategory: "casual-vestidos",
    tags: [],
    image: "https://jandulamodautrera.es/wp-content/uploads/2025/10/IMG_9905-1.jpg",
    description: "Vestido de noche con brillos de diamante.",
    sizes: [
      "S",
      "M",
      "L",
      "XL"
    ]
  },
  {
    id: 141,
    name: "VESTIDO NUDES",
    price: 29.99,
    originalPrice: null,
    category: "Casual",
    subcategory: "casual-vestidos",
    tags: [],
    image: "https://jandulamodautrera.es/wp-content/uploads/2025/10/IMG_9713.jpg",
    description: "Vestido en tonos nudes sutiles.",
    sizes: [
      "S",
      "M",
      "L",
      "XL"
    ]
  },
  {
    id: 142,
    name: "VESTIDO CHOCOLATE",
    price: 32.99,
    originalPrice: null,
    category: "Casual",
    subcategory: "casual-vestidos",
    tags: [],
    image: "https://jandulamodautrera.es/wp-content/uploads/2025/10/IMG_8824.jpg",
    description: "Vestido en tono chocolate, cálido y elegante.",
    sizes: [
      "S",
      "M",
      "L",
      "XL"
    ]
  },
  {
    id: 143,
    name: "VESTIDO EUGENIA",
    price: 29.99,
    originalPrice: null,
    category: "Casual",
    subcategory: "casual-vestidos",
    tags: [],
    image: "https://jandulamodautrera.es/wp-content/uploads/2025/10/IMG_9078.jpg",
    description: "Vestido con diseño sofisticado modelo Eugenia.",
    sizes: [
      "S",
      "M",
      "L",
      "XL"
    ]
  },
  {
    id: 144,
    name: "VESTIDO MORADO COMBINADO GASA",
    price: 29.99,
    originalPrice: null,
    category: "Casual",
    subcategory: "casual-vestidos",
    tags: [],
    image: "https://jandulamodautrera.es/wp-content/uploads/2025/10/IMG_9061.jpg",
    description: "Vestido morado combinado con gasa.",
    sizes: [
      "S",
      "M",
      "L",
      "XL"
    ]
  },
  {
    id: 145,
    name: "VESTIDO LENCERO COMBINADO",
    price: 23.99,
    originalPrice: null,
    category: "Casual",
    subcategory: "casual-vestidos",
    tags: [],
    image: "https://jandulamodautrera.es/wp-content/uploads/2025/10/IMG_9164.jpg",
    description: "Vestido lencero con tejidos combinados.",
    sizes: [
      "S",
      "M",
      "L",
      "XL"
    ]
  },
  {
    id: 146,
    name: "VESTIDO HOJAS",
    price: 29.99,
    originalPrice: null,
    category: "Casual",
    subcategory: "casual-vestidos",
    tags: [],
    image: "https://jandulamodautrera.es/wp-content/uploads/2025/10/IMG_9011.jpg",
    description: "Vestido con estampado de hojas tropicales.",
    sizes: [
      "S",
      "M",
      "L",
      "XL"
    ]
  },
  {
    id: 147,
    name: "VESTIDO NUDO",
    price: 29.99,
    originalPrice: null,
    category: "Casual",
    subcategory: "casual-vestidos",
    tags: [],
    image: "https://jandulamodautrera.es/wp-content/uploads/2025/10/IMG_8963.jpg",
    description: "Vestido con detalle de nudo frontal.",
    sizes: [
      "S",
      "M",
      "L",
      "XL"
    ]
  },
  {
    id: 148,
    name: "VESTIDO HEBILLA AL CUELLO",
    price: 32,
    originalPrice: null,
    category: "Casual",
    subcategory: "casual-vestidos",
    tags: [],
    image: "https://jandulamodautrera.es/wp-content/uploads/2025/10/IMG_8644.jpg",
    description: "Vestido con hebilla decorativa al cuello.",
    sizes: [
      "S",
      "M",
      "L",
      "XL"
    ]
  },
  {
    id: 149,
    name: "VESTIDO ESTAMPA",
    price: 29.99,
    originalPrice: null,
    category: "Casual",
    subcategory: "casual-vestidos",
    tags: [],
    image: "https://jandulamodautrera.es/wp-content/uploads/2025/10/IMG_8593.jpg",
    description: "Vestido con estampa original.",
    sizes: [
      "S",
      "M",
      "L",
      "XL"
    ]
  },
  {
    id: 150,
    name: "VESTIDO ISA",
    price: 29.99,
    originalPrice: null,
    category: "Casual",
    subcategory: "casual-vestidos",
    tags: [],
    image: "https://jandulamodautrera.es/wp-content/uploads/2025/09/IMG_5516.jpg",
    description: "Vestido casual modelo Isa.",
    sizes: [
      "S",
      "M",
      "L",
      "XL"
    ]
  },
  {
    id: 151,
    name: "VESTIDO EVILLA",
    price: 28.99,
    originalPrice: null,
    category: "Casual",
    subcategory: "casual-vestidos",
    tags: [],
    image: "https://jandulamodautrera.es/wp-content/uploads/2025/09/IMG_5562.jpg",
    description: "Vestido con detalle de evilla.",
    sizes: [
      "S",
      "M",
      "L",
      "XL"
    ]
  },
  {
    id: 152,
    name: "VESTIDO LETICIA",
    price: 49.99,
    originalPrice: null,
    category: "Casual",
    subcategory: "casual-vestidos",
    tags: [],
    image: "https://jandulamodautrera.es/wp-content/uploads/2025/08/IMG_5078.jpg",
    description: "Vestido elegante modelo Leticia.",
    sizes: [
      "S",
      "M",
      "L",
      "XL"
    ]
  },
  {
    id: 153,
    name: "VESTIDO GLORIA",
    price: 29.99,
    originalPrice: null,
    category: "Casual",
    subcategory: "casual-vestidos",
    tags: [],
    image: "https://jandulamodautrera.es/wp-content/uploads/2025/08/IMG_5086.jpg",
    description: "Vestido fresco modelo Gloria.",
    sizes: [
      "S",
      "M",
      "L",
      "XL"
    ]
  },
  {
    id: 154,
    name: "VESTIDO CONSUELO",
    price: 39.99,
    originalPrice: null,
    category: "Casual",
    subcategory: "casual-vestidos",
    tags: [],
    image: "https://jandulamodautrera.es/wp-content/uploads/2025/08/IMG_2681-2.jpg",
    description: "Vestido con diseño sofisticado.",
    sizes: [
      "S",
      "M",
      "L",
      "XL"
    ]
  },
  {
    id: 155,
    name: "VESTIDO SISA",
    price: 28.99,
    originalPrice: null,
    category: "Casual",
    subcategory: "casual-vestidos",
    tags: [],
    image: "https://jandulamodautrera.es/wp-content/uploads/2025/07/IMG_8259.png",
    description: "Vestido sin mangas, fresco y cómodo.",
    sizes: [
      "S",
      "M",
      "L",
      "XL"
    ]
  },
  {
    id: 156,
    name: "VESTIDO LORENA CASUAL",
    price: 27.99,
    originalPrice: null,
    category: "Casual",
    subcategory: "casual-vestidos",
    tags: [],
    image: "https://jandulamodautrera.es/wp-content/uploads/2025/07/IMG_6522.png",
    description: "Vestido Lorena en versión casual.",
    sizes: [
      "S",
      "M",
      "L",
      "XL"
    ]
  },
  {
    id: 157,
    name: "VESTIDO CASANDRA",
    price: 59.99,
    originalPrice: null,
    category: "Casual",
    subcategory: "casual-vestidos",
    tags: [],
    image: "https://jandulamodautrera.es/wp-content/uploads/2025/06/IMG_8766.jpg",
    description: "Vestido con diseño exclusivo modelo Casandra.",
    sizes: [
      "S",
      "M",
      "L",
      "XL"
    ]
  },
  {
    id: 158,
    name: "VESTIDO JANDULA",
    price: 28.99,
    originalPrice: null,
    category: "Casual",
    subcategory: "casual-vestidos",
    tags: [],
    image: "https://jandulamodautrera.es/wp-content/uploads/2025/05/IMG_4490.jpg",
    description: "Vestido insignia de la casa Jándula.",
    sizes: [
      "S",
      "M",
      "L",
      "XL"
    ]
  },
  {
    id: 159,
    name: "VESTIDO GALA",
    price: 48,
    originalPrice: null,
    category: "Casual",
    subcategory: "casual-vestidos",
    tags: [],
    image: "https://jandulamodautrera.es/wp-content/uploads/2025/05/PHOTO-2025-05-05-12-13-58-1.jpg",
    description: "Vestido de gala casual.",
    sizes: [
      "S",
      "M",
      "L",
      "XL"
    ]
  },
  {
    id: 160,
    name: "VESTIDO MAGENTA",
    price: 49.99,
    originalPrice: null,
    category: "Casual",
    subcategory: "casual-vestidos",
    tags: [],
    image: "https://jandulamodautrera.es/wp-content/uploads/2025/04/IMG_2676.jpg",
    description: "Vestido en tono magenta vibrante.",
    sizes: [
      "S",
      "M",
      "L",
      "XL"
    ]
  },
  {
    id: 161,
    name: "VESTIDO SERENA",
    price: 36.99,
    originalPrice: null,
    category: "Casual",
    subcategory: "casual-vestidos",
    tags: [],
    image: "https://jandulamodautrera.es/wp-content/uploads/2025/04/IMG_1581.jpg",
    description: "Vestido modelo Serena, fresco y elegante.",
    sizes: [
      "S",
      "M",
      "L",
      "XL"
    ]
  },
  {
    id: 162,
    name: "VESTIDO MANUELA",
    price: 29.99,
    originalPrice: null,
    category: "Casual",
    subcategory: "casual-vestidos",
    tags: [],
    image: "https://jandulamodautrera.es/wp-content/uploads/2025/03/IMG_0309.jpg",
    description: "Vestido con diseño femenino modelo Manuela.",
    sizes: [
      "S",
      "M",
      "L",
      "XL"
    ]
  },
  {
    id: 163,
    name: "CONJUNTO CONSUELO",
    price: 42.99,
    originalPrice: null,
    category: "Casual",
    subcategory: "casual-total-look",
    tags: [
      "Nueva Colección"
    ],
    image: "https://jandulamodautrera.es/wp-content/uploads/2026/02/IMG_1621.jpeg",
    description: "Conjunto completo con estilo sofisticado.",
    sizes: [
      "S",
      "M",
      "L",
      "XL"
    ]
  },
  {
    id: 164,
    name: "CONJUNTO DE TRAJE BRILLO DORADO",
    price: 59.99,
    originalPrice: null,
    category: "Casual",
    subcategory: "casual-total-look",
    tags: [
      "Nueva Colección",
      "Destacado"
    ],
    image: "https://jandulamodautrera.es/wp-content/uploads/2026/02/IMG_1069-1.jpeg",
    description: "Conjunto de traje con acabado brillante dorado.",
    sizes: [
      "S",
      "M",
      "L"
    ]
  },
  {
    id: 165,
    name: "CONJUNTO DE FALDA FLORES",
    price: 38,
    originalPrice: null,
    category: "Casual",
    subcategory: "casual-faldas-shorts",
    tags: [
      "Nueva Colección"
    ],
    image: "https://jandulamodautrera.es/wp-content/uploads/2026/02/147cd3eb-4068-4711-87bd-c121f5f3aafa.jpg",
    description: "Conjunto de falda con estampado floral.",
    sizes: [
      "S",
      "M",
      "L",
      "XL"
    ]
  },
  {
    id: 166,
    name: "CONJUNTO ADRIANA",
    price: 20,
    originalPrice: null,
    category: "Casual",
    subcategory: "casual-total-look",
    tags: [],
    image: "https://jandulamodautrera.es/wp-content/uploads/2026/01/IMG_1690-1.jpg",
    description: "Conjunto casual modelo Adriana.",
    sizes: [
      "S",
      "M",
      "L",
      "XL"
    ]
  },
  {
    id: 167,
    name: "CONJUNTO CREMALLERA BOLSILLOS",
    price: 20,
    originalPrice: null,
    category: "Casual",
    subcategory: "casual-total-look",
    tags: [],
    image: "https://jandulamodautrera.es/wp-content/uploads/2026/01/IMG_1559.jpg",
    description: "Conjunto con cremallera y bolsillos.",
    sizes: [
      "S",
      "M",
      "L",
      "XL"
    ]
  },
  {
    id: 168,
    name: "CONJUNTO NUDO",
    price: 21,
    originalPrice: null,
    category: "Casual",
    subcategory: "casual-total-look",
    tags: [],
    image: "https://jandulamodautrera.es/wp-content/uploads/2026/01/IMG_1662.jpg",
    description: "Conjunto con detalle de nudo.",
    sizes: [
      "S",
      "M",
      "L",
      "XL"
    ]
  },
  {
    id: 169,
    name: "CONJUNTO CAKI",
    price: 39.99,
    originalPrice: null,
    category: "Casual",
    subcategory: "casual-total-look",
    tags: [],
    image: "https://jandulamodautrera.es/wp-content/uploads/2026/01/IMG_6825.jpeg",
    description: "Conjunto en tono caki militar.",
    sizes: [
      "S",
      "M",
      "L",
      "XL"
    ]
  },
  {
    id: 170,
    name: "PANTALÓN CON CINTURÓN",
    price: 26.99,
    originalPrice: null,
    category: "Casual",
    subcategory: "casual-pantalones-monos",
    tags: [
      "Nueva Colección"
    ],
    image: "https://jandulamodautrera.es/wp-content/uploads/2026/02/IMG_1479-1.jpg",
    description: "Pantalón con cinturón incluido.",
    sizes: [
      "S",
      "M",
      "L",
      "XL"
    ]
  },
  {
    id: 171,
    name: "VAQUERO PIRATA",
    price: 25,
    originalPrice: null,
    category: "Casual",
    subcategory: "casual-pantalones-monos",
    tags: [],
    image: "https://jandulamodautrera.es/wp-content/uploads/2026/02/IMG_0576.jpeg",
    description: "Vaquero pirata de corte moderno.",
    sizes: [
      "34",
      "36",
      "38",
      "40",
      "42"
    ]
  },
  {
    id: 172,
    name: "PANTALÓN BÁSICO",
    price: 10,
    originalPrice: null,
    category: "Casual",
    subcategory: "casual-pantalones-monos",
    tags: [],
    image: "https://jandulamodautrera.es/wp-content/uploads/2026/02/IMG_0639.jpeg",
    description: "Pantalón básico imprescindible.",
    sizes: [
      "S",
      "M",
      "L",
      "XL"
    ]
  },
  {
    id: 173,
    name: "BOMBACHO REME",
    price: 23.99,
    originalPrice: null,
    category: "Casual",
    subcategory: "casual-pantalones-monos",
    tags: [],
    image: "https://jandulamodautrera.es/wp-content/uploads/2026/01/IMG_1678.jpg",
    description: "Pantalón bombacho modelo Reme.",
    sizes: [
      "S",
      "M",
      "L",
      "XL"
    ]
  },
  {
    id: 174,
    name: "JEANS BALNCOS",
    price: 25.99,
    originalPrice: null,
    category: "Casual",
    subcategory: "casual-pantalones-monos",
    tags: [],
    image: "https://jandulamodautrera.es/wp-content/uploads/2026/01/IMG_6459.jpeg",
    description: "Jeans blancos de corte moderno.",
    sizes: [
      "34",
      "36",
      "38",
      "40",
      "42"
    ]
  },
  {
    id: 175,
    name: "JEANS PAÑUELO TIRO MEDIO",
    price: 23.99,
    originalPrice: null,
    category: "Casual",
    subcategory: "casual-pantalones-monos",
    tags: [],
    image: "https://jandulamodautrera.es/wp-content/uploads/2026/01/IMG_6343.jpeg",
    description: "Jeans con pañuelo decorativo.",
    sizes: [
      "34",
      "36",
      "38",
      "40",
      "42"
    ]
  },
  {
    id: 176,
    name: "PANTALÓN DIPLOMÁTICO GRIS",
    price: 25.99,
    originalPrice: null,
    category: "Casual",
    subcategory: "casual-pantalones-monos",
    tags: [],
    image: "https://jandulamodautrera.es/wp-content/uploads/2026/01/IMG_6204.jpeg",
    description: "Pantalón diplomático gris elegante.",
    sizes: [
      "S",
      "M",
      "L",
      "XL"
    ]
  },
  {
    id: 177,
    name: "PANTALÓN CUADROS CINTURÓN",
    price: 33.99,
    originalPrice: null,
    category: "Casual",
    subcategory: "casual-pantalones-monos",
    tags: [],
    image: "https://jandulamodautrera.es/wp-content/uploads/2026/01/IMG_6053.jpeg",
    description: "Pantalón de cuadros con cinturón.",
    sizes: [
      "S",
      "M",
      "L",
      "XL"
    ]
  },
  {
    id: 178,
    name: "VAQUERO MARGARITA",
    price: 29.99,
    originalPrice: null,
    category: "Casual",
    subcategory: "casual-pantalones-monos",
    tags: [],
    image: "https://jandulamodautrera.es/wp-content/uploads/2026/01/IMG_5912.jpeg",
    description: "Vaquero con detalles margarita.",
    sizes: [
      "34",
      "36",
      "38",
      "40",
      "42"
    ]
  },
  {
    id: 179,
    name: "PANTALÓN JÁNDULA",
    price: 19.99,
    originalPrice: null,
    category: "Casual",
    subcategory: "casual-pantalones-monos",
    tags: [],
    image: "https://jandulamodautrera.es/wp-content/uploads/2026/01/IMG_5769.jpeg",
    description: "Pantalón insignia Jándula.",
    sizes: [
      "S",
      "M",
      "L",
      "XL"
    ]
  },
  {
    id: 180,
    name: "PANTALÓN TERCIOPELO TERESA",
    price: 16.99,
    originalPrice: null,
    category: "Casual",
    subcategory: "casual-pantalones-monos",
    tags: [],
    image: "https://jandulamodautrera.es/wp-content/uploads/2025/10/IMG_0276-1.jpg",
    description: "Pantalón de terciopelo modelo Teresa.",
    sizes: [
      "S",
      "M",
      "L",
      "XL"
    ]
  },
  {
    id: 181,
    name: "MONO TERCIOPELO LIDIA",
    price: 34.99,
    originalPrice: null,
    category: "Casual",
    subcategory: "casual-pantalones-monos",
    tags: [],
    image: "https://jandulamodautrera.es/wp-content/uploads/2025/10/IMG_0238-1.jpg",
    description: "Mono de terciopelo modelo Lidia.",
    sizes: [
      "S",
      "M",
      "L",
      "XL"
    ]
  },
  {
    id: 182,
    name: "BOMBACHO CHOCOLATE",
    price: 15.99,
    originalPrice: null,
    category: "Casual",
    subcategory: "casual-pantalones-monos",
    tags: [],
    image: "https://jandulamodautrera.es/wp-content/uploads/2025/10/IMG_0140.jpg",
    description: "Bombacho en tono chocolate.",
    sizes: [
      "S",
      "M",
      "L",
      "XL"
    ]
  },
  {
    id: 183,
    name: "PANTALÓN BOMBACHO LEOPARDO",
    price: 28,
    originalPrice: null,
    category: "Casual",
    subcategory: "casual-pantalones-monos",
    tags: [],
    image: "https://jandulamodautrera.es/wp-content/uploads/2025/10/IMG_0088.jpg",
    description: "Pantalón bombacho animal print.",
    sizes: [
      "S",
      "M",
      "L",
      "XL"
    ]
  },
  {
    id: 184,
    name: "PANTALÓN BOMBACHO EFECTO ARRUGADO",
    price: 29.99,
    originalPrice: null,
    category: "Casual",
    subcategory: "casual-pantalones-monos",
    tags: [],
    image: "https://jandulamodautrera.es/wp-content/uploads/2025/10/IMG_8185.jpg",
    description: "Bombacho con efecto arrugado.",
    sizes: [
      "S",
      "M",
      "L",
      "XL"
    ]
  },
  {
    id: 185,
    name: "PANTALÓN RAYAS",
    price: 26.99,
    originalPrice: null,
    category: "Casual",
    subcategory: "casual-pantalones-monos",
    tags: [],
    image: "https://jandulamodautrera.es/wp-content/uploads/2025/10/IMG_8218-1.jpg",
    description: "Pantalón de rayas elegante.",
    sizes: [
      "S",
      "M",
      "L",
      "XL"
    ]
  },
  {
    id: 186,
    name: "PANTALÓN BLANCO",
    price: 29.99,
    originalPrice: null,
    category: "Casual",
    subcategory: "casual-pantalones-monos",
    tags: [],
    image: "https://jandulamodautrera.es/wp-content/uploads/2025/09/IMG_6978.jpg",
    description: "Pantalón blanco versátil.",
    sizes: [
      "S",
      "M",
      "L",
      "XL"
    ]
  },
  {
    id: 187,
    name: "PANTALÓN BOMBACHO",
    price: 29.99,
    originalPrice: null,
    category: "Casual",
    subcategory: "casual-pantalones-monos",
    tags: [],
    image: "https://jandulamodautrera.es/wp-content/uploads/2025/09/IMG_5440.jpg",
    description: "Pantalón bombacho cómodo.",
    sizes: [
      "S",
      "M",
      "L",
      "XL"
    ]
  },
  {
    id: 188,
    name: "PANTALÓN CARGO",
    price: 32,
    originalPrice: null,
    category: "Casual",
    subcategory: "casual-pantalones-monos",
    tags: [],
    image: "https://jandulamodautrera.es/wp-content/uploads/2025/04/IMG_2975.jpg",
    description: "Pantalón cargo con bolsillos.",
    sizes: [
      "S",
      "M",
      "L",
      "XL"
    ]
  },
  {
    id: 189,
    name: "VAQUERO JÁNDULA",
    price: 25.99,
    originalPrice: null,
    category: "Casual",
    subcategory: "casual-pantalones-monos",
    tags: [],
    image: "https://jandulamodautrera.es/wp-content/uploads/2025/04/IMG_3069.jpg",
    description: "Vaquero insignia Jándula.",
    sizes: [
      "34",
      "36",
      "38",
      "40",
      "42"
    ]
  },
  {
    id: 190,
    name: "TOTAL LOOK VAQUERO CINTURÓN",
    price: 40,
    originalPrice: 69.99,
    category: "Casual",
    subcategory: "casual-pantalones-monos",
    tags: [
      "Special Price"
    ],
    image: "https://jandulamodautrera.es/wp-content/uploads/2025/09/685d7cc2-14d8-492d-95d2-79c9d82ce523.jpg",
    description: "Conjunto completo en denim.",
    sizes: [
      "34",
      "36",
      "38",
      "40",
      "42"
    ]
  },
  {
    id: 191,
    name: "MONO CARLOTA",
    price: 55.99,
    originalPrice: null,
    category: "Casual",
    subcategory: "casual-pantalones-monos",
    tags: [],
    image: "https://jandulamodautrera.es/wp-content/uploads/2025/02/image00008.jpeg",
    description: "Mono elegante modelo Carlota.",
    sizes: [
      "S",
      "M",
      "L",
      "XL"
    ]
  },
  {
    id: 192,
    name: "CAMISETA A RAYAS CORAZÓN",
    price: 10,
    originalPrice: null,
    category: "Casual",
    subcategory: "casual-camisetas-tops",
    tags: [
      "Nueva Colección"
    ],
    image: "https://jandulamodautrera.es/wp-content/uploads/2026/02/IMG_1281.jpeg",
    description: "Camiseta a rayas con detalle de corazón.",
    sizes: [
      "S",
      "M",
      "L",
      "XL"
    ]
  },
  {
    id: 193,
    name: "CAMISA COMBINADA CON VAQUERO",
    price: 23,
    originalPrice: null,
    category: "Casual",
    subcategory: "casual-camisas-chalecos",
    tags: [
      "Nueva Colección"
    ],
    image: "https://jandulamodautrera.es/wp-content/uploads/2026/02/IMG_1270.jpeg",
    description: "Camisa combinada con tejido vaquero.",
    sizes: [
      "S",
      "M",
      "L",
      "XL"
    ]
  },
  {
    id: 194,
    name: "CAMISA VICHY NEGRA",
    price: 22,
    originalPrice: null,
    category: "Casual",
    subcategory: "casual-camisas-chalecos",
    tags: [
      "Nueva Colección"
    ],
    image: "https://jandulamodautrera.es/wp-content/uploads/2026/02/IMG_1268.jpeg",
    description: "Camisa vichy en negro atemporal.",
    sizes: [
      "S",
      "M",
      "L",
      "XL"
    ]
  },
  {
    id: 195,
    name: "CAMISA CUADROS ROSA",
    price: 35.99,
    originalPrice: null,
    category: "Casual",
    subcategory: "casual-camisas-chalecos",
    tags: [],
    image: "https://jandulamodautrera.es/wp-content/uploads/2026/02/IMG_1259.jpeg",
    description: "Camisa de cuadros en tono rosa.",
    sizes: [
      "S",
      "M",
      "L",
      "XL"
    ]
  },
  {
    id: 196,
    name: "TOP ESCOTE BOHO",
    price: 19.99,
    originalPrice: null,
    category: "Casual",
    subcategory: "casual-camisetas-tops",
    tags: [
      "Nueva Colección"
    ],
    image: "https://jandulamodautrera.es/wp-content/uploads/2026/02/IMG_1084.jpeg",
    description: "Top con escote boho fresco.",
    sizes: [
      "S",
      "M",
      "L"
    ]
  },
  {
    id: 197,
    name: "CAMISA RAYAS",
    price: 25,
    originalPrice: null,
    category: "Casual",
    subcategory: "casual-camisas-chalecos",
    tags: [],
    image: "https://jandulamodautrera.es/wp-content/uploads/2026/02/IMG_0576.jpeg",
    description: "Camisa de rayas marinera.",
    sizes: [
      "S",
      "M",
      "L",
      "XL"
    ]
  },
  {
    id: 198,
    name: "CAMISA FLORES BORDADAS",
    price: 22.99,
    originalPrice: null,
    category: "Casual",
    subcategory: "casual-camisas-chalecos",
    tags: [],
    image: "https://jandulamodautrera.es/wp-content/uploads/2026/02/IMG_0618.jpeg",
    description: "Camisa con flores bordadas a mano.",
    sizes: [
      "S",
      "M",
      "L",
      "XL"
    ]
  },
  {
    id: 199,
    name: "TOP SUJETADOR",
    price: 8.99,
    originalPrice: null,
    category: "Casual",
    subcategory: "casual-camisetas-tops",
    tags: [],
    image: "https://jandulamodautrera.es/wp-content/uploads/2026/01/IMG_1705.jpg",
    description: "Top tipo sujetador para looks atrevidos.",
    sizes: [
      "S",
      "M",
      "L"
    ]
  },
  {
    id: 200,
    name: "CAMISA HOJAS",
    price: 21,
    originalPrice: null,
    category: "Casual",
    subcategory: "casual-camisas-chalecos",
    tags: [],
    image: "https://jandulamodautrera.es/wp-content/uploads/2026/01/Ver-fotos-recientes.png",
    description: "Camisa con estampado de hojas.",
    sizes: [
      "S",
      "M",
      "L",
      "XL"
    ]
  },
  {
    id: 201,
    name: "CAMISA VICHY LAZO",
    price: 19.99,
    originalPrice: null,
    category: "Casual",
    subcategory: "casual-camisas-chalecos",
    tags: [],
    image: "https://jandulamodautrera.es/wp-content/uploads/2026/01/IMG_6474.jpeg",
    description: "Camisa vichy con detalle de lazo.",
    sizes: [
      "S",
      "M",
      "L",
      "XL"
    ]
  },
  {
    id: 202,
    name: "TOP MANGA LARGA AVISPA",
    price: 18.99,
    originalPrice: null,
    category: "Casual",
    subcategory: "casual-camisetas-tops",
    tags: [],
    image: "https://jandulamodautrera.es/wp-content/uploads/2026/01/IMG_6483.jpeg",
    description: "Top de manga larga con cintura avispa.",
    sizes: [
      "S",
      "M",
      "L",
      "XL"
    ]
  },
  {
    id: 203,
    name: "CAMISA BLANCA FLORES",
    price: 11.99,
    originalPrice: null,
    category: "Casual",
    subcategory: "casual-camisas-chalecos",
    tags: [],
    image: "https://jandulamodautrera.es/wp-content/uploads/2026/01/IMG_6216.jpeg",
    description: "Camisa blanca con estampado floral.",
    sizes: [
      "S",
      "M",
      "L",
      "XL"
    ]
  },
  {
    id: 204,
    name: "CAISA BLANCA FLOR BRILLO",
    price: 18.99,
    originalPrice: null,
    category: "Casual",
    subcategory: "casual-camisas-chalecos",
    tags: [],
    image: "https://jandulamodautrera.es/wp-content/uploads/2026/01/IMG_6213.jpeg",
    description: "Camisa blanca con flor y detalles de brillo.",
    sizes: [
      "S",
      "M",
      "L",
      "XL"
    ]
  },
  {
    id: 205,
    name: "TOP ENCAJE",
    price: 11.99,
    originalPrice: null,
    category: "Casual",
    subcategory: "casual-camisetas-tops",
    tags: [],
    image: "https://jandulamodautrera.es/wp-content/uploads/2026/01/IMG_6090.jpeg",
    description: "Top de encaje delicado.",
    sizes: [
      "S",
      "M",
      "L"
    ]
  },
  {
    id: 206,
    name: "TOP ENCAJE VARIANTE",
    price: 18,
    originalPrice: null,
    category: "Casual",
    subcategory: "casual-camisetas-tops",
    tags: [],
    image: "https://jandulamodautrera.es/wp-content/uploads/2025/10/IMG_1014.jpg",
    description: "Top de encaje en versión diferente.",
    sizes: [
      "S",
      "M",
      "L"
    ]
  },
  {
    id: 207,
    name: "CAMISA ABOTONADA",
    price: 23.99,
    originalPrice: null,
    category: "Casual",
    subcategory: "casual-camisas-chalecos",
    tags: [],
    image: "https://jandulamodautrera.es/wp-content/uploads/2026/01/IMG_5916.jpeg",
    description: "Camisa abotonada clásica.",
    sizes: [
      "S",
      "M",
      "L",
      "XL"
    ]
  },
  {
    id: 208,
    name: "CAMISA BLANCA HOJAS",
    price: 46.99,
    originalPrice: null,
    category: "Casual",
    subcategory: "casual-camisas-chalecos",
    tags: [],
    image: "https://jandulamodautrera.es/wp-content/uploads/2026/01/ae8fd7dd-bc4d-4ff5-bde9-321036e4dfd2.jpg",
    description: "Camisa blanca con estampado de hojas.",
    sizes: [
      "S",
      "M",
      "L",
      "XL"
    ]
  },
  {
    id: 209,
    name: "CAMISA ABOTONADA ROSA",
    price: 29.99,
    originalPrice: null,
    category: "Casual",
    subcategory: "casual-camisas-chalecos",
    tags: [],
    image: "https://jandulamodautrera.es/wp-content/uploads/2025/12/IMG_5437.jpeg",
    description: "Camisa abotonada en rosa.",
    sizes: [
      "S",
      "M",
      "L",
      "XL"
    ]
  },
  {
    id: 210,
    name: "SIN MANGAS PELO NARANJA",
    price: 46,
    originalPrice: null,
    category: "Casual",
    subcategory: "casual-camisas-chalecos",
    tags: [],
    image: "https://jandulamodautrera.es/wp-content/uploads/2025/12/IMG_5447.jpeg",
    description: "Chaleco sin mangas con pelo naranja.",
    sizes: [
      "S",
      "M",
      "L"
    ]
  },
  {
    id: 211,
    name: "CAMISA LAZADA",
    price: 19.99,
    originalPrice: null,
    category: "Casual",
    subcategory: "casual-camisas-chalecos",
    tags: [],
    image: "https://jandulamodautrera.es/wp-content/uploads/2025/12/IMG_5417.jpeg",
    description: "Camisa con lazada decorativa.",
    sizes: [
      "S",
      "M",
      "L",
      "XL"
    ]
  },
  {
    id: 212,
    name: "TOP BRILLOS BEA",
    price: 32,
    originalPrice: null,
    category: "Casual",
    subcategory: "casual-camisetas-tops",
    tags: [],
    image: "https://jandulamodautrera.es/wp-content/uploads/2025/12/IMG_4239.jpeg",
    description: "Top con brillos modelo Bea.",
    sizes: [
      "S",
      "M",
      "L"
    ]
  },
  {
    id: 213,
    name: "CASACA FLORES",
    price: 59.99,
    originalPrice: null,
    category: "Casual",
    subcategory: "casual-camisas-chalecos",
    tags: [],
    image: "https://jandulamodautrera.es/wp-content/uploads/2025/11/IMG_2340.jpg",
    description: "Casaca con estampado floral.",
    sizes: [
      "S",
      "M",
      "L",
      "XL"
    ]
  },
  {
    id: 214,
    name: "LENCERO MANGA LARGA ENCAJE",
    price: 30,
    originalPrice: 46,
    category: "Casual",
    subcategory: null,
    tags: [
      "Special Price"
    ],
    image: "https://jandulamodautrera.es/wp-content/uploads/2025/11/30e0745d-eeae-4bfa-b2b5-cd50e049074c-1.jpg",
    description: "Vestido lencero con encaje. Precio especial.",
    sizes: [
      "S",
      "M",
      "L",
      "XL"
    ]
  },
  {
    id: 215,
    name: "CAMISA ORGANZA",
    price: 38.99,
    originalPrice: null,
    category: "Casual",
    subcategory: "casual-camisas-chalecos",
    tags: [],
    image: "https://jandulamodautrera.es/wp-content/uploads/2025/11/IMG_1852-1.jpg",
    description: "Camisa de organza transparente.",
    sizes: [
      "S",
      "M",
      "L",
      "XL"
    ]
  },
  {
    id: 216,
    name: "BODY NOCHE",
    price: 21.99,
    originalPrice: null,
    category: "Casual",
    subcategory: "casual-camisetas-tops",
    tags: [],
    image: "https://jandulamodautrera.es/wp-content/uploads/2025/10/IMG_1007.jpg",
    description: "Body para looks de noche.",
    sizes: [
      "S",
      "M",
      "L"
    ]
  },
  {
    id: 217,
    name: "CASACA TERCIOPELO ANA",
    price: 29.99,
    originalPrice: null,
    category: "Casual",
    subcategory: "casual-camisas-chalecos",
    tags: [],
    image: "https://jandulamodautrera.es/wp-content/uploads/2025/10/IMG_0445-1.jpg",
    description: "Casaca de terciopelo modelo Ana.",
    sizes: [
      "S",
      "M",
      "L",
      "XL"
    ]
  },
  {
    id: 218,
    name: "CASACA LUNAR",
    price: 36,
    originalPrice: null,
    category: "Casual",
    subcategory: "casual-camisas-chalecos",
    tags: [],
    image: "https://jandulamodautrera.es/wp-content/uploads/2025/09/IMG_5724.jpg",
    description: "Casaca con estampado de lunares.",
    sizes: [
      "S",
      "M",
      "L",
      "XL"
    ]
  },
  {
    id: 219,
    name: "TOP FLOR",
    price: 22.99,
    originalPrice: null,
    category: "Casual",
    subcategory: "casual-camisetas-tops",
    tags: [],
    image: "https://jandulamodautrera.es/wp-content/uploads/2025/09/IMG_5474.jpg",
    description: "Top con detalle de flor.",
    sizes: [
      "S",
      "M",
      "L"
    ]
  },
  {
    id: 220,
    name: "CORSERT BRILLOS",
    price: 28.99,
    originalPrice: null,
    category: "Casual",
    subcategory: "casual-camisetas-tops",
    tags: [],
    image: "https://jandulamodautrera.es/wp-content/uploads/2025/08/IMG_7016.jpg",
    description: "Corsé con detalles de brillos.",
    sizes: [
      "S",
      "M",
      "L"
    ]
  },
  {
    id: 221,
    name: "TOP BRILLOS",
    price: 9.99,
    originalPrice: null,
    category: "Casual",
    subcategory: "casual-camisetas-tops",
    tags: [],
    image: "https://jandulamodautrera.es/wp-content/uploads/2025/08/IMG_7007.jpg",
    description: "Top con brillos para la noche.",
    sizes: [
      "S",
      "M",
      "L"
    ]
  },
  {
    id: 222,
    name: "CORPIÑO FIESTA",
    price: 21,
    originalPrice: null,
    category: "Casual",
    subcategory: "casual-camisetas-tops",
    tags: [],
    image: "https://jandulamodautrera.es/wp-content/uploads/2025/07/IMG_9810.jpg",
    description: "Corpiño para eventos de fiesta.",
    sizes: [
      "S",
      "M",
      "L"
    ]
  },
  {
    id: 223,
    name: "TOP JIMENA",
    price: 34,
    originalPrice: null,
    category: "Casual",
    subcategory: "casual-camisetas-tops",
    tags: [],
    image: "https://jandulamodautrera.es/wp-content/uploads/2025/05/F59F7FCE-A6A7-43F7-B625-2C25D907941E.jpg",
    description: "Top elegante modelo Jimena.",
    sizes: [
      "S",
      "M",
      "L"
    ]
  },
  {
    id: 224,
    name: "TOP SUJETADOR ENCAJE",
    price: 8.99,
    originalPrice: null,
    category: "Casual",
    subcategory: "casual-camisetas-tops",
    tags: [],
    image: "https://jandulamodautrera.es/wp-content/uploads/2025/03/IMG_8500.jpg",
    description: "Top sujetador con encaje.",
    sizes: [
      "S",
      "M",
      "L"
    ]
  },
  {
    id: 225,
    name: "CAMISETA CALIFORNIA",
    price: 21,
    originalPrice: null,
    category: "Casual",
    subcategory: "casual-camisetas-tops",
    tags: [],
    image: "https://jandulamodautrera.es/wp-content/uploads/2025/03/IMG_8563.jpg",
    description: "Camiseta con estampado California.",
    sizes: [
      "S",
      "M",
      "L",
      "XL"
    ]
  },
  {
    id: 226,
    name: "CAMISETA ESCORPIO",
    price: 19.99,
    originalPrice: null,
    category: "Casual",
    subcategory: "casual-camisetas-tops",
    tags: [],
    image: "https://jandulamodautrera.es/wp-content/uploads/2025/03/IMG_8569.jpg",
    description: "Camiseta con diseño Escorpio.",
    sizes: [
      "S",
      "M",
      "L",
      "XL"
    ]
  },
  {
    id: 227,
    name: "CHAQUETA VAQUERA BOTONES DORADOS",
    price: 44,
    originalPrice: null,
    category: "Casual",
    subcategory: "casual-chaquetas",
    tags: [
      "Nueva Colección"
    ],
    image: "https://jandulamodautrera.es/wp-content/uploads/2026/02/IMG_1275.jpeg",
    description: "Chaqueta vaquera con botones dorados.",
    sizes: [
      "S",
      "M",
      "L",
      "XL"
    ]
  },
  {
    id: 228,
    name: "BLAZER JÁNDULA",
    price: 36,
    originalPrice: null,
    category: "Casual",
    subcategory: "casual-chaquetas",
    tags: [],
    image: "https://jandulamodautrera.es/wp-content/uploads/2026/01/IMG_1678.jpg",
    description: "Blazer insignia Jándula.",
    sizes: [
      "S",
      "M",
      "L",
      "XL"
    ]
  },
  {
    id: 229,
    name: "CHAQUETA VAQUERA INDIA",
    price: 42,
    originalPrice: null,
    category: "Casual",
    subcategory: "casual-chaquetas",
    tags: [],
    image: "https://jandulamodautrera.es/wp-content/uploads/2026/01/IMG_1587.jpg",
    description: "Chaqueta vaquera con estilo indio.",
    sizes: [
      "S",
      "M",
      "L",
      "XL"
    ]
  },
  {
    id: 230,
    name: "JERSEY BEATRIZ",
    price: 22.99,
    originalPrice: null,
    category: "Casual",
    subcategory: "casual-chaquetas",
    tags: [],
    image: "https://jandulamodautrera.es/wp-content/uploads/2026/01/IMG_6303.jpeg",
    description: "Jersey suave modelo Beatriz.",
    sizes: [
      "S",
      "M",
      "L",
      "XL"
    ]
  },
  {
    id: 231,
    name: "CHAQUETA DE PELO CELESTE",
    price: 54,
    originalPrice: null,
    category: "Casual",
    subcategory: "casual-chaquetas",
    tags: [],
    image: "https://jandulamodautrera.es/wp-content/uploads/2026/01/IMG_6224.jpeg",
    description: "Chaqueta de pelo en tono celeste.",
    sizes: [
      "S",
      "M",
      "L"
    ]
  },
  {
    id: 232,
    name: "PICOS PURPURINA",
    price: 14.99,
    originalPrice: null,
    category: "Casual",
    subcategory: "casual-chaquetas",
    tags: [],
    image: "https://jandulamodautrera.es/wp-content/uploads/2026/01/IMG_6022.jpeg",
    description: "Accesorio picos con purpurina.",
    sizes: []
  },
  {
    id: 233,
    name: "CHAQUETA POLIPIEL AMARILLA COMBINADA CON PELO",
    price: 69.99,
    originalPrice: null,
    category: "Casual",
    subcategory: "casual-chaquetas",
    tags: [],
    image: "https://jandulamodautrera.es/wp-content/uploads/2026/01/IMG_5936.jpeg",
    description: "Chaqueta polipiel amarilla con pelo.",
    sizes: [
      "S",
      "M",
      "L"
    ]
  },
  {
    id: 234,
    name: "PICO DE LANA",
    price: 14.99,
    originalPrice: null,
    category: "Casual",
    subcategory: "casual-chaquetas",
    tags: [],
    image: "https://jandulamodautrera.es/wp-content/uploads/2026/01/IMG_5930.jpeg",
    description: "Pico de lana cálido.",
    sizes: []
  },
  {
    id: 235,
    name: "CHAQUETA SOL",
    price: 45.99,
    originalPrice: null,
    category: "Casual",
    subcategory: "casual-chaquetas",
    tags: [],
    image: "https://jandulamodautrera.es/wp-content/uploads/2026/01/975c0ac4-27d5-465a-bf44-a3d827d377aa.jpg",
    description: "Chaqueta con diseño de sol.",
    sizes: [
      "S",
      "M",
      "L",
      "XL"
    ]
  },
  {
    id: 236,
    name: "CHAQUETA DE PELO SIN MANGAS GORRO",
    price: 46,
    originalPrice: null,
    category: "Casual",
    subcategory: "casual-chaquetas",
    tags: [],
    image: "https://jandulamodautrera.es/wp-content/uploads/2026/01/IMG_5900.jpeg",
    description: "Chaqueta de pelo sin mangas con gorro.",
    sizes: [
      "S",
      "M",
      "L"
    ]
  },
  {
    id: 237,
    name: "JERSEY PERLAS NEGRO",
    price: 25,
    originalPrice: null,
    category: "Casual",
    subcategory: "casual-chaquetas",
    tags: [],
    image: "https://jandulamodautrera.es/wp-content/uploads/2025/12/IMG_5477.jpeg",
    description: "Jersey negro con detalle de perlas.",
    sizes: [
      "S",
      "M",
      "L",
      "XL"
    ]
  },
  {
    id: 238,
    name: "ESTOLA DE PELO COMBINADA RAYAS",
    price: 26,
    originalPrice: null,
    category: "Casual",
    subcategory: "casual-chaquetas",
    tags: [],
    image: "https://jandulamodautrera.es/wp-content/uploads/2025/12/IMG_5454.jpeg",
    description: "Estola de pelo con rayas combinadas.",
    sizes: []
  },
  {
    id: 239,
    name: "JERSEY FLOR NIEVE",
    price: 29.99,
    originalPrice: null,
    category: "Casual",
    subcategory: "casual-chaquetas",
    tags: [],
    image: "https://jandulamodautrera.es/wp-content/uploads/2025/12/IMG_5092.jpeg",
    description: "Jersey con estampado floral invernal.",
    sizes: [
      "S",
      "M",
      "L",
      "XL"
    ]
  },
  {
    id: 240,
    name: "CHAQUETA PELO SIN MANGAS",
    price: 59.99,
    originalPrice: null,
    category: "Casual",
    subcategory: "casual-chaquetas",
    tags: [],
    image: "https://jandulamodautrera.es/wp-content/uploads/2025/12/IMG_5141-1.jpeg",
    description: "Chaqueta de pelo sin mangas.",
    sizes: [
      "S",
      "M",
      "L"
    ]
  },
  {
    id: 241,
    name: "CHAQUETA AVE",
    price: 39.99,
    originalPrice: null,
    category: "Casual",
    subcategory: "casual-chaquetas",
    tags: [],
    image: "https://jandulamodautrera.es/wp-content/uploads/2025/12/IMG_5109.jpeg",
    description: "Chaqueta con diseño de ave.",
    sizes: [
      "S",
      "M",
      "L",
      "XL"
    ]
  },
  {
    id: 242,
    name: "CHAQUETA PELO NATURAL",
    price: 99,
    originalPrice: null,
    category: "Casual",
    subcategory: "casual-chaquetas",
    tags: [
      "Nueva Colección"
    ],
    image: "https://jandulamodautrera.es/wp-content/uploads/2025/12/IMG_4320.jpeg",
    description: "Chaqueta de pelo natural premium.",
    sizes: [
      "S",
      "M",
      "L"
    ]
  },
  {
    id: 243,
    name: "BLAZER AITANA",
    price: 49.99,
    originalPrice: null,
    category: "Casual",
    subcategory: "casual-chaquetas",
    tags: [],
    image: "https://jandulamodautrera.es/wp-content/uploads/2025/10/92be22d8-cfe4-4d04-bd0c-05ba6e8b46e4.jpg",
    description: "Blazer elegante modelo Aitana.",
    sizes: [
      "S",
      "M",
      "L",
      "XL"
    ]
  },
  {
    id: 244,
    name: "CAPA EUGENIA",
    price: 18,
    originalPrice: null,
    category: "Casual",
    subcategory: "casual-chaquetas",
    tags: [],
    image: "https://jandulamodautrera.es/wp-content/uploads/2025/10/IMG_0027-1.jpg",
    description: "Capa ligera modelo Eugenia.",
    sizes: [
      "S",
      "M",
      "L"
    ]
  },
  {
    id: 245,
    name: "CHAQUETA SIN MANGAS COMBINADA",
    price: 38,
    originalPrice: null,
    category: "Casual",
    subcategory: "casual-chaquetas",
    tags: [],
    image: "https://jandulamodautrera.es/wp-content/uploads/2025/10/IMG_9645.jpg",
    description: "Chaqueta sin mangas combinada.",
    sizes: [
      "S",
      "M",
      "L",
      "XL"
    ]
  },
  {
    id: 246,
    name: "FALDA FLECOS MARRÓN",
    price: 34.99,
    originalPrice: null,
    category: "Casual",
    subcategory: "casual-faldas-shorts",
    tags: [
      "Nueva Colección"
    ],
    image: "https://jandulamodautrera.es/wp-content/uploads/2026/02/IMG_1086.jpeg",
    description: "Falda con flecos en tono marrón.",
    sizes: [
      "S",
      "M",
      "L"
    ]
  },
  {
    id: 247,
    name: "FALDA NURIA",
    price: 25.99,
    originalPrice: null,
    category: "Casual",
    subcategory: "casual-faldas-shorts",
    tags: [],
    image: "https://jandulamodautrera.es/wp-content/uploads/2025/09/IMG_5598.jpg",
    description: "Falda modelo Nuria.",
    sizes: [
      "S",
      "M",
      "L",
      "XL"
    ]
  },
  {
    id: 248,
    name: "FALDA MARIA",
    price: 38.99,
    originalPrice: null,
    category: "Casual",
    subcategory: "casual-faldas-shorts",
    tags: [],
    image: "https://jandulamodautrera.es/wp-content/uploads/2025/09/IMG_5573.jpg",
    description: "Falda modelo Maria.",
    sizes: [
      "S",
      "M",
      "L",
      "XL"
    ]
  },
  {
    id: 249,
    name: "FALDA FLECOS",
    price: 29.99,
    originalPrice: null,
    category: "Casual",
    subcategory: "casual-faldas-shorts",
    tags: [],
    image: "https://jandulamodautrera.es/wp-content/uploads/2025/05/IMG_3438.jpg",
    description: "Falda con flecos decorativos.",
    sizes: [
      "S",
      "M",
      "L"
    ]
  },
  {
    id: 250,
    name: "MONA TERCIOPELO",
    price: 32.99,
    originalPrice: null,
    category: "Casual",
    subcategory: null,
    tags: [],
    image: "https://jandulamodautrera.es/wp-content/uploads/2025/11/IMG_1954-1.jpg",
    description: "Mona de terciopelo, pieza única.",
    sizes: [
      "S",
      "M",
      "L"
    ]
  },
  {
    id: 251,
    name: "MALLA LEOPARDO",
    price: 10,
    originalPrice: null,
    category: "Casual",
    subcategory: null,
    tags: [],
    image: "https://jandulamodautrera.es/wp-content/uploads/2025/11/IMG_0947.jpg",
    description: "Malla con estampado leopardo.",
    sizes: [
      "S",
      "M",
      "L",
      "XL"
    ]
  },
  {
    id: 252,
    name: "CAMISA FRESA",
    price: 29.99,
    originalPrice: null,
    category: "Casual",
    subcategory: "casual-camisas-chalecos",
    tags: [
      "Nueva Colección"
    ],
    image: "https://jandulamodautrera.es/wp-content/uploads/2026/01/IMG_1645.jpg",
    description: "Camisa con estampado de fresas, fresco y divertido.",
    sizes: [
      "S",
      "M",
      "L",
      "XL"
    ]
  },
  {
    id: 253,
    name: "VAQUERO DIAMANTE",
    price: 35,
    originalPrice: null,
    category: "Casual",
    subcategory: "casual-pantalones-monos",
    tags: [
      "Nueva Colección"
    ],
    image: "https://jandulamodautrera.es/wp-content/uploads/2026/01/IMG_1649.jpg",
    description: "Vaquero con detalle de diamante brillante.",
    sizes: [
      "34",
      "36",
      "38",
      "40",
      "42"
    ]
  },
  {
    id: 254,
    name: "CAMISA CUELLO BORDADO",
    price: 31.99,
    originalPrice: null,
    category: "Casual",
    subcategory: "casual-camisas-chalecos",
    tags: [
      "Nueva Colección"
    ],
    image: "https://jandulamodautrera.es/wp-content/uploads/2026/01/IMG_6055.jpeg",
    description: "Camisa con cuello bordado artesanal.",
    sizes: [
      "S",
      "M",
      "L",
      "XL"
    ]
  },
  {
    id: 255,
    name: "CHAQUETA SIN MANGAS PELO NATURAL",
    price: 99,
    originalPrice: null,
    category: "Casual",
    subcategory: "casual-chaquetas",
    tags: [
      "Nueva Colección"
    ],
    image: "https://jandulamodautrera.es/wp-content/uploads/2025/12/IMG_4320.jpeg",
    description: "Chaqueta sin mangas de pelo natural.",
    sizes: [
      "S",
      "M",
      "L"
    ]
  }
];

export const formatPrice = (price) => {
  return price.toFixed(2).replace('.', ',') + ' €';
};
