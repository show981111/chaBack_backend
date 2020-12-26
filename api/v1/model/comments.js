const { ObjectID } = require('bson');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var commentsSchema = new Schema({
    parentID : {type : ObjectID, ref : 'community', required : true},
    userID : {type : String, required : true},
    userNickName : {type : String, required : true},
    updated : { type: Date, default: Date.now },
    content : { type : String, required : true},
    replies : [{type : ObjectID, ref : 'comments'}]
});

commentsSchema.index({"updated": -1});


module.exports = mongoose.model('comments', commentsSchema);