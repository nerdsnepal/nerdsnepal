'use client'

import { ADMIN_URL, API_URL, emailValidator, isEmpty, validateUserName } from "@/app/lib/utils/utils";
import { Button } from "@mui/material";
import axios from "axios";
import Image from "next/image";
import { useEffect, useState } from "react";
import { redirect,  } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import { Suspense } from "react";
import Loading from "@/app/loading";

export const metadata = {
    title:"Admin login page",
    description:"Login Page for the admin"
}


const getUser = (isEmail,password,username_email)=>{
    let user = {redirect:false}
    if(isEmail) user = {...user,email:username_email,password,isEmail}
    else user = {...user,username:username_email,password,isEmail}
    return user
}
const config = {
    withCredentials:true,
    headers:{
        'Access-Control-Cross-Origin':true,
        'Content-Type':'application/x-www-form-urlencoded'
    }
}
const LoginPage = () => {
    const {status} = useSession()
       useEffect(()=>{
        if(status==='authenticated'){
            redirect('/')
        }
       },[status])
        const [loginUser,setLoginUser]= useState({
            username_email:"",
            password:"",
            isEmail:false
        })

        const [isBtnEnable,setIsEnable] = useState(false)
        const [currentError,setcurrentError]= useState("")
        const [isLoading,setLoading] =useState(false)
        const login =async (user)=>{
           try {
             let result=  await   signIn("credentials",user)
            if(result.error){
                setcurrentError(result.error)
                return
            }
              redirect('/')
           } catch (error) {
                console.log(error);
               setcurrentError("Something went wrong")
           }finally{
            setLoading(false)
           } 
         }
        const validate=()=>{
            if(validateUserName(loginUser.username_email)) setLoginUser({...loginUser,isEmail:false})
            if(emailValidator(loginUser.username_email)) setLoginUser({...loginUser,isEmail:true})
             
        }
        const handleSubmit=async (e)=>{
            e.preventDefault();
            setLoading(true)
            validate()
           if(!isEmpty(currentError)){
                setLoading(false)
                return
            }
            const user = getUser(loginUser.isEmail,loginUser.password,loginUser.username_email)
            await login(user)
        }
        
        const onChangeHandler = (e,field)=>{
             setcurrentError("")
                if(field==="username_email"){
                    setLoginUser({...loginUser,username_email:e.target.value})
                }
                if(field==="password"){
                    setLoginUser({...loginUser,password:e.target.value})
                }
                if(!isEmpty(loginUser.password) && !isEmpty(loginUser.username_email)){
                    if(loginUser.password.length>=6 && loginUser.username_email.length>=4){
                        setIsEnable(true)
                    }else{
                        setIsEnable(false)
                    }
                }else{
                     setIsEnable(false)

                }
                
        }

    return <>
        <div  className="w-screen dark:bg-[#d6dbdc] h-screen mobile:grid justify-center items-center mobile_tablet:grid-cols-1 tablet_laptop:grid-cols-2 above_laptop:grid-cols-3">
      <div className="h-[50%]  w-full hidden mobile:block tablet_md:h-[25%] mobile_tablet:hidden p-5">
      <h1 className="text-center text-3xl text-black">Manage your business from anywhere, at any time(Slogan Here)</h1>
      </div>
    <div className="flex flex-col mobile:shadow-2xl mobile_tablet:justify-self-center mobile:bg-white tablet_laptop:justify-items-start mobile:justify-self-end mobile:border border-solid border-gray-300 rounded-xl h-fit w-auto mobile:w-fit justify-center items-center p-[25px]">
        <h1 className="p-8 font-bold  text-2xl text-black">Admin Portal </h1>
    <Image src={"/next.svg"} className="bg-white break-all p-[10px] mb-[11px]" draggable={false} width={100} height={100} alt="logo"/>
        <form onSubmit={handleSubmit}  className="basis-full flex flex-col m-8 gap-3 w-full mobile:w-fit dark:text-black">
        <input type="text"  minLength={4} maxLength={25}
         value={loginUser.username_email} onChange={(e)=>onChangeHandler(e,"username_email")} className="p-2 outline-none border border-gray-500 rounded-sm" inputMode="text" placeholder="Username or email" id="username_or_email" required name="username_or_email" />
        <input type="password"  minLength={6} autoComplete="true" value={loginUser.password} onChange={(e)=>onChangeHandler(e,"password")} className="p-2 outline-none border border-gray-500 rounded-sm" placeholder="Password" id="password" name="password" required/>
        <p className="text-red-500 text-xs">{currentError}</p>
        <Button className="font-bol" disabled={!isBtnEnable} variant="outlined"  type="submit" >{isLoading?"Logging in...":'Login'}</Button>      
        </form> 
    </div>
    </div>
    </>;
    
}
 
export default LoginPage;