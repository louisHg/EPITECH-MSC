import { Buffer } from "buffer"
import { authorize } from 'react-native-app-auth';

async function redditConnexion(config){
    try{
      const result = await authorize(config)
      .then(()=>console.log(result.accessToken))
    }
    catch(e){
      console.log(e)
    }
}

export { redditConnexion }