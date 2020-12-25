const { ObjectID } = require('bson');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var commentsSchema = new Schema({
    parentID : {type : ObjectID, ref : 'communities', required : true},
    userID : {type : String, required : true},
    userNickName : {type : String, required : true},
    updated : { type: Date, default: Date.now },
    content : { type : String, required : true}
});

commentsSchema.index({"updated": -1});


module.exports = mongoose.model('comments', commentsSchema);