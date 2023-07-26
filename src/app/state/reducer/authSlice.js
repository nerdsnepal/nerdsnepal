'use client'
import {createSlice} from '@reduxjs/toolkit'


const AuthSlice =  createSlice({
    name:'auth',
    initialState:{
        isAuth: false,
        data: {},
        isAdmin:false
    },
    reducers:{
        toggleAuth:(state)=>{
            state.isAuth = !state.isAuth
        },
        setUserData:(state,action)=>{
            state.data = action.payload
        },
        removeUserData:(state)=>{
            state.data = null
        },
        toogleIsAdmin:(state)=>{
            if(state.isAuth){
                state.isAdmin = ! state.isAdmin
            }
        }
        
    }
})

export const {toggleAuth,setUserData,removeUserData,toogleIsAdmin} = AuthSlice.actions 

export default AuthSlice.reducer 
