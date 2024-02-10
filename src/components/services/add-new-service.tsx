import { Box, Button, CircularProgress, FormControl, Grid, InputLabel, Link, MenuItem, Select, TextField, Typography } from "@mui/material"
import { Controller, SubmitHandler, useForm } from "react-hook-form"
import { Link as RouterLink, useNavigate } from "react-router-dom"
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet'
import { useGeoLocation } from "../../hooks/useGeoLocation"
import { DraggableMarker } from "../leaflet/draggable-marker"
import { useEffect, useState } from "react"
import { LatLng, LatLngExpression } from "leaflet"
import { QueryClient, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { QUERIES } from "../../const/queries"
import { getAllRanchs } from "../../api/ranchs-api"
import { getAllPackages } from "../../api/internet-packages-api"
import { CreateService, Service, createNewService } from "../../api/services-api"
import { AppError } from "../../api/server-response"



type Inputs = {

    name:string,
    lastName: string,
    phone:string,
    latitude:number,
    longitude: number,
    
    ip?:string
    packageId? : number,
    ranchId?: number
    paymentDay? : number,
    stripeId? : number


  }

  export interface MyMarkerInterface {
    lat:number,
    lng: number
  }

  const defaultCoordinates={

    
    latitude:23.8787249,
    longitude:-104.4906326
    
    } as GeolocationCoordinates


export const AddNewService = ()=>{

    const queryClient = useQueryClient()
    const navigate = useNavigate()
    const {
        register,
        handleSubmit,
        control,
        getValues,
        setValue,
        setError,
        reset,
        formState: { errors },
      } = useForm<Inputs>({
        defaultValues:{
            
            latitude:defaultCoordinates.latitude,
            longitude:defaultCoordinates.longitude

        }

      })

    const ranchsQuery = useQuery({  
        queryKey:[QUERIES.RANCHS],
        queryFn : getAllRanchs
    })

    const packagesQuery = useQuery({  
        queryKey:[QUERIES.INTERNETPACKAGES],
        queryFn : getAllPackages
    })


    const createServiceMutation = useMutation(
        {
            mutationFn:createNewService,
            onSuccess:(data)=>{
            
            
                queryClient.invalidateQueries({ queryKey:[QUERIES.SERVICES], refetchType:"active" })
                
                navigate("/services/"+data.id)

                // handleClickCloseNew()
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
                            // case "price":
                            //     setError("price", {message: err.message}); break;
                            // case "description":
                            //     setError("description", {message: err.message}); break;

                        }
                        
                        // console.log(err)
                    })
    
                }
                
            }
        }
    )  

    
    
      const onSubmit: SubmitHandler<Inputs> = (data) => {        
        
        // createPackageMutaion.mutate({ id: toDelete.current?.id, ...data})
      
        createServiceMutation.mutate({ service:data })
        console.log(data)

    }

    

    const updateFormCoordinates = (update: MyMarkerInterface)=>{

        
        setValue("latitude", update.lat, {shouldTouch:true})
        setValue("longitude", update.lng, {shouldTouch:true})

    }




    

    return(

        <Grid container>
            <Grid xs={12} sx={{ display:"flex", justifyContent:"flex-end"}}> 
                
                <Link component={RouterLink} to={`/services`} variant="caption"  sx={{ textDecoration:"none"}} fontSize={"1em"} >
                            
                    <Typography variant="body1" component="h1">
                        Go Back
                    </Typography>
                            
                </Link> 

            </Grid>
            
                <Typography variant="h5" component={"h1"}>
                    Add a new service
                </Typography>
            <Grid xs={12}>
                <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ mt: 1 }}>

                    <Box component={"div"} sx={{ display:"flex", justifyContent:"space-between", mb:"1.2em" } }>
                        <TextField
                            margin="normal"
                            required
                            sx={{width:"48%"}}
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
                            sx={{width:"48%"}}
                            error = {!!errors.lastName }
                            helperText={ errors.lastName?.message || "Please provide a last name" }
                            {...register("lastName", {required:true })}
                            id="lastName"
                            type="text"
                            label="Last name"
                            
                        />

                    </Box>        
                 
                    <Box component={"div"} sx={{width:"100%", display:"flex", justifyContent:"space-between"}}>
                    
                        { !ranchsQuery.isLoading && !ranchsQuery.isError && ranchsQuery.data ? 
                            <FormControl sx={{width:"48%"}}>
                                
                                <Controller
                                name="ranchId"
                                control={control}
                                defaultValue={ranchsQuery.data![0].id!}
                                render={({ field }) => (
                                    <Select
                                        error={ !!errors.ranchId  }
                                        {...field}
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                    
                                    >
                                        {
                                            ranchsQuery.data?.map(ranch=>{

                                                return <MenuItem value={ranch.id}>{ranch.name}</MenuItem>
                                            })
                                        }
                                        
                                    
                                    </Select>
                                )}
                                />
                                <InputLabel id="demo-simple-select-label">Ranch</InputLabel>
                            </FormControl>
                            
                            : <CircularProgress/>}

                    { !packagesQuery.isLoading && !packagesQuery.isError && packagesQuery.data ? 
                            <FormControl sx={{width:"48%"}}>
                                
                                <Controller
                                name="packageId"
                                control={control}
                                defaultValue={packagesQuery.data![0].id!}
                                render={({ field }) => (
                                    <Select
                                        error={ !!errors.packageId  }
                                        {...field}
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                    
                                    >
                                        {
                                            packagesQuery.data?.map(ipackage=>{

                                                return <MenuItem value={ipackage.id}>{ipackage.name}</MenuItem>
                                            })
                                        }
                                        
                                    
                                    </Select>
                                )}
                                />
                                <InputLabel id="demo-simple-select-label">Package</InputLabel>
                            </FormControl>
                            
                            : <CircularProgress/>}
                        
                        

                    </Box>


                    <Box component={"div"} sx={{width:"100%", display:"flex", justifyContent:"space-between", mt:"1em"}}>
                        
                        <TextField
                            margin="normal"
                            required
                            sx={{ width:"48%"}}
                            error = {!!errors.phone }
                            helperText={ errors.phone?.message || "Please provide a valid phone" }
                            {...register("phone", {required:true, minLength:10, maxLength:10 })}
                            id="phone"
                            type="tel"
                            label="Phone"
                            
                        />

                        <TextField
                            margin="normal"
                            required
                            sx={{ width:"48%"}}
                            error = {!!errors.ip }
                            helperText={ errors.ip?.message || "Please provide a valid IP" }
                            {...register("ip", { 
                                pattern: {
                                    value: /^(\d{1,3}\.){3}\d{1,3}$/,
                                    message: 'Invalid IPv4 address',
                                  }

                             })}
                            id="ip"
                            type="text"
                            label="IP Address"
                            
                        />

                    </Box>

                    <div style={{ display: 'none' }}>
                        {/* Hidden input */}
                        <label>Hidden Input:</label>
                        <Controller
                        name="latitude"
                        control={control}
                        render={({ field }) => <input {...field} type="hidden" />}
                        />
                    
                    <Controller
                        name="longitude"
                        control={control}
                        render={({ field }) => <input {...field} type="hidden" />}
                        />

                    </div>

                             


                    <Grid xs={12} sx={{mb:"1.5em"}}>

                    {   errors.latitude  ? ( <Typography color="red" fontSize={"1.2em"} component={"address"} mb={"1em"}>
                                Please select a location for the service
                                
                            </Typography>) : null}
                            <div id="map">

                                {

                                defaultCoordinates ?
                                    (<MapContainer 
                                        center={[getValues("latitude"), getValues("longitude")]} zoom={18} scrollWheelZoom={true} style={{height:"60vh"}}>
                                        <TileLayer
                                            attribution='Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
                                            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                                            // attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                            // url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                        />
                                         <DraggableMarker
                                            defaultLat={getValues("latitude")}
                                            defaultLng={ getValues("longitude")}
                                            updateCoordinates={updateFormCoordinates}

                                         /> 
                                    </MapContainer>)
                                    :null
                                }

                            </div>

                    </Grid>
                            
                            <Button 
                                // onClick={handleClickCloseNew}
                            >Cancel</Button>
                            <Button type="submit" 
                                // disabled={createPackageMutaion.isPending} 
                            variant="contained">
                                Create

                            </Button>
                            
                        </Box>
                    </ Grid>
                    </ Grid>
    )

}