const config = {
    mysql: {
        host: 'localhost',
        user: 'root',
        password: '4332wurx',
        database: 'fe_exam'
    },
    server: {
        port: 3001,
        view: 'ejs'
    },
    session: {
        secret: '1234',
        resave: false,
        saveUninitialized: false,
        expires: 600000,
        maxAge: 3600000
    }
};

module.exports = config;