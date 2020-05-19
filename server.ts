import 'zone.js/dist/zone-node';
import * as axios from 'axios';

import { ngExpressEngine } from '@nguniversal/express-engine';
import * as express from 'express';
import { join } from 'path';

import {  AppServerModule } from './src/main.server';
import { APP_BASE_HREF } from '@angular/common';
import { existsSync } from 'fs';
import { environment } from 'src/environments/environment';

// The Express app is exported so that it can be used by serverless Functions.
export function app() {
  const sendHttp = axios.default;
  const server = express();
  const distFolder = join(process.cwd(), 'dist/api-repository/browser');
  const indexHtml = existsSync(join(distFolder, 'index.original.html')) ? 'index.original.html' : 'index';

  // Our Universal express-engine (found @ https://github.com/angular/universal/tree/master/modules/express-engine)
  server.engine('html', ngExpressEngine({
    bootstrap: AppServerModule,
  }));

  server.set('view engine', 'html');
  server.set('views', distFolder);

  // Example Express Rest API endpoints
  // app.get('/api/**', (req, res) => { });
  // Serve static files from /browser
  server.get('*.*', express.static(distFolder, {
    maxAge: '1y'
  }));

  server.get('/api/:id', (req, res) => {
    const apiId = req.params.id;
    sendHttp({
      method: 'get',
      url: `${environment.URL_API}/v1/restApis/${apiId}`
    }).then((response) => {
      res.render(indexHtml, { req, providers: [{ provide: APP_BASE_HREF, useValue: req.baseUrl }]}, (err, html) => {
        if (err || !html) {
          res.render(indexHtml, { req, providers: [{ provide: APP_BASE_HREF, useValue: '404' }] });
        } else {
          html = html.replace('<script id="metadata" type="application/ld+json"></script>',
          `<script id="metadata" type="application/ld+json">${JSON.stringify(response.data)}</script>`);
          res.status(200).type('html').send(html);
        }
      });
    }).catch((_) => res.render(indexHtml, { req, providers: [{ provide: APP_BASE_HREF, useValue: '404' }] }));
  });
  // All regular routes use the Universal engine
  server.get('*', (req, res) => {
    res.render(indexHtml, { req, providers: [{ provide: APP_BASE_HREF, useValue: req.baseUrl }] });
  });

  return server;
}

function run() {
  const port = process.env.PORT || 4000;

  // Start up the Node server
  const server = app();
  server.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

// Webpack will replace 'require' with '__webpack_require__'
// '__non_webpack_require__' is a proxy to Node 'require'
// The below code is to ensure that the server is run only when not requiring the bundle.
declare const __non_webpack_require__: NodeRequire;
const mainModule = __non_webpack_require__.main;
const moduleFilename = mainModule && mainModule.filename || '';
if (moduleFilename === __filename || moduleFilename.includes('iisnode')) {
  run();
}

export * from './src/main.server';
