import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { QUERIES } from "../const/queries"
import { Ranch, deleteRanchById, getAllRanchs } from "../api/ranchs-api"
import { Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, Link, TextField, Typography } from "@mui/material"

import { DataGrid, GridColDef, GridRowsProp } from "@mui/x-data-grid"

import { Link as RouterLink, Outlet } from "react-router-dom"
import { useEffect, useRef, useState } from "react"
import { InternetPackage,  createNewInternetPackage,  deletePackage,  getAllPackages } from "../api/internet-packages-api"
import { SubmitHandler, useForm } from "react-hook-form"
import { AppError } from "../api/server-response"


type Inputs = {
    name: string
    price:number,
    description: string

  }

export const InternetPackages = ()=>{

    const [openDelete, setOpenDelete] = useState(false);
    const [openAdd, setOpenAdd] = useState(false)
    const queryClient = useQueryClient()

    let toDelete = useRef<InternetPackage | null | undefined>(null)

    const {
        register,
        handleSubmit,
        // watch,
        setValue,
        setError,
        reset,
        formState: { errors },
      } = useForm<Inputs>()


    const internetPackagesQuery = useQuery({  
        queryKey:[QUERIES.INTERNETPACKAGES],
        queryFn : getAllPackages
    })

    
    

    const createPackageMutaion = useMutation(
        {
            mutationFn:createNewInternetPackage,
            onSuccess:(data)=>{
            
            
                queryClient.invalidateQueries({ queryKey:[QUERIES.INTERNETPACKAGES], refetchType:"active" })
                reset()

                handleClickCloseNew()
                // console.log("")
            
            },
            onError: (err)=>{
    
                if(err instanceof AppError){
    
                    err.validationErrors.forEach(err=>{
    
                        // setError(err.field === "name"? "name":"root", {message: err.message })
                        // setError(err.field === "price"? "price":"root", {message:})


                        switch(err.field){
                            case "name":
                                setError("name", {message: err.message}); break;
                            case "price":
                                setError("price", {message: err.message}); break;
                            case "description":
                                setError("description", {message: err.message}); break;

                        }
                        
                        // console.log(err)
                    })
    
                }
                
            }
        }
    )

    const deleteMutation = useMutation(
        {
            mutationFn: deletePackage,
            onSuccess:()=>{
                internetPackagesQuery.refetch()
                setOpenDelete(false)
            }
        }
    )


    if( internetPackagesQuery.isLoading) return <CircularProgress />
    if(internetPackagesQuery.isError) return <>There was an error</>


    const onSubmit: SubmitHandler<Inputs> = (data) => {        
        
        createPackageMutaion.mutate({ id: toDelete.current?.id, ...data})
      
    }

    const handleCancelDelete = () => {        
        setOpenDelete(false)
        toDelete.current= null
    };

    const handleConfirmDelete =(id: number)=>{

        deleteMutation.mutate({ id })
        setOpenDelete(false)
    }
    
    const handleClickDelete = (id: number) => {
        
        toDelete.current = internetPackagesQuery.data!.find(ipackage => ipackage.id === id )  
        setOpenDelete(true);
    };

    const handleClickEdit= (id: number)=>{
        toDelete.current = internetPackagesQuery.data!.find(ipackage => ipackage.id === id )  
        
        if(toDelete.current){
            setValue("name",toDelete.current.name)
            setValue("price", toDelete.current.price)
            setValue("description", toDelete.current.description)
            setOpenAdd(true)
            
        }
        
        
    }

    const handleClickAddNew = ()=>{
        setOpenAdd(true)
    }

    const handleClickCloseNew = ()=>{
        toDelete.current = null
        setOpenAdd(false)
    }


    const rows: GridRowsProp<InternetPackage> = internetPackagesQuery.data!
      
    const columns: GridColDef<InternetPackage>[] = [
    { field:"id", headerName:"Id", width:50},
    { field:"name", headerName:"Name", width:150},
    { field:"price", headerName:"Price", width:100},
    { field:"description", headerName:"Description",  width:300},
    {  field:"actions", headerName: "Actions", width:300 , renderCell: (params)=>{

        
        return  <>
            <Box sx={{ display:"flex",gap:"1em", alignItems:"center" }} >

            {/* <Link component={RouterLink} 
                to={`/ranchs/edit/${params.row.id}`}
                variant="body2"
                >
                Edit 
            </Link> */}
            <Button variant="outlined" color="info" size="small"   onClick={()=>{ handleClickEdit( params.row.id)}}>
                Edit
            </Button>

            
            <Button variant="outlined" color="error" size="small"   onClick={()=>{ handleClickDelete( params.row.id)}}>
                Delete
            </Button>
            <Dialog
                open={openDelete}
                onClose={handleCancelDelete}
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
                <Button variant="contained" onClick={handleCancelDelete}>Cancel</Button>
                <Button variant="outlined" color="error" onClick={()=>{handleConfirmDelete(params.row.id) }} autoFocus>
                    Delete
                </Button>
                </DialogActions>
            </Dialog>
            
            </Box>

        </>
    } }
    ];
      

    // 
    
    

    return (
        <Grid container spacing={2}>
            <Grid item xs={12} >
                
                <Grid  xs={12} >
                    
                    <Typography variant="h5" component="h1" >
                        Internet Packages
                    </Typography>
                </Grid>

                <Grid xs={12} sx={{ padding:"1.5em 0em"}}>
                        <Button variant="contained" onClick={handleClickAddNew}>
                            Add new 
                        </Button>
                        
                        <Dialog
                            open={openAdd}
                            onClose={handleClickCloseNew}
                            PaperProps={{
                            
                            // onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
                            //     event.preventDefault();
                            //     const formData = new FormData(event.currentTarget);
                            //     const formJson = Object.fromEntries((formData as any).entries());
                            //     const email = formJson.email;
                            //     console.log(email);
                            //     handleClickCloseNew();
                            // },
                            }}
                        >
                            <DialogTitle>{ toDelete.current ? "Edit package" :"Add new package" }</DialogTitle>
                            <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ mt: 1 }}>
                            <DialogContent>
                                

                            
                
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

                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    error = {!!errors.price }
                                    helperText={ errors.price?.message || "Please provide a price" }
                                    {...register("price", {required:true })}
                                    id="price"
                                    type="number"
                                    label="Price"
                                    autoFocus
                                />

                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    {...register("description", { required:true, maxLength:250 })}
                                    error = {!!errors.description }
                                    helperText={ errors.description?.message || "Please provide a description" }
                                    label="Description"
                                    type="text"
                                    id="description"
                                    // autoComplete="current-password"
                                />
{/*                                 
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    sx={{ mt: 3, mb: 2 }}
                                >
                                    Sign In
                                </Button> */}
                                
                        

                                </DialogContent>
                            <DialogActions>
                            <Button onClick={handleClickCloseNew}>Cancel</Button>
                            <Button type="submit" disabled={createPackageMutaion.isPending} variant="contained">
                                { toDelete.current? "Update":"Create" }

                            </Button>
                            </DialogActions>
                            </Box>
                        </Dialog>
                        
                        

                    


                </Grid>
            </Grid>

            
           

            <Grid item xs={12} sx={{maxHeight:"60vh"}} >
              <DataGrid rows={rows} columns={columns}  />
            </Grid>
        </Grid>



    );


    

}