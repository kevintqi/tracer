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
