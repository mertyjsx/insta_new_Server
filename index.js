const express = require("express");
const axios = require("axios");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const User = require("./userModel");
const Log = require("./logModel");
const { Run, ig, Run2 } = require("./private-api");
let interval = 0;
const port = process.env.PORT || 4000;
let ok = 0;
const Arrayid = [];
let All = [];
let normaltime= 1300000 
let gecikmelitime=4800000

app.use(cors());
app.use(express.json());

const uri =
  "mongodb+srv://enes123:enes123@cluster0.3cmvt.mongodb.net/insta?retryWrites=true&w=majority";

mongoose.connect(uri, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

const connection = mongoose.connection;
connection.once("open", () => {
  console.log("MongoDB database connection established successfully");
});

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
const getActive=async ()=>{
 
  return await Log.find({}, async (err, data) => {
      if (err) {
        console.log(err);
      } else {
        
       
      }
    });
  }
const getUsers=async ()=>{

return await User.find({}, async (err, data) => {
    if (err) {
      console.log(err);
    } else {
      
     
    }
  });
}
const getOneUser=async ()=>{

  return await User.findOne({ followed: false }, function (err, adventure) {


  });
    
  }
 
const olumsuz = (body) => {
  Log.findOne({ _id: body.query.account }, async (err, res) => {
    console.log(err);
    console.log(res);
    if (!res) {
      Log.create(
        {
          _id: body.query.account,
          active: false,
          time: new Date(),
          Proxy:ig.state.proxyUrl
        },
        (err, data) => {
          if (err) {
            console.log(err);
          } else {
            console.log(data);
          }
        }
      );
    } else {
      Log.updateOne(
        { _id: body.query.account }, // Filter
        { $set: { active: false, time: new Date(),Proxy:ig.state.proxyUrl } } // Update
      )
        .then(async (obj) => console.log("Ok"))
        .catch((err) => console.log("181", err));
    }
  });
};

const olumlu = (body) => {
  console.log("oldu bu iş")
  Log.findOne({ _id: body.query.account }, (err, res) => {
    if (!res) {
      Log.create(
        {
          _id: body.query.account,
          active: true,
          time: new Date(),
          Proxy:ig.state.proxyUrl
        },
        (err, data) => {
          if (err) {
            console.log(err);
          } else {
            console.log(data);
          }
        }
      );
    } else {
      Log.updateOne(
        { _id: body.query.account }, // Filter
        { $set: { active: true, time: new Date() ,Proxy:ig.state.proxyUrl} } // Update
      )
        .then((obj) => console.log("updated"))
        .catch((err) => console.log(err));
    }
  });
};

const int = async (body) => {
  const user = await getOneUser();
  console.log(user);

  ig.friendship
    .create(user.id)
    .then((response) => {
      console.log("bura önemli", response);
      console.log("buraya girebilir");

      if (response.outgoing_request || response.following) {
        let followLog = response.following ? "following" : "requested";
        setTimeout(() => {
          int(body)
        }, normaltime);
        User.updateOne(
          { _id: user._id }, // Filter
          {
            $set: {
              followed: true,
              log: followLog,
              time: new Date(),
              account: body.query.account,
            },
          } // Update
        ).catch((err) => console.log("138", err));

        olumlu(body);
      } else {
     

        olumsuz(body);
      //  Run2(body.headers.username, body.headers.pass);
        setTimeout(() => {
          int(body)
        }, gecikmelitime);
        
      }
    })
    .catch(async (e) => {
  
      olumsuz(body);
    //  Run2(body.headers.username, body.headers.pass);
   setTimeout(() => {
     int(body)
   }, gecikmelitime);
    });
};

async function follow(body) {
  console.log("Başladı");
  await sleep(2000);
  console.log("Two seconds later, showing sleep in a loop...");

  // Sleep in loop
  int(body)

  console.log("hhh");
}


app.get("/info", async (req, res) => {
  const users = await getUsers();
  console.log(users);
  res.status(200).send({ users: users });
});

app.get("/active", async (req, res) => {
  const active = await getActive();
  console.log(active);
  res.status(200).send({ active: active });
});

app.post("/follow", async (req, res) => {
  console.log("burası follow");

  Run(req.headers.username, req.headers.pass,follow,req)
    .then((response) => {
      console.log("bakbu", response);
      if (response.pk) {
        res.send("ok");
        
      } else {
        console.log(response)
        res.send("not ok");
      }
    })
    .catch((e) =>{ 
      console.log(e)
      res.send("not ok")});
});

app.listen(port, () => {
  setTimeout(() => {
    //User.deleteMany().then(e=>console.log(e))
    //pullUsers("necklacesofficial",' ig_did=1B6DD261-B5CD-4B9C-BD54-F92D2F1A381E; mid=Xy1jHAALAAFGGg1b9oim18euAcN6; fbm_124024574287414=base_domain=.instagram.com; datr=7CxEXygCWAWwj8_G6630yIUB; rur=RVA; ig_gdpr_signup=%7B%22count%22%3A2%2C%22timestamp%22%3A1601977913136%7D; ig_nrcb=1; fbsr_124024574287414=7IdbY9o0sgYpCl-DfM7ks2DfpHxY7RohWZ0kKPl4geM.eyJ1c2VyX2lkIjoiMTI1NzY2NzQwMCIsImNvZGUiOiJBUUIyTnFpTG9kcGVhQnJwVVBOVE5mNldSOWVTNWc2V2FjRFF4VWFKYmR6TWw0ZGJDWTM5S2NGQ2RGeFNYeEVzdDhmcmtJV0taM3hDdXo3eE9MSDBRMFFXbnFxMm1reGlyVkZQbFhvYlUwa1RVZjdaWEFKNElrdWZsSVdjNmFCM19jRVBiQkloVUotdGQ5eUJiZ2hiY2Y1WnJhbEpRdEhWcmQ3SFZBZEJEWXBXbXFyaHdMX3AzTkU2Y0JmSGhHRkRJZHdIeVVsVHpFNzBQOXE0M2dlY3A0Vmh1ZHNMdXN0QmNfYkFSUDBQQzBZTzI4YThQbmNINEhfMXo5eVlQOS1zNXhvSmJkUE9CZ0NKZzZNRklzMkV6NGNaTTFTbHVMSU5BWVBiMG5ZcDFidmgxSHFtYWVfbk1kM2MwZE5XOEFIVEJWSSIsIm9hdXRoX3Rva2VuIjoiRUFBQnd6TGl4bmpZQkFKNG4xV0JaQVR0SjZBa1RaQmhkdmtKUUFuNjF1STJFelRZRlRsYkYwNjZYQmg3d1BGak91ZHZDZUhHZUJaQURJVHRqa1pBUTBNb2FjS1Q0Q2R4RHdMcTdUZ3JrQXdoVE5YTjVYSWlIZ0xuTUVJSDlIMDVlMnNYbVE2MnRlY2tYZzBQY2xMU1Byek9kRXJiclRaQ0dNR3NRU3BBaVFWZ1pEWkQiLCJhbGdvcml0aG0iOiJITUFDLVNIQTI1NiIsImlzc3VlZF9hdCI6MTYwMjA3NTM0NH0; csrftoken=Cf4JWvECIhzt77OrBomorhnVB3PaNFmZ; ds_user_id=43227602058; sessionid=43227602058%3A3lVzpvs27FhC3f%3A2; shbid=6407; shbts=1602083711.6219184; urlgen="{\"78.190.56.63\": 47331\054 \"46.155.41.28\": 15897}:1kQXpC:w3XnmEgyr9JHQ1SBNA7GlclWx2M"')
    //Run().then((response)=>follow())
  }, 2000);
  console.log(`Example app listening at http://localhost:${port}`);
});
