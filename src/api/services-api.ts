import { InternetPackage } from "./internet-packages-api"
import { APIClient, Ranch } from "./ranchs-api"
import { ServerResponse } from "./server-response"



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



export const createNewService = async ({ service  }: CreateUpdateService)=>{


    const { ip } = service

    


    const response = await APIClient.post<ServerResponse<Service>>(`/services`, {

        ...service,
        ip : ip==="" || ip===null || ip===undefined ? undefined : ip  
    })
    return response.data.data

}