import express from 'express'
import getAll from './getAll'
import create from './create'

const router = express.Router()

router.get('/', getAll)
router.post('/', create)

export default router
