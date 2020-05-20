const  axios=require("axios");
const FaceAPiKey=process.env["Face__AuthKey"];
const FaceAPiEndpoint=process.env["Face__Endpoint"];
module.exports=   async function (context) {
  context.log('JavaScript HTTP trigger function processed face detectiont.');
  var params = "returnFaceAttributes=age,gender,smile,facialHair,glasses,emotion,hair,makeup,accessories"
    
    var url=`${FaceAPiEndpoint}/face/v1.0/detect`;
 
const headers = {
    'Content-Type': 'application/json',
    'Ocp-Apim-Subscription-Key': '0efa1e276d7540e2bb479adceaa12edd'
  }
//   "url": 'https://homepages.cae.wisc.edu/~ece533/images/girl.png'
  const data= {
    "url": 'https://homepages.cae.wisc.edu/~ece533/images/girl.png'
 };
  
    let resp= await GetURLdata(url,data,headers,params)
    context.res = {
              status: 200,
              body: resp.data
            };
    context.done();
}
 

async function  GetURLdata(url, data,headers,params) {
    try {
        let endpoint=url;
        if (params!=''){endpoint=`${url}?${params}`}
     
        return axios.post( endpoint,data,
            {headers:headers}
      
            )
          
    } catch (error) {
        log('Error getting content ' + error);
        throw error;
    }
}