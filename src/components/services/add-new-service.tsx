import { Box, Button, CircularProgress, FormControl, Grid, InputLabel, Link, MenuItem, Select, Skeleton, TextField, Typography } from "@mui/material"
import { Controller, SubmitHandler, useForm } from "react-hook-form"
import { useNavigate, useParams } from "react-router-dom"
import { MapContainer,  TileLayer } from 'react-leaflet'

import { DraggableMarker } from "../leaflet/draggable-marker"
import {  useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { QUERIES } from "../../const/queries"
import { getAllRanchs } from "../../api/ranchs-api"
import { getAllPackages } from "../../api/internet-packages-api"
import { ServiceStatus, createNewService, getServiceById } from "../../api/services-api"
import { AppError } from "../../api/server-response"
import { useEffect, useState } from "react"
import { defaultCoordinates } from "../../hooks/useGeoLocation"



type Inputs = {

    name:string,
    lastName: string,
    phone:string,
    latitude:number,
    longitude: number,
    serviceStatus: ServiceStatus,
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

const days = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31]

export const AddNewService = ()=>{

    const queryClient = useQueryClient()
    const navigate = useNavigate()
    const { id } = useParams()

    const [myCoordinates, setMyCoordinates] = useState<MyMarkerInterface| null>()

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
        

      })

      

    const ranchsQuery = useQuery({  
        queryKey:[QUERIES.RANCHS],
        queryFn : getAllRanchs
    })

    const packagesQuery = useQuery({  
        queryKey:[QUERIES.INTERNETPACKAGES],
        queryFn : getAllPackages
    })

    const serviceDetailQuery  = useQuery({
        queryKey:[QUERIES.SERVICEDETAIL ],
        queryFn: ()=>getServiceById(id!),
        enabled: !!id
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
                            case "lastName":
                                setError("lastName", {message: err.message}); break;
                            case "phone":
                                setError("phone", {message: err.message}); break;
                            case "latitude":
                                setError("latitude", {message: err.message}); break;
                            case "longitude":
                                setError("longitude", {message: err.message}); break;
                            case "ip":
                                setError("ip", {message: err.message}); break;
                            case "packageId":
                                setError("packageId", {message: err.message}); break;
                            case "ranchId":
                                setError("ranchId", {message: err.message}); break;
                            case "paymentDay":
                                setError("paymentDay", {message: err.message}); break;
                            // case "phone":
                            //     setError("phone", {message: err.message}); break;
                        
                                    
                                    // packageId? : number,
                                    // ranchId?: number
                                    // paymentDay? : number,
                                    // stripeId? : number
                        
                        
                        }
                        
                        // console.log(err)
                    })
    
                }
                
            }
        }
    )  

    
    
      const onSubmit: SubmitHandler<Inputs> = (data) => {        
        
        // createPackageMutaion.mutate({ id: toDelete.current?.id, ...data})
      
        console.log(data)
        createServiceMutation.mutate({ service:data, id })
        // console.log(data)

    }

    

    const updateFormCoordinates = (update: MyMarkerInterface)=>{

        
        setValue("latitude", update.lat, {shouldTouch:true})
        setValue("longitude", update.lng, {shouldTouch:true})

    }


    


    if(serviceDetailQuery.isLoading && id) return <Skeleton animation="wave" />
    if(serviceDetailQuery.isError && id ) return <> {serviceDetailQuery.error.message}</>


    useEffect(()=>{
        

        if(id && serviceDetailQuery.data){
            // console.log("need to set defaults to update")

            setValue("name", serviceDetailQuery.data?.name,{shouldDirty:true})
            setValue("lastName", serviceDetailQuery.data?.lastName,{shouldTouch:true})
            setValue("ip", serviceDetailQuery.data?.ip)
            setValue("phone", serviceDetailQuery.data?.phone)
            setValue("paymentDay", (serviceDetailQuery.data?.paymentDay || undefined) )
            setValue("packageId", serviceDetailQuery.data.package?.id)
            setValue("ranchId", serviceDetailQuery.data.ranch?.id)
            setValue("latitude",serviceDetailQuery.data.latitude)
            setValue("longitude",serviceDetailQuery.data.longitude)
            setValue("serviceStatus",serviceDetailQuery.data.serviceStatus)
            
            // console.log("Updating defaults")

            setMyCoordinates({ 
                lat:serviceDetailQuery.data.latitude,
                lng: serviceDetailQuery.data.longitude
             })
        }
        else{
            setMyCoordinates({ lat:defaultCoordinates.latitude, lng:defaultCoordinates.longitude })
            setValue("latitude",defaultCoordinates.latitude)
            setValue("longitude",defaultCoordinates.longitude)
        }

        // console.log()

    },[serviceDetailQuery.data,id])
    

    // console.log(myCoordinates)

    return(

        <Grid container>
            
            
                <Typography variant="h5" component={"h1"}>
                    {id ? "Update service" :"Create new service"}
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
                                        labelId="ranch-label"
                                        id="demo-simple-select"
                                    
                                    >
                                        {
                                            ranchsQuery.data?.map((ranch, index)=>{

                                                return <MenuItem key={index} value={ranch.id}>{ranch.name}</MenuItem>
                                            })
                                        }
                                        
                                    
                                    </Select>
                                )}
                                />
                                <InputLabel id="ranch-label">Select a ranch</InputLabel>
                            </FormControl>
                            
                            : <CircularProgress/>}

                    { !packagesQuery.isLoading && !packagesQuery.isError && packagesQuery.data ? 
                            <FormControl sx={{width:"48%"}}>
                                <InputLabel id="package-label">Select a package</InputLabel>
                                <Controller
                                name="packageId"
                                control={control}
                                defaultValue={packagesQuery.data![0].id!}
                                render={({ field }) => (
                                    <Select
                                        error={ !!errors.packageId  }
                                        {...field}
                                        labelId="package-label"
                                        id="package-select"
                                    
                                    >
                                        {
                                            packagesQuery.data?.map(ipackage=>{

                                                return <MenuItem value={ipackage.id}>{ipackage.name}</MenuItem>
                                            })
                                        }
                                        
                                    
                                    </Select>
                                )}
                                />
                                
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
                            // required
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
                    <Box  sx={{mt:"1em" , display:"flex", justifyContent:"space-between"}}>
                        <FormControl sx={{width:"48%"}}>
                            <InputLabel id="payment-day-select-label">Payment day</InputLabel>    
                                <Controller
                            name="paymentDay"
                            control={control}
                            defaultValue={0}
                            render={({ field }) => (

                                
                                    <Select
                                        error={ !!errors.paymentDay  }
                                        {...field}
                                        labelId="payment-day-select-label"
                                        id="payment-day-select"
                                    
                                    >
                                        {

                                            
                                            days.map(day=>{

                                                
                                                return <MenuItem value={day}>{day}</MenuItem>
                                            })
                                        }
                                        
                                    
                                    </Select>
                                )}
                                />
                                
                            </FormControl>

                            <FormControl sx={{width:"48%"}}>
                            <InputLabel id="status-select-label">Service Status</InputLabel>    
                                <Controller
                            name="serviceStatus"
                            control={control}
                            defaultValue={ServiceStatus.CREATED}
                            render={({ field }) => (

                                
                                    <Select
                                        error={ !!errors.serviceStatus  }
                                        {...field}
                                        labelId="payment-day-select-label"
                                        id="payment-day-select"
                                    
                                    >
                                        {

                                            
                                            Object.values(ServiceStatus).map(option=>{
                                                    
                                                
                                                return <MenuItem value={option}>{option}</MenuItem>
                                            })
                                        }
                                        
                                    
                                    </Select>
                                )}
                                />
                                
                            </FormControl>

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

                             


                    <Grid xs={12} sx={{mt:"2em",  mb:"1.5em"}}>

                          <Typography color={ errors.latitude || errors.longitude ? "red":"CaptionText" } fontSize={"1.2em"} component={"address"} mb={"1em"}>
                                Please select a location for the service:
                                
                            </Typography>
                            <div id="map">

                                {

                                    myCoordinates?
                                    (<MapContainer 
                                        center={[myCoordinates.lat, myCoordinates.lng]} zoom={18} scrollWheelZoom={true} style={{height:"60vh"}}>
                                        <TileLayer
                                            attribution='Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
                                            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                                            // attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                            // url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                        />
                                         <DraggableMarker
                                            defaultLat={myCoordinates.lat}
                                            defaultLng={ myCoordinates.lng}
                                            updateCoordinates={updateFormCoordinates}
                                         /> 
                                    </MapContainer>) : null
                                }

                            </div>

                    </Grid>
                            
                            <Button type="submit" 
                                fullWidth
                                disabled={createServiceMutation.isPending} 
                                variant="contained">
                                {id ? "Update":"Create"}

                            </Button>
                            
                        </Box>
                    </ Grid>
                    </ Grid>
    )

}