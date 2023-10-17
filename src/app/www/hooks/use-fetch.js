import { useSelector } from "react-redux"
import { fetchSichu } from "../actions/action"
const { useState, useEffect } = require("react")


export const useSichuFetch = ({endPoint="",revalidate=60})=>{
    const user = useSelector((state)=>state.auth.user);
    const accessToken = user?.accessToken;
    const [data,setData] = useState(null);
    const [error,setError] = useState(null);
    const [isLoading,setLoading] = useState(true);
    useEffect(()=>{
     (async()=>{
       try {
        const result =await fetchSichu({accessToken,endPoint,revalidate});
        if(result.success){
            setData(result.data)
        }
       } catch (error) {
           setError(error)
       }finally{
        setLoading(false)
       }
     })()

    },[endPoint])
    return {data,isLoading,error}

}