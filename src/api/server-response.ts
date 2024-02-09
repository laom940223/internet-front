

export type MyValidationError = {

    field: string
    message: string
}

export type ServerError = {

    
    statusCode :number
    validationErrors? : MyValidationError[]
}


export type ServerResponse<T> = {

    StatusCode :number
    data: T,
    error: ServerError
}




export class AppError extends Error  {

    
    validationErrors : MyValidationError[] 

    constructor(message:string,  validationErrors?: MyValidationError[]){

        super(message)
        this.validationErrors = validationErrors || []
    }

}