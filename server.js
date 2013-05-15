//setup Dependencies
var connect = require('connect')
    , express = require('express')
    , io = require('socket.io')
    , port = (process.env.PORT || 80);

//Setup Express
var server = express.createServer();
server.configure(function(){
    server.set('views', __dirname + '/views');
    server.set('view options', { layout: false });
    server.use(connect.bodyParser());
    server.use(express.cookieParser());
    server.use(express.session({ secret: "shhhhhhhhh!"}));
    server.use(connect.static(__dirname + '/static'));
    server.use(server.router);
});

//setup the errors
server.error(function(err, req, res, next){
    if (err instanceof NotFound) {
        res.render('404.jade', { locals: { 
                  title : '404 - Not Found'
                 ,description: ''
                 ,author: ''
                 ,analyticssiteid: 'UA-40856573-1'
                },status: 404 });
    } else {
        res.render('500.jade', { locals: { 
                  title : 'The Server Encountered an Error'
                 ,description: ''
                 ,author: ''
                 ,analyticssiteid: 'UA-40856573-1'
                 ,error: err 
                },status: 500 });
    }
});
server.listen( port);

//Setup Socket.IO
var io = io.listen(server);
io.sockets.on('connection', function(socket){
  console.log('Client Connected');
  socket.on('message', function(data){
    socket.broadcast.emit('server_message',data);
    socket.emit('server_message',data);
  });
  socket.on('disconnect', function(){
    console.log('Client Disconnected.');
  });
});


///////////////////////////////////////////
//              Routes                   //
///////////////////////////////////////////

/////// ADD ALL YOUR ROUTES HERE  /////////

server.get('/', function(req,res){
    genericRender('index.jade', res);
});

server.get('/rsvp', function(req,res){
    genericRender('rsvp.jade', res);
});

server.get('/registry', function(req,res){
    genericRender('registry.jade', res);
});

server.get('/photos', function(req,res){
    genericRender('photos.jade', res);
});

server.get('/party', function(req,res){
    genericRender('party.jade', res);
});

server.get('/accommodations', function(req,res){
    genericRender('accommodations.jade', res);
});

server.get('/transportation', function(req,res){
    genericRender('transportation.jade', res);
});

server.get('/faq', function(req,res){
    genericRender('faq.jade', res);
});

server.get('/muertos', function(req,res){
    genericRender('muertos.jade', res);
});

function genericRender(filename, resposne)
{
    resposne.render(filename, {
        locals : {
            description: 'Website for the Wedding of Alex Woody and Andrea Steiling'
            ,author: 'Alex Woody'
        }
    });
}

//A Route for Creating a 500 Error (Useful to keep around)
server.get('/500', function(req, res){
    throw new Error('This is a 500 Error');
});

//The 404 Route (ALWAYS Keep this as the last route)
server.get('/*', function(req, res){
    throw new NotFound;
});

function NotFound(msg){
    this.name = 'NotFound';
    Error.call(this, msg);
    Error.captureStackTrace(this, arguments.callee);
}


console.log('Listening on http://0.0.0.0:' + port );
