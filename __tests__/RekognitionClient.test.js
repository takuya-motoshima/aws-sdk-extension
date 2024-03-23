const path = require('path');
const {RekognitionClient, FaceMissingException, MultipleFacesException} = require('../dist/build.common');
const loadEnv = require('./support/loadEnv');

const inputDir = path.join(__dirname, 'input')
let client;
const collection1 = 'xpunkydxcr';
const collection2 = 'jdyluopsaj';
const collection3 = 'ouijucgfjl';
const collection4 = 'jxsjfkndlx';
const collection5 = 'sykcoadhld';
let faceId;

beforeAll(() => {
  return new Promise(async resolve => {
    loadEnv();
    client =  new RekognitionClient({
      accessKeyId: process.env.REKOGNITION_ACCESS_KEY_ID,
      secretAccessKey: process.env.REKOGNITION_SECRET_ACCESS_KEY,
      region: process.env.REKOGNITION_REGION,
    });
    for (let collection of [collection1, collection2, collection3, collection4, collection4, collection5]) {
      try {
        switch (collection) {
        case collection1:
          await client.deleteCollection(collection);
          break;
        case collection2:
        case collection3:
          await client.createCollection(collection);
          break;
        case collection4:
          await client.createCollection(collection);
          await client.indexFace(collection, `${inputDir}/girl1_1.jpg`);
          break;
        case collection5:
          await client.createCollection(collection);
          faceId = await client.indexFace(collection, `${inputDir}/girl1_1.jpg`);
          break;
        }
      } catch {};
    }
    resolve();
  });
});

afterAll(() => {
  return new Promise(async resolve => {
    for (let collection of [collection2, collection4, collection5]) {
      try {
        await client.deleteCollection(collection);
      } catch {};
    }
    resolve();
  });
});

test('Should detect one person from the image', async () => {
  const result = await client.detectFaces(`${inputDir}/one-person.jpg`);
  expect(result.length).toBe(1);
});

test('Should be able to get facial details', async () => {
  const minConfidence = 90;
  const withDetails = true;
  const result = await client.detectFaces(`${inputDir}/one-person.jpg`, minConfidence, withDetails);
  const detail = result[0];
  expect(detail).toHaveProperty('boundingBox.width');
  expect(detail).toHaveProperty('boundingBox.height');
  expect(detail).toHaveProperty('boundingBox.left');
  expect(detail).toHaveProperty('boundingBox.top');
  expect(detail).toHaveProperty('ageRange.high');
  expect(detail).toHaveProperty('ageRange.low');
  expect(detail).toHaveProperty('gender');
  expect(detail).toHaveProperty('emotions.happy');
  expect(detail).toHaveProperty('emotions.surprised');
  expect(detail).toHaveProperty('emotions.fear');
  expect(detail).toHaveProperty('emotions.angry');
  expect(detail).toHaveProperty('emotions.calm');
  expect(detail).toHaveProperty('emotions.confused');
  expect(detail).toHaveProperty('emotions.disgusted');
  expect(detail).toHaveProperty('emotions.sad');
});

test('Should detect three persons from the image', async () => {
  const result = await client.detectFaces(`${inputDir}/three-persons.jpg`);
  expect(result.length).toBe(3);
});

test('The two faces should be the same person', async () => {
  const result = await client.compareFaces(
    `${inputDir}/girl1_1.jpg`,
    `${inputDir}/girl1_2.jpg`
  );
  expect(result >= 90.0).toBe(true);
});

test('The two faces should be different people', async () => {
  const result = await client.compareFaces(
    `${inputDir}/girl2.jpg`,
    `${inputDir}/girl3.jpg`
  );
  expect(result < 90.0).toBe(true);
});

test('Should be able to create collections', async () => {
  await client.createCollection(collection1);
  const list = await client.listCollections();
  expect(list.indexOf(collection1) !== -1).toBe(true);
});

test('Should index faces in the collection', async () => {
  const result = await client.indexFace(collection2, `${inputDir}/girl1_1.jpg`);
  expect(!!result).toBe(true);
});

test('Should return the details of the indexed face', async () => {
  const returnDetails = true;
  const result = await client.indexFace(collection2, `${inputDir}/girl1_1.jpg`, {returnDetails});
  expect(result).toHaveProperty('faceId');
  expect(result).toHaveProperty('ageRange.high');
  expect(result).toHaveProperty('ageRange.low');
  expect(result).toHaveProperty('gender');
  expect(result).toHaveProperty('emotions.happy');
  expect(result).toHaveProperty('emotions.surprised');
  expect(result).toHaveProperty('emotions.fear');
  expect(result).toHaveProperty('emotions.angry');
  expect(result).toHaveProperty('emotions.calm');
  expect(result).toHaveProperty('emotions.confused');
  expect(result).toHaveProperty('emotions.disgusted');
  expect(result).toHaveProperty('emotions.sad');
});

test('Should be able to find faces from the collection', async () => {
  const maxFaces = 1;
  const result = await client.searchFaces(collection4, `${inputDir}/girl1_2.jpg`, {maxFaces});
  expect(result).toHaveProperty('faceId');
  expect(result).toHaveProperty('boundingBox.width');
  expect(result).toHaveProperty('boundingBox.height');
  expect(result).toHaveProperty('boundingBox.left');
  expect(result).toHaveProperty('boundingBox.top');
  expect(result).toHaveProperty('similarity');
});

test('Should be able to find faces from the collection', async () => {
  const maxFaces = 1;
  const result = await client.searchFaces(collection4, `${inputDir}/girl1_2.jpg`, {maxFaces});
  expect(result).toHaveProperty('faceId');
  expect(result).toHaveProperty('boundingBox.width');
  expect(result).toHaveProperty('boundingBox.height');
  expect(result).toHaveProperty('boundingBox.left');
  expect(result).toHaveProperty('boundingBox.top');
  expect(result).toHaveProperty('similarity');
});

test('Should return null if collection is searched using faceless images', async () => {
  const result = await client.searchFaces(collection4, `${inputDir}/no-face.jpg`);
  expect(result).toBe(null);
});

test('If the throwNotFoundFaceException option is enabled and the collection is searched for images without faces, an FaceMissingException exception should be thrown', async () => {
  await expect(client.searchFaces(collection4, `${inputDir}/no-face.jpg`, {throwNotFoundFaceException: true}))
    .rejects
    .toThrow(FaceMissingException);
});

test('If the throwTooManyFaceException option is enabled and an image with multiple faces is searched for in the collection, an MultipleFacesException exception should be thrown', async () => {
  await expect(client.searchFaces(collection4, `${inputDir}/three-persons.jpg`, {throwTooManyFaceException: true}))
    .rejects
    .toThrow(MultipleFacesException);
});

test('Should list indexed faces', async () => {
  const result = await client.listFaces(collection4);
  for (let match of result) {
    expect(match).toHaveProperty('faceId');
    expect(match).toHaveProperty('boundingBox.width');
    expect(match).toHaveProperty('boundingBox.height');
    expect(match).toHaveProperty('boundingBox.left');
    expect(match).toHaveProperty('boundingBox.top');
  }
});

test('Should delete the face from the collection', async () => {
  const res = await client.deleteFaces(collection5, [faceId]);
  expect(res).toBe(true);
});

test('Collection should be deleted', async () => {
  const res = await client.deleteCollection(collection3);
  expect(res).toBe(true);
});
