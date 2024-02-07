
import {Navigate, Outlet } from 'react-router-dom'
import { User, getMe } from '../../api/auth'
import { useQuery } from '@tanstack/react-query'
import { QUERIES } from '../../const/queries'
import { ReactNode, PropsWithChildren } from 'react'

export const PrivateRoute = ()=>{

    
    
    // return <>Private</>

    const authQuery = useQuery<User | null>({
        queryKey: [QUERIES.me],
        queryFn: getMe
      })

    if(authQuery.isLoading) return <>Loading</>
    if(authQuery.isError) return <>Is Error</>


    if(!authQuery.data) return <Navigate to={"login"} />

    
    return <Outlet/>

}