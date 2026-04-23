# Supabase Setup

1. Crea tu proyecto en Supabase.
2. Ve a `SQL Editor`.
3. Pega y ejecuta `supabase/initial_schema.sql`.
4. Copia tus valores reales en un archivo `.env` local:

```env
VITE_SUPABASE_URL=https://TU_PROYECTO.supabase.co
VITE_SUPABASE_ANON_KEY=TU_ANON_KEY
```

5. Reinicia `vite` si estaba corriendo.

## Que crea este esquema

- Multi-tenant base para gimnasios
- Paginas del sitio por gimnasio con plantillas base
- Usuarios y perfiles ligados a `auth.users`
- Staff por gym y roles
- Socios, planes, membresias, pagos, check-ins y reservas
- App store interno con `apps_catalog` y activacion por gym
- RPCs para crear gimnasios y encender modulos desde el admin
- Soporte inicial para red de gimnasios adheridos a futuro
- RLS base para no exponer datos entre gimnasios

## Primer flujo sugerido

1. Crear un usuario owner desde Supabase Auth.
2. Insertar un gym cuyo `owner_user_id` sea ese usuario.
3. Insertar un `gym_users` con rol `gym_owner`.
4. Crear una sede en `gym_locations`.
5. Crear planes en `membership_plans`.
6. Empezar a cargar socios y pagos.
7. Cargar paginas como Inicio, Planes, Clases y Contacto desde el admin del SaaS.

## Nota

Si ya habias ejecutado una version anterior del esquema, vuelve a correr `supabase/initial_schema.sql` para agregar las tablas y funciones nuevas del admin.
