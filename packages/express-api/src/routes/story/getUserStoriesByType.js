import {Story} from '@hero/ht-core'

export default function getUserStoriesByType(req, res) {
    return Story.getUserStoriesByType(req.params.userId, req.query.type)
}