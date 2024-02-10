import axios, { AxiosResponse, isAxiosError } from "axios";
import { AppError, ServerResponse } from "./server-response";



export type InternetPackage = {

    id: number ,
    name: string,
    price: number,
    description: string
}


export const  APIClient = axios.create({
    baseURL: 'http://localhost:4000/api',
    timeout: 1000,
   
  });




  export const getAllPackages = async ()=>{

    const response = await APIClient.get<ServerResponse<InternetPackage[]>>("/internet-packages") 
    return response.data.data

  }


  export const deletePackage = async({id}:{ id: number})=>{

      try{

        return await APIClient.delete<ServerResponse<InternetPackage>>("/internet-packages/"+id)

      }catch(err){

        throw new Error("Something went wrong")
      }


  }


  export const createNewInternetPackage = async ( {name, id, price, description } : { name:string, id?: number, price: number, description: string } )=>{

    // console.log("")

      try{
        
        if(!id){
          const response = await APIClient.post<ServerResponse<InternetPackage>>("/internet-packages", {name, price: +price, description})
          return response.data.data

        }


        const response = await APIClient.put<ServerResponse<InternetPackage>>("/internet-packages/"+id, {name, price: +price, description})
          return response.data.data

          
        
      }catch(err){

        if(isAxiosError<ServerResponse<InternetPackage>>(err)){

          throw new AppError("Custom error", err.response?.data.error.validationErrors)

        }

      }

  }


