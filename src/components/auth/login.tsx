import { QueryKey, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { User, getMe, logIn } from "../../api/auth"
import { QUERIES } from "../../const/queries"
import { Navigate, redirect } from "react-router-dom"
import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { useForm, SubmitHandler } from "react-hook-form";


type Inputs = {
    email: string
    password: string
  }

export const Login =()=>{

    const queryClient = useQueryClient()
    const authQuery = queryClient.getQueryData<User | null>([QUERIES.me] )
    const {
        register,
        handleSubmit,
        // watch,
        formState: { errors },
      } = useForm<Inputs>()

    
    

      const onSubmit: SubmitHandler<Inputs> = (data) => {        
        
            logInMutation.mutate(data)
      
            
    }
    
    const logInMutation = useMutation({
        mutationFn: logIn,
        onSuccess:(data)=>{
            queryClient.setQueryData([QUERIES.me], ()=>data)
            // redirect("/")
        }
        
    })  

    
    // console.log("Rendering login", authQuery)
    if(!!authQuery) return <Navigate to={"/"}/>
    
      

      return (
            
            <Box
              sx={{
                marginTop: 8,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                <LockOutlinedIcon />
              </Avatar>
              <Typography component="h1" variant="h5">
                Sign in
              </Typography>
              <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ mt: 1 }}>
                
              {/* <input defaultValue="test"  /> */}
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  error = {!!errors.email }
                  helperText={ errors.email?.message || "Please provide an email" }
                  {...register("email", {required:true })}
                  id="email"
                  label="Email Address"
                  
                  autoComplete="email"
                  autoFocus
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  {...register("password", { required:true , maxLength:20 })}
                  error = {!!errors.password }
                  helperText={ errors.password?.message || "Please provide a password" }
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                />
                
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                >
                  Sign In
                </Button>
                <Grid container>
                  <Grid item xs>
                    <Link href="#" variant="body2">
                      Forgot password?
                    </Link>
                  </Grid>
                  <Grid item>
                    <Link href="#" variant="body2">
                      {"Don't have an account? Sign Up"}
                    </Link>
                  </Grid>
                </Grid>
              </Box>
            </Box>
            
         
      );

}




