# 🎬 Proyecto Multicine

![PHP](https://img.shields.io/badge/PHP-8.x-blue)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6-yellow)
![MySQL](https://img.shields.io/badge/MySQL-Database-orange)
![CSS3](https://img.shields.io/badge/CSS3-Styling-blueviolet)
![HTML5](https://img.shields.io/badge/HTML5-Markup-red)
![Status](https://img.shields.io/badge/Status-En%20desarrollo-green)
![License](https://img.shields.io/badge/License-Acad%C3%A9mica-lightgrey)

Aplicación web para la **gestión integral de un complejo multicine**, desarrollada con **JavaScript, PHP y CSS**, que permite administrar cines, salas, películas, pases y venta de entradas, diferenciando funcionalidades según el tipo de usuario.

---

## 📍 Descripción del proyecto

En la ciudad de **Albacete** se han abierto unas nuevas salas de un proyecto **Multicine**.  
El objetivo de esta aplicación es dar respuesta a los requisitos habituales de cualquier complejo cinematográfico moderno, ofreciendo una experiencia completa tanto para **administradores** como para **clientes**.

La aplicación permite:
- Gestionar complejos multicines, salas, películas y pases.
- Visualizar la cartelera diaria del cine.
- Comprar entradas controlando el aforo de las salas.
- Diferenciar accesos y funcionalidades según el rol del usuario.

---

## 🧩 Tecnologías utilizadas

### Frontend
- HTML5  
- CSS3  
- JavaScript (manipulación del DOM)

### Backend
- PHP

---

## 👥 Tipos de usuario

La aplicación distingue entre dos tipos de usuario con funcionalidades diferenciadas:

### 🔐 Administrador
Encargado de la gestión completa del multicine.

### 🎟️ Cliente
Usuario final que consulta la cartelera y compra entradas.

---

## 🏢 Estructura del Multicine

### 🎥 Multicine
- Nombre  
- Ubicación  
- Número de salas  

### 🚪 Sala
- Número identificador  
- Aforo  
- Película asignada  

### 🎞️ Película
- Código  
- Título  
- Género  
- Director/a  
- Actores/actrices principales  
- Fecha de estreno  
- Duración (minutos)  

### ⏰ Pase
- Hora de inicio  
- Hora de fin  
- Número de butacas ocupadas  

---

## ⚙️ Funcionalidades de la aplicación

### 🔑 Autenticación
- Inicio de sesión
- Registro de nuevos clientes
- Redirección automática al login tras el registro

---

## 🛠️ Funcionalidades del Administrador

### 🏢 Gestión de multicines
- Crear un complejo multicine
- Creación automática de las salas según el número indicado
- Visualizar los datos del multicine
- Mostrar salas, películas asignadas y pases disponibles

### 🎞️ Gestión de películas
- Crear películas
- Visualizar información detallada de una película
- Asignar películas a salas

### ⏰ Gestión de pases
- Crear pases para películas asignadas a salas
- Control de solapamiento de horarios
- Control de hora máxima de finalización (23:45)
- Visualización de pases por película y sala

### 🎟️ Gestión de entradas
- Listado de entradas vendidas en un día
- Listado de entradas vendidas entre dos fechas
- Información mostrada:
  - Fecha
  - Sala
  - Película
  - Pases
  - Número de entradas vendidas

---

## 🎬 Funcionalidades del Cliente

- Visualizar la cartelera completa del cine en un día determinado
- Mostrar:
  - Fecha
  - Películas
  - Salas
  - Pases
  - Entradas disponibles
- Comprar entradas para un pase concreto
- Control automático del aforo
- Envío de **correo electrónico de confirmación** tras la compra

---

## 📬 Mensajes al usuario

La aplicación informa al usuario mediante mensajes claros sobre:
- Acciones realizadas correctamente
- Errores de validación
- Acciones no permitidas

---

## 📌 Consideraciones finales

Proyecto desarrollado con los contenidos impartidos en clase.

Se valora especialmente:
- Manipulación correcta del DOM
- Comunicación eficiente cliente-servidor
- Código estructurado y orientado a buenas prácticas
- Separación clara entre:
  - Lógica
  - Presentación
  - Datos

---

## ✨ Autor

👤 **Álvaro Serrano**  
📚 Proyecto académico – Desarrollo de Aplicaciones Web

---
