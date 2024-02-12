import { Link } from "@mui/material"
import { Link as RouterLink } from "react-router-dom"

interface CustomLinkProps {

    to:string,
    text:string
}

export const CustomLink = ( { to, text } : CustomLinkProps )=>{


    return (

        <Link component={RouterLink} 
            to={to} 
            variant="caption"  
            sx={{ textDecoration:"none"}} 
            fontSize={"1em"} >
                            
            {text}
        </Link> 
    )
}