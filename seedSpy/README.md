# Seed Spy

## Commandes pour le docker

```bash
docker compose -f docker-compose.yml up -d --build
# Le container lance automatiquement le front / api
```

Pour lancer manuellement 

```bash
# Le front en dev
npm -w packages/frontend run dev
# Le front en 'prod'
npm -w packages/frontend run build && npm -w packages/frontend run preview

# le back
npm -w packages/backend run dev
```

## Writeup
voir pdf