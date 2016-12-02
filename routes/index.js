// routes/index.js

module.exports = function(app, Book){ // book.js의 Book모델 사용을 위해 라우터에 전달

    // GET ALL BOOKS
    app.get('/api/books', function(req,res){
        res.end();
    });

    // GET SINGLE BOOK
    app.get('/api/books/:book_id', function(req, res){
        res.end();
    });

    // GET BOOK BY AUTHOR
    app.get('/api/books/author/:author', function(req, res){
        res.end();
    });

    // CREATE BOOK
    app.post('/api/books', function(req, res){
        res.end();
    });

    // UPDATE THE BOOK
    app.put('/api/books/:book_id', function(req, res){
        res.end();
    });

    // DELETE BOOK
    app.delete('/api/books/:book_id', function(req, res){
        res.end();
    });
}
