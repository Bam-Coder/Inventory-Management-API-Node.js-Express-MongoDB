const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Inventory Management System API',
      version: '1.0.0',
      description: 'API professionnelle pour la gestion d\'inventaire avec authentification JWT et gestion des stocks en temps réel',
      contact: {
        name: 'API Support',
        email: 'support@inventory-api.com'
      },
    },
    servers: [
      {
        url: process.env.NODE_ENV === 'production' 
          ? 'https://your-production-domain.com/api' 
          : 'http://localhost:5003',
        description: process.env.NODE_ENV === 'production' ? 'Production server' : 'Development server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '507f1f77bcf86cd799439011' },
            name: { type: 'string', example: 'John Doe' },
            email: { type: 'string', format: 'email', example: 'john@example.com' },
            businessName: { type: 'string', example: 'Ma Boutique' },
            role: { type: 'string', enum: ['user', 'admin'], example: 'user' },
            isDeleted: { type: 'boolean', example: false },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },
        Product: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '507f1f77bcf86cd799439012' },
            name: { type: 'string', example: 'Ordinateur portable' },
            description: { type: 'string', example: 'Ordinateur portable gaming' },
            quantity: { type: 'number', example: 10 },
            reorderThreshold: { type: 'number', example: 5 },
            unit: { type: 'string', example: 'pièces' },
            category: { type: 'string', example: 'Électronique' },
            supplier: { type: 'string', example: 'TechCorp' },
            isDeleted: { type: 'boolean', example: false },
            addedBy: { type: 'string', example: '507f1f77bcf86cd799439011' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },
        StockLog: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '507f1f77bcf86cd799439013' },
            productId: { type: 'string', example: '507f1f77bcf86cd799439012' },
            userId: { type: 'string', example: '507f1f77bcf86cd799439011' },
            change: { type: 'number', example: 5 },
            type: { type: 'string', enum: ['in', 'out', 'adjustment'], example: 'in' },
            note: { type: 'string', example: 'Réception de stock' },
            timestamp: { type: 'string', format: 'date-time' }
          }
        },
        Error: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string', example: 'Erreur de validation' },
            errors: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  field: { type: 'string', example: 'email' },
                  message: { type: 'string', example: 'Email invalide' },
                  value: { type: 'string', example: 'invalid-email' }
                }
              }
            }
          }
        }
      },
      responses: {
        BadRequest: {
          description: 'Requête invalide'
        },
        ServerError: {
          description: 'Erreur lors de la récupération des données'
        },
        Unauthorized: {
          description: 'Accès non autorisé'
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ],
    paths: {
      '/auth/register': {
        post: {
          tags: ['Authentification'],
          summary: 'Inscription d\'un nouvel utilisateur',
          description: 'Créer un nouveau compte utilisateur',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['name', 'email', 'password', 'businessName'],
                  properties: {
                    name: { type: 'string', example: 'John Doe' },
                    email: { type: 'string', format: 'email', example: 'john@example.com' },
                    password: { type: 'string', example: 'password123' },
                    businessName: { type: 'string', example: 'Ma Boutique' }
                  }
                }
              }
            }
          },
          responses: {
            201: {
              description: 'Utilisateur créé avec succès',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean', example: true },
                      message: { type: 'string', example: 'Utilisateur créé avec succès' },
                      data: { $ref: '#/components/schemas/User' }
                    }
                  }
                }
              }
            },
            400: { $ref: '#/components/responses/BadRequest' },
            500: { $ref: '#/components/responses/ServerError' }
          }
        }
      },
      '/auth/login': {
        post: {
          tags: ['Authentification'],
          summary: 'Connexion utilisateur',
          description: 'Se connecter avec email et mot de passe',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['email', 'password'],
                  properties: {
                    email: { type: 'string', format: 'email', example: 'john@example.com' },
                    password: { type: 'string', example: 'password123' }
                  }
                }
              }
            }
          },
          responses: {
            200: {
              description: 'Connexion réussie',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean', example: true },
                      message: { type: 'string', example: 'Connexion réussie' },
                      data: { $ref: '#/components/schemas/User' }
                    }
                  }
                }
              }
            },
            401: { $ref: '#/components/responses/Unauthorized' },
            500: { $ref: '#/components/responses/ServerError' }
          }
        }
      },
      '/auth/profile': {
        get: {
          tags: ['Profil Utilisateur'],
          summary: 'Voir son propre profil',
          description: 'Récupérer les informations du profil de l\'utilisateur connecté',
          security: [{ bearerAuth: [] }],
          responses: {
            200: {
              description: 'Profil récupéré avec succès',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean', example: true },
                      message: { type: 'string', example: 'Profil récupéré avec succès' },
                      data: { $ref: '#/components/schemas/User' }
                    }
                  }
                }
              }
            },
            401: { $ref: '#/components/responses/Unauthorized' },
            500: { $ref: '#/components/responses/ServerError' }
          }
        },
        put: {
          tags: ['Profil Utilisateur'],
          summary: 'Modifier son propre profil',
          description: 'Mettre à jour les informations du profil de l\'utilisateur connecté',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    name: { type: 'string', example: 'John Doe' },
                    email: { type: 'string', format: 'email', example: 'john@example.com' },
                    businessName: { type: 'string', example: 'Ma Boutique' }
                  }
                }
              }
            }
          },
          responses: {
            200: {
              description: 'Profil mis à jour avec succès',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean', example: true },
                      message: { type: 'string', example: 'Profil mis à jour avec succès' },
                      data: { $ref: '#/components/schemas/User' }
                    }
                  }
                }
              }
            },
            400: { $ref: '#/components/responses/BadRequest' },
            401: { $ref: '#/components/responses/Unauthorized' },
            500: { $ref: '#/components/responses/ServerError' }
          }
        }
      },
      '/auth/password': {
        put: {
          tags: ['Profil Utilisateur'],
          summary: 'Changer son mot de passe',
          description: 'Modifier le mot de passe de l\'utilisateur connecté',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['currentPassword', 'newPassword'],
                  properties: {
                    currentPassword: { type: 'string', example: 'oldpassword123' },
                    newPassword: { type: 'string', example: 'newpassword123' }
                  }
                }
              }
            }
          },
          responses: {
            200: {
              description: 'Mot de passe modifié avec succès',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean', example: true },
                      message: { type: 'string', example: 'Mot de passe modifié avec succès' }
                    }
                  }
                }
              }
            },
            400: { $ref: '#/components/responses/BadRequest' },
            401: { $ref: '#/components/responses/Unauthorized' },
            500: { $ref: '#/components/responses/ServerError' }
          }
        }
      },
      '/products': {
        post: {
          tags: ['Produits'],
          summary: 'Créer un produit',
          description: 'Créer un nouveau produit pour l\'utilisateur connecté',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Product' }
              }
            }
          },
          responses: {
            201: {
              description: 'Produit créé',
              content: { 'application/json': { schema: { $ref: '#/components/schemas/Product' } } }
            },
            400: { $ref: '#/components/responses/BadRequest' },
            401: { $ref: '#/components/responses/Unauthorized' },
            500: { $ref: '#/components/responses/ServerError' }
          }
        },
        get: {
          tags: ['Produits'],
          summary: 'Lister mes produits',
          description: 'Récupérer tous les produits de l\'utilisateur connecté',
          security: [{ bearerAuth: [] }],
          responses: {
            200: {
              description: 'Liste des produits',
              content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Product' } } } }
            },
            401: { $ref: '#/components/responses/Unauthorized' },
            500: { $ref: '#/components/responses/ServerError' }
          }
        }
      },
      '/products/search': {
        get: {
          tags: ['Produits'],
          summary: 'Rechercher des produits',
          description: 'Recherche avancée de produits par nom, catégorie, fournisseur, etc.',
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: 'name', in: 'query', schema: { type: 'string' }, description: 'Nom du produit' },
            { name: 'category', in: 'query', schema: { type: 'string' }, description: 'Catégorie' },
            { name: 'unit', in: 'query', schema: { type: 'string' }, description: 'Unité' },
            { name: 'supplier', in: 'query', schema: { type: 'string' }, description: 'Fournisseur' },
            { name: 'lowStock', in: 'query', schema: { type: 'string', enum: ['true', 'false'] }, description: 'Stock faible' },
            { name: 'minQty', in: 'query', schema: { type: 'integer' }, description: 'Quantité min' },
            { name: 'maxQty', in: 'query', schema: { type: 'integer' }, description: 'Quantité max' }
          ],
          responses: {
            200: {
              description: 'Liste des produits trouvés',
              content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Product' } } } }
            },
            401: { $ref: '#/components/responses/Unauthorized' },
            500: { $ref: '#/components/responses/ServerError' }
          }
        }
      },
      '/products/low-stock': {
        get: {
          tags: ['Produits'],
          summary: 'Lister les produits en stock faible',
          description: 'Récupérer tous les produits dont le stock est inférieur ou égal au seuil de réapprovisionnement',
          security: [{ bearerAuth: [] }],
          responses: {
            200: {
              description: 'Liste des produits en stock faible',
              content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Product' } } } }
            },
            401: { $ref: '#/components/responses/Unauthorized' },
            500: { $ref: '#/components/responses/ServerError' }
          }
        }
      },
      '/products/stats': {
        get: {
          tags: ['Produits'],
          summary: 'Statistiques d\'inventaire',
          description: 'Obtenir des statistiques sur les produits de l\'utilisateur connecté',
          security: [{ bearerAuth: [] }],
          responses: {
            200: {
              description: 'Statistiques d\'inventaire',
              content: { 'application/json': { schema: { type: 'object', properties: {
                totalProducts: { type: 'integer', example: 10 },
                totalQuantity: { type: 'integer', example: 100 },
                lowStockCount: { type: 'integer', example: 2 },
                categoryStats: { type: 'array', items: { type: 'object', properties: { _id: { type: 'string' }, count: { type: 'integer' } } } }
              } } } }
            },
            401: { $ref: '#/components/responses/Unauthorized' },
            500: { $ref: '#/components/responses/ServerError' }
          }
        }
      },
      '/products/{id}': {
        get: {
          tags: ['Produits'],
          summary: 'Obtenir un produit par ID',
          description: 'Récupérer un produit par son ID',
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'ID du produit' }
          ],
          responses: {
            200: {
              description: 'Produit trouvé',
              content: { 'application/json': { schema: { $ref: '#/components/schemas/Product' } } }
            },
            404: { description: 'Produit non trouvé' },
            401: { $ref: '#/components/responses/Unauthorized' },
            500: { $ref: '#/components/responses/ServerError' }
          }
        },
        put: {
          tags: ['Produits'],
          summary: 'Mettre à jour un produit',
          description: 'Mettre à jour un produit existant',
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'ID du produit' }
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Product' }
              }
            }
          },
          responses: {
            200: {
              description: 'Produit mis à jour',
              content: { 'application/json': { schema: { $ref: '#/components/schemas/Product' } } }
            },
            404: { description: 'Produit non trouvé' },
            401: { $ref: '#/components/responses/Unauthorized' },
            500: { $ref: '#/components/responses/ServerError' }
          }
        },
        delete: {
          tags: ['Produits'],
          summary: 'Supprimer (soft delete) un produit',
          description: 'Marque le produit comme supprimé (isDeleted: true). Accessible par l\'utilisateur ou l\'admin.',
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
          ],
          responses: {
            200: {
              description: 'Produit supprimé (soft delete)',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean', example: true },
                      message: { type: 'string', example: 'Produit supprimé avec succès.' }
                    }
                  }
                }
              }
            },
            404: { $ref: '#/components/responses/BadRequest' }
          }
        }
      },
      '/stock/in': {
        post: {
          tags: ['Stock'],
          summary: 'Entrée de stock',
          description: 'Ajouter du stock à un produit',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['productId', 'quantity'],
                  properties: {
                    productId: { type: 'string', example: '507f1f77bcf86cd799439012' },
                    quantity: { type: 'number', example: 5 },
                    note: { type: 'string', example: 'Réception de stock' }
                  }
                }
              }
            }
          },
          responses: {
            200: { description: 'Stock ajouté', content: { 'application/json': { schema: { $ref: '#/components/schemas/Product' } } } },
            404: { description: 'Produit introuvable' },
            401: { $ref: '#/components/responses/Unauthorized' },
            500: { $ref: '#/components/responses/ServerError' }
          }
        }
      },
      '/stock/out': {
        post: {
          tags: ['Stock'],
          summary: 'Sortie de stock',
          description: 'Retirer du stock pour un produit.',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['productId', 'quantity'],
                  properties: {
                    productId: { type: 'string', example: '507f1f77bcf86cd799439012' },
                    quantity: { type: 'number', example: 2 },
                    note: { type: 'string', example: 'Vente' }
                  }
                }
              }
            }
          },
          responses: {
            200: {
              description: 'Stock retiré',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean', example: true },
                      message: { type: 'string', example: 'Stock retiré' },
                      product: { $ref: '#/components/schemas/Product' },
                      notification: {
                        type: 'object',
                        properties: {
                          type: { type: 'string', example: 'warning' },
                          title: { type: 'string', example: 'Stock faible' },
                          message: { type: 'string', example: 'Attention : le produit "Ordinateur portable" est en stock faible (2 restants) !' }
                        }
                      }
                    }
                  }
                }
              }
            },
            400: { description: 'Stock insuffisant' },
            404: { description: 'Produit introuvable' },
            401: { $ref: '#/components/responses/Unauthorized' },
            500: { $ref: '#/components/responses/ServerError' }
          }
        }
      },
      '/stock/adjust': {
        post: {
          tags: ['Stock'],
          summary: 'Ajuster le stock',
          description: 'Ajuster manuellement la quantité d\'un produit',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['productId', 'newQuantity'],
                  properties: {
                    productId: { type: 'string', example: '507f1f77bcf86cd799439012' },
                    newQuantity: { type: 'number', example: 20 },
                    note: { type: 'string', example: 'Inventaire annuel' }
                  }
                }
              }
            }
          },
          responses: {
            200: { description: 'Stock ajusté avec succès', content: { 'application/json': { schema: { $ref: '#/components/schemas/Product' } } } },
            400: { description: 'ID de produit invalide' },
            404: { description: 'Produit introuvable' },
            401: { $ref: '#/components/responses/Unauthorized' },
            500: { $ref: '#/components/responses/ServerError' }
          }
        }
      },
      '/stock/logs/{productId}': {
        get: {
          tags: ['Stock'],
          summary: 'Logs de stock pour un produit',
          description: 'Récupérer tous les logs de stock pour un produit donné',
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: 'productId', in: 'path', required: true, schema: { type: 'string' }, description: 'ID du produit' }
          ],
          responses: {
            200: { description: 'Liste des logs', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/StockLog' } } } } },
            401: { $ref: '#/components/responses/Unauthorized' },
            500: { $ref: '#/components/responses/ServerError' }
          }
        }
      },
      '/admin/users': {
        get: {
          tags: ['Admin'],
          summary: 'Lister tous les utilisateurs',
          description: 'Récupérer la liste de tous les utilisateurs (admin uniquement)',
          security: [{ bearerAuth: [] }],
          responses: {
            200: { description: 'Liste des utilisateurs', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/User' } } } } },
            401: { $ref: '#/components/responses/Unauthorized' },
            500: { $ref: '#/components/responses/ServerError' }
          }
        }
      },
      '/admin/users/{id}': {
        get: {
          tags: ['Admin'],
          summary: 'Obtenir un utilisateur par ID',
          description: 'Récupérer un utilisateur par son ID (admin uniquement)',
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'ID de l\'utilisateur' }
          ],
          responses: {
            200: { description: 'Utilisateur trouvé', content: { 'application/json': { schema: { $ref: '#/components/schemas/User' } } } },
            404: { description: 'Utilisateur non trouvé' },
            401: { $ref: '#/components/responses/Unauthorized' },
            500: { $ref: '#/components/responses/ServerError' }
          }
        },
        put: {
          tags: ['Admin'],
          summary: 'Mettre à jour un utilisateur',
          description: 'Mettre à jour les informations d\'un utilisateur (admin uniquement)',
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'ID de l\'utilisateur' }
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/User' }
              }
            }
          },
          responses: {
            200: { description: 'Utilisateur mis à jour', content: { 'application/json': { schema: { $ref: '#/components/schemas/User' } } } },
            404: { description: 'Utilisateur non trouvé' },
            400: { description: 'Rôle invalide' },
            401: { $ref: '#/components/responses/Unauthorized' },
            500: { $ref: '#/components/responses/ServerError' }
          }
        },
        delete: {
          tags: ['Admin'],
          summary: 'Supprimer définitivement un utilisateur',
          description: 'Supprimer définitivement un utilisateur (admin uniquement)',
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'ID de l\'utilisateur' }
          ],
          responses: {
            200: { description: 'Utilisateur supprimé définitivement' },
            404: { description: 'Utilisateur non trouvé' },
            401: { $ref: '#/components/responses/Unauthorized' },
            500: { $ref: '#/components/responses/ServerError' }
          }
        }
      },
      '/admin/users/{id}/disable': {
        put: {
          tags: ['Admin'],
          summary: 'Désactiver un utilisateur',
          description: 'Désactiver (soft delete) un utilisateur (admin uniquement)',
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'ID de l\'utilisateur' }
          ],
          responses: {
            200: { description: 'Utilisateur désactivé avec succès' },
            404: { description: 'Utilisateur non trouvé' },
            401: { $ref: '#/components/responses/Unauthorized' },
            500: { $ref: '#/components/responses/ServerError' }
          }
        }
      },
      '/admin/stats': {
        get: {
          tags: ['Admin'],
          summary: 'Statistiques globales',
          description: 'Obtenir des statistiques globales sur les utilisateurs, produits, logs',
          security: [{ bearerAuth: [] }],
          responses: {
            200: { description: 'Statistiques globales', content: { 'application/json': { schema: { type: 'object', properties: {
              totalUsers: { type: 'integer', example: 5 },
              totalProducts: { type: 'integer', example: 20 },
              totalStock: { type: 'integer', example: 200 },
              totalLogs: { type: 'integer', example: 50 }
            } } } } },
            401: { $ref: '#/components/responses/Unauthorized' },
            500: { $ref: '#/components/responses/ServerError' }
          }
        }
      },
      '/export/products': {
        get: {
          tags: ['Export'],
          summary: 'Exporter les produits en CSV',
          description: 'Exporter tous les produits de l\'utilisateur connecté au format CSV',
          security: [{ bearerAuth: [] }],
          responses: {
            200: { description: 'Fichier CSV généré' },
            401: { $ref: '#/components/responses/Unauthorized' },
            500: { $ref: '#/components/responses/ServerError' }
          }
        }
      },
      '/export/logs': {
        get: {
          tags: ['Export'],
          summary: 'Exporter les logs de stock en CSV',
          description: 'Exporter tous les logs de stock de l\'utilisateur connecté au format CSV',
          security: [{ bearerAuth: [] }],
          responses: {
            200: { description: 'Fichier CSV généré' },
            401: { $ref: '#/components/responses/Unauthorized' },
            500: { $ref: '#/components/responses/ServerError' }
          }
        }
      },
      '/export/low-stock': {
        get: {
          tags: ['Export'],
          summary: 'Exporter les produits en stock faible en CSV',
          description: 'Exporter tous les produits en stock faible au format CSV',
          security: [{ bearerAuth: [] }],
          responses: {
            200: { description: 'Fichier CSV généré' },
            401: { $ref: '#/components/responses/Unauthorized' },
            500: { $ref: '#/components/responses/ServerError' }
          }
        }
      },
      '/export/stats': {
        get: {
          tags: ['Export'],
          summary: 'Exporter les statistiques d\'inventaire en CSV',
          description: 'Exporter les statistiques d\'inventaire au format CSV',
          security: [{ bearerAuth: [] }],
          responses: {
            200: { description: 'Fichier CSV généré' },
            401: { $ref: '#/components/responses/Unauthorized' },
            500: { $ref: '#/components/responses/ServerError' }
          }
        }
      },
      '/admin/delete/user/{id}': {
        delete: {
          tags: ['Admin'],
          summary: 'Supprimer définitivement un utilisateur',
          description: 'Suppression irréversible d\'un utilisateur (admin uniquement)',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'string' },
              description: "ID de l'utilisateur"
            }
          ],
          responses: {
            200: {
              description: 'Utilisateur supprimé définitivement.',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      message: { type: 'string', example: 'Utilisateur supprimé définitivement.' }
                    }
                  }
                }
              }
            },
            404: { description: 'Utilisateur introuvable.' }
          }
        }
      },
      '/admin/products/{id}/hard-delete': {
        delete: {
          tags: ['Produits', 'Admin'],
          summary: 'Suppression définitive (hard delete) d\'un produit',
          description: 'Supprime définitivement le produit de la base. Réservé à l\'admin.',
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
          ],
          responses: {
            200: {
              description: 'Produit supprimé définitivement',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean', example: true },
                      message: { type: 'string', example: 'Produit supprimé définitivement.' }
                    }
                  }
                }
              }
            },
            404: { $ref: '#/components/responses/BadRequest' }
          }
        }
      },
      '/admin/audit/logs': {
        get: {
          tags: ['Admin', 'Audit'],
          summary: 'Consulter les logs d\'audit',
          description: 'Retourne les 100 dernières actions admin.',
          security: [{ bearerAuth: [] }],
          responses: {
            200: {
              description: 'Liste des logs',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean', example: true },
                      logs: {
                        type: 'array',
                        items: {
                          type: 'object',
                          properties: {
                            userId: { type: 'object', properties: { name: { type: 'string' }, email: { type: 'string' } } },
                            action: { type: 'string', example: 'delete_product' },
                            details: { type: 'object' },
                            timestamp: { type: 'string', format: 'date-time' }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  },
  apis: ['./routes/*.js', './controllers/*.js']
};

const specs = swaggerJsdoc(options);

module.exports = specs; 