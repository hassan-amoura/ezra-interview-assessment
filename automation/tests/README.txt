cd automation
npm install
npm run install:browsers
cp .env.example .env.local
npx playwright test tests/happy.path.spec.js --headed
