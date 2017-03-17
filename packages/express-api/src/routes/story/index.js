import express from 'express'
import getAll from './getAll'
import create from './create'
import getUserFeed from './getUserFeed'

const router = express.Router()

router.get('/', getAll)
router.get('/:id/feed', getUserFeed);

router.post('/', create)

export default router
