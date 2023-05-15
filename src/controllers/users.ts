import { Request, Response } from 'express';
import axios from 'axios';
import { ServerUserData } from '../interfaces/serverUserData';
import { ServerUserArray } from '../interfaces/serverUserArray';
import { User } from '../models/users';
import { Posts } from '../models/posts';
import { ServerPostArray } from '../interfaces/serverPostArray';


export class UserController {
    domain:string = "https://jsonplaceholder.typicode.com/";
    res:Response;
    req:Request;

    constructor (res:Response, req: Request) {
        this.res = res;
        this.req = req;
    }

 convertName(paramArray: ServerUserArray):Array<any> {
    let responseArray = paramArray.data.map((element)=>{
        const nameSeparator = element.name.split(" ");
        let prefix:string = "";
        let firstName:string = "";
        let lastName:string = "";
        if (nameSeparator.length > 2) {
            prefix = nameSeparator[0];
            firstName = nameSeparator[1];
            lastName = nameSeparator[2];
        }
        else
        {
            prefix = "";
            firstName = nameSeparator[0];
            lastName = nameSeparator[1];
        }
        
    let userMap:User = {
        id:element.id,
        prefix,
        firstName,
        lastName,
        email:element.email,
        address:element.address.street + " " + element.address.suite + " " + element.address.city + " " + element.address.zipcode,
        geolocation: "("+element.address.geo.lat + ", " + element.address.geo.lng+")",
        companyName: element.company.name
    };
    //userMap.id = element.id
    return userMap;
});
return responseArray
}



    async getAll():Promise<boolean> {    
        const url:string = this.domain + "users/";
        let functionStatus:boolean = true;
        let responseArray:Array<any>;
        //let userId:number = 1;
        //responseArray.data = [];
        try {
            console.log("- API Call")
            const resultArray:ServerUserArray = await axios.request({
                url,
            });
            responseArray = this.convertName(resultArray);
   
            console.log("Response Sent");      
            this.res.status(200).json(
                responseArray
            ); 
        }
        catch(error) {
            console.log(error);
            functionStatus = false;
            throw new Error(`Error in 'getAll': ${error}`);
        }
       return functionStatus;
    }


}
