
 export function validateBrand(b, brands) {
     if(!b) {
         return brands[0].id    // return the default brand
     }
     for(let brand of brands) {
         if(b===brand.id || b==brand.abbr){
             return brand.id
         }
     }
 }