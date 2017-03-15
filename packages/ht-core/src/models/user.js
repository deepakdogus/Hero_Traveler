import mongoose from 'mongoose'

/*
Adaptation of the Meteor user schema, removing the custom fields found there

TODO:
- add email validator
- decide if the custom fields are necessary to reimplement
 */

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    // fullName: {
    //     type: String,
    //     required: false,
    // },
    // email: {
    //     type: String,
    // },
    // slug: {
    //     type: String,
    // },
    profileAvatar: {
        type: String,
        // default: "default_avatar.png"
    },
//     profileBackground: {
//         type: String,
//         publish: true,
//         optional: true,
//         editableIf: canEdit
//     },
//     profileCaption: {
//         type: String,
//         publish: true,
//         optional: true,
//         editableIf: canEdit
//     },
//     interests: {
//         type: [String],
//         publish: false,
//         optional: true,
//         editableIf: canEdit
//      },
//     heroPoints: {
//         type: Number,
//         publish: false,
//         optional: true
//     },
//     followingCount: {
//         type: Number,
//         publish: true,
//         optional: true
//     },
//     followerCount: {
//         type: Number,
//         publish: true,
//         optional: true
//     },
//     emailHash: {
//         type: String,
//         publish: false,
//         optional: true
//     },
//     //   A blackbox modifiable object to store the user's settings
//     settings: {
//         type: Object,
//         optional: true,
//         editableIf: canEdit,
//         blackbox: true
//     }
})

const User = mongoose.model('User', UserSchema);


export default User