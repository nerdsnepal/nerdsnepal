import React from 'react';
import './App.css';
import { getAllCategory, login } from './services/api';
function App() {
    login("safalstha","Sa1fal2@S").then((res)=>{
        console.log(res);
    }).catch((err)=>{
        console.log(err);
    })
    getAllCategory()
  return (
    <div className="App">
    </div>
  );
}

export default App;
