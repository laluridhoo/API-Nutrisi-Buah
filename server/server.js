const Hapi = require('@hapi/hapi');
const routes = require('./routes');
require('dotenv').config();

const init = async () => {
    const server = Hapi.server({
        port: process.env.PORT || 8080,
        host: process.env.NODE_ENV !== "production" ? "localhost" : "0.0.0.0",
        routes: {
            cors: true
        }
    });
    server.route(routes);

    await server.start();
    console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

init();
