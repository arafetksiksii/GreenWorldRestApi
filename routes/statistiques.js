import express from 'express';
import { getUserDechetsStats } from  "../controllers/statistique.js";

const router = express.Router();

// ... autres routes

router.get('/stats/user-dechets', getUserDechetsStats);

export default router;