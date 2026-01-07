# Real-Time-Collaborative-Workspace

This is the Real time collaborative workspace with a strong focus on API design, security, performance, and real-time communication.

# Run build and Test

Remove-Item dist -Recurse -Force
Remove-Item node_modules\.cache -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item node_modules\.prisma -Recurse -Force -ErrorAction SilentlyContinue

npx jest --clearCache
npx prisma generate

npm run build
npm test
npm run test:coverage

# To verify run this in order

Remove-Item dist -Recurse -Force
npx jest --clearCache
npx prisma generate
npm run build
npm test

### ▶️ How to USE this Postman collection

1.Start Docker

    docker-compose up --build

2.Import

    Environment JSON
    Collection JSON

3.Select environment → RTCW-Local-Docker

4.Run APIs in order

    Auth → Workspace → Project → Job

5.Watch:

    Worker logs → Kafka job processed
    Mongo → activity logs
    Redis → RBAC cache
