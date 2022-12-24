let express = require("express");
let mongoose = require("mongoose");
let app = express();

const cors = require("cors");

app.use(express.json());
app.use(cors({ origin: "http://localhost:3000" }));

require("dotenv").config();

let mongoDBUsername = encodeURIComponent(process.env.MONGODB_USERNAME);
let mongoDBPassword = encodeURIComponent(process.env.MONGODB_PASSWORD);
let mongoDBUri = `mongodb+srv://${mongoDBUsername}:${mongoDBPassword}@cluster0.x4wqlpw.mongodb.net/?retryWrites=true&w=majority`;

mongoose.set('strictQuery', false);
mongoose.connect(
  mongoDBUri,
  { 
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
)
.then(() => console.log("MongoDB successfully connected"))
.catch(err => console.log(err));

const port = process.env.PORT || 5000;

app.listen(port, () => console.log('Server up and running on port ' + port));

let Vote = require("./models/vote");

///////////////////////////// POST /////////////////////////////
app.post("/vote/:prompt", async function(req, res) {

  let whichOptionChatGPTGenerated = req.body.whichOptionChatGPTGenerated;

  const vote = new Vote({
    promptNumber: req.params.prompt,
    whichOptionChatGPTGenerated: whichOptionChatGPTGenerated
  });

  vote.save()
    .then(vote => {
      res.json(vote);
    })
    .catch(err => console.log(err));
});

///////////////////////////// GET /////////////////////////////
app.get("/vote/:prompt", async function(req, res) {

  const optionOneChatGPTGeneratedCount = await Vote.countDocuments({ 
    promptNumber: req.params.prompt,
    whichOptionChatGPTGenerated: 1
  });

  const optionTwoChatGPTGeneratedCount = await Vote.countDocuments({ 
    promptNumber: req.params.prompt,
    whichOptionChatGPTGenerated: 2
  });

  res.json({optionOneChatGPTGeneratedCount: optionOneChatGPTGeneratedCount, optionTwoChatGPTGeneratedCount: optionTwoChatGPTGeneratedCount});
});