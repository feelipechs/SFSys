import { hashPassword } from '../../utils/security.js';

/**
 * Seed global (ES Modules) — versão atualizada com:
 * - product.category (food, clothing, hygiene, others)
 * - campaign.category (food, clothing, hygiene, others)
 * - password hashing via hashPassword()
 * - address table + beneficiaries referencing address_id
 * - products have unit and perishable flag (validity only for food)
 * - MySQL compatibility (bulkInsert then SELECT for IDs)
 *
 * NÃO cria admin (seed admin fica separada em outro arquivo).
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

function pick(arr, idx) {
  return arr[idx % arr.length];
}

/* ----- Product catalog with category, unit and perishable flag ----- */
const productCatalog = [
  { name: 'Arroz Tipo 1', category: 'food', unit: 'kg', perishable: false },
  { name: 'Feijão Carioca', category: 'food', unit: 'kg', perishable: false },
  {
    name: 'Óleo de Soja',
    category: 'food',
    unit: 'l',
    perishable: false,
  },
  { name: 'Açúcar Cristal', category: 'food', unit: 'kg', perishable: false },
  {
    name: 'Macarrão Espaguete',
    category: 'food',
    unit: 'kg',
    perishable: false,
  },
  { name: 'Leite UHT', category: 'food', unit: 'l', perishable: true },
  {
    name: 'Farinha de Trigo',
    category: 'food',
    unit: 'kg',
    perishable: false,
  },
  {
    name: 'Café Torrado',
    category: 'food',
    unit: 'kg',
    perishable: false,
  },
  {
    name: 'Kit Higiene Pessoal',
    category: 'hygiene',
    unit: 'un',
    perishable: false,
  },
  {
    name: 'Cobertor (Adulto)',
    category: 'clothing',
    unit: 'un',
    perishable: false,
  },
];

/* ----- Campaign categories (will assign categories to campaigns) ----- */
const campaignCategories = ['food', 'clothing', 'hygiene', 'others'];

export async function up(queryInterface, Sequelize) {
  const now = new Date();

  /* ---------------------------
     1) USERS (3 managers, 7 volunteers) — use hashPassword()
     --------------------------- */
  const plainPwd = '@Senha123;'; // conforme solicitado
  // generate hashed password via project's hashPassword
  const hashedPwd = await hashPassword(plainPwd);

  const users = [
    {
      email: 'marina.silva@example.com',
      password: hashedPwd,
      name: 'Marina Silva',
      role: 'manager',
      created_at: now,
      updated_at: now,
    },
    {
      email: 'paulo.santana@example.com',
      password: hashedPwd,
      name: 'Paulo Santana',
      role: 'manager',
      created_at: now,
      updated_at: now,
    },
    {
      email: 'renata.martins@example.com',
      password: hashedPwd,
      name: 'Renata Martins',
      role: 'manager',
      created_at: now,
      updated_at: now,
    },

    {
      email: 'joao.pereira@example.com',
      password: hashedPwd,
      name: 'João Pereira',
      role: 'volunteer',
      created_at: now,
      updated_at: now,
    },
    {
      email: 'larissa.almeida@example.com',
      password: hashedPwd,
      name: 'Larissa Almeida',
      role: 'volunteer',
      created_at: now,
      updated_at: now,
    },
    {
      email: 'felipe.rodrigues@example.com',
      password: hashedPwd,
      name: 'Felipe Rodrigues',
      role: 'volunteer',
      created_at: now,
      updated_at: now,
    },
    {
      email: 'camila.ferreira@example.com',
      password: hashedPwd,
      name: 'Camila Ferreira',
      role: 'volunteer',
      created_at: now,
      updated_at: now,
    },
    {
      email: 'gustavo.oliveira@example.com',
      password: hashedPwd,
      name: 'Gustavo Oliveira',
      role: 'volunteer',
      created_at: now,
      updated_at: now,
    },
    {
      email: 'sabrina.dias@example.com',
      password: hashedPwd,
      name: 'Sabrina Dias',
      role: 'volunteer',
      created_at: now,
      updated_at: now,
    },
    {
      email: 'thiago.monteiro@example.com',
      password: hashedPwd,
      name: 'Thiago Monteiro',
      role: 'volunteer',
      created_at: now,
      updated_at: now,
    },
  ];

  await queryInterface.bulkInsert('user', users);

  const userEmails = users.map((u) => u.email);
  const usersInserted = await queryInterface.sequelize.query(
    `SELECT id, email, role FROM user WHERE email IN (:emails)`,
    { replacements: { emails: userEmails }, type: Sequelize.QueryTypes.SELECT },
  );

  /* ---------------------------
     2) CAMPAIGNS (10) with categories
     --------------------------- */
  const campaigns = [
    {
      name: 'Campanha Inverno Solidário - Alimentos',
      start_date: '2025-06-01',
      end_date: '2025-08-01',
      status: 'inProgress',
      category: 'food',
      created_at: now,
      updated_at: now,
    },
    {
      name: 'Natal com Esperança - Vestuário',
      start_date: '2025-11-10',
      end_date: '2025-12-26',
      status: 'pending',
      category: 'clothing',
      created_at: now,
      updated_at: now,
    },
    {
      name: 'Doe Alimentos, Salve Famílias',
      start_date: '2025-04-01',
      end_date: '2025-04-30',
      status: 'finished',
      category: 'food',
      created_at: now,
      updated_at: now,
    },
    {
      name: 'Ação Contra a Fome',
      start_date: '2025-01-15',
      end_date: '2025-02-20',
      status: 'finished',
      category: 'food',
      created_at: now,
      updated_at: now,
    },
    {
      name: 'Crianças Primeiro - Kits',
      start_date: '2025-03-01',
      end_date: '2025-06-30',
      status: 'inProgress',
      category: 'others',
      created_at: now,
      updated_at: now,
    },
    {
      name: 'Bem-Estar Comunitário',
      start_date: '2025-05-10',
      end_date: '2025-07-20',
      status: 'inProgress',
      category: 'hygiene',
      created_at: now,
      updated_at: now,
    },
    {
      name: 'Todos Pelo Próximo',
      start_date: '2025-02-01',
      end_date: '2025-05-01',
      status: 'canceled',
      category: 'others',
      created_at: now,
      updated_at: now,
    },
    {
      name: 'Mãos Que Ajudam - Distribuição de Cobertores',
      start_date: '2025-07-01',
      end_date: '2025-09-30',
      status: 'pending',
      category: 'clothing',
      created_at: now,
      updated_at: now,
    },
    {
      name: 'Juntos Por Amor - Higiene',
      start_date: '2025-08-15',
      end_date: '2025-10-10',
      status: 'pending',
      category: 'hygiene',
      created_at: now,
      updated_at: now,
    },
    {
      name: 'Apoio às Famílias Vulneráveis',
      start_date: '2025-12-01',
      end_date: '2025-12-15',
      status: 'pending',
      category: 'food',
      created_at: now,
      updated_at: now,
    },
  ];

  await queryInterface.bulkInsert('campaign', campaigns);

  const campaignNames = campaigns.map((c) => c.name);
  const campaignsInserted = await queryInterface.sequelize.query(
    `SELECT id, name, category FROM campaign WHERE name IN (:names)`,
    {
      replacements: { names: campaignNames },
      type: Sequelize.QueryTypes.SELECT,
    },
  );

  /* ---------------------------
     3) ADDRESS (10 realistic addresses)
     --------------------------- */
  const addresses = [
    {
      cep: '01001000',
      state: 'SP',
      city: 'São Paulo',
      neighborhood: 'Sé',
      street: 'Praça da Sé',
      number: 's/n',
      complement: null,
      latitude: -23.55052,
      longitude: -46.633309,
      created_at: now,
      updated_at: now,
    },
    {
      cep: '20040002',
      state: 'RJ',
      city: 'Rio de Janeiro',
      neighborhood: 'Centro',
      street: 'Rua Uruguaiana',
      number: '100',
      complement: 'Sala 12',
      latitude: -22.90556,
      longitude: -43.17778,
      created_at: now,
      updated_at: now,
    },
    {
      cep: '30140071',
      state: 'MG',
      city: 'Belo Horizonte',
      neighborhood: 'Centro',
      street: 'Rua da Bahia',
      number: '200',
      complement: null,
      latitude: -19.9245,
      longitude: -43.9354,
      created_at: now,
      updated_at: now,
    },
    {
      cep: '80010000',
      state: 'PR',
      city: 'Curitiba',
      neighborhood: 'Centro',
      street: 'Rua XV de Novembro',
      number: '150',
      complement: null,
      latitude: -25.4284,
      longitude: -49.2733,
      created_at: now,
      updated_at: now,
    },
    {
      cep: '90010000',
      state: 'RS',
      city: 'Porto Alegre',
      neighborhood: 'Centro Histórico',
      street: 'Rua dos Andradas',
      number: '400',
      complement: null,
      latitude: -30.0277,
      longitude: -51.2287,
      created_at: now,
      updated_at: now,
    },
    {
      cep: '50010100',
      state: 'PE',
      city: 'Recife',
      neighborhood: 'Boa Viagem',
      street: 'Av. Boa Viagem',
      number: '42',
      complement: null,
      latitude: -8.1221,
      longitude: -34.9081,
      created_at: now,
      updated_at: now,
    },
    {
      cep: '40110010',
      state: 'BA',
      city: 'Salvador',
      neighborhood: 'Barra',
      street: 'Av. Sete de Setembro',
      number: '512',
      complement: null,
      latitude: -12.9714,
      longitude: -38.5014,
      created_at: now,
      updated_at: now,
    },
    {
      cep: '88010001',
      state: 'SC',
      city: 'Florianópolis',
      neighborhood: 'Centro',
      street: 'Rua Felipe Schmidt',
      number: '208',
      complement: null,
      latitude: -27.597,
      longitude: -48.5495,
      created_at: now,
      updated_at: now,
    },
    {
      cep: '58039200',
      state: 'PB',
      city: 'João Pessoa',
      neighborhood: 'Tambaú',
      street: 'Rua das Acácias',
      number: '77',
      complement: null,
      latitude: -7.1195,
      longitude: -34.845,
      created_at: now,
      updated_at: now,
    },
    {
      cep: '69005010',
      state: 'AM',
      city: 'Manaus',
      neighborhood: 'Centro',
      street: 'Rua das Mangueiras',
      number: '210',
      complement: null,
      latitude: -3.11866,
      longitude: -60.0212,
      created_at: now,
      updated_at: now,
    },
  ];

  await queryInterface.bulkInsert('address', addresses);

  const addressCeps = addresses.map((a) => a.cep);
  const addressesInserted = await queryInterface.sequelize.query(
    `SELECT id, cep FROM address WHERE cep IN (:ceps)`,
    { replacements: { ceps: addressCeps }, type: Sequelize.QueryTypes.SELECT },
  );

  const addressIdByCep = addressesInserted.reduce((acc, a) => {
    acc[a.cep] = a.id;
    return acc;
  }, {});

  /* ---------------------------
     4) BENEFICIARIES (10) using address_id
     --------------------------- */
  const beneficiaries = [
    {
      responsible_name: 'Maria Aparecida de Souza',
      responsible_cpf: generateCPF(),
      registration_date: new Date('2024-01-10'),
      family_members_count: 4,
      address_id: addressIdByCep['01001000'],
      created_at: now,
      updated_at: now,
    },
    {
      responsible_name: 'José Carlos dos Santos',
      responsible_cpf: generateCPF(),
      registration_date: new Date('2024-02-05'),
      family_members_count: 3,
      address_id: addressIdByCep['20040002'],
      created_at: now,
      updated_at: now,
    },
    {
      responsible_name: 'Ana Paula Ferreira',
      responsible_cpf: generateCPF(),
      registration_date: new Date('2024-03-18'),
      family_members_count: 5,
      address_id: addressIdByCep['30140071'],
      created_at: now,
      updated_at: now,
    },
    {
      responsible_name: 'Marcos Vinícius Oliveira',
      responsible_cpf: generateCPF(),
      registration_date: new Date('2024-04-22'),
      family_members_count: 2,
      address_id: addressIdByCep['80010000'],
      created_at: now,
      updated_at: now,
    },
    {
      responsible_name: 'Camila Rodrigues Dias',
      responsible_cpf: generateCPF(),
      registration_date: new Date('2024-05-14'),
      family_members_count: 4,
      address_id: addressIdByCep['90010000'],
      created_at: now,
      updated_at: now,
    },
    {
      responsible_name: 'Paulo Henrique Moreira',
      responsible_cpf: generateCPF(),
      registration_date: new Date('2024-06-11'),
      family_members_count: 3,
      address_id: addressIdByCep['50010100'],
      created_at: now,
      updated_at: now,
    },
    {
      responsible_name: 'Rita de Cássia Almeida',
      responsible_cpf: generateCPF(),
      registration_date: new Date('2024-07-27'),
      family_members_count: 6,
      address_id: addressIdByCep['40110010'],
      created_at: now,
      updated_at: now,
    },
    {
      responsible_name: 'Gustavo Martins Ribeiro',
      responsible_cpf: generateCPF(),
      registration_date: new Date('2024-08-19'),
      family_members_count: 2,
      address_id: addressIdByCep['88010001'],
      created_at: now,
      updated_at: now,
    },
    {
      responsible_name: 'Luciana Mendes da Silva',
      responsible_cpf: generateCPF(),
      registration_date: new Date('2024-09-30'),
      family_members_count: 4,
      address_id: addressIdByCep['58039200'],
      created_at: now,
      updated_at: now,
    },
    {
      responsible_name: 'Fábio Torres Lima',
      responsible_cpf: generateCPF(),
      registration_date: new Date('2024-10-25'),
      family_members_count: 3,
      address_id: addressIdByCep['69005010'],
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
     5) DONORS (5 individual + 5 legal)
     --------------------------- */
  const donors = [
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

  const individualDonors = donorsInserted.filter(
    (d) => d.type === 'individual',
  );
  const legalDonors = donorsInserted.filter((d) => d.type === 'legal');

  const donorIndividuals = individualDonors.map((d, i) => ({
    donor_id: d.id,
    cpf: generateCPF(),
    date_of_birth: addDays(new Date('1980-01-01'), i * 365),
    created_at: now,
    updated_at: now,
  }));

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
     6) PRODUCTS (10) - current_stock = 0.00, with category + unit + perishable
     --------------------------- */
  const products = productCatalog.map((p) => ({
    name: p.name,
    category: p.category,
    unit_of_measurement: p.unit,
    current_stock: 0.0,
    created_at: now,
    updated_at: now,
  }));

  await queryInterface.bulkInsert('product', products);

  const productNames = products.map((p) => p.name);
  const productsInserted = await queryInterface.sequelize.query(
    `SELECT id, name FROM product WHERE name IN (:names)`,
    {
      replacements: { names: productNames },
      type: Sequelize.QueryTypes.SELECT,
    },
  );

  /* ---------------------------
     7) DONATIONS (20) + DONATION_ITEMS (1-3 items)
     --------------------------- */
  const donationRecords = [];
  const donationObsList = [];

  const donorIds = donorsInserted.map((d) => d.id);
  const userIds = usersInserted.map((u) => u.id);
  const campaignIds = campaignsInserted.map((c) => c.id);
  const productIds = productsInserted.map((p) => p.id);
  const beneficiaryIds = beneficiariesInserted.map((b) => b.id);

  for (let i = 0; i < 20; i++) {
    const donorId = pick(donorIds, i);
    const responsibleUserId = pick(userIds, i + 1);
    const campaignId = i % 5 === 0 ? null : pick(campaignIds, i);
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

  const donationsInserted = await queryInterface.sequelize.query(
    `SELECT id, observation FROM donation WHERE observation IN (:obs)`,
    {
      replacements: { obs: donationObsList },
      type: Sequelize.QueryTypes.SELECT,
    },
  );

  // donation items
  const donationItems = [];
  for (let i = 0; i < donationsInserted.length; i++) {
    const donation = donationsInserted[i];
    const itemsCount = 1 + (i % 3); // 1..3
    for (let j = 0; j < itemsCount; j++) {
      const productIdx = (i + j) % productCatalog.length;
      const product = productIds[productIdx];
      const prodMeta = productCatalog[productIdx];

      const qty = (1 + ((i + j) % 5)) * (j === 0 ? 2 : 1);
      const valid =
        prodMeta.category === 'food' ? addDays(new Date(), 180 + i + j) : null;

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
     8) DISTRIBUTIONS (20) + DISTRIBUTION_ITEMS (1-2 items)
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
      quantity_baskets: 1 + (i % 3),
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

  const distributionsInserted = await queryInterface.sequelize.query(
    `SELECT id, observation FROM distribution WHERE observation IN (:obs)`,
    {
      replacements: { obs: distributionObsList },
      type: Sequelize.QueryTypes.SELECT,
    },
  );

  const distributionItems = [];
  for (let i = 0; i < distributionsInserted.length; i++) {
    const dist = distributionsInserted[i];
    const itemsCount = 1 + (i % 2); // 1..2
    for (let j = 0; j < itemsCount; j++) {
      const productIdx = (i + j + 2) % productCatalog.length;
      const product = productIds[productIdx];
      const prodMeta = productCatalog[productIdx];

      const qty = 1 + ((i + j) % 3);
      const valid =
        prodMeta.category === 'food' ? addDays(new Date(), 90 + i + j) : null;

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

  console.log('Global seed (categories + hashed passwords) executed.');
}

export async function down(queryInterface, Sequelize) {
  // Order inverted to avoid FK violations
  await queryInterface.bulkDelete('distribution_item', null, {});
  await queryInterface.bulkDelete('distribution', null, {});
  await queryInterface.bulkDelete('donation_item', null, {});
  await queryInterface.bulkDelete('donation', null, {});
  await queryInterface.bulkDelete('product', null, {});
  await queryInterface.bulkDelete('donor_individual', null, {});
  await queryInterface.bulkDelete('donor_legal', null, {});
  await queryInterface.bulkDelete('donor', null, {});
  await queryInterface.bulkDelete('beneficiary', null, {});
  await queryInterface.bulkDelete('address', null, {});
  await queryInterface.bulkDelete('campaign', null, {});
  await queryInterface.bulkDelete('user', null, {});
}
