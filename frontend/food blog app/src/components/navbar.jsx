import { useState, useEffect } from 'react'
import Modal from './Modal'
import InputForm from './InputForm'
import { NavLink } from 'react-router-dom'
import { FaBars, FaTimes } from 'react-icons/fa'

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false)
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    let token = localStorage.getItem("token")
    const [showLogin, setShowLogin] = useState(token ? false : true)
    let user = JSON.parse(localStorage.getItem("user"))

    useEffect(() => {
        setShowLogin(token ? false : true)
    }, [token])

    const checkLogin = () => {
        if (token) {
            localStorage.removeItem("token")
            localStorage.removeItem("user")
            setShowLogin(true)
            window.location.href = "/"
        } else {
            setIsOpen(true)
        }
    }

    return (
        <>
            <header>
                <h2>Food Blog</h2>
                <button className="menu-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                    {isMenuOpen ? <FaTimes /> : <FaBars />}
                </button>
                <ul className={isMenuOpen ? "nav-active" : ""}>
                    <li><NavLink to="/" onClick={() => setIsMenuOpen(false)}>Home</NavLink></li>
                    <li onClick={() => { if (showLogin) setIsOpen(true); setIsMenuOpen(false); }}>
                        <NavLink to={!showLogin ? "/myRecipe" : "/"}>My Recipes</NavLink>
                    </li>
                    <li onClick={() => { if (showLogin) setIsOpen(true); setIsMenuOpen(false); }}>
                        <NavLink to={!showLogin ? "/favRecipe" : "/"}>Favourites</NavLink>
                    </li>
                    <li onClick={() => { checkLogin(); setIsMenuOpen(false); }}>
                        <p className='login'>{showLogin ? 'Login' : 'Logout'}</p>
                    </li>
                    {!showLogin && user?.email && (
                        <li>
                            <span className='nav-user'>{user.email}</span>
                        </li>
                    )}
                </ul>
            </header>
            {isOpen && <Modal onClose={() => setIsOpen(false)}><InputForm setIsOpen={() => setIsOpen(false)} /></Modal>}
        </>
    )
}
