import { node as createDaemon } from 'springbokjs-daemon';
import fetch from 'node-fetch';
import { strictEqual } from 'assert';

suite('test hello server', function() {
    let daemon = createDaemon([
        '--harmony',
        '--es_staging',
        'lib/index.js',
        '--port',
        5555,
    ]);

    suiteSetup((done) => {
        daemon.start();
        daemon.on('stdout', (data) => {
            let string = data.toString().toLowerCase();
            if (string.indexOf('listening') !== -1) {
                if (done) {
                    done();
                }

                console.log('Server started');
            }
        });
    });

    suiteTeardown(() => {
        daemon.stop();
    });

    test('hello without name', () => {
        return fetch('http://localhost:5555/')
            .then(res => res.text())
            .then(res => {
                strictEqual(res, 'Hello World!');
            });
    });

    test('hello with name', () => {
        return fetch('http://localhost:5555/?name=Chris')
            .then(res => res.text())
            .then(res => {
                strictEqual(res, 'Hello Chris!');
            });
    });
});
