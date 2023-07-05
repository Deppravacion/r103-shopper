// promises that handle the fetch calls
import { COMMERCE_URL, COMMERCE_PUBLIC_API, COMMERCE_PRIVATE_API } from "./constants";

  // export class CommerceService {
  //   async fetchProducts() {
  //     return new Promise( async (succ, fail) => {
  //       try {
  //         const url = new URL(
  //           COMMERCE_URL
  //          );           
  //          const params = {
  //            "limit": "25",
  //          };
  //          Object.keys(params)
  //            .forEach(key => url.searchParams.append(key, params[key]));
           
  //          const headers = {
  //            "X-Authorization": COMMERCE_PUBLIC_API,
  //            "Accept": "application/json",
  //            "Content-Type": "application/json",
  //          };
        
  //         const response = await fetch(url, {
  //           method: "GET",
  //           headers: headers,
  //         })
  //         if (response.ok) {
  //           const json = await response.json()
  //           const apiCartItems = {}

  //           const data = json.forEach((item) => {
  //             apiCartItems[item.name] = {
  //               id: item.id, 
  //               name: item.name,
  //               description: item.description, 
  //               price: item.price.raw,
  //               image: item.image.url,
  //               quantity: 0,
  //               get total() {
  //                 return this.price * this.quantity
  //               }
  //             }
  //           })
  //           succ({ response, data })
  //         } else {
  //           fail( {err: 'Invalid Request'} )
  //         }
  //       } catch(err) {
  //         fail(err)
  //       }
  //     })
  //   }
  // }

  //below is a function method. practice above
  export class CommerceService {
    async fetchProducts() {
      return new Promise( async (succ, fail) => {
        try {
          const url = new URL(
            COMMERCE_URL
           );           
           const params = {
             "limit": "25",
           };
           Object.keys(params)
             .forEach(key => url.searchParams.append(key, params[key]));
           
           const headers = {
             "X-Authorization": COMMERCE_PUBLIC_API,
             "Accept": "application/json",
             "Content-Type": "application/json",
           };
        
          const response = await fetch(url, {
            method: "GET",
            headers: headers,
          })
          if (response.ok) {
            const json = await response.json()
            const data = json.data
              .map((item, index) => ({
                id: item.id, 
                name: item.name,
                description: item.description, 
                price: item.price.raw,
                image: item.image.url,
                quantity: 0,
              }))
            succ({ response, data })
          } else {
            fail( {err: 'Invalid Request'} )
          }
        } catch(err) {
          fail(err)
        }
      })
    }
  }