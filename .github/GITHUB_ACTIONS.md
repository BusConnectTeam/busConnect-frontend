# GitHub Actions Setup

Este proyecto utiliza GitHub Actions para CI/CD automático.

## Workflows Configurados

### 1. CI/CD Pipeline (`ci.yml`)
Se ejecuta en:
- Push a `main` o `develop`
- Pull requests a `main` o `develop`

**Pasos:**
- ✅ Checkout del código
- ✅ Instalación de dependencias
- ✅ Linting con ESLint
- ✅ Verificación de tipos con TypeScript
- ✅ Build de la aplicación Next.js
- 📦 Upload de artefactos de build

### 2. PR Checks (`pr-checks.yml`)
Se ejecuta en pull requests y añade un comentario automático cuando pasa todas las verificaciones.

## Configuración de Secrets

Para que GitHub Actions funcione correctamente, necesitas configurar los siguientes secrets en tu repositorio:

### Ir a: `Settings` → `Secrets and variables` → `Actions` → `New repository secret`

#### Secrets requeridos:

1. **NEXT_PUBLIC_API_URL**
   - Descripción: URL de tu API backend
   - Ejemplo: `https://busconnect-api.onrender.com`
   - Uso: Variable de entorno para el build

2. **RENDER_DEPLOY_HOOK_URL** (Opcional - para auto-deploy)
   - Descripción: Webhook URL de Render para deploy automático
   - Obtenerlo de: Render Dashboard → Your Service → Settings → Deploy Hook
   - Ejemplo: `https://api.render.com/deploy/srv-xxxxx?key=yyyyy`

## Cómo obtener el Deploy Hook de Render

1. Ve a [Render Dashboard](https://dashboard.render.com/)
2. Selecciona tu servicio
3. Ve a `Settings`
4. Busca la sección `Deploy Hook`
5. Copia la URL
6. Pégala en GitHub Secrets como `RENDER_DEPLOY_HOOK_URL`

## Activar Auto-Deploy a Render

Para activar el deploy automático cuando se hace push a `main`:

1. Descomenta el job `deploy` en `.github/workflows/ci.yml`
2. Configura el secret `RENDER_DEPLOY_HOOK_URL`
3. Haz push a `main`

```yaml
# En ci.yml, descomenta estas líneas:
deploy:
  name: Deploy to Render
  needs: lint-and-build
  runs-on: ubuntu-latest
  if: github.ref == 'refs/heads/main' && github.event_name == 'push'
  
  steps:
    - name: Trigger Render Deploy
      run: |
        curl -X POST ${{ secrets.RENDER_DEPLOY_HOOK_URL }}
```

## Verificar Status de los Workflows

Después de hacer push, puedes ver el progreso en:
- Pestaña `Actions` en tu repositorio de GitHub
- O en el badge del PR

## Badges para README

Puedes añadir estos badges a tu README.md principal:

```markdown
![CI/CD](https://github.com/BusConnectTeam/busConnect-frontend/workflows/CI%2FCD%20Pipeline/badge.svg)
![PR Checks](https://github.com/BusConnectTeam/busConnect-frontend/workflows/PR%20Checks/badge.svg)
```

## Flujo de Trabajo Recomendado

1. Crea una rama para tu feature: `git checkout -b feature/nueva-funcionalidad`
2. Haz tus cambios y commits
3. Push a GitHub: `git push origin feature/nueva-funcionalidad`
4. Crea un Pull Request
5. GitHub Actions ejecutará automáticamente todas las verificaciones
6. Si todo pasa ✅, el PR está listo para merge
7. Al hacer merge a `main`, se desplegará automáticamente a Render (si está activado)

## Troubleshooting

### Error: "npm ci can only install packages when your package.json and package-lock.json are in sync"
- Solución: Haz `npm install` localmente y commitea el `package-lock.json` actualizado

### Error en el build
- Verifica que todas las variables de entorno estén configuradas
- Revisa los logs en la pestaña Actions de GitHub

### Deploy hook no funciona
- Verifica que el secret `RENDER_DEPLOY_HOOK_URL` esté correctamente configurado
- Verifica que el servicio en Render esté activo
