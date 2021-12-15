const Photo = require('../models/Photo');
const User = require('../models/User');


async function createPhoto(dataPhoto) {
    try {
        console.log(dataPhoto)
        const photo = new Photo(dataPhoto);
        await photo.save();
        return photo;
    } catch (err) {
        throw new Error(err);
    }
}


async function getAllPhotos() {
    const photos = await Photo.find({}).lean();
    return photos;
};


async function getPhotoById(id) {
    const photo = await Photo.findById(id).lean();
    return photo;
};

async function editPhoto(dataPhoto) {
    try {
        let photo = await Photo.findById(dataPhoto.id);
        photo.title = dataPhoto.title;
        photo.description = dataPhoto.description;
        photo.imageUrl = dataPhoto.imageUrl;
        const isEmpty = Object.keys(dataPhoto.comment).length === 0;
        if (!isEmpty) {
            photo.comments.push(dataPhoto.comment);
        }

        return photo.save();
    } catch (err) {
        throw new Error(err);
    }
};

async function deletePhoto(id) {
    try {
        return await Photo.findByIdAndDelete(id);
    } catch (err) {
        throw new Error(err);
    }

};


async function likePhoto(userId, photoId) {

    const photo = await Photo.findById(photoId);

    console.log('photo -> ', photo)
    if (!photo.usersLiked.includes(userId)) {
        photo.usersLiked.push(userId);
        photo.likes++;
        photo.save();
        return photo;

    } else {
        throw new Error('Photo already liked!');
    }



}


module.exports = {
    createPhoto,
    getAllPhotos,
    getPhotoById,
    editPhoto,
    deletePhoto,
    likePhoto
};