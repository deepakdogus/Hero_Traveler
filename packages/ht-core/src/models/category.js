import mongoose from 'mongoose'
import softDelete from 'mongoose-delete'
import slug from 'mongoose-slug-generator'
import Promise from 'bluebird'

export const ModelName = 'Category'

const CategorySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  // slug: {
  //   type: String,
  //   slug: 'title',
  //   unique: true
  // },
  // Default categories are created by the system
  isDefault: {
    type: Boolean,
    default: false
  },
  // Categories can be promoted by admins
  isPromoted: {
    type: Boolean,
    default: false
  },
  image: {
    altText: String,
    original: {
      filename: String,
      path: String,
      width: Number,
      height: Number,
      meta: {
        mimeType: String
      }
    },
    versions: {
      thumbnail240: {
        filename: String,
        path: String,
        width: Number,
        height: Number,
        meta: {
          mimeType: String
        }
      }
    }
  },
  counts: {
    followers: {
      type: Number,
      default: 0
    },
    stories: {
      type: Number,
      default: 0
    }
  },
  featured: {
    type: Boolean,
    default: false
  },
}, {
  timestamps: true,
  toObject: {
    virtuals: true
  },
  toJSON: {
    virtuals: true
  }
})

CategorySchema.statics = {
  list({ page = 1, perPage = 5, search='', sort, query }) {
    let queryToApply = {}

    if (query) {
      queryToApply = query
    }

    if (search !== '') {
      queryToApply['$text'] = { $search: search }
    } 

    let sortToApply = {createdAt: -1}
    if (sort) {
      sortToApply = {
        [sort.fieldName]: sort.order
      }
    }
    return Promise.props({
      count: this.count(queryToApply).exec(),
      data: this.find(queryToApply)
        .skip((page - 1) * perPage)
        .limit(perPage)
        .sort(sortToApply)
          .exec(),
    })
  }
}

CategorySchema.pre('save', function(next) {
  if (this.counts.stories === 10) {
    this.isPromoted = true
  }
  next()
})

CategorySchema.plugin(slug, {truncate: 50})
CategorySchema.plugin(softDelete, {overrideMethods: true})

export default mongoose.model(ModelName, CategorySchema)
