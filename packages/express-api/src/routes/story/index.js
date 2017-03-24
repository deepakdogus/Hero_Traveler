import express from 'express'
import {hasValidOauth} from '../../middleware'
import getAll from './getAll'
import getUser from './getUser'
import create from './create'
import getUserFeed from './getUserFeed'

const router = express.Router()

router.get('/', hasValidOauth, getAll)
router.get('/user/:userId', hasValidOauth, getUser)
router.get('/:id/feed', hasValidOauth, getUserFeed);

router.post('/', hasValidOauth, create)

export default router
