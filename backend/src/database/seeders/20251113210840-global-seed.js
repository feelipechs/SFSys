import bcrypt from 'bcryptjs';

/**
 * Seed global para MySQL + Sequelize (ES Modules)
 * Nome sugerido do arquivo: 202502010001-global-seed.js
 *
 * Observações:
 * - Não cria admin (conforme solicitado).
 * - Assume que o backend/triggers atualizam product.current_stock ao inserir donation_item / distribution_item.
 * - Gera CPFs e CNPJs válidos (algoritmos implementados abaixo).
 */

function pad(n, width = 2) {
  return String(n).padStart(width, '0');
}

function addDays(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

/* ----- Geradores de CPF e CNPJ válidos ----- */
/* Algoritmos baseados nas regras oficiais (dígitos verificadores) */

function generateCPF() {
  const n = Array.from({ length: 9 }, () => Math.floor(Math.random() * 10));
  const calcDigit = (arr, factor) => {
    const sum = arr.reduce((s, v) => s + v * factor--, 0);
    const mod = sum % 11;
    return mod < 2 ? 0 : 11 - mod;
  };
  const d1 = calcDigit(n, 10);
  const d2 = calcDigit([...n, d1], 11);
  return [...n, d1, d2].join('');
}

function generateCNPJ() {
  const n = Array.from({ length: 12 }, () => Math.floor(Math.random() * 10));
  const calc = (arr, factors) => {
    const sum = arr.reduce((s, v, i) => s + v * factors[i], 0);
    const mod = sum % 11;
    return mod < 2 ? 0 : 11 - mod;
  };
  const factors1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  const d1 = calc(n, factors1);
  const factors2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  const d2 = calc([...n, d1], factors2);
  return [...n, d1, d2].join('');
}

/* ----- Helpers de escolha ----- */
function pick(arr, idx) {
  return arr[idx % arr.length];
}

/* ----- Unidades de medida permitidas (exemplos) ----- */
const units = ['kg', 'l', 'un'];

export async function up(queryInterface, Sequelize) {
  const now = new Date();

  /* ---------------------------
     1) USERS (3 managers, 7 volunteers)
     --------------------------- */
  const pwd = await bcrypt.hash('@Senha123', 10);

  const users = [
    {
      email: 'marina.silva@example.com',
      password: pwd,
      name: 'Marina Silva',
      role: 'manager',
      created_at: now,
      updated_at: now,
    },
    {
      email: 'paulo.santana@example.com',
      password: pwd,
      name: 'Paulo Santana',
      role: 'manager',
      created_at: now,
      updated_at: now,
    },
    {
      email: 'renata.martins@example.com',
      password: pwd,
      name: 'Renata Martins',
      role: 'manager',
      created_at: now,
      updated_at: now,
    },

    {
      email: 'joao.pereira@example.com',
      password: pwd,
      name: 'João Pereira',
      role: 'volunteer',
      created_at: now,
      updated_at: now,
    },
    {
      email: 'larissa.almeida@example.com',
      password: pwd,
      name: 'Larissa Almeida',
      role: 'volunteer',
      created_at: now,
      updated_at: now,
    },
    {
      email: 'felipe.rodrigues@example.com',
      password: pwd,
      name: 'Felipe Rodrigues',
      role: 'volunteer',
      created_at: now,
      updated_at: now,
    },
    {
      email: 'camila.ferreira@example.com',
      password: pwd,
      name: 'Camila Ferreira',
      role: 'volunteer',
      created_at: now,
      updated_at: now,
    },
    {
      email: 'gustavo.oliveira@example.com',
      password: pwd,
      name: 'Gustavo Oliveira',
      role: 'volunteer',
      created_at: now,
      updated_at: now,
    },
    {
      email: 'sabrina.dias@example.com',
      password: pwd,
      name: 'Sabrina Dias',
      role: 'volunteer',
      created_at: now,
      updated_at: now,
    },
    {
      email: 'thiago.monteiro@example.com',
      password: pwd,
      name: 'Thiago Monteiro',
      role: 'volunteer',
      created_at: now,
      updated_at: now,
    },
  ];

  await queryInterface.bulkInsert('user', users);

  // recuperar users inseridos
  const userEmails = users.map((u) => u.email);
  const usersInserted = await queryInterface.sequelize.query(
    `SELECT id, email, role FROM user WHERE email IN (:emails)`,
    { replacements: { emails: userEmails }, type: Sequelize.QueryTypes.SELECT },
  );

  /* ---------------------------
     2) CAMPAIGNS (10)
     --------------------------- */
  const campaigns = [
    {
      name: 'Campanha Inverno Solidário',
      start_date: '2025-06-01',
      end_date: '2025-08-01',
      status: 'inProgress',
      created_at: now,
      updated_at: now,
    },
    {
      name: 'Natal com Esperança',
      start_date: '2025-11-10',
      end_date: '2025-12-26',
      status: 'pending',
      created_at: now,
      updated_at: now,
    },
    {
      name: 'Doe Alimentos, Salve Famílias',
      start_date: '2025-04-01',
      end_date: '2025-04-30',
      status: 'finished',
      created_at: now,
      updated_at: now,
    },
    {
      name: 'Ação Contra a Fome',
      start_date: '2025-01-15',
      end_date: '2025-02-20',
      status: 'finished',
      created_at: now,
      updated_at: now,
    },
    {
      name: 'Crianças Primeiro',
      start_date: '2025-03-01',
      end_date: '2025-06-30',
      status: 'inProgress',
      created_at: now,
      updated_at: now,
    },
    {
      name: 'Bem-Estar Comunitário',
      start_date: '2025-05-10',
      end_date: '2025-07-20',
      status: 'pending',
      created_at: now,
      updated_at: now,
    },
    {
      name: 'Todos Pelo Próximo',
      start_date: '2025-02-01',
      end_date: '2025-05-01',
      status: 'canceled',
      created_at: now,
      updated_at: now,
    },
    {
      name: 'Mãos Que Ajudam',
      start_date: '2025-07-01',
      end_date: '2025-09-30',
      status: 'pending',
      created_at: now,
      updated_at: now,
    },
    {
      name: 'Juntos Por Amor',
      start_date: '2025-08-15',
      end_date: '2025-10-10',
      status: 'pending',
      created_at: now,
      updated_at: now,
    },
    {
      name: 'Apoio às Famílias Vulneráveis',
      start_date: '2025-01-02',
      end_date: '2025-03-01',
      status: 'finished',
      created_at: now,
      updated_at: now,
    },
  ];

  await queryInterface.bulkInsert('campaign', campaigns);

  const campaignNames = campaigns.map((c) => c.name);
  const campaignsInserted = await queryInterface.sequelize.query(
    `SELECT id, name FROM campaign WHERE name IN (:names)`,
    {
      replacements: { names: campaignNames },
      type: Sequelize.QueryTypes.SELECT,
    },
  );

  /* ---------------------------
     3) BENEFICIARIES (10)
     --------------------------- */
  const beneficiaries = [
    {
      responsible_name: 'Maria Aparecida de Souza',
      responsible_cpf: generateCPF(),
      registration_date: new Date('2024-01-10'),
      address: 'Rua das Flores, 123 - Jardim Primavera, São Paulo - SP',
      family_members_count: 4,
      created_at: now,
      updated_at: now,
    },
    {
      responsible_name: 'José Carlos dos Santos',
      responsible_cpf: generateCPF(),
      registration_date: new Date('2024-02-05'),
      address: 'Av. Brasil, 450 - Centro, Rio de Janeiro - RJ',
      family_members_count: 3,
      created_at: now,
      updated_at: now,
    },
    {
      responsible_name: 'Ana Paula Ferreira',
      responsible_cpf: generateCPF(),
      registration_date: new Date('2024-03-18'),
      address: 'Rua Belo Horizonte, 88 - Santa Luzia, Belo Horizonte - MG',
      family_members_count: 5,
      created_at: now,
      updated_at: now,
    },
    {
      responsible_name: 'Marcos Vinícius Oliveira',
      responsible_cpf: generateCPF(),
      registration_date: new Date('2024-04-22'),
      address: 'Rua Imperatriz Leopoldina, 900 - Boa Vista, Curitiba - PR',
      family_members_count: 2,
      created_at: now,
      updated_at: now,
    },
    {
      responsible_name: 'Camila Rodrigues Dias',
      responsible_cpf: generateCPF(),
      registration_date: new Date('2024-05-14'),
      address: 'Rua Rio Negro, 301 - Harmonia, Porto Alegre - RS',
      family_members_count: 4,
      created_at: now,
      updated_at: now,
    },
    {
      responsible_name: 'Paulo Henrique Moreira',
      responsible_cpf: generateCPF(),
      registration_date: new Date('2024-06-11'),
      address: 'Rua do Sol, 42 - Boa Viagem, Recife - PE',
      family_members_count: 3,
      created_at: now,
      updated_at: now,
    },
    {
      responsible_name: 'Rita de Cássia Almeida',
      responsible_cpf: generateCPF(),
      registration_date: new Date('2024-07-27'),
      address: 'Av. Sete de Setembro, 512 - Barra, Salvador - BA',
      family_members_count: 6,
      created_at: now,
      updated_at: now,
    },
    {
      responsible_name: 'Gustavo Martins Ribeiro',
      responsible_cpf: generateCPF(),
      registration_date: new Date('2024-08-19'),
      address: 'Rua Independência, 208 - Centro, Florianópolis - SC',
      family_members_count: 2,
      created_at: now,
      updated_at: now,
    },
    {
      responsible_name: 'Luciana Mendes da Silva',
      responsible_cpf: generateCPF(),
      registration_date: new Date('2024-09-30'),
      address: 'Rua das Acácias, 77 - Tambaú, João Pessoa - PB',
      family_members_count: 4,
      created_at: now,
      updated_at: now,
    },
    {
      responsible_name: 'Fábio Torres Lima',
      responsible_cpf: generateCPF(),
      registration_date: new Date('2024-10-25'),
      address: 'Rua das Mangueiras, 210 - Centro, Manaus - AM',
      family_members_count: 3,
      created_at: now,
      updated_at: now,
    },
  ];

  await queryInterface.bulkInsert('beneficiary', beneficiaries);

  const beneficiaryCpfs = beneficiaries.map((b) => b.responsible_cpf);
  const beneficiariesInserted = await queryInterface.sequelize.query(
    `SELECT id, responsible_cpf FROM beneficiary WHERE responsible_cpf IN (:cpfs)`,
    {
      replacements: { cpfs: beneficiaryCpfs },
      type: Sequelize.QueryTypes.SELECT,
    },
  );

  /* ---------------------------
     4) DONORS (5 individual + 5 legal)
     --------------------------- */
  const donors = [
    // individuals
    {
      type: 'individual',
      name: 'Carlos Pereira',
      phone: '11987654321',
      email: 'carlos.pereira@example.com',
      created_at: now,
      updated_at: now,
    },
    {
      type: 'individual',
      name: 'Ana Souza',
      phone: '11988887777',
      email: 'ana.souza@example.com',
      created_at: now,
      updated_at: now,
    },
    {
      type: 'individual',
      name: 'Lucas Almeida',
      phone: '21999998888',
      email: 'lucas.almeida@example.com',
      created_at: now,
      updated_at: now,
    },
    {
      type: 'individual',
      name: 'Mariana Costa',
      phone: '31991112222',
      email: 'mariana.costa@example.com',
      created_at: now,
      updated_at: now,
    },
    {
      type: 'individual',
      name: 'Rafael Gomes',
      phone: '41995554444',
      email: 'rafael.gomes@example.com',
      created_at: now,
      updated_at: now,
    },

    // legal
    {
      type: 'legal',
      name: 'TechCorp Ltda',
      phone: '1133334444',
      email: 'contato@techcorp.com',
      created_at: now,
      updated_at: now,
    },
    {
      type: 'legal',
      name: 'Innova SA',
      phone: '1144445555',
      email: 'suporte@innova.com',
      created_at: now,
      updated_at: now,
    },
    {
      type: 'legal',
      name: 'AlphaSystems ME',
      phone: '1155556666',
      email: 'admin@alphasystems.com',
      created_at: now,
      updated_at: now,
    },
    {
      type: 'legal',
      name: 'Grupo Solaris',
      phone: '1166667777',
      email: 'financeiro@solaris.com',
      created_at: now,
      updated_at: now,
    },
    {
      type: 'legal',
      name: 'Mercury & Co',
      phone: '1177778888',
      email: 'contato@mercuryco.com',
      created_at: now,
      updated_at: now,
    },
  ];

  await queryInterface.bulkInsert('donor', donors);

  const donorEmails = donors.map((d) => d.email);
  const donorsInserted = await queryInterface.sequelize.query(
    `SELECT id, email, type FROM donor WHERE email IN (:emails) ORDER BY id ASC`,
    {
      replacements: { emails: donorEmails },
      type: Sequelize.QueryTypes.SELECT,
    },
  );

  // separar por tipo
  const individualDonors = donorsInserted.filter(
    (d) => d.type === 'individual',
  );
  const legalDonors = donorsInserted.filter((d) => d.type === 'legal');

  // donor_individual
  const donorIndividuals = individualDonors.map((d, i) => ({
    donor_id: d.id,
    cpf: generateCPF(),
    date_of_birth: addDays(new Date('1980-01-01'), i * 365), // datas variadas
    created_at: now,
    updated_at: now,
  }));

  // donor_legal
  const donorLegals = legalDonors.map((d, i) => ({
    donor_id: d.id,
    trade_name: `${d.email.split('@')[0].replace(/\W/g, '')} LTDA`,
    cnpj: generateCNPJ(),
    company_name: `Razão Social ${i + 1}`,
    created_at: now,
    updated_at: now,
  }));

  await queryInterface.bulkInsert('donor_individual', donorIndividuals);
  await queryInterface.bulkInsert('donor_legal', donorLegals);

  /* ---------------------------
     5) PRODUCTS (10) - current_stock = 0.00 (backend updates later)
     --------------------------- */
  const productNames = [
    'Arroz Tipo 1',
    'Feijão Carioca',
    'Óleo de Soja',
    'Açúcar Cristal',
    'Macarrão Espaguete',
    'Leite UHT',
    'Farinha de Trigo',
    'Café Torrado',
    'Enlatados Mix',
    'Sabonete Glicerinado',
  ];

  const products = productNames.map((name, i) => ({
    name,
    unit_of_measurement: pick(units, i),
    current_stock: 0.0,
    created_at: now,
    updated_at: now,
  }));

  await queryInterface.bulkInsert('product', products);

  const productsInserted = await queryInterface.sequelize.query(
    `SELECT id, name FROM product WHERE name IN (:names)`,
    {
      replacements: { names: productNames },
      type: Sequelize.QueryTypes.SELECT,
    },
  );

  /* ---------------------------
     6) DONATIONS (20) + DONATION_ITEMS (1-3 items)
     --------------------------- */
  // Preparo lista de donation observations únicas para recuperar ids depois
  const donationRecords = [];
  const donationObsList = [];

  // arrays fonte para escolhas
  const donorIds = donorsInserted.map((d) => d.id);
  const userIds = usersInserted.map((u) => u.id);
  const campaignIds = campaignsInserted.map((c) => c.id);
  const productIds = productsInserted.map((p) => p.id);
  const beneficiaryIds = beneficiariesInserted.map((b) => b.id);

  // criar 20 doações
  for (let i = 0; i < 20; i++) {
    const donorId = pick(donorIds, i);
    const responsibleUserId = pick(userIds, i + 1); // evitar sempre o mesmo
    const campaignId = i % 5 === 0 ? null : pick(campaignIds, i); // algumas sem campanha
    const dt = addDays(new Date('2025-01-01'), i * 3);
    const obs = `seed_donation_${pad(i)}_${Date.now()}`;

    donationRecords.push({
      date_time: dt,
      observation: obs,
      donor_id: donorId,
      responsible_user_id: responsibleUserId,
      campaign_id: campaignId,
      created_at: now,
      updated_at: now,
    });
    donationObsList.push(obs);
  }

  await queryInterface.bulkInsert('donation', donationRecords);

  // recuperar donations inseridas
  const donationsInserted = await queryInterface.sequelize.query(
    `SELECT id, observation FROM donation WHERE observation IN (:obs)`,
    {
      replacements: { obs: donationObsList },
      type: Sequelize.QueryTypes.SELECT,
    },
  );

  // map donation items (1-3 items por doação)
  const donationItems = [];
  for (let i = 0; i < donationsInserted.length; i++) {
    const donation = donationsInserted[i];
    const itemsCount = 1 + (i % 3); // 1..3
    // escolher produtos distintos para cada donation
    for (let j = 0; j < itemsCount; j++) {
      const product = pick(productIds, i + j);
      const qty = (1 + ((i + j) % 5)) * (j === 0 ? 2 : 1); // quantidades variadas
      const valid =
        (i + j) % 2 === 0 ? addDays(addDays(new Date(), 90), i + j) : null; // validade opcional

      donationItems.push({
        quantity: qty,
        validity: valid,
        donation_id: donation.id,
        product_id: product,
        created_at: now,
        updated_at: now,
      });
    }
  }

  await queryInterface.bulkInsert('donation_item', donationItems);

  /* ---------------------------
     7) DISTRIBUTIONS (20) + DISTRIBUTION_ITEMS (1-2 items)
     --------------------------- */
  const distributionRecords = [];
  const distributionObsList = [];

  for (let i = 0; i < 20; i++) {
    const beneficiaryId = pick(beneficiaryIds, i);
    const responsibleUserId = pick(userIds, i + 2);
    const campaignId = i % 4 === 0 ? null : pick(campaignIds, i + 1);
    const dt = addDays(new Date('2025-01-05'), i * 4);
    const obs = `seed_distribution_${pad(i)}_${Date.now()}`;

    distributionRecords.push({
      date_time: dt,
      quantity_baskets: 1 + (i % 3), // 1..3
      observation: obs,
      beneficiary_id: beneficiaryId,
      responsible_user_id: responsibleUserId,
      campaign_id: campaignId,
      created_at: now,
      updated_at: now,
    });
    distributionObsList.push(obs);
  }

  await queryInterface.bulkInsert('distribution', distributionRecords);

  // recuperar distributions inseridas
  const distributionsInserted = await queryInterface.sequelize.query(
    `SELECT id, observation FROM distribution WHERE observation IN (:obs)`,
    {
      replacements: { obs: distributionObsList },
      type: Sequelize.QueryTypes.SELECT,
    },
  );

  // distribution items (1-2 por distribuição), escolhendo produtos que provavelmente tem estoque (mas lembrando: backend atualiza estoque)
  const distributionItems = [];
  for (let i = 0; i < distributionsInserted.length; i++) {
    const dist = distributionsInserted[i];
    const itemsCount = 1 + (i % 2); // 1..2
    for (let j = 0; j < itemsCount; j++) {
      const product = pick(productIds, i + j + 2);
      const qty = 1 + ((i + j) % 3);
      const valid = (i + j) % 2 === 1 ? addDays(new Date(), 60 + i + j) : null;

      distributionItems.push({
        distribution_id: dist.id,
        product_id: product,
        quantity: qty,
        validity: valid,
        created_at: now,
        updated_at: now,
      });
    }
  }

  await queryInterface.bulkInsert('distribution_item', distributionItems);

  // FIM
  console.log(
    'Global seed executed: users, campaigns, beneficiaries, donors, products, donations, and distributions inserted.',
  );
}

export async function down(queryInterface, Sequelize) {
  // Apagar em ordem inversa para não violar FKs
  await queryInterface.bulkDelete('distribution_item', null, {});
  await queryInterface.bulkDelete('distribution', null, {});
  await queryInterface.bulkDelete('donation_item', null, {});
  await queryInterface.bulkDelete('donation', null, {});
  await queryInterface.bulkDelete('product', null, {});
  await queryInterface.bulkDelete('donor_individual', null, {});
  await queryInterface.bulkDelete('donor_legal', null, {});
  await queryInterface.bulkDelete('donor', null, {});
  await queryInterface.bulkDelete('beneficiary', null, {});
  await queryInterface.bulkDelete('campaign', null, {});
  await queryInterface.bulkDelete('user', null, {});
}
