import { useEffect, useState } from "react"



export const defaultCoordinates={

    
latitude:23.8787249,
longitude:-104.4906326

} as GeolocationCoordinates

export const useGeoLocation = ()=>{

    
        
    const [message, setMessage] =useState("Fetching")
    const [coordinates, setCoordinates] = useState<GeolocationCoordinates>()


    

    const getFromBrowser = ()=>{

        if (navigator.geolocation) {
            // what to do if supported
            
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    // what to do once we have the position
                    setMessage("Success")
                    setCoordinates(position.coords)
                },
                (error) => {
                    // display an error if we cant get the users position
                    setMessage("Error: Please accept the geolocation")
                    setCoordinates
                    console.error('Error getting user location:', error);
                },
                {
                    enableHighAccuracy:true,
                    maximumAge:1000
                }
            )

        }
        else {
            // display an error if not supported
            console.error('Geolocation is not supported by this browser.');
        }
        
    }


    const getCoordinates = ()=>{

        getFromBrowser()

        return coordinates

    }


    const getDefaultCoordinates = ()=>{

        return defaultCoordinates
    }

    useEffect(()=>{

        getFromBrowser()

    },[])


    return { message, coordinates, getCoordinates, defaultCoordinates}

}