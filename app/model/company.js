const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// customerId : unique id for a signed up customer
// name : company name
// logo : the relative path of the company logo image, preferebbly width==46px
// location : the address Location of company
// preferedLanguage : the preferred language for Apps, using standard strings like "en-us"
// updated : date when the instance was last updated
const companySchema = new Schema ({
    customerId: { type: Schema.Types.ObjectId, ref: 'User' },
    name: {type: String, required: true},
    logo: String,
    location: {
        lat: Number,
		lng: Number,
        address : String,
    },
    manager : {type : Schema.Types.ObjectId, ref: 'Employee'},
    appSettings: {
        preferreLanguage : {type: String, default: "en"},
        mapZoon : {type: Number, default: 13},
        mapMinZoom: {type: Number, default:13}
    },
    updated: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Company', companySchema);