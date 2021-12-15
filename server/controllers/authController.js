const router = require('express').Router();
const { body, validationResult } = require('express-validator');
const { isGuest } = require('../middlewares/guards');


router.post('/register',
    async (req, res) => {
        console.log('post register entered');
        console.log(req)
        const userTrim = req.body.username.trim();
        const passTrim = req.body.password.trim();

        let message = [];
        
        if (message.length > 0) {
            const messageStr = message.join('\n');
            console.log('message LOG-> ', message)

            res.status(400).send(messageStr);
            throw new Error(messageStr);
        }

        try {
            const postRegister = await req.auth.register(userTrim, /*req.body.email.trim(),*/ passTrim);
            console.log("success register")
            res.status(200).send(JSON.stringify(postRegister));

        } catch (err) {
            console.log('register err ->', err.message);

            res.status(400).send(JSON.stringify(err.message))
        }
    }
);

router.post('/login', /*isGuest(),*/ async (req, res) => {
    console.log('post login')
    const userTrim = req.body.username.trim();
    const passTrim = req.body.password.trim();
    console.log('username -> ', userTrim);
    console.log('password -> ', passTrim);


    try {
        const response = await req.auth.login(userTrim, passTrim);
        console.log('login response -> ', response)
        res.status(200).send(JSON.stringify(response))                        //TODO change redirect location

    } catch (err) {
        console.log('login err ->', err.message);

        res.status(400).send(JSON.stringify(err.message))

    }

});

router.post('/getUserById', async (req, res) => {
    console.log('getUserById reques received');
    const id = req.body.id;

    try {
        const response = await req.auth.getUser(req.body.id);
        const data = await response;
        const username = data.username;
        res.status(200).send(JSON.stringify(username));
    } catch (err) {
        res.status(400).send(JSON.stringify(err.message));
    }

});


router.get('/logout', async (req, res) => {
    try {
        await req.auth.logout();
        res.redirect('/');                   //TODO change according project requirements
    } catch (err) {
        console.log(err.message);
        res.render('/');                    //TODO change according project requirements
    }
});

router.get('/ranklist', async (req, res) => {
    console.log('ranklist entered');
    try {
        await Promise.all([
            req.auth.getAllUsers(),
            req.storage.getAllPhotos()
        ])
            .then(response => {
                let users = response[0];
                let photos = response[1];

                let ranklist = {};
                for (const user of users) {
                    let ownPhotos = [];
                    for (const photo of photos) {
                        if (user._id.toString() == photo.owner.toString()) {
                            photo.username = user.username;
                            ownPhotos.push(photo);
                        }
                    }
                    ranklist[user._id] = { ownPhotos, username: user.username, totalLikes: 0 };

                }

                let ranklistArr = Object.entries(ranklist)

                for (const line of ranklistArr) {
                    const owner = line[0];

                    if (line[1].ownPhotos) {
                        //    console.log(line[1].ownPhotos.length > 0)
                        const photosArr = Object.entries(line[1].ownPhotos);

                        let totalLikes = 0;
                        //   console.log('photosArr ->', photosArr)
                        for (const photo of photosArr) {
                            console.log('PHPHPHPHPHPHPHPHPHPHPHPHPHPHPH -> ', photo)
                            totalLikes += photo[1].likes;
                            //         console.log(totalLikes)
                        }
                        ranklist[owner].totalLikes = totalLikes;
                        console.log(`TOTAL LIKES ${totalLikes} added `)
                        //     console.log('test -> ', ranklist[photo.owner])
                    }
                }
                ranklistArr.sort((a, b) => {
                    const totalLikesA = a[1].totalLikes;
                    const totalLikesB = b[1].totalLikes;
                    return totalLikesB - totalLikesA;
                });

                const top3 = ranklistArr.slice(0, 3);
                console.log('TOP 3 -> ', top3);
                res.status(200).send(JSON.stringify(top3));                res.status(200).send(JSON.stringify(top3));
            })
    } catch (err) {
        console.log("ERROR - " + err.message)
        res.status(400).send(JSON.stringify(err.message));
    }

})


module.exports = router;