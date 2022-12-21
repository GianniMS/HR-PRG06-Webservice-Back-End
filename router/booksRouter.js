// Books router
const express = require("express");
const Book = require("../models/booksModel");

//Create router
const router = express.Router();

// Add routes for all end points

// Create GET route /
router.get("/", async (req, res) => {
    console.log("GET request for collection");

    if (req.header('Accept') !== "application/json") {
        res.status(415).send();
    }

    try {
        let books = await Book.find();

        let booksCollection = {
            items: books,
            _links: {
                self: {
                    href: `${process.env.BASE_URI}books/`
                },
                collection: {
                    href: `${process.env.BASE_URI}books/`
                }
            },
            pagination: "Filler Text Next Time"
        }

        res.json(booksCollection);
    } catch {
        res.status(400).send();
    }
})

// Create GET detail
router.get("/:id", async(req, res) => {
    //Find (_id)
    console.log(`GET request for detail ${req.params.id}`);

    try {
        let book = await Book.findById(req.params.id);
        if (book == null) {
            res.status(404).send();
        } else {
            res.json(book);
        }
    } catch {
        res.status(415).send()
    }
})

// Use middleware to check POST headers
router.post("/", (req, res, next) => {
    console.log("POST middleware to check Content-Type")

    if (req.header("Content-Type") !== "application/json" && req.header("Content-Type") !== "application/x-www-form-urlencoded") {
        res.status(400).send();
    } else {
        next();
    }
});

// Add middleware to prevent empty POST values
router.post("/", (req, res, next) => {
    console.log("POST middleware to check empty POST value")

    if (req.body.name && req.body.genre && req.body.author) {
        next ();
    } else {
        res.status(400).send();
    }
})

// Add resource to collection: POST /
router.post("/", async (req, res) => {
    console.log("POST request for collection");

    // Info from request
    let book = Book({
        name: req.body.name,
        genre: req.body.genre,
        author: req.body.author
    })

    try {
        await book.save();
        res.status(201).send(book);
    } catch {
        res.status(500).send();
    }
})

// Add middleware to check PUT headers
router.put("/:_id", async (req, res, next) => {
    console.log("Middleware to check POST content type")

    if (req.header("Content-Type") !== "application/json" && req.header("Content-Type") !== "application/x-www-form-urlencoded"){
        res.status(400).send();
    } else {
        next();
    }
})

// Add middleware to prevent empty PUT values
router.put("/:_id", async (req, res, next) => {
    console.log("Middleware to check empty PUT value")

    if (req.body.name && req.body.genre && req.body.author) {
        next();
    } else {
        res.status(400).send();
    }
})

router.put("/:_id", async (req, res) => {
    let book = await Book.findOneAndUpdate(req.params,
        {
           name: req.body.name,
           genre: req.body.genre,
           author: req.body.author
        })

    try {
        book.save();

        res.status(203).send();
    } catch {
        res.status(500).send();
    }
})

// Options for collection: OPTIONS
router.options("/", async (req, res) => {
    console.log(`OPTIONS request for collection /`);
    res.setHeader('Allow', 'GET, POST, OPTIONS');
    res.send();
})

// Options for detail: OPTIONS /id
router.options("/:id", async(req, res) => {
    console.log(`OPTIONS request for detail ${req.params.id}`);
    res.set({
        'Allow': 'GET, PUT, DELETE, OPTIONS'
    }).send()
})

// Detail: DELETE /id
router.delete("/:id", async (req, res) => {
    console.log(`Delete request for detail ${req.params.id}`);

    try {
        await Book.findByIdAndDelete(req.params.id);

        res.status(204).send();
    } catch {
        res.status(404).send();
    }
})

// Export router
module.exports = router;