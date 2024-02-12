import { useQuery } from "@tanstack/react-query"
import { Outlet, Link as RouterLink, useParams } from "react-router-dom"
import { QUERIES } from "../../const/queries"
import { getServiceById } from "../../api/services-api"
import {  Grid, Link, Paper, Skeleton, Typography, useTheme } from "@mui/material"
import { CustomLink } from "../global/custom-link"
// import { Link as RouterLink} from 'react-router-dom'



export const ServiceDetails =()=>{

    const params = useParams()

    const theme = useTheme()
    const serviceDetailQuery  = useQuery({
        queryKey:[QUERIES.SERVICEDETAIL ],
        queryFn: ()=>getServiceById(params.id!)
    })


    if(serviceDetailQuery.isLoading) return <Skeleton animation="wave" />
    if(serviceDetailQuery.isError) return <> {serviceDetailQuery.error.message}</>

    return (
      
    <Grid container spacing={2} xs={12}>

            

        <Grid item xs={12}>
            <Paper  sx={{
                padding: theme.spacing(4)
                }} 
            elevation={1}>
                
                <Grid container spacing={2}>
                    
                    <Grid item xs={12}>
                        <Typography variant="h5" align="left">
                            Service Details
                        </Typography>

                    </Grid>

                    <Grid item xs={6}>
                        <Grid container >


                            <Grid item xs={12}>
                            <Typography variant="body1">
                            <strong>Service ID:</strong> { `${serviceDetailQuery.data?.id}`}

                            </Typography>
                            </Grid>

                            <Grid item xs={12}>
                                <Typography variant="body1">
                                <strong>Name:</strong> { `${serviceDetailQuery.data?.name}  ${serviceDetailQuery.data?.lastName }` }
                                </Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="body1">
                                <strong>Phone:</strong> { `${serviceDetailQuery.data?.phone}`}
                                </Typography>
                            </Grid>

                            <Grid item xs={12}>
                                <Typography variant="body1">
                                <strong>Status:</strong> { `${serviceDetailQuery.data?.serviceStatus}`}
                                </Typography>
                            </Grid>

                            <Grid item xs={12}>
                                <Typography variant="body1">
                                <strong>Payment Day:</strong> 
                                {`${serviceDetailQuery.data?.paymentDay || "Not defined"}`}
{/* 
                                <CustomLink 
                                    to={`/services/${params.id}/payments`} 
                                    text=" Payment Details"
                                />   */}
                                
                                </Typography>
                            </Grid>

                        </Grid>
                    </Grid>

                    
                    <Grid item xs={6}>
                        <Grid container >


                            <Grid item xs={12}>
                            <Typography variant="body1">
                                <strong>IP Address</strong> { `${serviceDetailQuery.data?.ip || "Not provided" }`}
                            </Typography>
                            </Grid>

                            <Grid item xs={12}>
                                <Typography variant="body1">
                                <strong>Package:</strong> { `${serviceDetailQuery.data?.package?.name}  ` }
                                </Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="body1">
                                <strong>Ranch:</strong> { `${serviceDetailQuery.data?.ranch?.name}`}
                                </Typography>
                            </Grid>

                            <Grid item xs={12}>
                                <Typography variant="body1">
                                    <strong>Location:</strong> 
                                    <CustomLink
                                        to={`/services/${params.id}/location?latitude=${serviceDetailQuery.data?.latitude}&longitude=${serviceDetailQuery.data?.longitude}`}
                                        text="Show Location"
                                    />

                                    
                                </Typography>
                            </Grid>

                        </Grid>
                    </Grid>
                   
                    <Grid item xs={12} sx={{ display:"flex", justifyContent:"flex-end"}}>
                        <CustomLink 
                            text="Edit info"
                            to={`/services/${serviceDetailQuery.data?.id}/edit`}
                        />
                    </Grid>
                    
                </Grid>
            </Paper>
        </Grid>

        <Grid item xs={12}>
            <Outlet/>
        </Grid>
    </Grid>


        
    )
}