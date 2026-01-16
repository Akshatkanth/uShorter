const express = require("express");
const router = express.Router();
const Url = require("../models/Url");
const { nanoid } = require("nanoid"); 

// ---------- Helpers ----------
const isValidUrl = (url) => {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
};

const normalizeCode = (code) => code.trim();

// ---------- CREATE ----------
router.post("/shorten", async (req, res) => {
  try {
    const { url } = req.body;

    if (!url || !isValidUrl(url)) {
      return res.status(400).json({
        error: "Invalid URL. Must start with http:// or https://"
      });
    }

    const shortCode = nanoid(6);

    const newUrl = await Url.create({
      url,
      shortCode
    });

    return res.status(201).json({
      id: newUrl._id,
      url: newUrl.url,
      shortCode: newUrl.shortCode,
      createdAt: newUrl.createdAt,
      updatedAt: newUrl.updatedAt
    });
  } catch (err) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// ---------- STATS----------
router.get("/shorten/:shortCode/stats", async (req, res) => {
  try {
    const shortCode = normalizeCode(req.params.shortCode);

    const urlData = await Url.findOne({ shortCode });

    if (!urlData) {
      return res.status(404).json({ error: "Short URL not found" });
    }

    return res.status(200).json({
      id: urlData._id,
      url: urlData.url,
      shortCode: urlData.shortCode,
      createdAt: urlData.createdAt,
      updatedAt: urlData.updatedAt,
      accessCount: urlData.accessCount
    });
  } catch {
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// ---------- GET ----------
router.get("/shorten/:shortCode", async (req, res) => {
  try {
    const shortCode = normalizeCode(req.params.shortCode);

    const urlData = await Url.findOne({ shortCode });

    if (!urlData) {
      return res.status(404).json({ error: "Short URL not found" });
    }

    return res.status(200).json({
      id: urlData._id,
      url: urlData.url,
      shortCode: urlData.shortCode,
      createdAt: urlData.createdAt,
      updatedAt: urlData.updatedAt
    });
  } catch {
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// ---------- UPDATE ----------
router.put("/shorten/:shortCode", async (req, res) => {
  try {
    const shortCode = normalizeCode(req.params.shortCode);
    const { url } = req.body;

    if (!url || !isValidUrl(url)) {
      return res.status(400).json({
        error: "Invalid URL. Must start with http:// or https://"
      });
    }

    const updatedUrl = await Url.findOneAndUpdate(
      { shortCode },
      { url },
      { new: true }
    );

    if (!updatedUrl) {
      return res.status(404).json({ error: "Short URL not found" });
    }

    return res.status(200).json({
      id: updatedUrl._id,
      url: updatedUrl.url,
      shortCode: updatedUrl.shortCode,
      createdAt: updatedUrl.createdAt,
      updatedAt: updatedUrl.updatedAt
    });
  } catch {
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// ---------- DELETE ----------
router.delete("/shorten/:shortCode", async (req, res) => {
  try {
    const shortCode = normalizeCode(req.params.shortCode);

    const deletedUrl = await Url.findOneAndDelete({ shortCode });

    if (!deletedUrl) {
      return res.status(404).json({ error: "Short URL not found" });
    }

    return res.status(204).send();
  } catch {
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

//redirect route
router.get("/:shortCode", async (req, res) => {
  try {
    const shortCode = normalizeCode(req.params.shortCode);

    const urlData = await Url.findOne({ shortCode });

    if (!urlData) {
      return res.status(404).json({ error: "Short URL not found" });
    }

    urlData.accessCount += 1;
    await urlData.save();

    return res.redirect(urlData.url);
  } catch {
    return res.status(500).json({ error: "Internal Server Error" });
  }
});


module.exports = router;
