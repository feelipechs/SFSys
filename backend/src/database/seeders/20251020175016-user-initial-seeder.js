import { hashPassword } from '../../utils/security.js';

const ADMIN_PASSWORD = process.env.ADMIN_INITIAL_PASSWORD;
const ADMIN_EMAIL = process.env.ADMIN_INITIAL_EMAIL;

export async function up(queryInterface) {
  if (!ADMIN_PASSWORD) {
    console.error(
      'AVISO: ADMIN_INITIAL_PASSWORD não definida. Ignorando seed do Admin.',
    );
    return;
  }

  const hashedPassword = await hashPassword(ADMIN_PASSWORD);

  await queryInterface.bulkInsert(
    'user',
    [
      {
        email: ADMIN_EMAIL,
        password: hashedPassword,
        name: 'Admin',
        role: 'admin',
        created_at: new Date(),
        updated_at: new Date(),
      },
    ],
    {},
  );
}

export async function down(queryInterface) {
  // ajustar a exclusão para usar o campo 'email'
  await queryInterface.bulkDelete('user', { email: ADMIN_EMAIL }, {});
}
