import {compose} from 'compose-middleware'

import hasClientId from './hasClientId'
import hasOauthBearer from './hasOauthBearer'

export default compose([
  hasClientId,
  hasOauthBearer
])
