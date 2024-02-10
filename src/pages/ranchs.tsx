import { useMutation, useQuery } from "@tanstack/react-query"
import { QUERIES } from "../const/queries"
import { Ranch, deleteRanchById, getAllRanchs } from "../api/ranchs-api"
import { Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, Link, Typography } from "@mui/material"

import { DataGrid, GridColDef, GridRowsProp } from "@mui/x-data-grid"

import { Link as RouterLink, Outlet } from "react-router-dom"
import { useRef, useState } from "react"



export const Ranchs = ()=>{

    const [open, setOpen] = useState(false);

    let toDelete = useRef<Ranch | null | undefined>(null)



    const ranchsQuery = useQuery({  
        queryKey:[QUERIES.RANCHS],
        queryFn : getAllRanchs
    })

    
    const deleteMutation = useMutation(
        {
            mutationFn: deleteRanchById,
            onSuccess:()=>{
                ranchsQuery.refetch()
                setOpen(false)
            }
        }
    )


    if( ranchsQuery.isLoading) return <CircularProgress />
    if(ranchsQuery.isError) return <>There was an error</>

    const handleClose = () => {
        if(toDelete.current?.id){
            deleteMutation.mutate({id: toDelete.current?.id})
        }
        

        
    };

    
    const handleClickDelete = (id: number) => {
        
        toDelete.current = ranchsQuery.data!.find(ranch => ranch.id === id )  
        setOpen(true);
    };


    const rows: GridRowsProp<Ranch> = ranchsQuery.data!
      
    const columns: GridColDef<Ranch>[] = [
    { field:"id", headerName:"Id", width:150},
    { field:"name", headerName:"Name", width:200},
    {  field:"actions", headerName: "Actions", width:300 , renderCell: (params)=>{

        
        return  <>
            <Box sx={{ display:"flex",gap:"1em", alignItems:"center" }} >

            <Link component={RouterLink} 
                to={`/ranchs/edit/${params.row.id}`}
                variant="body2"
                >
                Edit 
            </Link>


            
            <Button variant="outlined" color="warning" size="small"   onClick={()=>{ handleClickDelete( params.row.id)}}>
                Delete
            </Button>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                {"Are you sure you want to delete"}
                </DialogTitle>
                <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    {`You are about to delete`} <strong> {`"${toDelete.current?.name}"`} </strong> permanently are you sure?
                </DialogContentText>
                </DialogContent>
                <DialogActions>
                <Button onClick={handleClose}>Disagree</Button>
                <Button onClick={handleClose} autoFocus>
                    Agree
                </Button>
                </DialogActions>
            </Dialog>
            
            </Box>

        </>
    } }
    ];
      
    
    

    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <Grid container>
                    <Grid xs={12}>
        
                        <Typography variant="h5" component="h1">
                            Ranchs
                        </Typography>

                    </Grid>
                    <Grid xs={12} sx={{ padding:"1.5em 0em"}}>
                        <Link component={RouterLink} to={`/ranchs/new`} variant="button"  fontSize={"1em"} >
                            <Button variant="contained">Add new </Button>

                        </Link>                
                    </Grid>
                </Grid>
            </Grid>

            
            <Grid item xs={12}>

                <Outlet/>
            </Grid>

            <Grid item xs={12} sx={{maxHeight:"60vh"}} >
                <DataGrid rows={rows} columns={columns}  />
            </Grid>
        </Grid>



    );


    

}