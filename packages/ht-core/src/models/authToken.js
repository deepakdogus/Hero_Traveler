import mongoose, {Schema} from 'mongoose'
import randToken from 'rand-token'
import moment from 'moment'

const oauth = {
	tokens: {
		access: {
			length: 32,
			life: (3600 * 24 * 365), // 1 year
		},
		refresh: {
			length: 32,
			life: (3600 * 24 * 365),
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
  timestamps: true,
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
      if (!token) return this.create(tokenToCreate)
      else return token
    })
  },

  findOrAdd(attrs) {
    const tokenConfig = oauth.tokens[attrs.type]
    const token = Object.assign({}, attrs, {
      value: randToken.generate(tokenConfig.length),
      expiresAt: moment.utc().add(tokenConfig.life, 'seconds').toDate()
    })
    // Remove tokens that are about to expire
    return this.remove(Object.assign({}, attrs, {
      expiresAt: {
        $lte: moment()
          .utc()
          .add(7, 'days')
          .toDate()
      }
    }))
    .then(() => this.findOrCreate(attrs, token))
  }
}

export default mongoose.model('AuthToken', TokenSchema)
