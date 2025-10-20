import bcrypt from 'bcryptjs';

export async function up(queryInterface, Sequelize) {
  // A senha para teste é 'Cliente@123'
  const hashedPassword = await bcrypt.hash('Cliente@123', 10);

  await queryInterface.bulkInsert(
    'beneficiary',
    [
      {
        email: 'cliente@teste.com',
        password: hashedPassword,
        responsible_name: 'Maria Teste',
        registration_date: new Date(),
        address: 'Rua de Teste, 10',
        family_members_count: 3,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ],
    {},
  );
}

export async function down(queryInterface) {
  await queryInterface.bulkDelete(
    'beneficiary',
    { email: 'cliente@teste.com' },
    {},
  );
}
