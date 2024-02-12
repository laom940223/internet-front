import { useState } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'

import  { Routes, Route } from 'react-router-dom'
import { PrivateRoute } from './components/global/private-route'
import { Login } from './components/auth/login'
import { useQuery } from '@tanstack/react-query'
import { User, getMe } from './api/auth'
import { QUERIES } from './const/queries'

import {  createTheme } from '@mui/material'
import { Layout } from './components/layout/layout'
import { Ranchs } from './pages/ranchs'
import { CreateRanchForm } from './components/ranchs/create-ranchform'
import { InternetPackages } from './pages/packages'
import {  Services } from './pages/services'
import { AddNewService } from './components/services/add-new-service'
import { ServiceLocation } from './pages/dash'
import { ServiceDetails } from './components/services/service-details'
import { ServicePayments } from './components/services/service-payments'


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

                        <Route path='/' element={<ServiceLocation/>}/>
                        
                        <Route path="/services" >
                            <Route path='/services' element ={<Services/>}/>
                            <Route path="/services/new" element={<AddNewService/>}/>


                            <Route path="/services/:id" element={<ServiceDetails/>}>
                                <Route path='/services/:id/location' element={<ServiceLocation/>}/>        
                                <Route path='/services/:id/payments' element={ <ServicePayments/>}/>
                            </Route>
                            <Route path='/services/:id/edit' element={<AddNewService/> }/>

                        </Route>


                        <Route path="/internet-packages" element={<InternetPackages />}>
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
