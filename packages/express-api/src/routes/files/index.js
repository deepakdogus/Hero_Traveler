import express from 'express'

import { hasValidOauth } from '../../middleware'
import videoUpload from './videoUpload';
import videoRemove from './videoRemove';

const router = express.Router()

router.post('/video-upload', hasValidOauth, videoUpload);
router.delete('/video-upload', hasValidOauth, videoRemove);

export default router
