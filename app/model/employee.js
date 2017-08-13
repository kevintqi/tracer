const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// companyId : the _id of Company where the employee works for
// nickName : unique name for identify the employee, might be used for login app
// icon : the relative path for icon image, preferabbly 36pxx36px
// roles : worker, manager ,??
// currentLocation : (optional) the current location of the Employee as reported by the app
const employeeSchema = new Schema ({
    companyId : { type: Schema.Types.ObjectId, ref: 'Company' },
    nickName : { type: String, required: true, unique:true },
    icon : String,
    roles : String,
    currentLocation: {
        location: {
            lat: Number,
            lng: Number
        },
        updated: { type: Date, default: Date.now }
    }
});

module.exports = mongoose.model('Employee', employeeSchema);