import mongoose, {Schema} from 'mongoose'
import randToken from 'rand-token'
import moment from 'moment'

const oauth = {
	tokens: {
		access: {
			length: 32,
			life: 3600, // 1 hour
		},
		refresh: {
			length: 32,
			life: (3600 * 24 * 90), // 90 days
		},
	},
	clients: {
		'5746f32e39485d1103b31254': {
			name: 'Mobile app',
		},
	},
}

const TokenSchema = new Schema({
  user: {
		type: Schema.Types.ObjectId,
		ref: 'User'
	},
  value: String,
  type: {
    type: String,
    enum: ['access', 'refresh']
  },
  expiresAt: Date
}, {
  toObject: {
    virtuals: true
  },
  toJSON: {
    virtuals: true
  }
})

TokenSchema.statics = {
  findOrCreate(tokenToFind, tokenToCreate) {
    return this.findOne(tokenToFind)
      .then(token => {
        if (!token) {
          return this.create(tokenToCreate)
        } else {
          return token
        }
      })
  },

  findOrAdd(attrs, next) {
    const tokenConfig = oauth.tokens[attrs.type]
    const token = Object.assign({}, attrs, {
      value: randToken.generate(tokenConfig.length),
      expiresAt: moment.utc().add(tokenConfig.life, 'seconds').toDate()
    })

    return this.remove(Object.assign({}, attrs, {
      expiresAt: {
        $lte: moment().utc().add(5, 'minutes').toDate()
      }
    }))
      .then(() => {
        return this.findOrCreate(attrs, token)
      })
      .catch(next)
  }
}

export default mongoose.model('AuthToken', TokenSchema)
