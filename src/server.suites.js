// The entire test suite to test the server.
exports.suites = [
    {
        describe: "Authentication",
        request: {
            page: 1,
            endpoint: '/players'
        },
        tests: [
            {
                describe: "should reject (401) empty username and empty password",
                report: {
                    priority: 'p0',
                    repro:
                        `
                        1. Make a request to valid server enpdoint
                        2. Send empty username and password
                        3. Expect that server rejects the request with an error code of 401
                        `

                },
                request: {
                    credentials: {
                        username: '',
                        password: '',
                    },
                },
                expect: {
                    status: 401
                }
            },
            {
                describe: "should reject (401) empty username (valid password)",
                report: {
                    priority: 'p0',
                    repro:
                        `
                        1. Make a request to valid server enpdoint
                        2. Send empty username but non-empty and valid password
                        3. Expect that server rejects the request with an error code of 401
                        `
                },
                request: {
                    credentials: {
                        username: '',
                        password: 'admin',
                    },
                },
                expect: {
                    status: 401
                }
            },
            {
                describe: "should reject (401) invalid username (valid password)",
                report: {
                    priority: 'p0',
                    repro:
                        `
                    1. Make a request to valid server enpdoint
                    2. Send invalid username but non-empty and valid password
                    3. Expect that server rejects the request with an error code of 401
                    `
                },
                request: {
                    credentials: {
                        username: 'invalid-username',
                        password: 'admin',
                    },
                },
                expect: {
                    status: 401
                }
            },
            {
                describe: "should reject (401) invalid password (valid username)",
                report: {
                    priority: 'p0',
                    repro:
                        `
                        1. Make a request to valid server enpdoint
                        2. Send valid username but invalid password
                        3. Expect that server rejects the request with an error code of 401
                        `
                },
                request: {
                    credentials: {
                        username: 'admin',
                        password: 'invalid-password',
                    },
                },
                expect: {
                    status: 401
                }
            },
            {
                describe: "should reject (401) invalid username and invalid password",
                report: {
                    priority: 'p0',
                    repro:
                        `
                        1. Make a request to valid server enpdoint
                        2. Send invalid username and invalid password
                        3. Expect that server rejects the request with an error code of 401
                        `
                },
                request: {
                    credentials: {
                        username: 'invalid-username',
                        password: 'invalid-password',
                    },
                },
                expect: {
                    status: 401
                }
            },
            {
                describe: "should accept valid username and valid password",
                report: {
                    priority: 'p0',
                    repro:
                        `
                        1. Make a request to valid server enpdoint
                        2. Send valid username and valid password
                        3. Expect no error and server responds with success code of 200
                        `
                },
                request: {
                    credentials: {
                        username: 'admin',
                        password: 'admin',
                    },
                },
                expect: {
                    status: 200
                }
            },
        ]
    },
    {
        describe: "API endpoint",
        request: {
            page: 1,
            credentials: {
                username: 'admin',
                password: 'admin',
            },
        },
        tests: [
            {
                describe: "should refuse (404) invalid /player endpoint",
                report: {
                    priority: 'p1',
                    repro:
                        `
                        1. Make a request to invalid server enpdoint
                        2. Expect that server returns 404
                        `
                },
                request: {
                    endpoint: '/player',
                },
                expect: {
                    status: 404
                }
            },
            {
                describe: "should reject (418) invalid params to valid endpoint",
                report: {
                    priority: 'p1',
                    repro:
                        `
                        1. Make a request to valid server enpdoint with invalid query param
                        2. Expect that server returns 418
                        `
                },
                request: {
                    endpoint: '/players?pagex=0',
                },
                expect: {
                    status: 418
                }
            },
            {
                describe: "should accept (200) valid /players endpoint",
                report: {
                    priority: 'p1',
                    repro:
                        `
                        1. Make a request to valid server enpdoint
                        2. Expect that server returns 200
                        `
                },
                request: {
                    endpoint: '/players',
                },
                expect: {
                    status: 200
                }
            },
        ]
    },
    {
        describe: "Pagination",
        request: {
            endpoint: '/players',
            credentials: {
                username: 'admin',
                password: 'admin',
            },
        },
        tests: [
            {
                describe: "should refuse (418) when no page is requested",
                report: {
                    priority: 'p2',
                    repro:
                        `
                        1. Make a request without requesting any page
                        2. Expect that server returns 418
                        `
                },
                expect: {
                    status: 418
                }
            },
            {
                describe: "should refuse (418) when 0th page is requested",
                report: {
                    priority: 'p2',
                    repro:
                        `
                        1. Make a request for a invalid page number 0
                        2. Expect that server returns 418
                        `
                },
                request: {
                    page: 0
                },
                expect: {
                    status: 418
                }
            },
            {
                describe: "should refuse (418) when negative page is requested",
                report: {
                    priority: 'p2',
                    repro:
                        `
                        1. Make a request for a negative page number -1
                        2. Expect that server returns 418
                        `
                },
                request: {
                    page: -1
                },
                expect: {
                    status: 418
                }
            },
            {
                describe: "should succeed (200) when 1st page is requested",
                report: {
                    priority: 'p2',
                    repro:
                        `
                        1. Make a request for a valid 1st page
                        2. Expect that server returns 200
                        `
                },
                request: {
                    page: 1
                },
                expect: {
                    status: 200
                }
            },
        ]
    },
    {
        describe: "Data / Behavior",
        request: {
            endpoint: '/players',
            credentials: {
                username: 'admin',
                password: 'admin',
            },
        },
        tests: [
            {
                describe: "should succeed (200) when a valid page is requested",
                report: {
                    priority: 'p2',
                    repro:
                        `
                        1. Make a request for a valid page number 100
                        2. Expect that server returns 200
                        `
                },
                request: {
                    page: 100,
                },
                expect: {
                    status: 200,
                }
            },
            {
                describe: "should contain unique 'ID's in a response",
                report: {
                    priority: 'p2',
                    repro:
                        `
                        1. Make a request for a valid page number 1
                        2. Epect that returns entries have a unique ID field values
                        `
                },
                request: {
                    page: 1,
                },
                expect: {
                    status: 200,
                    uniqueFields: ["ID"],
                }
            },
            {
                describe: "should contain unique 'Name's in a response",
                report: {
                    priority: 'p4',
                    repro:
                        `
                        1. Make a request for a valid page number 1
                        2. Epect that returns entries have a unique Name field values
                        `
                },
                request: {
                    page: 1,
                },
                expect: {
                    status: 200,
                    uniqueFields: ["Name"],
                }
            },
            {
                describe: "should have a page size of 50 (# of entries)",
                report: {
                    priority: 'p4',
                    repro:
                        `
                        1. Make a request for a valid page number 1
                        2. Epect that server returns 50 entries as a page size 
                        `
                },
                request: {
                    page: 1,
                },
                expect: {
                    status: 200,
                    count: 50,
                    firstEntry: {
                        "ID": 0
                    },
                    lastEntry: {
                        "ID": 49
                    }
                }
            },
            {
                describe: "should have a correct first entry ID",
                report: {
                    priority: 'p4',
                    repro:
                        `
                        1. Make a request for a valid page number 1
                        2. Epect that first entry has a correct ID value
                        `
                },
                request: {
                    page: 1,
                },
                expect: {
                    status: 200,
                    firstEntry: {
                        "ID": 0
                    },
                }
            },
            {
                describe: "should have a correct last entry ID",
                report: {
                    priority: 'p4',
                    repro:
                        `
                        1. Make a request for a valid page number 1
                        2. Epect that last entry has a correct ID value
                        `
                },
                request: {
                    page: 1,
                },
                expect: {
                    status: 200,
                    lastEntry: {
                        "ID": 49
                    }
                }
            },
            {
                describe: "should have unique 'ID's across pages",
                report: {
                    priority: 'p3',
                    repro:
                        `
                        1. Make a request for a 10 pages starting at page 1
                        2. Epect that there are no duplicate IDs across the pages
                        `
                },
                request: {
                    page: 1,
                    pages: 10,
                },
                expect: {
                    status: 200,
                    uniqueFields: ["ID"],
                }
            },
            {
                describe: "should not have any missing 'ID's across pages",
                report: {
                    priority: 'p3',
                    repro:
                        `
                        1. Make a request for a 10 pages starting at page 1
                        2. Epect that there are no missing IDs across the pages
                        `
                },
                request: {
                    page: 1,
                    pages: 10,
                },
                expect: {
                    status: 200,
                    sequentialFields: ["ID"],
                }
            },
        ]
    },
]
