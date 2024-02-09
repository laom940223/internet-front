import axios, { AxiosResponse, isAxiosError } from "axios";
import { AppError, ServerResponse } from "./server-response";



export type Ranch = {

    id: number,
    name: string
}


export const  APIClient = axios.create({
    baseURL: 'http://localhost:4000/api',
    timeout: 1000,
   
  });




  export const getAllRanchs = async ()=>{

    const response = await APIClient.get<ServerResponse<Ranch[]>>("/ranchs") 
    return response.data.data

  }


  export const createNewRanch = async ( {name, id } : { name:string, id?: number } )=>{

      try{
        
        if(!id){
          const response = await APIClient.post<ServerResponse<Ranch>>("/ranchs", {name})
          return response.data.data

        }


        const response = await APIClient.put<ServerResponse<Ranch>>("/ranchs/"+id, {name})
          return response.data.data

          
        
      }catch(err){

        if(isAxiosError<ServerResponse<Ranch>>(err)){

          throw new AppError("Custom error", err.response?.data.error.validationErrors)

        }

      }

  }


  export const deleteRanchById = async ({id}:{id:number})=>{


      try {
        
        const response = await APIClient.delete<ServerResponse<Ranch>>("/ranchs/"+id)
        return response.data.data

      } catch (error) {
        
      }


  }