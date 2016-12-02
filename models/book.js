// models/book.js

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var bookSchema = new Schema({
    title: String,
    author: String,
    // collection: 'COLLECTION_NAME',
    published_date: {type: Date, default: Date.now}
});

// model 모듈화
module.exports = mongoose.model('book', bookSchema);

/*
    schema에서 사용되는 SchemaType은 총 8종류

    String
    Number
    Date
    Buffer
    Boolean
    Mixed
    Objectid
    Array
*/
