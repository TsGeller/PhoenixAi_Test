import test from 'ava';
import request from 'supertest';
import { app } from '../index.js'; 
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import API_KEY from '../apiKey.js';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

test('POST /image should resize the image and return it', async t => {
  const filePath = path.join(__dirname, './images/phoenixAi.jpeg'); 
  
  const response = await request(app)
    .post('/image')
    .attach('image', fs.readFileSync(filePath), './images/phoenixAi.jpeg')
    .field('width', '200')
    .field('height', '200');

  t.is(response.status, 200);
  t.is(response.headers['content-type'], 'image/jpeg');

  
  const metadata = await sharp(response.body).metadata();
  t.is(metadata.width, 200);
  t.is(metadata.height, 200);
});

test('POST /image should return 400 if no image is provided', async t => {
  const response = await request(app)
    .post('/image')
    .field('width', '200')
    .field('height', '200');

  t.is(response.status, 400);
  t.is(response.text, 'Aucun fichier image trouvé.');
});

test('POST /image should return 400 if width or height is missing', async t => {
  const filePath = path.join(__dirname, './images/phoenixAi.jpeg');
  
  const response = await request(app)
    .post('/image')
    .attach('image', fs.readFileSync(filePath), './images/phoenixAi.jpeg');

  t.is(response.status, 400);
  t.is(response.text, 'Les dimensions sont requises');
});

test('POST /image should return 400 if dimensions are invalid', async t => {
  const filePath = path.join(__dirname, './images/phoenixAi.jpeg');
  
  const response = await request(app)
    .post('/image')
    .attach('image', fs.readFileSync(filePath), 'phoenixAi.jpeg')
    .field('width', 'e')
    .field('height', '0');

  t.is(response.status, 400);
  t.is(response.text, 'Les dimensions sont requises');
});
test('GET /testApiKey should return 200 for valid API key', async t => {
  const response = await request(app)
      .get('/testApiKey')
      .set('x-api-key', API_KEY); 

  t.is(response.status, 200);
  t.is(response.text, 'Clé API valide');
});
test('GET /testApiKey should return 403 for invalid API key', async t => {
  const response = await request(app)
      .get('/testApiKey')
      .set('x-api-key', 'INVALID_API_KEY'); 

  t.is(response.status, 403);
  t.is(response.text, 'Clé API invalide ou manquante');
});

