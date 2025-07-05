const express = require('express');
const router = express.Router();

const { protect } = require('../middlewares/auth.middleware');
const { stockIn, stockOut, getStockLogs, getAllStockLogs } = require('../controllers/stock.controller');
const { adjustStock } = require('../controllers/stock.controller');
router.use(protect);

router.post('/in', stockIn);
router.post('/out', stockOut);
router.get('/logs', getAllStockLogs);
router.get('/logs/:productId', getStockLogs);
router.post('/adjust', adjustStock);

module.exports = router;
