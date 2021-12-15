const { isUser } = require('../middlewares/guards');

const router = require('express').Router();

router.post('/create', isUser(), async (req, res) => {
    console.log('create request received!');

    console.log('req body -> ', req.body);
    let dataPhoto = {
        title: req.body.title.trim(),
        description: req.body.description.trim(),
        imageUrl: req.body.imageUrl.trim(),
        owner: req.body.owner
    }

    try {
        console.log('data->', dataPhoto)
        const photo = await req.storage.createPhoto(dataPhoto);
        res.status(200).send(photo);
    } catch (err) {
        console.log(err)


    }



    /*    let errors = [];
        let dataPlay = {
            _id: req.params.id,
            title: req.body.title.trim(),
            description: req.body.description.trim(),
            imageUrl: req.body.imageUrl.trim(),
            //   isPublic: req.body.public ? true : false,
            owner: req.user._id
        };
    
        if (!dataPlay.title) {
            errors.push('Please enter title');
        }
        // else if (dataPlay.title.length < 4) {
        //     errors.push('Name length must be at least 4 characters long');
        // }
    
        if (!dataPlay.description) {
            errors.push('Please enter description');
        }
        // else if (dataPlay.description.length < 3) {
        //     errors.push('City must be at least 3 characters long')
        // };
    
        if (!dataPlay.imageUrl) {
            errors.push('Please enter image URL');
        } else if (!dataPlay.imageUrl.startsWith('http://') && !dataPlay.imageUrl.startsWith('https://')) {
            errors.push('Please enter valid image URL');
        };
        if (errors.length > 0) {
            const ctx = {
                user: req.user ? true : false,
                username: req.user.username,
                dataPlay,
                errors
            };
            console.log(ctx);
            return res.render('photo/create', ctx);
        }
    
    
        try {
            console.log('data->', dataPlay)
            await req.storage.createPlay(dataPlay);
            res.redirect('/');
        } catch (err) {
            console.log(err)
            const ctx = {
                user: req.user ? true : false,
                username: req.user.username,
                dataPlay,
                errors: err.message
            };
            console.log(ctx)
            res.render('photo/create', ctx);
        }
    
    */
});

router.get('/details/:id',/* isUser(),*/ async (req, res) => {
    console.log('details entered')
    console.log(req.params.id)
    try {
        const dataPhoto = await req.storage.getPhotoById(req.params.id);

        res.status(200).send(dataPhoto)
    } catch (err) {
        res.status(503).send(err);
    }
});

router.post('/edit/:id',/* isUser(),*/ async (req, res) => {
    console.log('post edit entered')
    //console.log(req.body)
    let errors = [];
    console.log(req.body);
    let comment = {};
    if (req.body.comment) {
        comment = {
            username: req.body.comment.username,
            text: req.body.comment.text
        }
    }
    const dataPhoto = {
        title: req.body.title.trim(),
        description: req.body.description.trim(),
        imageUrl: req.body.imageUrl.trim(),
        id: req.body.photoId,
        comment,
    }
    console.log(dataPhoto)
    try {
        const photo = await req.storage.editPhoto(dataPhoto);
        res.status(200).send(photo)
    } catch (err) {
        console.log(err)
        res.status(400).send(err);

    }


});

router.post('/like/:id', async (req, res) => {
    console.log('POST like')
    const userId = req.body.userId;
    const photoId = req.body.photoId;
    try {
        const dataPhoto = await req.storage.likePhoto(userId, photoId);
        res.status(200).send(JSON.stringify(dataPhoto));

    } catch (err) {

        res.status(400).send(JSON.stringify(err.message));

    }

});

router.post('/delete/:id', async (req, res) => {

    try {
        await req.storage.deletePhoto(req.params.id);
        res.status(200).send(JSON.stringify('delete succesfull'));
    } catch (err) {
        console.log(err.message);
        throw new Error(JSON.stringify(err.message));
    }

});

router.get('/recent', async (req, res) => {
    //console.log('recent entered')
    let photos = await req.storage.getAllPhotos();
    console.log('before sort');

    for (const line of photos) {
        console.log(line.createdAt);
    }

    sortedPhotos = photos.sort((a, b) => {

        return a.createdAt.localeCompare(b.createdAt)
    }
    );

    console.log('after sort');

    for (const line of sortedPhotos) {
        console.log(line.createdAt);
    }

    res.status(200).send(photos);
});

router.get('/mostLiked', async (req, res) => {
    let photos = await req.storage.getAllPhotos();

    photos = photos.sort((a, b) => b.likes - a.likes);
    res.status(200).send(photos)
})


module.exports = router;