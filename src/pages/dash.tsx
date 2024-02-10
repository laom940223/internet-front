import { Button, Grid, Typography } from "@mui/material"
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet"
import { useGeoLocation } from "../hooks/useGeoLocation"
import { useLocation, useParams } from "react-router-dom"
import { useParseLocation } from "../hooks/useParseLocation"




export const Dash = ()=>{



    const parse =useParseLocation()

    const latitude = parse.get("latitude")
    const longitude = parse.get("longitude")


    console.log(+latitude!, +longitude!)

    return (
        <Grid container xs={12} sx={{mb:"1.5em"}}>

            <Grid item xs={12} > 
            <div id="map" >
                
                {

                latitude && longitude ? 
                (<MapContainer 
                    center={[+latitude, +longitude]} zoom={18} scrollWheelZoom={true} 
                    style={{height:"60vh"}}>
                    <TileLayer
                        attribution='Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
                        url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                        // attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        // url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker
                        position={{ lat: +latitude, lng:+longitude }}
                    
                    />
                </MapContainer>)
                    :null
                }

            </div>
            </Grid>

        </Grid>
    )
}