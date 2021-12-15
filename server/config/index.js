module.exports = {
    PORT: process.env.PORT || 3030,
    DB_CONNECTION_STRING: process.env.MONGO_CONNECTION_URI || 'mongodb://localhost:27017/PhotoShare' ,   //DB to be changed according to the project requirements
    TOKEN_SECRET: 'this is  my exam_token secret',
    COOKIE_NAME: 'SESSION_TOKEN',
}