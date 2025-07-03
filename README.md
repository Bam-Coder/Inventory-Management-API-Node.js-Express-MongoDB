# Inventory Management System API

Un système de gestion d'inventaire simple et efficace pour les petites entreprises, développé avec Node.js, Express et MongoDB.

## 🚀 Fonctionnalités

- **Authentification** : Inscription et connexion des utilisateurs
- **Gestion des produits** : CRUD complet pour les produits
- **Gestion des stocks** : Entrées, sorties et ajustements de stock
- **Alertes de stock faible** : Notifications automatiques
- **Suppression soft/hard** : Soft delete (désactivation logique), hard delete (suppression définitive, admin)
- **Audit log** : Historique des actions admin
- **Recherche et filtres** : Recherche par nom, catégorie, quantité, fournisseur
- **Statistiques** : Vue d'ensemble de l'inventaire
- **Export CSV** : Export des données en format CSV
- **Rôles utilisateur** : Utilisateur et administrateur
- **API RESTful** : Documentation Swagger incluse

## 📋 Prérequis

- Node.js (version 16 ou supérieure)
- MongoDB
- npm ou yarn

## 🛠️ Installation

1. **Cloner le repository**
   ```bash
   git clone <repository-url>
   cd inventory-api
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   ```

3. **Configuration de l'environnement**
   ```bash
   cp env.example .env
   ```
   Modifier le fichier `.env` avec vos paramètres.

4. **Démarrer le serveur**
   ```bash
   # Mode développement
   npm run dev

   # Mode production
   npm start
   ```

## 📚 API Endpoints

### Authentification
- `POST /auth/register` - Inscription d'un nouvel utilisateur
- `POST /auth/login` - Connexion utilisateur
- `GET /auth/profile` - Voir son propre profil
- `PUT /auth/profile` - Modifier son propre profil
- `PUT /auth/password` - Changer son mot de passe

### Produits
- `GET /products` - Liste des produits de l'utilisateur
- `POST /products` - Créer un nouveau produit
- `GET /products/:id` - Détails d'un produit
- `PUT /products/:id` - Modifier un produit
- `DELETE /products/:id` - **Soft delete** (désactive le produit, accessible user/admin)
- `DELETE /admin/products/:id/hard-delete` - **Hard delete** (suppression définitive, admin)
- `GET /products/search` - Rechercher des produits
- `GET /products/low-stock` - Produits en stock faible
- `GET /products/stats` - Statistiques d'inventaire

### Stock
- `POST /stock/in` - Entrée de stock
- `POST /stock/out` - Sortie de stock
- `POST /stock/adjust` - Ajustement de stock
- `GET /stock/logs/:productId` - Historique des mouvements

> **Notification stock faible** : Lorsqu'une opération de stock fait passer un produit sous le seuil de réapprovisionnement, la réponse API contient un champ `notification` permettant d'afficher une alerte immédiate à l'utilisateur.

#### Exemple de réponse API (stock faible)
```json
{
  "success": true,
  "message": "Stock retiré",
  "product": { ... },
  "notification": {
    "type": "warning",
    "title": "Stock faible",
    "message": "Attention : le produit \"Ordinateur portable\" est en stock faible (2 restants) !"
  }
}
```

### Export CSV
- `GET /export/products` - Exporter tous les produits
- `GET /export/logs` - Exporter l'historique des mouvements de stock
- `GET /export/low-stock` - Exporter les produits en stock faible
- `GET /export/stats` - Exporter les statistiques d'inventaire

### Administration (Admin uniquement)
- `GET /admin/users` - Liste des utilisateurs
- `GET /admin/user/:id` - Détails d'un utilisateur
- `PUT /admin/user/:id` - Modifier un utilisateur
- `DELETE /admin/user/:id` - Désactiver un utilisateur (**soft delete**)
- `DELETE /admin/delete/user/:id` - Supprimer définitivement un utilisateur (**hard delete**)
- `GET /admin/stats/global` - Statistiques globales
- `GET /admin/audit/logs` - **Logs d'audit admin** (100 dernières actions)

#### Exemple de réponse audit log
```json
{
  "success": true,
  "logs": [
    {
      "userId": { "name": "Admin", "email": "admin@exemple.com" },
      "action": "delete_product",
      "details": { "productId": "...", "name": "Produit X" },
      "timestamp": "2024-05-10T14:23:00.000Z"
    }
  ]
}
```

---

### Suppression d'un produit

- **Soft delete** (`DELETE /products/:id`) : Marque le produit comme supprimé (`isDeleted: true`). Accessible à l'utilisateur ou à l'admin.
- **Hard delete** (`DELETE /admin/products/:id/hard-delete`) : Supprime définitivement le produit de la base. Réservé à l'admin.

#### Exemple de réponse soft delete
```json
{
  "success": true,
  "message": "Produit supprimé avec succès."
}
```

#### Exemple de réponse hard delete
```json
{
  "success": true,
  "message": "Produit supprimé définitivement."
}
```

---

### Logs d'audit (admin)

- `GET /admin/audit/logs` : Retourne les 100 dernières actions admin.

#### Exemple de réponse
```json
{
  "success": true,
  "logs": [
    {
      "userId": { "name": "Admin", "email": "admin@exemple.com" },
      "action": "delete_product",
      "details": { "productId": "...", "name": "Produit X" },
      "timestamp": "2024-05-10T14:23:00.000Z"
    }
  ]
}
```

## 🗄️ Structure de la base de données

### Users
```js
{
  name: String,
  email: String,
  password: String (hashé),
  businessName: String,
  role: 'user' | 'admin',
  isDeleted: Boolean
}
```

### Products
```js
{
  name: String,
  description: String,
  quantity: Number,
  reorderThreshold: Number,
  unit: String,
  category: String,
  supplier: String,
  addedBy: ObjectId (ref: User),
  isDeleted: Boolean
}
```

### StockLogs
```js
{
  productId: ObjectId (ref: Product),
  userId: ObjectId (ref: User),
  change: Number,
  type: 'in' | 'out' | 'adjustment',
  note: String,
  timestamp: Date
}
```

---

## 🔒 Sécurité

- **JWT** pour l'authentification
- **bcrypt** pour le hashage des mots de passe
- **Rate limiting** pour prévenir les abus
- **Helmet** pour les headers de sécurité
- **Validation** des données d'entrée
- **Sanitisation** MongoDB et XSS

---

## 📖 Documentation

La documentation interactive de l'API est disponible à :
```
http://localhost:5003/api-docs

```

## 🧪 Tests

Pour tester l'API manuellement :

1. Démarrer le serveur
2. Utiliser Postman ou un client HTTP
3. Commencer par créer un compte via `/auth/register`
4. Utiliser le token JWT retourné pour les requêtes authentifiées

## 📝 Exemple d'utilisation

### Créer un compte
```bash
curl -X POST http://localhost:5003/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "businessName": "Ma Boutique"
  }'
```

### Créer un produit
```bash
curl -X POST http://localhost:5003/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name": "Ordinateur portable",
    "description": "Ordinateur portable gaming",
    "quantity": 10,
    "reorderThreshold": 5,
    "unit": "pièces",
    "category": "Électronique",
    "supplier": "TechCorp"
  }'
```

### Exporter les produits en CSV
```bash
curl -X GET http://localhost:5003/export/products \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  --output products.csv
```

## 🤝 Contribution

1. Fork le projet
2. Créer une branche pour votre fonctionnalité
3. Commiter vos changements
4. Pousser vers la branche
5. Ouvrir une Pull Request

## 👥 Équipe

- Développement Backend
- Tests et Documentation
- Sécurité et Performance

---

**Note** : Ce projet est conçu pour les petites entreprises ayant besoin d'une solution d'inventaire simple mais efficace. 

---