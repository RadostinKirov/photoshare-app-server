const router = require('express').Router();

router.get('/', async (req, res) => {
    console.log('/home requested ')
    
    let photos = await req.storage.getAllPhotos();
 

    res.status(200).send(photos);
});


module.exports = router;