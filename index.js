require('dotenv').config();
console.log(process.env.PORT);
const express = require('express');
const cookieParser=require('cookie-parser');
const path=require('path')
const app = express();
const db = require('./config/mongoose');
const PORT=8000;
const session=require('express-session');
const passport=require('passport');
const passportLocal=require('./config/passport-local-strategy');
const passportGoogle=require('./config/passport-google-oauth2-strategy');
const passportFacebook=require('./config/passport-facebook-strategy')
const MongoStore = require('connect-mongo');
const socket = require("socket.io");

const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const cors=require("cors");
app.use(
    cors({
      origin: true,
      credentials: true,
    })
  );

app.use(express.urlencoded());
app.use(cookieParser());

app.use('/photo',express.static(path.join(__dirname,'..')));

app.use(session({
    name:'SocialMedia',
    secret:"something",
    saveUninitialized:false,
    resave:false,
    cookie:{
        maxAge:(1000*60*100)
    },
    store: MongoStore.create(
        { 
            mongoUrl: 'mongodb://127.0.0.1:27017/SocialMedia`'
         },function(err){
            console.log(err || "connect mongo setup ok");
         }
         )
}));

app.use(passport.initialize());
app.use(passport.session());

// app.use(passport.setAuthenticatedUser);

app.use('/',require('./routes')); 

const server =app.listen(PORT,(err)=>{
    if(err) console.log("error in running server",err);
    console.log(`Server is successfully running on port: ${PORT}`); 
})

//socket.io
const io = socket(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

//different landSpace for posts
// const postsNamespace = ;

io.of("/posts").on("connection", (socket) => {
  console.log('user connected to postsNamespace');
  socket.on('uploadedPost',(data)=>{
    console.log(data.newPost);
    io.of("/posts").emit('postarrived',data);
  })
});

global.onlineUsers = new Map();
io.of('/chat').on("connection", (socket) => {
  console.log('user connected to normalNamespace');
  global.chatSocket = socket;
  socket.on("add-user", (userId) => {
    console.log('user connected');
    onlineUsers.set(userId, socket.id);
  });

  socket.on("send-msg", async (data) => {
    const sendUserSocket = await onlineUsers.get(data.to);
    // console.log(sendUserSocket);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("msg-recieve", data.msg);
    }
  });
});