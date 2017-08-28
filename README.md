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
`/companies`

### Code examples
```http
https://localhost:3000/companies
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



## GET company by customer id 
Retrieves a company based on a customer id. <br>
`/company?customer_id=<id>`

### Code examples
```http
https://localhost:3000/company?customer_id=123
```
| Parameter | Required | Options |Description |
|----------|----------|--------------|-------------|
| customer_id | yes | n/a | This parameter should be passed as a query variable. |

### Response Data
```
{ <company JSON> }
```

### Successful Post-conditions
* A successful status and the data are returned


### Error Post-conditions
* `400`, bad request
* `404`, service not available
* `500`, unexpected runtime error
---



## GET company by id 
Retrieves a company based on an (company) id.  <br>
`/company/<company_id>`

### Code examples
```http
https://localhost:3000/company/123
```
| Parameter | Required | Options |Description |
|----------|----------|--------------|-------------|
| company_id | yes | n/a | none |

### Response Data
```
{ <company JSON> }
```

### Successful Post-conditions
* A successful status and the data are returned

### Error Post-conditions
* `400`, bad request
* `404`, service not available
* `500`, unexpected runtime error
---


## POST create a company 
Creates a company  <br>
`/company`

### Code examples
```http
https://localhost:3000/company
```
| Parameter | Required | Options |Description |
|----------|----------|--------------|-------------|
| n/a | n/a | n/a | n/a |

### Input Data
```
{ <company JSON> }
```

### Response Data
```
{ "companyId": <company_id>}
```

### Successful Post-conditions
* A successful status and the data are returned

### Error Post-conditions
* `400`, bad request
* `404`, service not available
* `500`, unexpected runtime error
---




## PUT update a company based on id 
Updates a company based on (company) id.<br>
`/company?company_id=<id>`

### Code examples
```http
https://localhost:3000/company?company_id=123
```
| Parameter | Required | Options |Description |
|----------|----------|--------------|-------------|
| company_id | yes | n/a | This parameter should be passed as a query variable. |

### Input Data
Any element of the company json object. Note that the structure of the json must be preserved.
```
 any element of <company JSON> 
```
### Response Data
```
{ <company JSON> }
```

### Successful Post-conditions
* A successful status and the data are returned


### Error Post-conditions
* `400`, bad request
* `404`, service not available
* `500`, unexpected runtime error
---



## PATCH update the preferred language 
Updates the preferred language from the application settings.<br>
`/company/<company_id>/app_settings/preferred_language`

### Code examples
```http
https://localhost:3000/company?company_id=123
```
| Parameter | Required | Options |Description |
|----------|----------|--------------|-------------|
| company_id | yes | n/a | Company id |

### Input Data
`<lang>` should be replaced by the language, example "en-us" or "es"
```
 { 'preferredLanguage': <lang> } 
```
### Response Data
```
{ "language": <lang>}
```

### Successful Post-conditions
* A successful status and the data are returned


### Error Post-conditions
* `400`, bad request
* `404`, service not available
* `500`, unexpected runtime error
---



## GET job  by company id 
Retrieves a job based on a company id. <br>
`/job?company_id=<id>`

### Code examples
```http
https://localhost:3000/job?company_id=123
```
| Parameter | Required | Options |Description |
|----------|----------|--------------|-------------|
| company_id | yes | n/a | This parameter should be passed as a query variable. |

### Response Data
```
{ <job JSON> }
```

### Successful Post-conditions
* A successful status and the data are returned


### Error Post-conditions
* `400`, bad request
* `404`, service not available
* `500`, unexpected runtime error
---




## POST create a job with a company id 
Creates a job with a company id.  <br>
`/job?company_id=<id>`

### Code examples
```http
https://localhost:3000/job?company_id=123
```
| Parameter | Required | Options |Description |
|----------|----------|--------------|-------------|
| company_id | yes | n/a | This parameter should be passed as a query variable. |

### Input Data
```
{ <job JSON> }
```

### Response Data
```
{ "jobId": <job_id>}
```

### Successful Post-conditions
* A successful status and the data are returned

### Error Post-conditions
* `400`, bad request
* `404`, service not available
* `500`, unexpected runtime error
---




## PATCH updates a job based on company id. 
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
```
 any element of <job JSON> 
```

### Response Data
```
{ <job JSON> }
```

### Successful Post-conditions
* A successful status and the data are returned

### Error Post-conditions
* `400`, bad request
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
