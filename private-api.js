const { IgApiClient }=require('instagram-private-api');
const axios = require("axios");

// You must generate device id's before login.
// Id's generated based on seed
// So if you pass the same value as first argument - the same id's are generated every time

// Optionally you can setup proxy url

const Run=async (username,pass,follow,req) => {
    let  ig= new IgApiClient();
    console.log("lol",username)
    ig.state.generateDevice(username);



   




    ig.state.proxyUrl = req.headers.proxy;
    console.log("proxy",process.env.IG_PROXY)
  // Execute all requests prior to authorization in the real Android application
  // Not required but recommended
  const bune=await ig.simulate.preLoginFlow();
  
  const loggedInUser = await ig.account.login(username, pass);
  // The same as preLoginFlow()
  console.log("bune",bune)
  console.log("loginuser",loggedInUser)
  // Optionally wrap it to process.nextTick so we dont need to wait ending of this bunch of requests
  await ig.simulate.postLoginFlow()
  // Create UserFeed instance to get loggedInUser's posts
  const userFeed = ig.feed.user(loggedInUser.pk);
console.log("userfeed",userFeed)
if(loggedInUser){
follow(req)

}

console.log(loggedInUser)
return loggedInUser

}

const Run2=async (username,pass) => {

  console.log("lol",username)
  ig.state.generateDevice(username);
// Execute all requests prior to authorization in the real Android application
// Not required but recommended
ig.state.proxyUrl = process.env.IG_PROXY;
await ig.account.logout()


const bune=await ig.simulate.preLoginFlow();

const loggedInUser = await ig.account.login(username, pass);
// The same as preLoginFlow()
console.log("bune",bune)
console.log("loginuser",loggedInUser)
// Optionally wrap it to process.nextTick so we dont need to wait ending of this bunch of requests
await ig.simulate.postLoginFlow()

// Create UserFeed instance to get loggedInUser's posts
const userFeed = ig.feed.user(loggedInUser.pk);





console.log("userfeed",userFeed)
//console.log(loggedInUser)
return loggedInUser

}











exports.Run = Run
exports.Run2=Run2