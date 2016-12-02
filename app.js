// app.js

// [LOAD PACKAGES]
var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var app = express();

// [CONFIGURE APP TO USE bodyParser]
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// [CONFIGURE SERVER PORT]
var port = process.env.port || 8080;

// [CONFIGURE ROUTER]
var router = require("./routes")(app, Book); //book.js의 Book모델을 사용하기 위해 전달

// [RUN SERVER]
var server = app.listen(port, function(){
    console.log("Express server has started on port "+port);
});

// [CONFIGURE mongoose]

// CONNECT TO MONGODB SERVER
var db = mongoose.connection;
db.on('error', console.error);
db.once('open', function(){
    // CONNECTED TO MONGODB SERVER
    console.log("Connected to mongod server");
});

mongoose.connect('mongodb://localhost/mongodb_tutorial');
//mongoose.connect('mongodb://username:password@host:port/database?options...');

// DEFINE MODEL : book.js의 모듈 불러오기.
var Book = require('./models/book');


// Book데이터를 DB에 저장하는 api
app.post('/api/books', function(req, res){
    var book = new Book();
    book.title = req.body.name;
    book.author = req.body.author;
    book.published_date = new Date(req.body.published_date);

    book.save(function(err){
        if(err){
            console.err(err);
            res.json({result:0});
            return;
        }
        res.json({result:1});
    })
});

// GET ALL BOOKS => 모든 book 데이터 조회하는 API
app.get('/api/books', function(req,res){
    Book.find(function(err, books){
        if(err) return res.status(500).send({error: 'database failure'});
        res.json(books);
    })
});

// GET SINGLE BOOK => 데이터베이스에서 ID값을 찾아서 book document 출력
app.get('/api/books/:book_id', function(req, res){
    Book.findOne({_id: req.params.book_id}, function(err, book){
        if(err) return res.status(500).json({error: err});
        if(!book) return res.status(404).json({error: 'book not found'});
        res.json(book);
    })
});
