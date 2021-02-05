var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var communitiesSchema = new Schema({
    userID : {type : String, required : true},
    userNickName : {type : String, required : true},
    updated : { type: Date, default: Date.now },
    category : {type : Number, required : true},
    content : {type : String, required : true},
    resizedImages : [{type : String}],
    originalImages : [{type : String}],
    commentsNum : { type: Number, default: 0 },
    placeID : {type : String},
    placeName : {type : String},
    profileImg : {type : String, required : true},
    title : {type : String}
});
communitiesSchema.index({"updated": -1});

module.exports = mongoose.model('community', communitiesSchema);
