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

// GET BOOKS BY AUTHOR => author값이 매칭되는 데이터 찾아 출력.
app.get('/api/books/author/:author', function(req, res){
    // find() 메소드에서 첫번째 인자에는 query, 두번째 인자에는 projection 전달(생략 시 모든 filed 출력)
    // author값으로 찾아서 title과 published_date만 출력
    Book.find({author: req.params.author}, {_id: 0, title: 1, published_date: 1},  function(err, books){
        if(err) return res.status(500).json({error: err});
        if(books.length === 0) return res.status(404).json({error: 'book not found'});
        res.json(books);
    })
});

// UPDATE THE BOOK
app.put('/api/books/:book_id', function(req, res){
    Book.findById(req.params.book_id, function(err, book){
        if(err) return res.status(500).json({ error: 'database failure' });
        if(!book) return res.status(404).json({ error: 'book not found' });

        if(req.body.title) book.title = req.body.title;
        if(req.body.author) book.author = req.body.author;
        if(req.body.published_date) book.published_date = req.body.published_date;

        book.save(function(err){
            if(err) res.status(500).json({error: 'failed to update'});
            res.json({message: 'book updated'});
        });

    });

});
