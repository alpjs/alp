import { chmodSync, unlinkSync, createReadStream } from 'fs';
import { createServer as createHttpServer } from 'http';
import { createRequestProcessor } from './processRequest';

export function createServer(app) {
    const publicDir = app.paths.public;

    const socketPath = app.config.get('socketPath');
    const port = app.config.get('port');
    const hostname = app.config.get('hostname');

    app.logger.info(
        'Creating server',
        socketPath ? { socketPath: socketPath } : { port: port },
        { [socketPath ? 'socketPath' : 'port']: ['yellow'] }
    );

    if (socketPath) {
        try {
            unlinkSync(socketPath);
        } catch (err) {
        }
    }

    const server = createHttpServer(createRequestProcessor(app));

    server.listen(socketPath || port, hostname, function() {
        if (socketPath) {
            chmodSync(socketPath, '777');
        }
        app.logger.info(
            'Server listening',
            socketPath ? { socketPath: socketPath } : { port: port },
            { [socketPath ? 'socketPath' : 'port']: ['yellow'] }
        );
    });
}
