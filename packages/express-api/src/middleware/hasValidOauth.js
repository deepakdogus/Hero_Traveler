import {compose} from 'compose-middleware'

import hasClientId from './hasClientId'
import hasOauthBearer from './hasOauthBearer'
import populatesUser from './populatesUser'

export default compose([
  hasClientId,
  populatesUser,
  hasOauthBearer,
])
