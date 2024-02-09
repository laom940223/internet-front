
import {  useMutation,  useQueryClient } from "@tanstack/react-query"

import { QUERIES } from "../../const/queries"
import { Navigate, redirect, useNavigate, useParams } from "react-router-dom"
import * as React from 'react';

import Button from '@mui/material/Button';

import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';

import Typography from '@mui/material/Typography';
import { useForm, SubmitHandler } from "react-hook-form";
import { Ranch, createNewRanch } from "../../api/ranchs-api";

import { AppError, ServerResponse } from "../../api/server-response";



type Inputs = {
    name: string
    
  }


export const CreateRanchForm = ()=>{

    const { id } = useParams()
    const navigate = useNavigate()
    
    const queryClient = useQueryClient()
    const ranchs =  queryClient.getQueryData<Ranch[]>([QUERIES.RANCHS])

    let toEdit :Ranch 
    
    if ( id ){

        toEdit =ranchs?.find( ranch => ranch.id === +id )!

    } 

    const {
        register,
        handleSubmit,
        // watch, 
        setError,
        reset,
        setValue,
        setFocus,
        formState: { errors },
      } = useForm<Inputs>()

    
    const onSubmit: SubmitHandler<Inputs> = ({name}) => {        
        
        if(!toEdit) {
            newRanchMutation.mutate({ name })
            return
        }

        if(name === toEdit.name) return

        newRanchMutation.mutate({ name, id : toEdit.id })
                    
    }
    
    const newRanchMutation = useMutation({
        mutationFn: createNewRanch,
        onSuccess:(data)=>{
            
            
            queryClient.invalidateQueries({ queryKey:[QUERIES.RANCHS], refetchType:"active" })
            reset()
             navigate("/ranchs")
            // console.log("")
        
        },
        onError: (err)=>{

            if(err instanceof AppError){

                err.validationErrors.forEach(err=>{

                    setError(err.field === "name"? "name":"root", {message: err.message })

                })

            }
            
        }
        
    })  


    React.useEffect(()=>{

        if(id){
            setValue("name", toEdit.name, { shouldTouch :true} )
            setFocus("name")
            // console.log(toEdit)
        }

        else{

            reset()
        }

        

    }, [id])
    
    

    

    return (
        
        <Box
            sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            }}
        >
            <Typography component="h1" variant="h5">
               { id ?  `Edit ranch` : "Create new ranch"}
            </Typography>
            <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ mt: 1 }}>
            
            {/* <input defaultValue="test"  /> */}
            <TextField
                margin="normal"
                required
                fullWidth
                error = {!!errors.name }
                helperText={ errors.name?.message || "Please provide a name" }
                {...register("name", {required:true })}
                id="name"
                label="Name"
                
                
                autoFocus
            />
            
            <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={ newRanchMutation.isPending }
                sx={{ mt: 3, mb: 2 }}
            >
                { id ? "Edit" : "Create" }
            </Button>
            </Box>
        </Box>
        
        
    );


}












