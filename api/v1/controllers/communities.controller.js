const Communities = require('../model/communities.js')

var postPosts = async function(req, res, next){
    try {
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
        const results = await Communities.find({category : req.params.category}).sort({updated : -1})
                                                    .skip( req.params.pageNumber)
                                                    .limit( 20 );//paging 
        res.status(200).send(results);
    } catch (error) {
        console.log(error);
        next(error);
    }   
}

var getPostsByID = async function(req, res , next){
    try{
        const results = await Communities.find({userID : req.params.userID}).sort({updated : -1})     
        res.send(results);
    }catch (error) {
        console.log(error);
        next(error);
    }   
}

var updatePosts = async function(req, res, next){
    try {
        const filter = { userID : req.token_userID, _id : req.params.postID};

        req.body.updated = Date.now();
        req.body.userID = req.token_userID;
        const updates = req.body;
        const options = { new: true };
        // console.log(postID);
        const result = await Communities.findOneAndUpdate(filter, updates, options);
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
    const filter = { userID : req.token_userID, _id : req.params.postID};

    try {
        const result = await Communities.findOneAndDelete(filter);
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