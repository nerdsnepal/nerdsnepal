import axios from "axios"
import { emailValidator, validateUserName, } from "../utils/common"


const API_BASE_URL = "http://localhost:8000"
const config = {
    withCredentials:true,
    headers:{
        'Access-Control-Cross-Origin':true
    }
}
const register=()=>{

}
const login =async (email_or_username,password)=>{
  try {
    let result = await axios.post(`${API_BASE_URL}/auth/email-login`,{
        email:emailValidator(email_or_username)?email_or_username:"",
        password:password,
        username:validateUserName(email_or_username)?email_or_username:""
    },config)
    return result.data
  } catch (error) {
    return Promise.reject({error})
  }
}
const getAllProduct= async()=>{
    try {
        let result = await axios.post(`${API_BASE_URL}/auth/email-login`)
        return result.data
      } catch (error) {
        return Promise.reject({error})
      }
}
const getProductById = (id)=>{

}
const getAllCategory = async()=>{
    try {
    
        let result = await axios.get(`${API_BASE_URL}/admin/category`,{withCredentials:true})
        return result.data
      } catch (error) {
        return Promise.reject({error})
      }
}

export  {register,login,getAllProduct
    ,getProductById,getAllCategory}