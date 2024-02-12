import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { QUERIES } from "../const/queries"
import { Ranch, deleteRanchById, getAllRanchs } from "../api/ranchs-api"
import { Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, Link, TextField, Typography } from "@mui/material"

import { DataGrid, GridColDef, GridRowsProp } from "@mui/x-data-grid"

import { Link as RouterLink, Outlet, useNavigate } from "react-router-dom"
import { useEffect, useRef, useState } from "react"
import { InternetPackage,  createNewInternetPackage,  deletePackage,  getAllPackages } from "../api/internet-packages-api"
import { SubmitHandler, useForm } from "react-hook-form"
import { AppError } from "../api/server-response"
import { Service, getAllServices } from "../api/services-api"


type Inputs = {
    name: string
    price:number,
    description: string

  }

export const Services = ()=>{

    const navigate = useNavigate()

   

    const servicesQuery = useQuery({  
        queryKey:[QUERIES.SERVICES],
        queryFn : getAllServices
    })

    
    

   


    if( servicesQuery.isLoading) return <CircularProgress />
    if(servicesQuery.isError) return <>There was an error</>


  
    
  

    const handleClickEdit= (id: string)=>{
        // toDelete.current = servicesQuery.data!.find(ipackage => ipackage.id === id )  
       navigate("/services/"+id)
        
        
    }

    

    


    const rows: GridRowsProp<Service> = servicesQuery.data!
      
    const columns: GridColDef<Service>[] = [
    { field:"id", headerName:"ID", width:80},
    { field:"name", headerName:"Name", width:150},
    { field:"lastName", headerName:"Last Name", width:150},
    { field:"paymentDay", headerName:"Payment day", width:150},
    { field:"serviceStatus", headerName:"Status", width:150},
    { field:"ranch",headerName:"Ranch",  width:150,  renderCell: params =>{

        return params.row.ranch?.name!

    }},


    { field:"package",headerName:"Package",  width:100, renderCell: params =>{

        return params.row.package?.name!

    }},

    { field:"ip", headerName:"IP", width:200},
    
    {  field:"actions", headerName: "Actions", width:150 , renderCell: (params)=>{

        
        return  <>
            <Box sx={{ display:"flex",gap:"1em", alignItems:"center" }} >

           
                    <Link component={RouterLink} to={`/services/${params.row.id}/payments`} variant="caption"  sx={{ textDecoration:"none"}} fontSize={"1em"} >
                        
                        <Button variant="outlined">
                            Details
                        </Button>
                        
                    </Link>

            
            
            
            </Box>

        </>
    } }
    ];
      

    // 
    
    

    return (
        <Grid container >
            <Grid item xs={12} sx={{pl:0}}>
                <Grid container>
                    <Grid item xs={12}>
    
                        <Typography variant="h5" component="h1" >
                            Services
                        </Typography>
                        

                    </Grid>
                    <Grid xs={12} sx={{ padding:"1.5em 0em"}}>
                    
                    <Link component={RouterLink} to={`/services/new`} variant="button"  fontSize={"1em"} >
                            <Button variant="contained">Add new </Button>

                        </Link>                
                    </Grid>
                </Grid>
            </Grid>

            
            <Grid xs={12}>

                <Outlet/>
            </Grid>

            <Grid xs={12} sx={{ minHeight:"60vh",  maxHeight:"80vh"}} >
              <DataGrid rows={rows} columns={columns}  />
            </Grid>
        </Grid>



    );


    

}