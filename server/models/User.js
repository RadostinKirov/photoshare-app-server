const { Schema, model } = require('mongoose');


const schema = new Schema({
    username: { type: String, required: true },
    hashedPassword: { type: String, required: true },
    likedPhotos: [{ type: String, default: [] }],
  
});

module.exports = model('User', schema)