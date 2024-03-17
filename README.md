# TWTASK

This is the test app with a simple directory structure

## Docker

To build an image

```shell
docker build --pull --rm -f "Dockerfile" -t twtaskapp:latest "." 
```

To run in a new container
```shell
docker run --workdir=/usr/src/app -p 8100:8100 --restart=no --runtime=runc -d twtaskapp:latest
```

This will start server, run tests and serve the report at localhost:8100

## To run and to test

```shell
npm start
```

### See test report.

```shell
open report/index.html
```


## Directory structure

```shell
├── bin
│   └── twtask
├── Dockerfile
├── dockerignore
├── package.json
├── package-lock.json
├── README.md
└── src
    ├── server.suites.js
    └── server.test.js


```
## src/server.suites.js

This is where the tests suites are defined. It details out what to request, how to request it and what to expect/assert from the server response.

It looks something like this.

```js
// The enstire test suite to test the server.
exports.suites = [
    {
        describe: "Authentication",
        request: { page: 1, endpoint: '/players'},
        tests: [{
                describe: "should reject (401) empty username and empty password",
                request: {credentials: {username: '',password: ''}},
                expect: {status: 401}
            } /* Other tests for Auth */]
    }
    /* Other tests for Pagination, Data, API endpoints, etc. */
];
```

## src/server.test.js

This is the main test runner using `Jest`. It imports above declarations and run those tests and reports any failures.

It looks something like this.

```js
// Run all the test suite one by one.
const suites = require('./server.suites.js').suites;
for (const suite of suites) {
	describe(suite.describe, () => {
		const tests = suite.tests;
		for (const testCase of tests) {
			it(testCase.describe, async () => {
                // Make request and assert response
            }
        }
    }
}
```