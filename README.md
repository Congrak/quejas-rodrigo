# Oficina Nacional de Quejas contra Rodrigo 🖋️

Formulario para que tu ex radique todas sus quejas sobre ti, y un buzón privado donde tú las lees.

- `/` → el formulario (este link es el que le mandas a ella)
- `/buzon-secreto` → tus quejas, protegidas con contraseña

## Subirlo a GitHub

1. Crea un repositorio nuevo en github.com (por ejemplo `quejas-rodrigo`), vacío.
2. Descomprime el zip, abre una terminal en la carpeta y corre:

```bash
git init
git add .
git commit -m "Oficina de quejas"
git branch -M main
git remote add origin https://github.com/TU-USUARIO/quejas-rodrigo.git
git push -u origin main
```

(O arrastra los archivos a la página del repo con "uploading an existing file".)

## Publicarlo en Vercel

1. En vercel.com → **Add New → Project** → importa el repo. Next.js se detecta solo. Dale **Deploy**.
2. Ve a tu proyecto → pestaña **Storage** → **Create Database** → elige **Upstash for Redis** (plan gratis) → conéctalo al proyecto. Esto agrega solas las variables de conexión.
3. Ve a **Settings → Environment Variables** y agrega `ADMIN_PASSWORD` con la contraseña que quieras.
4. Ve a **Deployments** → los tres puntos del último → **Redeploy** (para que tome las variables).

Listo. Mándale el link principal y entra tú a `tu-sitio.vercel.app/buzon-secreto` para leer.

## Correrlo en tu compu (opcional)

```bash
npm install
cp .env.example .env.local   # y llena los valores
npm run dev
```
