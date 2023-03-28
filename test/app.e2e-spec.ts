import { strictEqual } from 'assert';
import fetch from 'node-fetch';

describe('AppController (e2e)', () => {
  it('/ (OPTIONS)', async () => {
    const response = await fetch('http://localhost:3000/', {
      method: 'OPTIONS',
      headers: {
        'Access-Control-Request-Method': 'POST',
        'Access-Control-Request-Headers': 'Content-Type',
        Origin: 'http://localhost:3000',
      },
    });

    strictEqual(response.status, 204);
    strictEqual(
      response.headers.get('Access-Control-Allow-Origin'),
      'http://localhost:3000',
    );
    strictEqual(
      response.headers.get('Access-Control-Allow-Methods'),
      'GET,HEAD,PUT,PATCH,POST,DELETE',
    );
    strictEqual(
      response.headers.get('Access-Control-Allow-Headers'),
      'Content-Type',
    );
  });

  it('/ (POST)', async () => {
    const response = await fetch('http://localhost:3000/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        source: 'extern "C" void control_loop() {}',
      }),
    });

    strictEqual(response.status, 200);
    strictEqual(
      response.headers.get('Content-Type'),
      'application/octet-stream',
    );
  });
});
