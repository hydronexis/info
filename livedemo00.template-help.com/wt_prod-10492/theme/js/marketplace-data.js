/**
 * Datos del Marketplace - Productos y Vendedores
 * Cada vegetal tiene 3 vendedores con precios, ubicación y reviews propias.
 */
const MARKETPLACE_DATA = {
  'romaine-lettuce': {
    id: 'romaine-lettuce',
    name: 'Romaine Lettuce',
    nameEs: 'Lechuga Romana',
    image: 'images/product-1-220x160.png',
    basePrice: '0.60',
    category: 'Leafy Greens',
    sellersPage: 'sellers-romaine-lettuce.html',
    sellers: [
      {
        id: 'alberto-martinez',
        name: 'Alberto Martínez',
        price: '0.75',
        description: 'Lechuga romana cultivada en sistema hidropónico NFT. Hojas crujientes, de color verde intenso y excelente durabilidad post-cosecha. Ideal para ensaladas César y wraps.',
        sellerInfo: 'Productor con 8 años de experiencia en hidroponía. Especializado en lechugas de hoja. Entrega los martes y viernes en La Chorrera.',
        location: {
          name: 'La Ciudad del Niño',
          address: 'V68H+CH3, La Chorrera, Panamá',
          embed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3940.5!2d-79.783!3d8.88!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8faca3c3c3c3c3c3%3A0x0!2sLa%20Ciudad%20del%20Ni%C3%B1o!5e0!3m2!1ses!2spa!4v1700000000000',
          directions: 'Desde la autopista Panamericana, tomar la salida hacia La Chorrera. Continuar 2 km por la vía principal hasta el mercado comunitario. El punto de recogida está señalizado con cartel verde "Hydronexis".'
        },
        reviews: [
          { author: 'Velinda Guitierres', stars: 5, date: 'september 1st, 2026', text: 'Me súper gusto, Amazing!!!!!!!!' },
          { author: 'Carlos Mendoza', stars: 5, date: 'august 15th, 2026', text: 'La lechuga llegó fresca y crujiente. Muy recomendado.' }
        ]
      },
      {
        id: 'maria-rodriguez',
        name: 'María Rodríguez',
        price: '0.60',
        description: 'Lechuga romana orgánica sin pesticidas. Cultivada con nutrientes balanceados en invernadero climatizado. Textura suave y sabor delicado.',
        sellerInfo: 'Agricultora familiar desde 2019. Certificación en buenas prácticas agrícolas. Acepta pedidos por WhatsApp.',
        location: {
          name: 'Mercado de Arraiján',
          address: 'Arraiján, Panamá Oeste',
          embed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3941!2d-79.65!3d8.95!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sArraij%C3%A1n!5e0!3m2!1ses!2spa!4v1700000000001',
          directions: 'Ubicada en el mercado municipal de Arraiján, puesto #12. Estacionamiento disponible en la parte trasera del edificio.'
        },
        reviews: [
          { author: 'Ana Torres', stars: 4, date: 'july 20th, 2026', text: 'Buena calidad y precio justo. Volveré a comprar.' }
        ]
      },
      {
        id: 'jose-hernandez',
        name: 'José Hernández',
        price: '0.55',
        description: 'Lechuga romana de cosecha diaria. Sistema Deep Water Culture (DWC) para máxima frescura. Perfecta para consumo inmediato o almacenamiento de 5-7 días.',
        sellerInfo: 'Ingeniero agrónomo graduado de UDELAS. Finca hidropónica de 200 m². Ofrece descuentos por volumen.',
        location: {
          name: 'Finca Hydronexis West',
          address: 'Vía Centenario, Panamá Oeste',
          embed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3942!2d-79.70!3d8.92!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sPanam%C3%A1%20Oeste!5e0!3m2!1ses!2spa!4v1700000000002',
          directions: 'Por la Vía Centenario, km 12.5, entrada a mano derecha con portón blanco. Llamar al llegar para abrir.'
        },
        reviews: [
          { author: 'Pedro Sánchez', stars: 5, date: 'june 10th, 2026', text: 'Excelente relación calidad-precio. La más fresca del mercado.' },
          { author: 'Lucía Vega', stars: 4, date: 'may 28th, 2026', text: 'Muy buena, aunque el punto de recogida es un poco lejos.' }
        ]
      }
    ]
  },

  'tomatoes': {
    id: 'tomatoes',
    name: 'Tomatoes',
    nameEs: 'Tomates',
    image: 'images/product-2-191x132.png',
    basePrice: '1.15',
    category: 'Fruit Vegetables',
    sellersPage: 'sellers-tomatoes.html',
    sellers: [
      {
        id: 'alberto-martinez',
        name: 'Alberto Martínez',
        price: '1.25',
        description: 'Tomates cherry rojos cultivados en hidroponía. Dulces, jugosos y perfectos para ensaladas. Cosechados el mismo día de la entrega.',
        sellerInfo: 'Productor con 8 años de experiencia. Especialista en tomates de invernadero.',
        location: {
          name: 'La Ciudad del Niño',
          address: 'V68H+CH3, La Chorrera, Panamá',
          embed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3940.5!2d-79.783!3d8.88!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8faca3c3c3c3c3c3%3A0x0!2sLa%20Ciudad%20del%20Ni%C3%B1o!5e0!3m2!1ses!2spa!4v1700000000000',
          directions: 'Desde la autopista Panamericana, salida La Chorrera. 2 km por vía principal hasta mercado comunitario.'
        },
        reviews: [
          { author: 'Velinda Guitierres', stars: 5, date: 'september 1st, 2026', text: 'Me súper gusto, Amazing!!!!!!!!' }
        ]
      },
      {
        id: 'carmen-vega',
        name: 'Carmen Vega',
        price: '1.15',
        description: 'Tomates beefsteak de gran tamaño. Ideales para sandwiches y salsas. Cultivo sin suelo con control de EC y pH.',
        sellerInfo: 'Emprendedora agrícola desde 2020. Participante activa en ferias agroecológicas de Panamá Oeste.',
        location: {
          name: 'Capira Centro',
          address: 'Capira, Panamá Oeste',
          embed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3943!2d-79.58!3d8.75!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sCapira!5e0!3m2!1ses!2spa!4v1700000000003',
          directions: 'En el parque central de Capira, junto al kiosco de verduras orgánicas. Horario: 7am - 2pm.'
        },
        reviews: [
          { author: 'Roberto Díaz', stars: 5, date: 'august 5th, 2026', text: 'Los mejores tomates que he probado en Panamá.' }
        ]
      },
      {
        id: 'luis-morales',
        name: 'Luis Morales',
        price: '1.05',
        description: 'Tomates Roma para salsa y cocina. Piel firme, pulpa carnosa y bajo contenido de agua. Excelente rendimiento.',
        sellerInfo: 'Ex-chef convertido en productor. Enfoque en calidad gourmet para restaurantes locales.',
        location: {
          name: 'San Carlos',
          address: 'San Carlos, Panamá Oeste',
          embed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3944!2d-79.73!3d8.78!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sSan%20Carlos!5e0!3m2!1ses!2spa!4v1700000000004',
          directions: 'Finca al final de la calle principal de San Carlos. Buscar letrero "Tomates LM".'
        },
        reviews: [
          { author: 'Isabel Ruiz', stars: 4, date: 'july 12th, 2026', text: 'Perfectos para hacer salsa casera.' }
        ]
      }
    ]
  },

  'spinach': {
    id: 'spinach',
    name: 'Spinach',
    nameEs: 'Espinaca',
    image: 'images/product-3-238x158.png',
    basePrice: '2.95',
    category: 'Leafy Greens',
    sellersPage: 'sellers-spinach.html',
    sellers: [
      {
        id: 'elena-castro',
        name: 'Elena Castro',
        price: '3.10',
        description: 'Espinaca baby leaf de hoja tierna. Rica en hierro y vitaminas. Cultivada en sistema aeropónico de alta densidad.',
        sellerInfo: 'Nutricionista y productora. Enfoque en superfoods locales.',
        location: {
          name: 'La Chorrera Centro',
          address: 'La Chorrera, Panamá Oeste',
          embed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3940.5!2d-79.783!3d8.88!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sLa%20Chorrera!5e0!3m2!1ses!2spa!4v1700000000005',
          directions: 'Mercado municipal, sección de hojas verdes, puesto #5.'
        },
        reviews: [
          { author: 'Marta Jiménez', stars: 5, date: 'august 22nd, 2026', text: 'Espinaca muy tierna, ideal para smoothies.' }
        ]
      },
      {
        id: 'ricardo-pena',
        name: 'Ricardo Peña',
        price: '2.95',
        description: 'Espinaca tradicional de hoja grande. Perfecta para cocinar o saltear. Sabor suave y textura uniforme.',
        sellerInfo: 'Agricultor de tercera generación adaptado a hidroponía.',
        location: {
          name: 'Arraiján',
          address: 'Arraiján, Panamá Oeste',
          embed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3941!2d-79.65!3d8.95!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sArraij%C3%A1n!5e0!3m2!1ses!2spa!4v1700000000001',
          directions: 'Cooperativa agrícola de Arraiján, módulo 3.'
        },
        reviews: [
          { author: 'Felipe Ortiz', stars: 4, date: 'july 8th, 2026', text: 'Buena calidad, buen precio.' }
        ]
      },
      {
        id: 'sofia-ramirez',
        name: 'Sofía Ramírez',
        price: '2.80',
        description: 'Espinaca orgánica certificada. Sin químicos sintéticos. Cosecha semanal garantizada.',
        sellerInfo: 'Bióloga marina reconvertida en agricultura sostenible.',
        location: {
          name: 'Vista Alegre',
          address: 'Vista Alegre, Arraiján',
          embed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3945!2d-79.68!3d8.97!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sVista%20Alegre!5e0!3m2!1ses!2spa!4v1700000000006',
          directions: 'Urbanización Vista Alegre, calle 3, casa #45 con invernadero visible desde la calle.'
        },
        reviews: [
          { author: 'Daniela Mora', stars: 5, date: 'june 30th, 2026', text: 'Orgánica de verdad, se nota la diferencia.' }
        ]
      }
    ]
  },

  'chives': {
    id: 'chives',
    name: 'Chives',
    nameEs: 'Cebollín',
    image: 'images/product-4-204x125.png',
    basePrice: '0.30',
    category: 'Herbs & Steams',
    sellersPage: 'sellers-chives.html',
    sellers: [
      {
        id: 'pedro-gomez',
        name: 'Pedro Gómez',
        price: '0.35',
        description: 'Cebollín fresco de corte diario. Aroma intenso y sabor delicado. Ideal como condimento para sopas, ensaladas y platos asiáticos.',
        sellerInfo: 'Especialista en hierbas aromáticas hidropónicas.',
        location: {
          name: 'La Chorrera',
          address: 'La Chorrera, Panamá Oeste',
          embed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3940.5!2d-79.783!3d8.88!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sLa%20Chorrera!5e0!3m2!1ses!2spa!4v1700000000005',
          directions: 'Mercado de productores, pasillo de hierbas, puesto verde.'
        },
        reviews: [
          { author: 'Gabriela León', stars: 5, date: 'august 18th, 2026', text: 'Muy fresco, dura bastante en el refrigerador.' }
        ]
      },
      {
        id: 'ana-lopez',
        name: 'Ana López',
        price: '0.30',
        description: 'Cebollín en manojos de 100g. Cultivado en torres verticales para máximo aprovechamiento del espacio.',
        sellerInfo: 'Emprendedora en agricultura vertical urbana.',
        location: {
          name: 'Panamá Oeste',
          address: 'Vía Israel, La Chorrera',
          embed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3940.5!2d-79.783!3d8.88!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sLa%20Chorrera!5e0!3m2!1ses!2spa!4v1700000000005',
          directions: 'Edificio comercial Vía Israel, local 4B, segundo piso.'
        },
        reviews: [
          { author: 'Tomás Herrera', stars: 4, date: 'july 25th, 2026', text: 'Buen producto, buen servicio.' }
        ]
      },
      {
        id: 'miguel-santos',
        name: 'Miguel Santos',
        price: '0.28',
        description: 'Cebollín premium en empaque al vacío. Mayor vida útil y frescura garantizada por 10 días.',
        sellerInfo: 'Tecnólogo alimentario. Innovador en empaques para hierbas.',
        location: {
          name: 'Feria del Agricultor',
          address: 'Panamá Oeste',
          embed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3941!2d-79.65!3d8.95!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sArraij%C3%A1n!5e0!3m2!1ses!2spa!4v1700000000001',
          directions: 'Feria del Agricultor los sábados de 6am a 12pm. Puesto #22.'
        },
        reviews: [
          { author: 'Claudia Reyes', stars: 5, date: 'june 15th, 2026', text: 'El empaque al vacío es genial, no se marchita.' }
        ]
      }
    ]
  },

  'butterhead-lettuce': {
    id: 'butterhead-lettuce',
    name: 'Butterhead Lettuce',
    nameEs: 'Lechuga Mantecosa',
    image: 'images/product-5-204x156.png',
    basePrice: '0.65',
    category: 'Leafy Greens',
    sellersPage: 'sellers-butterhead-lettuce.html',
    sellers: [
      {
        id: 'alberto-martinez',
        name: 'Alberto Martínez',
        photo: 'images/vendedores/Alberto_Cortez_color.jpg',
        price: '0.75',
        description: 'Butterhead lettuce with soft leaves and a compact shape. Its creamy texture makes it ideal for gourmet salads and healthy wraps.',
        sellerInfo: 'Producer with 8 years of experience in hydroponics and a strong focus on leafy crops.',
        location: {
          name: 'La Ciudad del Niño',
          address: 'V68H+CH3, La Chorrera, Panamá',
          embed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3940.5!2d-79.783!3d8.88!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8faca3c3c3c3c3c3%3A0x0!2sLa%20Ciudad%20del%20Ni%C3%B1o!5e0!3m2!1ses!2spa!4v1700000000000',
          directions: 'From the Pan-American Highway, take the exit toward La Chorrera. Continue 2 km to the community market.'
        },
        reviews: [
          { author: 'Velinda Guitierres', stars: 5, date: 'september 1st, 2026', text: 'I really liked it, amazing!' }
        ]
      },
      {
        id: 'patricia-nunez',
        name: 'Patricia Núñez',
        price: '0.65',
        description: 'Lechuga mantecosa hidropónica de invernadero. Hojas tiernas y color verde uniforme. Entrega a domicilio disponible.',
        sellerInfo: 'Enfermera y productora. Servicio de entrega los miércoles.',
        location: {
          name: 'Nuevo Emperador',
          address: 'Nuevo Emperador, Panamá Oeste',
          embed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3946!2d-79.72!3d8.98!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sNuevo%20Emperador!5e0!3m2!1ses!2spa!4v1700000000007',
          directions: 'Residencial Los Olivos, casa #8. Tocar timbre verde.'
        },
        reviews: [
          { author: 'Héctor Vargas', stars: 4, date: 'august 10th, 2026', text: 'Entrega puntual y producto fresco.' }
        ]
      },
      {
        id: 'fernando-cruz',
        name: 'Fernando Cruz',
        price: '0.58',
        description: 'Lechuga mantecosa en maceta viva. Se entrega con raíz para máxima frescura. Dura hasta 2 semanas en refrigeración.',
        sellerInfo: 'Innovador en venta de plantas vivas para consumo.',
        location: {
          name: 'Chame',
          address: 'Chame, Panamá Oeste',
          embed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3947!2d-79.88!3d8.58!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sChame!5e0!3m2!1ses!2spa!4v1700000000008',
          directions: 'Carretera interamericana, km 52, invernadero con domo blanco.'
        },
        reviews: [
          { author: 'Laura Méndez', stars: 5, date: 'july 3rd, 2026', text: 'La idea de planta viva es excelente.' }
        ]
      }
    ]
  },

  'radish': {
    id: 'radish',
    name: 'Radish',
    nameEs: 'Rábano',
    image: 'images/product-6-237x156.png',
    basePrice: '0.65',
    category: 'Root Vegetables',
    sellersPage: 'sellers-radish.html',
    sellers: [
      {
        id: 'jorge-mendez',
        name: 'Jorge Méndez',
        price: '0.70',
        description: 'Rábanos rojos crujientes de ciclo corto (25 días). Picantes y refrescantes. Perfectos para ensaladas y decoración.',
        sellerInfo: 'Especialista en cultivos de ciclo corto en hidroponía.',
        location: {
          name: 'La Chorrera',
          address: 'La Chorrera, Panamá Oeste',
          embed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3940.5!2d-79.783!3d8.88!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sLa%20Chorrera!5e0!3m2!1ses!2spa!4v1700000000005',
          directions: 'Mercado municipal, sección raíces y tubérculos.'
        },
        reviews: [
          { author: 'Oscar Blanco', stars: 5, date: 'august 28th, 2026', text: 'Crujientes y frescos, excelentes.' }
        ]
      },
      {
        id: 'diana-flores',
        name: 'Diana Flores',
        price: '0.65',
        description: 'Rábanos blancos daikon hidropónicos. Suaves y versátiles para cocina asiática y encurtidos.',
        sellerInfo: 'Chef y productora de vegetales especializados.',
        location: {
          name: 'Arraiján',
          address: 'Arraiján, Panamá Oeste',
          embed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3941!2d-79.65!3d8.95!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sArraij%C3%A1n!5e0!3m2!1ses!2spa!4v1700000000001',
          directions: 'Restaurante La Huerta, compras en recepción de 9am a 5pm.'
        },
        reviews: [
          { author: 'Kenji Tanaka', stars: 5, date: 'july 17th, 2026', text: 'Perfect daikon for my recipes!' }
        ]
      },
      {
        id: 'raul-espinoza',
        name: 'Raúl Espinoza',
        price: '0.60',
        description: 'Mix de rábanos multicolor (rojo, blanco, púrpura). Presentación atractiva para restaurantes y eventos.',
        sellerInfo: 'Proveedor para restaurantes de Panamá Oeste.',
        location: {
          name: 'Vista Alegre',
          address: 'Vista Alegre, Arraiján',
          embed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3945!2d-79.68!3d8.97!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sVista%20Alegre!5e0!3m2!1ses!2spa!4v1700000000006',
          directions: 'Bodega Vista Alegre, calle principal, portón azul.'
        },
        reviews: [
          { author: 'Marina Costa', stars: 4, date: 'june 22nd, 2026', text: 'Bonitos colores, buen sabor.' }
        ]
      }
    ]
  },

  'red-bell-peppers': {
    id: 'red-bell-peppers',
    name: 'Red Bell Peppers',
    nameEs: 'Pimentón Rojo',
    image: 'images/product-7-210x168.png',
    basePrice: '2.00',
    category: 'Fruit Vegetables',
    sellersPage: 'sellers-red-bell-peppers.html',
    sellers: [
      {
        id: 'alberto-martinez',
        name: 'Alberto Martínez',
        price: '2.15',
        description: 'Pimentón rojo maduro, dulce y carnoso. Alto contenido de vitamina C. Ideal para asar, rellenar o comer crudo.',
        sellerInfo: 'Productor con 8 años de experiencia. Especialista en solanáceas.',
        location: {
          name: 'La Ciudad del Niño',
          address: 'V68H+CH3, La Chorrera, Panamá',
          embed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3940.5!2d-79.783!3d8.88!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8faca3c3c3c3c3c3%3A0x0!2sLa%20Ciudad%20del%20Ni%C3%B1o!5e0!3m2!1ses!2spa!4v1700000000000',
          directions: 'Mercado comunitario, sección pimentones.'
        },
        reviews: [
          { author: 'Velinda Guitierres', stars: 5, date: 'september 1st, 2026', text: 'Me súper gusto, Amazing!!!!!!!!' }
        ]
      },
      {
        id: 'gloria-aguilar',
        name: 'Gloria Aguilar',
        price: '2.00',
        description: 'Pimentones rojos de invernadero climatizado. Piel brillante y gruesa. Tamaño uniforme para empaque comercial.',
        sellerInfo: 'Exportadora local de vegetales hidropónicos.',
        location: {
          name: 'Capira',
          address: 'Capira, Panamá Oeste',
          embed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3943!2d-79.58!3d8.75!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sCapira!5e0!3m2!1ses!2spa!4v1700000000003',
          directions: 'Planta de empaque Capira, zona industrial.'
        },
        reviews: [
          { author: 'Ernesto Paredes', stars: 4, date: 'august 3rd, 2026', text: 'Tamaño uniforme, buena calidad.' }
        ]
      },
      {
        id: 'victor-salazar',
        name: 'Víctor Salazar',
        price: '1.90',
        description: 'Pimentón rojo mini para gourmet. Perfecto para platos individuales y catering. Sabor concentrado.',
        sellerInfo: 'Chef ejecutivo y microproductor.',
        location: {
          name: 'San Carlos',
          address: 'San Carlos, Panamá Oeste',
          embed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3944!2d-79.73!3d8.78!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sSan%20Carlos!5e0!3m2!1ses!2spa!4v1700000000004',
          directions: 'Finca gourmet San Carlos, cita previa por WhatsApp.'
        },
        reviews: [
          { author: 'Chef Andrés', stars: 5, date: 'july 1st, 2026', text: 'Perfect size for fine dining plates.' }
        ]
      }
    ]
  },

  'yellow-bell-peppers': {
    id: 'yellow-bell-peppers',
    name: 'Yellow Bell Peppers',
    nameEs: 'Pimentón Amarillo',
    image: 'images/product-8-210x133.png',
    basePrice: '2.00',
    category: 'Fruit Vegetables',
    sellersPage: 'sellers-yellow-bell-peppers.html',
    sellers: [
      {
        id: 'alberto-martinez',
        name: 'Alberto Martínez',
        price: '2.10',
        description: 'Pimentón amarillo dulce con notas cítricas. Excelente para salteados, pizzas y platos mediterráneos.',
        sellerInfo: 'Productor con 8 años de experiencia.',
        location: {
          name: 'La Ciudad del Niño',
          address: 'V68H+CH3, La Chorrera, Panamá',
          embed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3940.5!2d-79.783!3d8.88!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8faca3c3c3c3c3c3%3A0x0!2sLa%20Ciudad%20del%20Ni%C3%B1o!5e0!3m2!1ses!2spa!4v1700000000000',
          directions: 'Mercado comunitario, sección pimentones.'
        },
        reviews: [
          { author: 'Velinda Guitierres', stars: 5, date: 'september 1st, 2026', text: 'Me súper gusto, Amazing!!!!!!!!' }
        ]
      },
      {
        id: 'monica-rivera',
        name: 'Mónica Rivera',
        price: '2.00',
        description: 'Pimentones amarillos de pared gruesa. Ideales para rellenar. Cultivo en coco coir con riego automatizado.',
        sellerInfo: 'Ingeniera en sistemas de riego. Finca tecnificada.',
        location: {
          name: 'Nuevo Arraiján',
          address: 'Nuevo Arraiján, Panamá Oeste',
          embed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3941!2d-79.65!3d8.95!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sArraij%C3%A1n!5e0!3m2!1ses!2spa!4v1700000000001',
          directions: 'Urbanización Nuevo Arraiján, manzana 4, lote 12.'
        },
        reviews: [
          { author: 'Sandra Ortiz', stars: 4, date: 'august 14th, 2026', text: 'Perfectos para rellenar, muy carnosos.' }
        ]
      },
      {
        id: 'hector-davila',
        name: 'Héctor Dávila',
        price: '1.85',
        description: 'Pimentón amarillo ecológico. Sin cera ni tratamiento post-cosecha. Color natural brillante.',
        sellerInfo: 'Agricultor certificado en producción ecológica.',
        location: {
          name: 'La Chorrera',
          address: 'La Chorrera, Panamá Oeste',
          embed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3940.5!2d-79.783!3d8.88!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sLa%20Chorrera!5e0!3m2!1ses!2spa!4v1700000000005',
          directions: 'Eco-tienda La Chorrera, frente al parque central.'
        },
        reviews: [
          { author: 'Paula Nieto', stars: 5, date: 'june 8th, 2026', text: '100% natural, se nota el sabor.' }
        ]
      }
    ]
  },

  'green-bell-peppers': {
    id: 'green-bell-peppers',
    name: 'Green Bell Peppers',
    nameEs: 'Pimentón Verde',
    image: 'images/product-9-185x155.png',
    basePrice: '2.00',
    category: 'Fruit Vegetables',
    sellersPage: 'sellers-green-bell-peppers.html',
    sellers: [
      {
        id: 'alberto-martinez',
        name: 'Alberto Martínez',
        price: '2.05',
        description: 'Pimentón verde firme y crujiente. Sabor ligeramente amargo ideal para cocina latina, sofritos y guisos.',
        sellerInfo: 'Productor con 8 años de experiencia.',
        location: {
          name: 'La Ciudad del Niño',
          address: 'V68H+CH3, La Chorrera, Panamá',
          embed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3940.5!2d-79.783!3d8.88!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8faca3c3c3c3c3c3%3A0x0!2sLa%20Ciudad%20del%20Ni%C3%B1o!5e0!3m2!1ses!2spa!4v1700000000000',
          directions: 'Mercado comunitario, sección pimentones.'
        },
        reviews: [
          { author: 'Velinda Guitierres', stars: 5, date: 'september 1st, 2026', text: 'Me súper gusto, Amazing!!!!!!!!' }
        ]
      },
      {
        id: 'beatriz-campos',
        name: 'Beatriz Campos',
        price: '2.00',
        description: 'Pimentones verdes de exportación. Calibre grande y uniforme. Empaque en cajas de 5 kg.',
        sellerInfo: 'Comercializadora de vegetales hidropónicos al mayoreo.',
        location: {
          name: 'Arraiján',
          address: 'Arraiján, Panamá Oeste',
          embed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3941!2d-79.65!3d8.95!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sArraij%C3%A1n!5e0!3m2!1ses!2spa!4v1700000000001',
          directions: 'Centro de acopio Arraiján, bodega #7.'
        },
        reviews: [
          { author: 'Distribuidora Fresh', stars: 4, date: 'august 20th, 2026', text: 'Buen calibre para reventa.' }
        ]
      },
      {
        id: 'edgar-wong',
        name: 'Edgar Wong',
        price: '1.80',
        description: 'Pimentón verde asiático de pared delgada. Ideal para salteados wok y cocina oriental. Cocción rápida.',
        sellerInfo: 'Productor especializado en vegetales asiáticos.',
        location: {
          name: 'Panamá Oeste',
          address: 'Vía Centenario, La Chorrera',
          embed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3942!2d-79.70!3d8.92!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sPanam%C3%A1%20Oeste!5e0!3m2!1ses!2spa!4v1700000000002',
          directions: 'Invernadero Wong, km 10 Vía Centenario.'
        },
        reviews: [
          { author: 'Li Wei', stars: 5, date: 'july 30th, 2026', text: 'Authentic taste for stir fry dishes.' }
        ]
      }
    ]
  }
};

/** SVG icono de avatar de usuario */
const SELLER_AVATAR_SVG = '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="8" r="4" fill="#222"/><path d="M4 20c0-4 4-7 8-7s8 3 8 7" fill="#222"/></svg>';

/** SVG icono de chat */
const CHAT_ICON_SVG = '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" stroke="#222" fill="none" stroke-width="1.5"/></svg>';

/** Genera estrellas HTML */
function renderStars(count) {
  let stars = '';
  for (let i = 0; i < 5; i++) {
    stars += i < count ? '★' : '☆';
  }
  return stars;
}
