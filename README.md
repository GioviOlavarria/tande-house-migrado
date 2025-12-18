
# TandeHouse – Frontend
TandeHouse es una aplicación web de comercio electrónico enfocada en la venta de cartas Pokémon TCG.
Este repositorio contiene exclusivamente la capa visual del proyecto, desarrollada con React, responsable de la interfaz de usuario, la navegación y la comunicación con los servicios backend.
Objetivo del proyecto

El objetivo de TandeHouse es ofrecer una plataforma web funcional para la venta de cartas Pokémon, permitiendo a los usuarios navegar por el catálogo de productos, gestionar un carrito de compras, autenticarse en el sistema y realizar pagos a través de una pasarela externa.

## Tecnologías utilizadas
React
JavaScript (ES6+)
HTML5
CSS3
Fetch API


## Funcionalidades
Visualización de productos con imagen, precio y stock
Navegación por la tienda
Carrito de compras
Inicio y cierre de sesión de usuarios
Acceso diferenciado para administradores
Integración con pasarela de pago Flow mediante consumo de API
Comunicación con el backend


El frontend consume servicios REST expuestos por distintos microservicios, los cuales se configuran mediante variables de entorno para facilitar el despliegue en distintos entornos.


USER_API_BASE_URL
PRODUCT_API_BASE_URL
PAYMENT_API_BASE_URL
BILLING_API_BASE_URL

## Despliegue
La aplicación frontend se encuentra desplegada en Vercel, lo que permite un hosting rápido, seguro y con integración continua desde GitHub.