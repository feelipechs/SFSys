export async function up(queryInterface) {
  await queryInterface.bulkInsert(
    'beneficiary',
    [
      {
        responsible_name: 'Maria Teste',
        registration_date: new Date(),
        address: 'Rua de Teste, 10',
        family_members_count: 3,
        created_at: new Date(),
        updated_at: new Date(),
      },
      // Adicione mais beneficiários de teste se necessário
    ],
    {},
  );
}

export async function down(queryInterface) {
  // O rollback agora deve usar um campo que seja razoavelmente único, como o nome
  // Mas, como 'responsible_name' pode não ser único, o ideal seria deletar
  // com base no ID se fosse conhecido. Usaremos o nome por simplicidade.
  await queryInterface.bulkDelete(
    'beneficiary',
    { responsible_name: 'Maria Teste' }, // USAR CAMPO QUE SEJA ÚNICO
    {},
  );
}
