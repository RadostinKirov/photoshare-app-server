const photo = require('../services/photo');


module.exports = () => (req, res, next) => {
    //TODO import and decorate services
    req.storage = {
        ...photo
    };

    next();
};