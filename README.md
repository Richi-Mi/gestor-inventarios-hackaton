# 🏪 Frontend de "Calzando a Mexico"

## ⭐ Qué hace
Sistema inteligente de gestión de tienda que integra:
1. **Gestión de inventario local** por tienda
2. **Sistema de ventas** con carrito y recibos PDF
3. **Recomendaciones IA** para optimizar exhibición de productos
4. **Dashboard** para monitoreo de productos e inventario

## 🚀 Cómo ejecutarlo

```bash
# Instalar y ejecutar (usa el que prefieras)
bun install && bun dev
# o
npm install && npm run dev
# o
yarn && yarn dev
```

Abre http://localhost:5173 y navega a:
- `/sales` - Sistema de ventas (principal)
- `/registerProduct` - Alta de productos
- `/products` - Ver/editar inventario

## 🎯 Funcionalidades destacadas

### 1. Sistema de Ventas Inteligente
- Carrito con panel lateral y ajuste de cantidades
- Actualización automática de inventario local
- Generación de recibos PDF
- Recomendaciones IA para optimizar ventas

### 2. Gestión de Inventario Local
- Persistencia por tienda en localStorage
- Edición rápida desde la tabla de productos
- Actualización automática al realizar ventas

### 3. Integración IA
- Analiza inventario + datos históricos
- Sugiere productos para mostrador
- Optimiza exhibición según rotación

## 🔧 Requerimientos técnicos
- Backend en `http://127.0.0.1:3000`
- Node.js / Bun / Yarn instalado
- Para probar: ejecuta los comandos arriba y crea un nuevo usuario.

## 💡 Innovación
- **Gestión híbrida**: Inventario local + datos centralizados
- **IA para retail**: Optimización de exhibición basada en datos
- **UX moderna**: Dark mode, PDF automáticos, panel lateral
- **Sin dependencia backend**: Funciona offline (localStorage)
