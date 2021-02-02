const Communities = require('../model/communities.js')

var postPosts = async function(req, res, next){
    try {
        if(req.body.category == 0){
            req.body.category = '자유게시판';
        }else if(req.body.category == 1){
            req.body.category = 'QnA';
        }else if(req.body.category == 2){
            req.body.category = '실시간 현황';
        }
        req.body.userID = req.token_userID;
        req.body.userNickName = req.token_userNickName;
        req.body.profileImg = `${process.env.BUCKET_PATH}/images/resize/${req.token_userID}/${req.token_userID}.jpeg`;

        if(req.body.imageKey)
        {
            var resizedImages = [];
            var originalImages = [];
            for(var j = 0; j < req.body.imageKey.length; j++){
                resizedImages.push(`${process.env.BUCKET_PATH}/images/resize/${req.token_userID}/${req.body.imageKey[j]}`);
                originalImages.push(`${process.env.BUCKET_PATH}/images/original/${req.token_userID}/${req.body.imageKey[j]}`);
            }
            req.body.resizedImages = resizedImages;
            req.body.originalImages = originalImages;
        }

        req.body.imageKey = undefined;
        const post = new Communities(req.body);
        console.log(post);
        const result = await post.save();
        res.send(result);
    } catch (error) {
        console.log(error);
        next(error);
    }
    
}

var getAllPosts = async function(req, res, next){
    try {
        const results = await Communities.find({}).sort({updated : -1});//paging 
        res.status(200).send(results);
    } catch (error) {
        console.log(error);
        next(error);
    }   
}

var getPostsByID = async function(req, res , next){
    try{
        const results = await Communities.find({userID : req.params.userID}).sort({updated : -1});
        console.log(results);
        res.send(results);
    }catch (error) {
        console.log(error);
        next(error);
    }   
}

var updatePosts = async function(req, res, next){
    try {
        const postID = req.params.postID;
        req.body.updated = Date.now();
        req.body.userID = req.token_userID;
        const updates = req.body;
        const options = { new: true };
        // console.log(postID);
        const result = await Communities.findByIdAndUpdate(postID, updates, options);
        if (!result) {
            const error = new Error();
            error.message = 'postID is Not found';
            error.status = 404;
            throw error;
        }
        res.status(200).send(result);
    } catch (error) {
        console.log(error);
        next(error);
    }
}

var deletePosts = async function(req, res, next){
    const postID = req.params.postID;
    try {
        const result = await Communities.findByIdAndDelete(postID);
        // console.log(result);
        if (!result) {
            const error = new Error();
            error.message = 'postID is Not found';
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
    postPosts: postPosts,
    getAllPosts : getAllPosts,
    getPostsByID : getPostsByID,
    updatePosts : updatePosts,
    deletePosts : deletePosts
}