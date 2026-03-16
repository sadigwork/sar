import { execSync } from 'child_process';

function run(cmd: string) {
  console.log(`\n▶ ${cmd}`);
  execSync(cmd, { stdio: 'inherit' });
}

async function main() {
  console.log('\n🧹 Resetting database...\n');

  run(
    'npx prisma migrate reset --force --schema=libs/infrastructure/prisma/prisma/schema.prisma',
  );

  run(
    'npx prisma generate --schema=libs/infrastructure/prisma/prisma/schema.prisma',
  );

  run('npx nx run api:seed');

  run('npx nx run api:seed:generate');

  console.log('\n✅ Database ready\n');
}

main();
