require('dotenv').config();
console.log(process.env.PORT);
const express = require('express');
const cookieParser=require('cookie-parser');

const app = express();
const db = require('./config/mongoose');
const PORT=8000;
const session=require('express-session');
const passport=require('passport');
const passportLocal=require('./config/passport-local-strategy');
const passportJWT=require('./config/passport-jwt-strategy');
const MongoStore = require('connect-mongo');

const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));
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

app.use(passport.setAuthenticatedUser);

app.use('/',require('./routes')); 

app.listen(PORT,(err)=>{
    if(err) console.log("error in running server",err);
    console.log(`Server is successfully running on port: ${PORT}`); 
})