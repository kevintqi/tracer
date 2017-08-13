const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// companyId : the _id of Company where the employee works for
// contact : contact info for the Job
// location : location of the Job
// assignee : unique _id of assignee
// status : New, Starting, Progressing,Finishing, Done, Blocked
// statusIcon : relative path for status icon image
// targetSchedule.scheduleType : daily, weekly, etc
// targetSchedule.startDate: date started or to start the Job
// targetSchedule.endDate :date completed or to complete the Job
// targetSchedule.time : target start and end time
// actualSchedule : recorded actual time on the Job
// mileage : the milage accumulated for the Job, 
//          such as trip to get there, to get required tools and materials
//          if it's the last job of the assignee, trip to get back to the company
// achived : the date where Job was achive. Active Jobs should not have the field
const jobSchema = new Schema ({
    companyId : { type: Schema.Types.ObjectId, ref: 'Company' },
    contact : {
        name : String,
        phoneNumber : String
    },
    location : {
        lat: Number,
        lng: Number,
        address : {
            street: String,
            city : String,
            zipCode :Number,
            state: String
        }
    },
    assignee : {type: Schema.Types.ObjectId, ref: 'Employee'},
    status : {type: String, default: "New"},
    statusIcon : {type: String, default: "images/progress_0.png"},
    targetSchedule : {
        scheduleType : String,
        startDate: Date,
        endDate: Date,
        time : {
            start : Date,
            end : Date
        }
    },
    actualSchedule : {
        startDate: Date,
        endDate: Date,
        time : {
            start : Date,
            end : Date
        }
    },
    mileage : Number,
    achived : Date
});

module.exports = mongoose.model('Job', jobSchema);