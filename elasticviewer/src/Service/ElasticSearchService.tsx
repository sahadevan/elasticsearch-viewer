export async function getIndices(elasticUrl: string) {    
    let indices: string[] = [];
   try{    
       if(elasticUrl){
        let response = await fetch(elasticUrl + '_aliases');
        if(response && response.ok)
        {
            let aliases = await response.json();
            if(aliases)
            {
            Object.keys(aliases).forEach((index) => {
                console.log(index);
                indices.push(index);
            });
            }
        }  
        return indices;
    }else{
        console.log('Invalid ElasticSearch URL :' + elasticUrl);
    }
   }catch(error){
    console.log(error);
    return indices;
   }
}

export async function getClusterHealth(elasticUrl: string){
    let health : string = "";
    try{    
        if(elasticUrl){
         let response = await fetch(elasticUrl + '_cat/health');
         if(response && response.ok)
         {
            var result = await response.body?.getReader().read();
            health =  new TextDecoder("utf-8").decode(result?.value);
            health = health.split(" ")[3];
            console.log('Elasticsearch cluster health: '+ health);             
         }  
         return health;
     }else{
         console.log('Invalid ElasticSearch URL :' + elasticUrl);
     }
    }catch(error){
     console.log(error);
     return health;
    }
}