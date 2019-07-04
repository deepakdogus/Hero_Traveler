import express from 'express'

import videoUpload from './videoUpload';

const router = express.Router();

router.post('/generate-signature', videoUpload);

export default router
