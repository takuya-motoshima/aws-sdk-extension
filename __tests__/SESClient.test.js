const {SESClient} = require('../dist/build.common');
const loadEnv = require('./support/loadEnv');

let client;

beforeAll(() => {
  loadEnv();
  client =  new SESClient({
    apiVersion: process.env.SES_API_VERSION,
    region: process.env.SES_REGION,
    accessKeyId: process.env.SES_ACCESS_KEY_ID,
    secretAccessKey: process.env.SES_SECRET_ACCESS_KEY,
  });
});

test('Should send email to a valid address', async () => {
  const messageId = await client
    .from(process.env.SES_FROM, 'Sender Name')
    .to(process.env.SES_TO)
    .subject('Test email')
    .body('Hi, this is a test email')
    .send();
  expect(messageId).toBeTruthy();
});