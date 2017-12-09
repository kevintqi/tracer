# tracker by Sebeca.com


Authentication:
source=https://scotch.io/tutorials/easy-node-authentication-setup-and-local

Installation of mongodb
https://scotch.io/tutorials/an-introduction-to-mongodb

# APIs
The APIs for the Tracker Service are currently under construction. The APIs makes it easier to retrieve information about companies and jobs. At this moment, the following APIs are supported.

---
## GET companies 
Retrieves all the companies <br>
`/api/companies`

### Code examples
```http
https://localhost:3000/api/companies
```
| Parameter | Required | Options |Description |
|----------|----------|--------------|-------------|
| None | n/a | n/a | n/a |

### Response Data
```
{
	"companies": [
		 { <company JSON> }
	]
}
```

### Successful Post-conditions
* A successful status and the data are returned


### Error Post-conditions
* `400`, bad request
* `404`, service not available
* `500`, unexpected runtime error
---



## GET company
Retrieves a company <br>
`/api/company`

### Code examples
```http
https://localhost:3000/api/company
```
| Parameter | Required | Options |Description |
|----------|----------|--------------|-------------|
| n/a | n/a | n/a | n/a |

### Response Data
```json
{
    "_id": "59a38a3b98101d114fef37b3",
    "customerId": {
        "_id": "5986b8180a8ea07f6155858d",
        "__v": 0,
        "local": {
            "group": "acc_1_out_for_service",
            "role": "manager",
            "lang": "en-us",
            "password": "$2a$08$w2VOeogPIFw1/dn.ptVXROcmzNJoklEArWM0DpfNUOSzHlUoYr.gm",
            "email": "ruben@m.com"
        }
    },
    "name": "Cloud 9",
    "logo": "images/logo.png",
    "__v": 0,
    "updated": "2017-08-28T03:12:59.015Z",
    "appSettings": {
        "mapMinZoom": 13,
        "mapZoom": 11,
        "preferredLanguage": "en-us"
    },
    "location": {
        "lat": 34.1022,
        "lng": -118.2737
    }
}
```

### Successful Post-conditions
* A successful status and the data are returned


### Error Post-conditions
* `400`, bad request
* `404`, service not available
* `500`, unexpected runtime error

<!-- *************************************************************************************************************-->
<!-- *************************************************************************************************************-->
<!-- *************************************************************************************************************-->

---

## GET company by id 
Retrieves a company based on an (company) id.  <br>
`/api/company/<company_id>`

### Code examples
```http
https://localhost:3000/api/company/123
```
| Parameter | Required | Options |Description |
|----------|----------|--------------|-------------|
| company_id | yes | n/a | none |

### Response Data
```json
{
    "_id": "59a38a3b98101d114fef37b3",
    "customerId": {
        "_id": "5986b8180a8ea07f6155858d",
        "__v": 0,
        "local": {
            "group": "acc_1_out_for_service",
            "role": "manager",
            "lang": "en-us",
            "password": "$2a$08$w2VOeogPIFw1/dn.ptVXROcmzNJoklEArWM0DpfNUOSzHlUoYr.gm",
            "email": "ruben@m.com"
        }
    },
    "name": "Cloud 9",
    "logo": "images/logo.png",
    "__v": 0,
    "updated": "2017-08-28T03:12:59.015Z",
    "appSettings": {
        "mapMinZoom": 13,
        "mapZoom": 11,
        "preferredLanguage": "en-us"
    },
    "location": {
        "lat": 34.1022,
        "lng": -118.2737
    }
}
```

### Successful Post-conditions
* A successful status and the data are returned

### Error Post-conditions
* `400`, bad request
* `404`, service not available
* `500`, unexpected runtime error

<!-- *************************************************************************************************************-->
<!-- *************************************************************************************************************-->
<!-- *************************************************************************************************************-->

---

## POST create a company 
Creates a company  <br>
`/api/company`

### Code examples
```http
https://localhost:3000/api/company
```
| Parameter | Required | Options |Description |
|----------|----------|--------------|-------------|
| n/a | n/a | n/a | n/a |

### Input Data
```json
{
    "company": {
        "customerId": "5986b8180a8ea07f6155858d",
        "name": "Cloud 9",
        "logo": "images/logo.png",
        "appSettings": {
            "mapMinZoom": 13,
            "mapZoom": 11,
            "preferredLanguage": "en-us"
        },
        "location": {
            "lat": 34.1022,
            "lng": -118.2737
        }
    }
}
```

### Response Data
```json
{
    "companyId": "59cc4fb360406ef31a0369a5"
}
```

### Successful Post-conditions
* A successful status and the data are returned

### Error Post-conditions
* `400`, bad request
* `404`, service not available
* `500`, unexpected runtime error
---




## PUT update a company
Updates a company <br>
`/api/company`

### Code examples
```http
https://localhost:3000/api/company
```
| Parameter | Required | Options |Description |
|----------|----------|--------------|-------------|
| n/a | n/a | n/a | n/a |

### Input Data
Any element of the company json object. Note that the structure of the json must be preserved.
```json
 {
    "company": {
       "name": "lechDev",
       "location": {
           "lat": 777.77,
           "lng": -118.2737
       }
    }
}
```
### Response Data
```json
{
    "_id": "59a38a3b98101d114fef37b3",
    "customerId": "5986b8180a8ea07f6155858d",
    "name": "lechDev",
    "logo": "images/logo.png",
    "__v": 0,
    "updated": "2017-08-28T03:12:59.015Z",
    "appSettings": {
        "mapMinZoom": 13,
        "mapZoom": 11,
        "preferredLanguage": "en-us"
    },
    "location": {
        "lat": 777.77,
        "lng": -118.2737
    }
}
```

### Successful Post-conditions
* A successful status and the data are returned


### Error Post-conditions
* `400`, bad request
* `404`, service not available
* `500`, unexpected runtime error

<!-- *************************************************************************************************************-->
<!-- *************************************************************************************************************-->
<!-- *************************************************************************************************************-->

---

## GET all jobs 
Retrieves all jobs  
`/api/jobs`

### Code examples
```http
https://localhost:3000/jobs
```

| Parameter | Required | Options |Description |
|----------|----------|--------------|-------------|
| n/a | n/a | n/a | n/a |

### Response Data
```json
{
    "jobs": [
        {
            "_id": "59a38a3b98101d114fef37bd",
            "mileage": 3333,
            "assignee": "5986b8180a8ea07f6155858d",
            "companyId": "5986b8180a8ea07f6155858d",
            "__v": 0,
            "actualSchedule": {
                "startDate": "2017-08-26T18:02:15.555Z",
                "endDate": "2017-08-26T18:02:16.666Z",
                "time": {
                    "start": "2017-08-26T18:02:11.111Z",
                    "end": "2017-08-26T18:02:12.222Z"
                }
            },
            "statusIcon": "images/check.png",
            "status": "Done",
            "location": {
                "lat": 34.0723,
                "lng": -118.2436,
                "address": {
                    "street": "17985 Pacific Coast Hwy",
                    "city": "Torrance",
                    "state": "CA",
                    "zipCode": 90272
                }
            },
            "contact": {
                "name": "Kevin",
                "phoneNumber": "310 333 5050"
            }
        }
    ]
}
```

### Successful Post-conditions
* A successful status and the data are returned

### Error Post-conditions
* `400`, bad request
* `404`, service not available
* `500`, unexpected runtime error

<!-- *************************************************************************************************************-->
<!-- *************************************************************************************************************-->
<!-- *************************************************************************************************************-->

---

## GET job by id 
Retrieve a job based on an id
`/api/job/<job_id>`

### Code examples
```http
https://localhost:3000/api/job/<job_id>
```

| Parameter | Required | Options |Description |
|----------|----------|--------------|-------------|
| job id | yes | n/a | The id is used to retrieve the job |

### Response Data
```json
{
    "job": [
        {
            "_id": "59a38a3b98101d114fef37bd",
            "mileage": 3333,
            "assignee": "5986b8180a8ea07f6155858d",
            "companyId": "5986b8180a8ea07f6155858d",
            "__v": 0,
            "actualSchedule": {
                "startDate": "2017-08-26T18:02:15.555Z",
                "endDate": "2017-08-26T18:02:16.666Z",
                "time": {
                    "start": "2017-08-26T18:02:11.111Z",
                    "end": "2017-08-26T18:02:12.222Z"
                }
            },
            "statusIcon": "images/check.png",
            "status": "Done",
            "location": {
                "lat": 34.0723,
                "lng": -118.2436,
                "address": {
                    "street": "17985 Pacific Coast Hwy",
                    "city": "Torrance",
                    "state": "CA",
                    "zipCode": 90272
                }
            },
            "contact": {
                "name": "Kevin",
                "phoneNumber": "310 333 5050"
            }
        }
    ]
}
```

### Successful Post-conditions
* A successful status and the data are returned


### Error Post-conditions
* `400`, bad request
* `404`, service not available
* `500`, unexpected runtime error

<!-- *************************************************************************************************************-->
<!-- *************************************************************************************************************-->
<!-- *************************************************************************************************************-->

---

## POST create a job
Creates a job with a company id.  <br>
`/api/job`

### Code examples
```http
https://localhost:3000/job
```
| Parameter | Required | Options |Description |
|----------|----------|--------------|-------------|
| n/a | n/a | n/a | n/a |

### Input Data
```json
{
    "mileage": 1111,
    "assignee": "5986b8180a8ea07f6155858d",
    "actualSchedule": {
        "startDate": "2017-08-26T18:02:15.555Z",
        "endDate": "2017-08-26T18:02:16.666Z",
        "time": {
            "start": "2017-08-26T18:02:11.111Z",
            "end": "2017-08-26T18:02:12.222Z"
        }
    },
    "statusIcon": "images/check.png",
    "status": "Done",
    "location": {
        "lat": 34.0723,
        "lng": -118.2436,
        "address": {
            "street": "17985 Pacific Coast Hwy",
            "city": "Torrance",
            "state": "CA",
            "zipCode": 90272
        }
    },
    "contact": {
        "name": "Kevin",
        "phoneNumber": "310 333 5050"
    }
}
```

### Response Data
```json
{
    "jobId": "59d1698938759b633d3908d1"
}
```

### Successful Post-conditions
* A successful status and the data are returned

### Error Post-conditions
* `400`, bad request
* `404`, service not available
* `500`, unexpected runtime error
---

<!-- *************************************************************************************************************-->
<!-- *************************************************************************************************************-->
<!-- *************************************************************************************************************-->

## PUT updates a job based on company id. 
Updates a job based on a company id.  <br>
`/job/<job_id>/update`

### Code examples
```http
https://localhost:3000/job/123/update
```
| Parameter | Required | Options |Description |
|----------|----------|--------------|-------------|
| job_id | yes | n/a | Job id used to do the update. |

### Input Data
Any element of the job json object. Note that the structure of the json must be preserved.
```json
 {
    "mileage": 777,
    "contact": {
        "name": "Ruben",
        "phoneNumber": "310 333 5050"
    }
} 
```

### Response Data
```json
{
    "_id": "59d1698938759b633d3908d1",
    "assignee": "5986b8180a8ea07f6155858d",
    "mileage": 777,
    "companyId": "5986b8180a8ea07f6155858d",
    "__v": 0,
    "actualSchedule": {
        "startDate": "2017-08-26T18:02:15.555Z",
        "endDate": "2017-08-26T18:02:16.666Z",
        "time": {
            "start": "2017-08-26T18:02:11.111Z",
            "end": "2017-08-26T18:02:12.222Z"
        }
    },
    "statusIcon": "images/check.png",
    "status": "Done",
    "location": {
        "lat": 34.0723,
        "lng": -118.2436,
        "address": {
            "street": "17985 Pacific Coast Hwy",
            "city": "Torrance",
            "state": "CA",
            "zipCode": 90272
        }
    },
    "contact": {
        "name": "Ruben",
        "phoneNumber": "310 333 5050"
    }
}
```

### Successful Post-conditions
* A successful status and the data are returned

### Error Post-conditions
* `400`, bad request
* `404`, service not available
* `500`, unexpected runtime error
---

<!-- *************************************************************************************************************-->
<!-- *************************************************************************************************************-->
<!-- *************************************************************************************************************-->

## GET location logs 
Retrieves all the location logs associated with the company.  <br>
`/api/location_logs`

### Code examples
```http
https://localhost:3000/location_logs
```
| Parameter | Required | Options |Description |
|----------|----------|--------------|-------------|
| n/a | n/a | n/a | n/a |

### Input Data
none

### Response Data
```json
{
    "locationLogs": [
        {
            "_id": "59e42060ab1a31443a3fc6ba",
            "jobId": "5986b8180a8ea07f61558999",
            "companyId": "5986b8180a8ea07f6155858d",
            "__v": 0,
            "dateLog": "2017-10-16T02:58:40.333Z",
            "location": {
                "lat": 34.1022,
                "lng": -118.2737
            }
        },
        {
            "_id": "59e4283c982b0d9b4679e3c1",
            "jobId": "5986b8180a8ea07f61558999",
            "companyId": "5986b8180a8ea07f6155858d",
            "__v": 0,
            "dateLog": "2017-10-16T03:32:12.867Z",
            "location": {
                "lat": 800.3333,
                "lng": -1.7331
            }
        }
    ]
}
```

### Successful Post-conditions
* A successful status and the data are returned

### Error Post-conditions
* `400`, Bad request 
* `401`, Unauthorized 
* `404`, service not available
* `500`, unexpected runtime error
---

<!-- *************************************************************************************************************-->
<!-- *************************************************************************************************************-->
<!-- *************************************************************************************************************-->

## GET location logs based on job id 
Retrieves all logs based on a job id  <br>
`/api/location_log?jobId=<job_id>`

### Code examples
```http
https://localhost:3000/location_log?jobId=<job_id>
```
| Parameter | Required | Options |Description |
|----------|----------|--------------|-------------|
| jobId | yes | n/a | This is a query parameter. |

### Input Data
none

### Response Data
```json
{
    "locationLogs": [
        {
            "_id": "59e42060ab1a31443a3fc6ba",
            "jobId": "5986b8180a8ea07f61558999",
            "companyId": "5986b8180a8ea07f6155858d",
            "__v": 0,
            "dateLog": "2017-10-16T02:58:40.333Z",
            "location": {
                "lat": 34.1022,
                "lng": -118.2737
            }
        },
        {
            "_id": "59e4283c982b0d9b4679e3c1",
            "jobId": "5986b8180a8ea07f61558999",
            "companyId": "5986b8180a8ea07f6155858d",
            "__v": 0,
            "dateLog": "2017-10-16T03:32:12.867Z",
            "location": {
                "lat": 800.3333,
                "lng": -1.7331
            }
        }
    ]
}
```

### Successful Post-conditions
* A successful status and the data are returned

### Error Post-conditions
* `400`, Bad request 
* `401`, Unauthorized 
* `404`, service not available
* `500`, unexpected runtime error
---

<!-- *************************************************************************************************************-->
<!-- *************************************************************************************************************-->
<!-- *************************************************************************************************************-->

## POST create location log entry 
Create a location log entry  <br>
`/api/location_log`

### Code examples
```http
https://localhost:3000/location_logs
```
| Parameter | Required | Options |Description |
|----------|----------|--------------|-------------|
| n/a | n/a | n/a | n/a |

### Input Data
```json
{
    "locationLogs": [
        {
           "jobId": "5986b8180a8ea07f61558999",
            "location": {
               "lat": 34.1022,
               "lng": -118.2737
            },
            "dateLog": 1510443849817
        },
        {
           "jobId": "5986b8180a8ea07f61558999",
           "location": {
               "lat": 34.77,
               "lng": -118.77
            },
            "dateLog": 1510443849817
        }
    ]
}
```

### Response Data
```json
{
    "dateLog": "2017-10-17T02:35:38.495Z"
}
```

### Successful Post-conditions
* A successful status and the data are returned

### Error Post-conditions
* `400`, Bad request 
* `401`, Unauthorized 
* `404`, service not available
* `500`, unexpected runtime error
---

# DEV Notes
1. validate that a update and patch really took placed in copy_.


### Tasks for Enabling Workflow Demo
| Item | Member | Status | Comments |
| ---- | ------ | ------ | -------- |
| Define data schema | Kevin | | |
| Spec REST APIs |Kevin + Ruben | | |
| Support database operation for data schema | Ruben | |  |
| Support REST APIs | Ruben | |  |
| Use REST APIs on dashboard app | Kevin | | |
| Create a test Android app | Kevin | | |
| Integration and deployment | Ruben + Kevin | | |
| Prepare demo presentation | Ruben + Kevin | | |


### Todo 
| Item | Member | Status | Comments |
| ---- | ------ | ------ | -------- |
| sebeca.com landing page | | | |
| Investigate aws database (preference couchbase) | | | |
| Update readme.md | Ruben | Done | 2017-06-06 |
| Host sebeca.com | Ruben | in progress | |
| Call and register with Torrance chamber of commerce | | | |
| Business cards | Ruben | in progress | |
| Email accounts for sebeca.com | | | |
| Setup angularJS project | | | |
| Study google map view | | | |

### User Stories
| Story | Status | Barrier | Comments |
| ----- | ------ | ------- | -------- |
| As a Business Owner, I need to track the location of my workers | | | |
| As a Business Owner, I need to track the progress of the current jobs | | | |
| As a Business Owner, I need to assign a task(job) to a workers based on availability and proximity. | | | |
