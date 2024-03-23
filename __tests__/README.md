# About the Test

## Test Preparation
1. Copy `__tests__/.env.sample` to create `__tests__/.env`.
    ```sh
    cp -a __tests__/.env.sample __tests__/.env
    ```
1. Define the environment variables needed to run the tests in `__tests__/.env`.
    |Name|Description|
    |--|--|
    |REKOGNITION_REGION|Amazon Rekognition Region.|
    |REKOGNITION_ACCESS_KEY_ID|Amazon Rekognition access key ID.|
    |REKOGNITION_SECRET_ACCESS_KEY|Amazon Rekognition Secret Access Key.|
    |SES_API_VERSION|Amazon SES Version.|
    |SES_REGION|Amazon SES Region.|
    |SES_ACCESS_KEY_ID|Amazon SES access key ID.|
    |SES_SECRET_ACCESS_KEY|Amazon SES secret access key.|
    |SES_FROM|Amazon SES source email address.|
    |SES_TO|Amazon SES destination email address.|

## Directory structure
```sh
__tests__/
    |-- input                     Test data.
    |-- support                   Utilities.
    |-- .env.sample               Sample environment variables.
    |-- RekognitionClient.test.js Amazon Rekognition Client test.
    `-- SESClient.test.js         Amazon SES Client test.
```

## Evidence (2024/3/24)
```sh
$ npm test

> aws-sdk-extension@1.0.0 test
> jest

 PASS  __tests__/RekognitionClient.test.js (5.906 s)
  ✓ Should detect one person from the image (339 ms)
  ✓ Should be able to get facial details (361 ms)
  ✓ Should detect three persons from the image (422 ms)
  ✓ The two faces should be the same person (115 ms)
  ✓ The two faces should be different people (156 ms)
  ✓ Should be able to create collections (73 ms)
  ✓ Should index faces in the collection (329 ms)
  ✓ Should return the details of the indexed face (271 ms)
  ✓ Should be able to find faces from the collection (238 ms)
  ✓ Should be able to find faces from the collection (215 ms)
  ✓ Should return null if collection is searched using faceless images (50 ms)
  ✓ If the throwNotFoundFaceException option is enabled and the collection is searched for images without faces, an FaceMissingException exception should be thrown (700 ms)
  ✓ If the throwTooManyFaceException option is enabled and an image with multiple faces is searched for in the collection, an MultipleFacesException exception should be thrown (417 ms)
  ✓ Should list indexed faces (22 ms)
  ✓ Should delete the face from the collection (36 ms)
  ✓ Collection should be deleted (78 ms)

 PASS  __tests__/SESClient.test.js
  ✓ Should send email to a valid address (425 ms)

Test Suites: 2 passed, 2 total
Tests:       17 passed, 17 total
Snapshots:   0 total
Time:        6.83 s
Ran all test suites.
```