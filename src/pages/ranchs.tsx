import { useQuery } from "@tanstack/react-query"
import { QUERIES } from "../const/queries"
import { Ranch, getAllRanchs } from "../api/ranchs-api"
import { Button, CircularProgress, Grid, Link } from "@mui/material"

import { DataGrid, GridColDef, GridRowsProp } from "@mui/x-data-grid"

import { Link as RouterLink, Outlet } from "react-router-dom"



export const Ranchs = ()=>{


    const ranchsQuery = useQuery({  
        queryKey:[QUERIES.RANCHS],
        queryFn : getAllRanchs
    })

    


    if( ranchsQuery.isLoading) return <CircularProgress />
    if(ranchsQuery.isError) return <>There was an error</>

    


    const rows: GridRowsProp<Ranch> = ranchsQuery.data!
      
    const columns: GridColDef<Ranch>[] = [
    { field:"id", headerName:"Id", width:150},
    { field:"name", headerName:"Name", width:200},
    {  field:"actions", headerName: "Actions", width:300 , renderCell: (params)=>{

        
        return  <>
            
            <Link component={RouterLink} 
                to={`/ranchs/edit/${params.row.id}`}
                variant="body2"

                >
                Edit 
            </Link>
        </>
    } }
    ];
      
    
    

    return (
        <Grid container spacing={2}>
            <Grid xs={12}>
                Titulop
                <Link component={RouterLink} to={`/ranchs/new`}   variant="body2"
                    >
                    Add New Ranch
                </Link>
            </Grid>
            <Grid xs={12}  >
              <DataGrid rows={rows} columns={columns}  />
            </Grid>
            <Grid xs={12}>

                <Outlet/>
            </Grid>
        </Grid>



    );


    

}