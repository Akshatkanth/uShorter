const express = require('express');

const isValidUrl = (url) => {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
};

const models = require("../models/Url");
const Url = require('../models/Url');
const router = express.Router();

let nanoid;

// Dynamic import for nanoid (ESM module)
(async () => {
  const module = await import('nanoid');
  nanoid = module.nanoid;
})();

//post /short
router.post("/shorten", async(req, res)=>{
    try{
        const{url} = req.body;

        //1. validation
        if (!url || !isValidUrl(url)) {
            return res.status(400).json({
                error: "Invalid URL bro. Must start with http:// or https:// "
                });
            }

        //2. Generate unique short code
        const shortCode = nanoid(6);

        //3. Save to DB
        const newUrl = await Url.create({
            url,
            shortCode
        });

        //4. return response
        res.status(201).json({
            id: newUrl._id,
            url: newUrl.url,
            shortCode: newUrl.shortCode,
            createdAt: newUrl.createdAt,
            updatedAt: newUrl.updatedAt
        });
    }catch(error){
        res.status(500).json({
            error:"Internal Server Error"
        });
    }
});


//GET  /shorten/:shortCode
router.get("/shorten/:shortCode", async (req, res) => {
    try {
        const {shortCode} = req.params;

        //1. Find URL by shortCode
        const urlData = await Url.findOne({shortCode});

        //2. If not found 
        if(!urlData){
            return res.status(404).json({
                error:"Short URL not found"
            });
        }

        //3. If found, return data
        res.status(200).json({
            id: urlData._id,
            url: urlData.url,
            shortCode: urlData.shortCode,
            createdAt: urlData.createdAt,
            updatedAt: urlData.updatedAt
        });
    } catch (error) {
        res.status(500).json({
            error:"Internal Server Error"
        });
    }
});

//PUT /shorten/:shortCode

router.put("/shorten/:shortCode", async(req, res) => {
    try {
        const {shortCode} = req.params;
        const {url} = req.body;

        //1. Validate input
        if (!url || !isValidUrl(url)) {
            return res.status(400).json({
                error: "Invalid URL bro. Must start with http:// or https:// "
                });
            }

        //2. Find and update
        const updatedUrl = await Url.findOneAndUpdate(
            {shortCode},
            {url},
            {new:true} //return updated document
        );

        //3. Not Found
        if(!updatedUrl){
            return res.status(404).json({
                error:"Short URL not found"
            });
        }

        //4. Success respone
        res.status(200).json({
            id: updatedUrl._id,
            url: updatedUrl.url,
            shortCode: updatedUrl.shortCode,
            createdAt: updatedUrl.createdAt,
            updatedAt: updatedUrl.updatedAt
        });
    } catch (error) {
        res.status(500).json({
            error: "Internal Server Error"
        });
    }
});

//DELETE /shorten/:shortCode
router.delete("/shorten/:shortCode", async(req, res) =>{
    try {
        const {shortCode} = req.params;

        //1. Delete By ShortCode
        const deletedUrl = await Url.findOneAndDelete({shortCode});
        
        //2. Not found 
        if(!deletedUrl){
            return res.status(404).json({
                error:"Short Url not found"
            });
        }

        //3. success no content
        res.status(204).send();
    } catch (error) {
        res.status(500).json({
            error:"Internal server error"
        });
    }
});

//GET /shorten/:shortCode/stats
router.get("/shorten/:shortCode/stats", async(req,res)=>{
    try {
        const {shortCode} = req.params;
        const urlData = await Url.findOne({shortCode});

        if(!urlData){
            return res.status(404).json({
                error: "Short URL not found"
            });
        }

        res.status(200).json({
            id: urlData._id,
            url: urlData.url,
            shortCode: urlData.shortCode,
            createdAt: urlData.createdAt,
            updatedAt: urlData.updatedAt,
            accessCount: urlData.accessCount
        });
    } catch (error) {
        res.status(500).json({
            error:"Internal server error"
        });
    }
});



//GET /:shortCode -> Redirecttttt
router.get("/:shortCode", async (req, res) =>{
    try {
        const {shortCode} = req.params;

        //1. find the url
        const urlData = await Url.findOne({shortCode});

        //2. if not found
        if(!urlData){
            return res.status(404).json({
                error:"Short URL not found"
            });
        }

        //3. increment access count
        urlData.accessCount += 1;
        await urlData.save();
        
        
        //4. redirect to orginal url
        res.redirect(urlData.url);
    } catch (error) {
        res.status(500).json({
            error: "Internal Server Error"
        });
    }
});


module.exports = router;