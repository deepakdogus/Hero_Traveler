import _ from 'lodash'

export default function formatQueryParams(req) {
  const page = parseInt(req.query.page, 10);
  const perPage = parseInt(req.query.perPage || 5, 10);
  const search = req.query.search;
  const query = req.query.query && _.isString(req.query.query) ? JSON.parse(req.query.query) : req.query.query;
  const sort = req.query.sort && _.isString(req.query.sort) ? JSON.parse(req.query.sort) : req.query.sort;
  return {
    page,
    perPage,
    search,
    query,
    sort,
  }
}
