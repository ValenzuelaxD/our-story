# API (Node)

Servicio HTTP para el formulario de recados (Turnstile en el servidor, SMTP, CORS y rate limit). Código de referencia solamente: **cómo publicarlo o qué ejecutar en producción no está documentado en este repositorio.**

## Uso local

```bash
cd api
cp .env.example .env
# Completa el .env (los valores reales no entran en Git)
npm install
npm run dev
```

Requiere Node 20+.

## Rutas

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/health` | Health check |
| POST | `/api/recados` | Recado (JSON: `name`, `email`, `message`, `turnstileToken`) |