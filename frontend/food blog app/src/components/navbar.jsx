import React, { useState, useEffect } from 'react'
import Modal from './Modal'
import InputForm from './InputForm'
import { NavLink, useNavigate } from 'react-router-dom'

export default function Navbar() {
    const navigate = useNavigate()
    const [isOpen, setIsOpen] = useState(false)
    let token = localStorage.getItem("token")
    const [isLogin, setIsLogin] = useState(token ? false : true)
    let user = JSON.parse(localStorage.getItem("user"))

    useEffect(() => {
        setIsLogin(token ? false : true)
    }, [token])

    const checkLogin = () => {
        if (token) {
            localStorage.removeItem("token")
            localStorage.removeItem("user")
            setIsLogin(true)
            window.location.href = "/"
        } else {
            setIsOpen(true)
        }
    }

    return (
        <>
            <header>
                <h2>Food Blog</h2>
                <ul>
                    <li><NavLink to="/">Home</NavLink></li>
                    <li onClick={() => isLogin && setIsOpen(true)}><NavLink to={!isLogin ? "/myRecipe" : "/"}>My Recipes</NavLink></li>
                    <li onClick={() => isLogin && setIsOpen(true)}><NavLink to={!isLogin ? "/favRecipe" : "/"}>Favourites</NavLink></li>
                    <li onClick={checkLogin}><p className='login'>{(isLogin) ? 'Login' : 'Logout'}</p></li>
                    {!isLogin && user?.email && <li><span className='nav-user'>{user.email}</span></li>}
                </ul>
            </header>
            {(isOpen) && <Modal onClose={() => setIsOpen(false)}><InputForm setIsOpen={() => setIsOpen(false)} /></Modal>}
        </>
    )
}
