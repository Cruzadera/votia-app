# AskUs Backend

- Ejecutar: npm install && npm run prisma:generate && npm run prisma:migrate && npm run start
- Configuración de base de datos: copiar .env.example a .env y ajustar (o usar prisma/.env para sqlite local)
- Rack del cron: node-cron se dispara a las 00:01 cada día

Prisma:
- Archivo: prisma/schema.prisma
- DB local muy simple: sqlite en file:./dev.db

Endpoints básicos:
- POST /api/users
- POST /api/groups
- POST /api/groups/join
- GET /api/groups/:groupId/results
- GET /api/daily-questions/:groupId
- POST /api/questions
- POST /api/answers
