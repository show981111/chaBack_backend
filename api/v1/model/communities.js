var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var communitiesSchema = new Schema({
    userID : {type : String, required : true},
    userNickName : {type : String, required : true},
    updated : { type: Date, default: Date.now },
    category : {type : String, required : true},
    content : {type : String, required : true},
    resizedImages : [{type : String}],
    originalImages : [{type : String}],
    commentsNum : { type: Number, default: 0 },
});
communitiesSchema.index({"updated": -1});

module.exports = mongoose.model('community', communitiesSchema);
