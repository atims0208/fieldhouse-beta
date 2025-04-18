"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const productController_1 = __importDefault(require("../controllers/productController"));
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.get('/', productController_1.default.getAllProducts);
router.get('/:productId', productController_1.default.getProductById);
router.get('/user/:username', productController_1.default.getProductsByUser);
router.post('/', auth_1.authenticate, productController_1.default.createProduct);
router.put('/:productId', auth_1.authenticate, productController_1.default.updateProduct);
router.delete('/:productId', auth_1.authenticate, productController_1.default.deleteProduct);
router.get('/dashboard/my-products', auth_1.authenticate, productController_1.default.getMyProducts);
exports.default = router;
//# sourceMappingURL=productRoutes.js.map