function isUser() {
    console.log('isUser entered')
    return (req, res, next) => {
        console.log ('req.body.token -> ', req.body.token);
        if (req.body.token) {
            console.log("isUser -> user -> ", req.body.token);
            next();
        } else {
            console.log('Unautorized')
            res.status(402).send('Unautorized request');
        }
    };
}

function isGuest() {
    return (req, res, next) => {
        if (!req.user) {
            next();
        } else {
            res.status(401).send({"error": "Unautorized request"})
        }
     };
}

module.exports = {
    isUser,
    isGuest
};