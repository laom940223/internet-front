import { isAxiosError } from "axios"
import { InternetPackage } from "./internet-packages-api"
import { APIClient, Ranch } from "./ranchs-api"
import { AppError, ServerResponse } from "./server-response"


export enum ServiceStatus {
    ONLINE ="ONLINE",
    OFFLINE = "OFFLINE",
    CREATED = "CREATED",
    PAYMENTDUE ="PAYMENTDUE"
}

export type Service ={

    id:string
    name:string,
    lastName: string,
    phone:string,
    latitude:number,
    longitude: number,
    ip?:string
    package?: InternetPackage,
    ranch?: Ranch,
    packageId? : number,
    ranchId?: number
    paymentDay? : number,
    stripeId? : number
    serviceStatus: ServiceStatus


}


export type CreateService = Omit<Service, "id">

type CreateUpdateService = {
    service: CreateService,
    id?: string
}


export const getAllServices = async ()=>{

    const response = await APIClient.get<ServerResponse<Service[]>>("/services") 
    return response.data.data

}


export const getServiceById = async (id:string)=>{

    const response = await APIClient.get<ServerResponse<Service>>("/services/"+id)

    return response.data.data

}



export const createNewService = async ({ service, id  }: CreateUpdateService)=>{


    const { ip } = service
    const myip =ip==="" || ip===null  ? null : ip  


    try{

    
            if(!id){
                const response = await APIClient.post<ServerResponse<Service>>(`/services`, {

                    ...service,
                    ip : myip 
                })
                return response.data.data
            }


            const response = await APIClient.put<ServerResponse<Service>>(`/services/${id}`, {
                ...service,
                ip : myip 
            })
            return response.data.data
        }catch(err){

            if(isAxiosError<ServerResponse<InternetPackage>>(err)){

                throw new AppError("Custom error", err.response?.data.error.validationErrors)
      
            }

            throw  err


        }

        

}