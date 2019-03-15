import {Category} from '@hero/ht-core'
import formatQueryParams from '../../../utils/formatSearchQueryParams'
import _ from 'lodash'

export default function getAll(req, res) {
  const params = formatQueryParams(req);
  Category.listWithCounts(params).then((data) => {
    return res.json(data);
  });
}
