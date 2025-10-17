import { DataTypes } from 'sequelize'; // Necessário para os Models individuais
import sequelize from '../config/db.js'; // <-- Importa a instância do sequelize que você corrigiu!

// 1. Importa as funções de definição de cada Model (com o .js obrigatório)
// Atualizando as importações para os nomes em inglês


// 2. Inicializa os Models, passando a instância do Sequelize e DataTypes
// O (sequelize) faz a função ser executada e retorna o Model


// 3. Define as Associações (mantido, mas usando os Models traduzidos)
// studentId e courseId já estavam em camelCase, o que é ótimo.


// 4. Exporta tudo
// Atualizando os nomes dos Models no objeto db
const db = {

};

export default db;
