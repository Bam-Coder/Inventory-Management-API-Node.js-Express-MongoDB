// scripts/setup.js
// Script de configuration initiale de la base de données (création d'utilisateurs de test)

const mongoose = require('mongoose');
const User = require('../models/User');
const logger = require('../utils/logger');

// Configuration des données de test
const TEST_USERS = [
  {
    name: 'Admin',
    email: 'admin@inventory.com',
    password: 'admin123',
    businessName: 'Administration',
    role: 'admin'
  },
  {
    name: 'Utilisateur Test',
    email: 'user@inventory.com',
    password: 'user123',
    businessName: 'Boutique Test',
    role: 'user'
  }
];

// Validation des variables d'environnement
const validateEnvironment = () => {
  const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/inventory_db';
  const port = process.env.PORT || 5003;
  
  logger.info(`🔧 Configuration détectée:`);
  logger.info(`   - MongoDB: ${mongoUri}`);
  logger.info(`   - Port: ${port}`);
  
  return { mongoUri, port };
};

// Création d'un utilisateur de test
const createTestUser = async (userData) => {
  try {
    const existingUser = await User.findOne({ email: userData.email });
    
    if (existingUser) {
      logger.info(`ℹ️ Utilisateur ${userData.email} existe déjà`);
      return existingUser;
    }

    const newUser = await User.create(userData);
    logger.info(`✅ Utilisateur créé: ${userData.email} / ${userData.password}`);
    return newUser;
  } catch (error) {
    logger.error(`❌ Erreur lors de la création de ${userData.email}:`, error.message);
    throw error;
  }
};

// Configuration des données de test
const setupTestData = async () => {
  try {
    logger.info('🚀 Début de la configuration des données de test...');
    
    for (const userData of TEST_USERS) {
      await createTestUser(userData);
    }

    logger.info('🎉 Configuration des données terminée avec succès !');
  } catch (error) {
    logger.error('❌ Erreur lors de la configuration des données:', error.message);
    throw error;
  }
};

// Affichage des informations de connexion
const displayConnectionInfo = (port) => {
  logger.info('\n📚 Informations de connexion:');
  logger.info(`   - API Documentation: http://localhost:${port}/api-docs`);
  logger.info(`   - Health Check: http://localhost:${port}/health`);
  logger.info(`   - Serveur API: http://localhost:${port}`);
  logger.info('\n🔑 Comptes de test créés:');
  logger.info('   - Admin: admin@inventory.com / admin123');
  logger.info('   - User: user@inventory.com / user123');
};

// Fonction principale
const main = async () => {
  try {
    logger.info('🔧 Démarrage du script de configuration...');
    
    // Validation de l'environnement
    const { mongoUri, port } = validateEnvironment();

    // Connexion à MongoDB
    await mongoose.connect(mongoUri);
    logger.info('📦 Connexion à MongoDB établie');

    // Configuration des données de test
    await setupTestData();

    // Affichage des informations
    displayConnectionInfo(port);

    // Fermer la connexion
    await mongoose.connection.close();
    logger.info('🔌 Connexion MongoDB fermée');
    logger.info('✅ Configuration terminée avec succès !');

  } catch (error) {
    logger.error('❌ Erreur fatale:', error.message);
    process.exit(1);
  }
};

// Exécuter si appelé directement
if (require.main === module) {
  main();
}

module.exports = { setupTestData, createTestUser }; 