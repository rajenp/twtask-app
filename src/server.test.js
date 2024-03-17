// const axios = require('axios');

// The endpoint to be used for this test. Needs server to be running first.
const BASE_URL = 'http://localhost:8000';

// Creates a basic auth header (base64) for the given username and password.
function createBasicAuthToken(username, password) {
	const token = Buffer.from(`${username}:${password}`, 'utf8').toString('base64');
	return `Basic ${token}`;
}

// Helper to make a request to twtask server. 
async function makeRequest(url, page, username, password) {
	try {
		response = await fetch(`${url}` + (!!page ? `?page=${page}` : ``), {
			headers: {
				Authorization: createBasicAuthToken(username, password)
			}
		})
	} catch (error) {
		response = error.response || { offline: true };
	}
	return response;
}

// Run all the test suite one by one.
const suites = require('./server.suites.js').suites;
for (const suite of suites) {
	describe(suite.describe, () => {
		const tests = suite.tests;
		for (const testCase of tests) {
			it(`${testCase.report.priority}:: ${testCase.describe}`, async () => {
				// read request creds from a test case or else callback to suite
				const { username, password }
					= testCase.request?.credentials || suite.request?.credentials;
				// read request page from a test case or else callback to suite
				let page = testCase.request?.page || suite.request?.page;
				const endpoint = testCase.request?.endpoint || suite.request?.endpoint || '/players';
				const url = BASE_URL + endpoint;
				let response;
				response = await makeRequest(url, page, username, password);

				if (response.offline) {
					throw new Error(`Server offline ? `);
				}
				const expected = testCase.expect;

				try {
					expect(response.status).toBe(expected.status);

					if (expected.status !== 200) return;

					// Data validity check
					let data = await response.json();
					expect(Array.isArray(data)).toBeTruthy();

					// Number of pages to be requested. Default 1 
					let pages = testCase.request.pages || 1;
					debugger;
					while (pages-- > 1) {
						page++;

						const resp = await makeRequest(url, page, username, password);
						expect(resp.status).toBe(expected.status);
						data = [...data, ...await resp.json()];
					}

					// If requested, check data count
					if (expected.count) {
						expect(data.length).toBe(expected.count);
					}

					// If requested, check unique fields 
					const uniqueFields = expected.uniqueFields;
					if (uniqueFields && Array.isArray(uniqueFields)) {
						for (const fieldName of uniqueFields) {
							const fieldValues = data.map(obj => obj[fieldName]);
							const uniqueValues = [...new Set(fieldValues)];
							expect(fieldValues).toStrictEqual(uniqueValues);
						}
					}

					// If requested, check sequential fields
					const sequentialFields = expected.sequentialFields;
					if (sequentialFields && Array.isArray(sequentialFields)) {
						for (const fieldName of sequentialFields) {
							const fieldValues =
								data.map(obj => obj[fieldName]).sort((a, b) => a - b);
							const sequentialValues =
								Array.from(Array(fieldValues.length).keys())
									.sort((a, b) => a - b);

							let missingIds = sequentialValues.filter(x => !fieldValues.includes(x));

							expect(missingIds).toBe([]);
						}
					}

					// If requested, check first entry
					if (expected.firstEntry) {
						expect(data[0]).toEqual(expect.objectContaining(expected.firstEntry));
					}

					// If requested, check last entry
					if (expected.lastEntry) {
						expect(data[data.length - 1]).toEqual(expect.objectContaining(expected.lastEntry));
					}
				} catch (err) {
					const testReport =
						`There's a bug. \n
						 Priority: ${testCase.report.priority}\n
						 Repro Steps \n
						${testCase.report.repro}\n
						-----
		${err}`;

					throw new Error(`${testReport.replace(/\s{2,}/ig, "\n")}`);
				}
			});
		}
	});
}