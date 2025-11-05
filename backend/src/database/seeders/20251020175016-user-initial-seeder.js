import bcrypt from 'bcryptjs';

export async function up(queryInterface) {
  // senha teste
  const hashedPassword = await bcrypt.hash('User@123', 10);

  await queryInterface.bulkInsert(
    'user',
    [
      {
        login: 'admin',
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
  await queryInterface.bulkDelete('user', { login: 'admin' }, {});
}
