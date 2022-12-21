// Require Mongoose
const mongoose = require("mongoose");

// Define a schema
const Schema = mongoose.Schema;

const BookSchema = new Schema({
    name: String,
    genre: String,
    author: String
}, {toJSON: {virtuals: true}});

// Add virtual property to Book, to include (dynamic) links
BookSchema.virtual('_links').get(
    function () {
        return {
            self: {
                href: `${process.env.BASE_URI}books/${this._id}`
            },
            collection: {
                href: `${process.env.BASE_URI}books/`
            }
        }
    }
)
// Export model class
module.exports = mongoose.model("Book", BookSchema);