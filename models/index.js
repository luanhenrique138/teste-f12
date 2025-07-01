import fs from 'fs';
import path from 'path';
import Sequelize from 'sequelize';
import process from 'process';
import { fileURLToPath } from 'url';

// --- Substitutos para __filename e __dirname em ES Modules ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// -------------------------------------------------------------

const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';

// --- Importando o JSON de configuração de forma moderna ---
// A sintaxe 'assert' foi atualizada para 'with' em versões mais recentes do Node.js.
import configJson from '../config/config.json' with { type: 'json' };
const config = configJson[env];
// -------------------------------------------------------------

const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

// --- Lendo os arquivos de modelo de forma assíncrona ---
const files = fs
  .readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  });

for (const file of files) {
  // Usamos import() dinâmico, que é a versão ES6 do require() dentro de loops
  const module = await import(path.join('file://', __dirname, file));
  const model = module.default(sequelize, Sequelize.DataTypes);
  db[model.name] = model;
}
// -------------------------------------------------------------

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

// --- Exportando com a sintaxe ES6 ---
export default db;