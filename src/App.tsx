import { useState } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'

import  { Routes, Route } from 'react-router-dom'
import { PrivateRoute } from './components/global/private-route'
import { Login } from './components/auth/login'
import { useQuery } from '@tanstack/react-query'
import { User, getMe } from './api/auth'
import { QUERIES } from './const/queries'
import { ThemeProvider } from '@emotion/react'
import { Container, CssBaseline, createTheme } from '@mui/material'
import { Layout } from './components/layout/layout'
import { Ranchs } from './pages/ranchs'
import { CreateRanchForm } from './components/ranchs/create-ranchform'


const defaultTheme = createTheme();

function App() {

    const authQuery = useQuery<User | null>({
      queryKey: [QUERIES.me],
      queryFn: getMe
    })


    if(authQuery.isLoading) return <>Is Loading</>
    if(authQuery.isError) return <>Is Error</>

  
    return( 
            <Routes>
                
                <Route element={ <PrivateRoute/>}> 
                    <Route   element={ <Layout/>  }>

                        <Route path='/' element={<>This is the dashboard</>}/>
                        
                        <Route path="/internet-packages" element={<>This is are the packages</>}>

                        </Route>
                        
                        <Route path="/ranchs" element ={<Ranchs/>}>
                            <Route path='/ranchs/new' element={ <CreateRanchForm/> } />
                            <Route path='/ranchs/edit/:id' element={ <CreateRanchForm/> } />
                        </Route>                      
                    
                    </Route>
                </Route>
                
                <Route path='/login' element={<Login/>} />                
            </Routes>

    )
  

  
}

export default App
