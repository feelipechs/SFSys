import bcrypt from 'bcryptjs';

export async function up(queryInterface, Sequelize) {
  // A senha para teste é 'Staff@123'
  const hashedPassword = await bcrypt.hash('Staff@123', 10);

  await queryInterface.bulkInsert(
    'staff',
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
  await queryInterface.bulkDelete('staff', { login: 'admin' }, {});
}
