const { Schema, model } = require('mongoose');


const schema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    imageUrl: { type: String, required: true },
    createdAt: { type: String, default: new Date() },
    usersLiked: [{ type: String, default: [] }],
    likes: { type: Number, default: 0 },
    owner: { type: Schema.Types.ObjectId, ref: 'User' },
    comments: [{ type: Object, default: [] }]
});

module.exports = model('Photo', schema)