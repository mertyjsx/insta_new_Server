async function dbAtma(item) {
    let userObj=[]
   
   const promises = item.map(
     async (i) =>{
     
 let user = {
        
         _id: i.node.id,
         id:  i.node.id,
         followed: false,
       }
 console.log(user)
   
 All.push(user)
 
 // wait until all promises are resolved
 
    
     }
   );
 
   console.log("All",All)
     
     
     await  User.insertMany(All, { ordered: false }, (err, data) => {
       if (err) {
         console.log(err);
       } else {
         console.log("65",data);
         All=[]
       }
     })
     
 
   
  
  
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
  
   
function showid(array, cookie) {
    array.map((item) => {
      item.map((item) => Arrayid.push(item.node.id));
    });
    setTimeout(() => {
      //follow(cookie);
    }, 3000);
  }
  
  async function pullUsers(name, cookie) {
    console.log("cookie", cookie);
    //console.log(`https://www.instagram.com/${name}/?__a=1`);
    //"etsy" yazarak etsynin idsini alıyoruz aslında direk idsini bulabilirz ama sonradan bugra yazdıgımızda otomatik onun kullanıclarını almıs olcaz daha rahat
    axios({
      method: "get", //you can set what request you want to be
      url: `https://www.instagram.com/${name}/?__a=1`,
  
      headers: {
        cookie: cookie,
        "sec-fetch-dest": "empty",
  
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
  
        "x-ig-app-id": 936619743392459,
        "x-ig-www-claim": "hmac.AR3EgGFPrRp7lMoflSHG-AggQXPR8gqcknUibswg0xaolnOy",
        "x-requested-with": "XMLHttpRequest",
      },
    }).then((n) => {
      //kullanıcı id sini aldık
      let userid = n.data.logging_page_id.split("_")[1];
  
      //alttaki url followersları alma urlsi ama ilk follower çekişle sonrakiler farklı
      let url = `https://www.instagram.com/graphql/query/?query_hash=c76146de99bb02f6415203be841dd25a&variables=%7B%22id%22%3A%22${userid}%22%2C%22include_reel%22%3Atrue%2C%22fetch_mutual%22%3Atrue%2C%22first%22%3A24%7D`;
  
      axios({
        method: "get", //you can set what request you want to be
        url: url,
  
        headers: {
          cookie: cookie,
          "sec-fetch-dest": "empty",
          "x-csrftoken": "Cf4JWvECIhzt77OrBomorhnVB3PaNFmZ",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-origin",
          referer: "https://www.instagram.com/necklacesofficial/followers/",
          "x-ig-app-id": 936619743392459,
          "x-ig-www-claim":
            "hmac.AR3EgGFPrRp7lMoflSHG-AggQXPR8gqcknUibswg0xaolnOy",
          "x-requested-with": "XMLHttpRequest",
        },
      }).then((response) => {
        //followersları çektik yanında kullancılar ve after geldi sonra bunu loopa alıcaz aşagıda
  
        let obj = response.data.data.user.edge_followed_by;
  
        let after = obj.page_info.end_cursor;
  
        let Array = [];
        //Array.push(obj.edges)
        console.log("ilki tamam", obj);
        let newurl = `https://www.instagram.com/graphql/query/?query_hash=c76146de99bb02f6415203be841dd25a&variables=%7B%22id%22%3A%22${userid}%22%2C%22include_reel%22%3Atrue%2C%22fetch_mutual%22%3Atrue%2C%22first%22%3A200%2C%22after%22%3A%22${
          after.split("==")[0]
        }%3D%3D%22%7D`;
  
        const inter = setInterval(() => {
          axios({
            method: "get", //you can set what request you want to be
            url: newurl,
  
            headers: {
              cookie: cookie,
              "sec-fetch-dest": "empty",
  
              "sec-fetch-mode": "cors",
              "sec-fetch-site": "same-origin",
              referer: "https://www.instagram.com/tomascorekulan/following/",
              "x-ig-app-id": 936619743392459,
              "x-ig-www-claim":
                "hmac.AR3EgGFPrRp7lMoflSHG-AggQXPR8gqcknUibswg0xaolnOy",
              "x-requested-with": "XMLHttpRequest",
            },
          })
            .then(async (response) => {
              newurl = `https://www.instagram.com/graphql/query/?query_hash=c76146de99bb02f6415203be841dd25a&variables=%7B%22id%22%3A%22${userid}%22%2C%22include_reel%22%3Atrue%2C%22fetch_mutual%22%3Atrue%2C%22first%22%3A100%2C%22after%22%3A%22${
                response.data.data.user.edge_followed_by.page_info.end_cursor.split(
                  "=="
                )[0]
              }%3D%3D%22%7D`;
  
              await dbAtma(response.data.data.user.edge_followed_by.edges);
  
              //yukarıdaki direk id si her request sonrası new url üretiyoruz çünkü after şeyleri farklı hepsinin
  
              //50 ye ulaştıgında durdur
            })
            .catch();
        }, 12000);
      });
    });
  }