import {Story} from '@hero/ht-core'

export default function getUserStoriesByType(req, res) {
    console.log('hitting the direct')
    return Story.getUserStoriesByType(req.params.userId, req.query.type)
}