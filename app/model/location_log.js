const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const locationLogSchema = new Schema ({
    companyId : { type: Schema.Types.ObjectId, required: true, ref: 'Company' },
    jobId : { type: Schema.Types.ObjectId, required: true, ref: 'Job' },
    location: {
        lat: { type: Number, required: true},
        lng: { type: Number, required: true},
    },
    dateLog: { type: Date, required: true, default: Date.now }
});

module.exports = mongoose.model('LocationLog', locationLogSchema);