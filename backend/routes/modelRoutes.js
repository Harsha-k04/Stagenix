import express from 'express';
import { getAIDesign } from '../controllers/modelController.js';

const router = express.Router();
router.post('/generate', getAIDesign);
export default router;
