# tracker by Sebeca.com


## Database configuration
### Local Couchbase installation
1. install CouchBase
   https://developer.couchbase.com/documentation/server/current/install/getting-started-docker.html
2. Add a bucket named "users"
3. Add the following document
[
  {
    "users": {
      "_meta": {
        "created": "2017-07-03T01:13:41.842Z",
        "docType": "model"
      },
      "item": {
        "data": {
          "data": "[{\"Raul Ramirez\", \"Juan Meyers\", \"Ruben Lechner\"}]",
          "userId": "1357"
        },
        "id": "1357"
      }
    }
  }
]
4. Now use: http://localhost:3000/users
5. Exaple output
   [{"data":"[{\"Raul Ramirez\", \"Juan Meyers\", \"Ruben Lechner\"}]","userId":"1357"}]
---------------------------------------------------

Authentication:
source=https://scotch.io/tutorials/easy-node-authentication-setup-and-local

Installation of mongodb
https://scotch.io/tutorials/an-introduction-to-mongodb

## REST APIs
### Company 
* GET
  * Request
```
GET /company?customer_id=12345
```
  * Response Data
```
{
"company": {
    "companyId" : 1234
		"name": "Cloud 8",
		"logo": "images/logo.png",
		"location": {
			"lat": 34.1022,
			"lng": -118.2737,
			"zoom": 13,
			"minZoom" : 13
		},
		"manager": {
			"name": "Hugo",
			"icon": "images/manager.jpg"
		}
	}
}
```
* POST (TBD)
* PUT (TBD)
* PATCH (Language)
  * Request
```
PATCH /company/1234/app_settings/preferred_language 

Content Data JSON
{preferredLanguage: 'es'}
```
  * Response Data
```
{"messagesLocation" : "es/messages.json"}
```

### Job
* GET (Active Jobs for Today)
  * Request
```
GET /job?company_id=1234
```
  * Response Data
```
{
	"jobs": [{
	  "jobId" : 345,
		"assignee": {
		  "employeeId" : 9876,
			"name": "Joe",
			"icon": "images/joe.png",
			"position": {
				"lat": 34.0723,
				"lng": -118.2436
			}
		},
		"location": {
			"lat": 34.0723,
			"lng": -118.2436,
			"address": "17985 Pacific Coast Hwy, Pacific Palisades, CA 90272"
		},
		"status": "Blocked",
		"statusIcon": "images/block.png",
		"targetTime": {
			"label": "Schedule",
			"start": "7:00a",
			"end": "9:00a"
		},
		"actualTime": {
			"label": "Actual",
			"start": "7:00a"
		}
	}]
}
```
* POST (New Job)
  * Request
```
POST /job?company_id=1234

Content Data JSON
{
  "contact": {}
  "location": {"address": {}}
  "targetSchedule" : {}
}
```
  * Response Data
```
{ 
   "jobId": 345  
}
```

* PATCH (Assignment)
  * Request
```
PATCH /job/345/assignee?company_id=1234

Content Data JSON
{
  employeeId: 987
}
```
  * Response
```
{job}
```

* PATCH (Status)
  * Request
```
PATCH /job/345/status?company_id=1234

Content Data JSON
{
  "status": "Done",
  "statusIcon": "images/check.png"
  "actualSchedule" : {}
}
```
  * Response
```
{job}
```

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
