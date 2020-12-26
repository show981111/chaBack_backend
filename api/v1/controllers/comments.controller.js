const Comment = require('../model/comments.js')
const Community = require('../model/communities.js')

//post
let postComment = async function(req, res, next){
    
    try{
        const results = await Community.findById(req.body.parentID);
        console.log(results);
        if(!results || results.length < 1 ){
            const error = new Error();
            error.message = 'parentID is Not found';
            error.status = 404;
            throw error;
        }

        const post = new Comment(req.body);
        const result = await post.save();
        res.send(result);
    }catch(error){
        console.log(error);
        next(error);
    }
}

//post reply => push replies into their parent 
let postReply = async function(req, res, next){
    try{
        const searchParent = await Community.findById(req.body.parentID);
        console.log(searchParent);
        if(!searchParent || searchParent.length < 1 ){
            const error = new Error();
            error.message = 'parentID is Not found';
            error.status = 404;
            throw error;
        }

        const searchReplyParent = await Comment.findById(req.params.replyParentID);
        console.log(searchReplyParent);
        if(!searchReplyParent || searchReplyParent.length < 1 ){
            const error = new Error();
            error.message = 'replyParentID is Not found';
            error.status = 404;
            throw error;
        }

        const post = new Comment(req.body);
        const result = await post.save();

        const replyID = result._id;
        const replyParentID = req.params.replyParentID;
        const options = { new: true };
        const updateResult = await Comment.findByIdAndUpdate(replyParentID, { $push: { 'replies':  replyID}}, options);
        res.send(result);

    }catch(error){
        next(error);
    }
}

//get Comments By parent ID 
let getCommentsByParent = async function(req, res, next){
    try{
        const results = await Comment.find({parentID : req.params.parentID}).sort({updated : -1}).populate('replies');
        console.log(results);
        res.send(results);
    }catch (error) {
        console.log(error);
        next(error);
    }   
}

//get Comments By userID w/ posts 
let getCommentsByUserID = async function(req, res, next){
    try{
        console.log(req.params.userID);
        const results = await Comment.find({userID : req.params.userID}).sort({updated : -1}).populate('parentID');
        console.log(results);
        res.send(results);
    }catch (error) {
        console.log(error);
        next(error);
    }   
}

let updateComment = async function(req, res, next){
    try{
        const commentID = req.params.commentID;
        const options = { new: true };
        // console.log(postID);
        const result = await Comment.findByIdAndUpdate(commentID, {content : req.body.content, updated : Date.now()}, options);
        if (!result) {
            const error = new Error();
            error.message = 'commentID is Not found';
            error.status = 404;
            throw error;
        }
        res.status(200).send(result);
    } catch (error){
        next(error);
    }
}

let deleteComment = async function(req, res, next){
    const commentID = req.params.commentID;
    try {
        const result = await Comment.findByIdAndDelete(commentID);
        if (!result) {
            const error = new Error();
            error.message = 'commentID is Not found';
            error.status = 404;
            throw error;
        }
        res.send(result);
    } catch (error) {
        console.log(error);
        next(error);
    }
}

module.exports = {
    postComment : postComment,
    getCommentsByParent : getCommentsByParent,
    getCommentsByUserID : getCommentsByUserID,
    updateComment : updateComment,
    deleteComment : deleteComment,
    postReply : postReply
}