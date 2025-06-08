import Koa from 'koa';
import Router from '@koa/router';
import bodyParser from 'koa-bodyparser';
import { createBucket } from './utils/bucket';
import { defineConfig } from '@woovi/common';
import { resolve } from 'path';

const dirPath = resolve(__dirname, '../');
const config = JSON.parse(JSON.stringify(defineConfig(dirPath)));

const app = new Koa();
const router = new Router();
const bucket = createBucket(1, 10);

app.use(bodyParser());

router.get('/bucket', (ctx) => {
  ctx.body = JSON.stringify(bucket) + '\n';
});

app.use(router.routes()).use(router.allowedMethods());

const port = config.SERVER_PORT_LOCAL || 3000;

app.listen(port, () => {
  console.log('Listening in port: ' + port);
});
