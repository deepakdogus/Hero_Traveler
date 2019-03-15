import {Guide} from '@hero/ht-core'
import _ from 'lodash'
import formatQueryParams from '../../../utils/formatSearchQueryParams'

export default function getAll(req, res) {
  const params = formatQueryParams(req);
  Guide.getMany(params)
    .then((data) => {
      return res.json({
        data: data.data,
        count: data.count
      });
    });
}
