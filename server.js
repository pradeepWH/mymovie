const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const dbConfig = require ("./app/config/db.config"); 
const nodemailer = require('nodemailer');
global.__basedir = __dirname;

var corsOptions = {
  origin: "http://localhost:8081"
};

let transport = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  service: 'gmail', 
  port: 2525,
  auth: {
     user: 'pradeep.verma@webhungers.com',
     pass: 'Pradeep.WH'
  }
});

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


const db = require("./app/models");
const Role = db.role;

db.mongoose
  .connect(`mongodb+srv://dbPradeep:dbPradeepPass@cluster0.tu33o.mongodb.net/usersmovie?retryWrites=true&w=majority`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Successfully connect to MongoDB.");
    initial();
  })
  .catch(err => {
    console.error("Connection error", err);
    process.exit();
  });



  function initial() {
    Role.estimatedDocumentCount((err, count) => {
      if (!err && count === 0) {
        new Role({
          name: "user"
        }).save(err => {
          if (err) {
            console.log("error", err);
          }
  
          console.log("added 'user' to roles collection");
        });
  
        new Role({
          name: "moderator"
        }).save(err => {
          if (err) {
            console.log("error", err);
          }
  
          console.log("added 'moderator' to roles collection");
        });
  
        new Role({
          name: "admin"
        }).save(err => {
          if (err) {
            console.log("error", err);
          }
  
          console.log("added 'admin' to roles collection");
        });
      }
    });
  }


  //send mail
app.get('/api/send_plain_mail', function(req, res) {
  console.log('sending email..');
  const message = {
    from: 'pradeep.verma@webhungers.com', // Sender address
    to: 'pradeep.verma@webhungers.com',         // recipients
    subject: 'test mail from Nodejs', // Subject line
    text: 'Successfully! received mail using nodejs' // Plain text body
};
transport.sendMail(message, function(err, info) {
    if (err) {
      console.log(err)
    } else {
      console.log('mail has sent.');
      console.log(info);
    }
});
});



// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to movie users application." });
});

// routes
require('./app/routes/auth.routes')(app);
require('./app/routes/user.routes')(app);
require('./app/routes/movie.routes')(app);
require('./app/routes/upload.routes')(app);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});