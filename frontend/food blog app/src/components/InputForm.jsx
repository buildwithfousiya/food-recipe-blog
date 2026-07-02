import axios from 'axios'
import { useState } from 'react'
import { API_URL } from '../config'

export default function InputForm({ setIsOpen }) {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isSignUp, setIsSignUp] = useState(false)
    const [error, setError] = useState('')

    const validateForm = () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!email || !email.trim()) {
            return "Email is required."
        }
        if (!emailRegex.test(email)) {
            return "Please enter a valid email address."
        }
        if (!password || !password.trim()) {
            return "Password is required."
        }
        if (isSignUp && password.length < 6) {
            return "Password must be at least 6 characters long."
        }
        return ""
    }

    const handleOnsubmit = async (e) => {
        e.preventDefault()
        const validationError = validateForm()
        if (validationError) {
            setError(validationError)
            return
        }
        setError("")
        let endpoint = (isSignUp) ? "signUp" : "login"
        await axios.post(`${API_URL}/${endpoint}`, { email, password })
            .then((res) => {
                localStorage.setItem("token", res.data.token)
                localStorage.setItem("user", JSON.stringify(res.data.user))
                setIsOpen()
                window.location.reload()
            })
            .catch(data => setError(data.response?.data?.error || "An error occurred."))
    }
    return (
        <>
            <form className='form' onSubmit={handleOnsubmit}>
                <div className='form-control'>
                    <label>Email</label>
                    <input type="text" className='input' onChange={(e) => setEmail(e.target.value)} ></input>
                </div>
                <div className='form-control'>
                    <label>Password</label>
                    <input type="password" className='input' onChange={(e) => setPassword(e.target.value)} ></input>
                </div>
                <button type="submit">{isSignUp ? "Sign Up" : "Login"}</button>
                <br></br>
                {(error != "") && <h6 className='error'> {error} </h6>}<br></br>
                <p onClick={() => setIsSignUp(pre => !pre)}>{isSignUp ? "Already have an account" : "Create new account"}</p>
            </form>
        </>
    )
}
