const axios = require("axios");
const FaceAPiKey = process.env["Face__AuthKey"];
const FaceApiEndpoint = process.env["Face__Endpoint"];
module.exports = async function (context, req) {
  context.log(`url in post method is ${req} to call face detectiont.`);
  const cognitiveServiceParams = "returnFaceAttributes=age,gender,smile,facialHair,glasses,emotion,hair,makeup,accessories"
  const faceApiUrl = `${FaceApiEndpoint}/face/v1.0/detect`;

  const headers = {
    'Content-Type': 'application/json',
    'Ocp-Apim-Subscription-Key': FaceAPiKey
  }

  const data= { "url": req.body };

  let response = await getFaceApi(faceApiUrl, data, headers, cognitiveServiceParams)
  let personAtrributes=reportAttributes(response.data[0]);
     

  context.res = {
    status: 200,
    body: personAtrributes
  };
  try{
    let signalrObj={name:'Anonymous',detail:personAtrributes,type:'interovert'}
    if (req.query && req.query.name && typeof req.query.name!="undefined" && req.query.name.trim()!='')  {
       signalrObj.name=req.query.name ;
    }
    if (req.query && req.query.type && typeof req.query.type!="undefined" && req.query.type.trim()!='')  {
      signalrObj.type=req.query.type ;
   }
    let personDetail=  {
      target: 'summercampBroadcastedDetail',
      arguments: [signalrObj]
      };
    context.bindings.signalRMessages =personDetail;
    }
    catch(error){
      context.log(`error in outbinding to signalr`,error);
    }
  // context.res = {
  //   status: 200,
  //   body: response.data
  // };
  context.done();
}

  function percentage(num){
      if (!isNaN(num)){
        let res= (num.toFixed(2) * 100);
        return `${res}%`;
        }
        return "0%";  
    }

  function reportAttributes(attr){
    let faceAttribute=  attr.faceAttributes;
    let description='<div>';
    if (faceAttribute.hasOwnProperty('smile') ){ description=description.concat(`You have a nice smile! Almost ${percentage(faceAttribute.smile)} smile`,"</br>")}
    if (faceAttribute.hasOwnProperty('age') ){ description=description.concat(`umm are ${faceAttribute.age} years old? You look younger :)`,"</br>")}
    if (faceAttribute.hasOwnProperty('gender') ){ description=description.concat(`You might be ${faceAttribute.gender}, am I right?`,"</br>")}
    if (faceAttribute.hasOwnProperty('facialHair') ){ 
      if (faceAttribute.facialHair.moustache && faceAttribute.facialHair.moustache>0)  { description=description.concat(`You have ${faceAttribute.facialHair.moustache} moustache`,"</br>")}
      if (faceAttribute.facialHair.beard && faceAttribute.facialHair.beard>0)  { description=description.concat(`You have ${faceAttribute.facialHair.beard} beard`,"</br>")}
    }
    if (faceAttribute.hasOwnProperty('glasses') ){ description=description.concat(`You wear ${faceAttribute.glasses}`,"</br>")}
    if (faceAttribute.hasOwnProperty('emotion') ){ 
      description=description.concat(`You look ...`);
      if (faceAttribute.emotion.anger && faceAttribute.emotion.anger>0)  { description=description.concat(` ${percentage(faceAttribute.emotion.anger)} angry`,",")}
      if (faceAttribute.emotion.contempt && faceAttribute.emotion.contempt>0)  { description=description.concat(` ${percentage(faceAttribute.emotion.contempt)} contempt`,",")}
      if (faceAttribute.emotion.happiness && faceAttribute.emotion.happiness>0)  { description=description.concat(`  ${percentage(faceAttribute.emotion.happiness)} happy :)`,",")}
      if (faceAttribute.emotion.fear && faceAttribute.emotion.fear>0)  { description=description.concat(`  ${percentage(faceAttribute.emotion.fear)} fearful`,",")}
      if (faceAttribute.emotion.neutral && faceAttribute.emotion.neutral>0)  { description=description.concat(`  ${percentage(faceAttribute.emotion.neutral)} neutral`,",")}
      if (faceAttribute.emotion.sadness && faceAttribute.emotion.sadness>0)  { description=description.concat(`  ${percentage(faceAttribute.emotion.sadness)} sad`,",")}
      if (faceAttribute.emotion.surprise && faceAttribute.emotion.surprise>0)  { description=description.concat(`  ${percentage(faceAttribute.emotion.surprise)} surprised`,",")}
      description=description.concat(`</br>`);
     
    }
    if (faceAttribute.hasOwnProperty('makeup') ){ 
      if (faceAttribute.makeup.eyeMakeup==true ||  faceAttribute.makeup.lipMakeup==true)  { description=description.concat(`You have just a bit makeup. Looks good :)`,"</br>")}
    }

    // if (faceAttribute.hasOwnProperty('accessories')   ){ }
      if (faceAttribute.hasOwnProperty('hair')  ){ 
        let colors='';
        if (faceAttribute.hair.bald>0)  { description=description.concat(`looks like you have lost ${percentage(faceAttribute.hair.bald)} of your hair`,"</br>")}
      if (faceAttribute.hair.hairColor && faceAttribute.hair.hairColor.length>0)  { 
          faceAttribute.hair.hairColor.map(hair=>{  
            if (hair.confidence>0.5){ colors=colors.concat(hair.color,",")}
              
         })
        if (colors!=''){description=description.concat(`your hair is ${colors} `)}
        }
        
    
    }
      description=description.concat("</br>");
      return description;
  }
  

async function getFaceApi(url, data, headers, params) {
  try {
    let endpoint = url;
    if (params != '') { endpoint = `${url}?${params}` }

      return axios.post(endpoint, data,
        { headers: headers }

      )

  } catch (error) {
    log('Error in analysing the file' + error);
    throw error;
  }
}