import React,{useContext} from "react";
import {Navigate, Outlet} from 'react-router-dom';
import {AuthContext} from '../middleware/AuthContext';

const ProtectedRoutes = ({children}) => {
    const token= localStorage.getItem('token');
    const roles = localStorage.getItem('StoreRole');

    if(!token || !roles){
        return <Navigate to='/login'/>
    }

    return children;
};

export default ProtectedRoutes;