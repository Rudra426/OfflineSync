import express from 'express';
import { handleSyncAction } from '../controllers/syncController.js';

const router = express.Router();

router.post('/', handleSyncAction);

export default router;
