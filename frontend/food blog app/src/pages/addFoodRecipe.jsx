import { useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { BsArrowLeft } from "react-icons/bs"
import { API_URL } from '../config'

export default function AddFoodRecipe() {
    const [recipeData, setRecipeData] = useState({})
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const onHandleChange = (e) => {
        let val = e.target.name === "ingredients"
            ? e.target.value.split(",")
            : (e.target.name === "file")
                ? e.target.files[0]
                : e.target.value;
        setRecipeData(pre => ({ ...pre, [e.target.name]: val }))
    }

    const validateForm = (data) => {
        if (!data.title || !data.title.trim()) return "Title is required."
        if (!data.time || !data.time.trim()) return "Time is required."
        if (!data.ingredients || data.ingredients.length === 0 || (Array.isArray(data.ingredients) && data.ingredients.every(i => !i.trim()))) {
            return "Ingredients are required."
        }
        if (!data.instructions || !data.instructions.trim()) return "Instructions are required."
        if (!data.file) return "Recipe Image is required."
        return ""
    }

    const onHandleSubmit = async (e) => {
        e.preventDefault()
        const validationError = validateForm(recipeData)
        if (validationError) {
            setError(validationError)
            return
        }

        setError("")
        setLoading(true)

        try {
            await axios.post(`${API_URL}/recipe`, recipeData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    'authorization': 'bearer ' + localStorage.getItem("token")
                }
            })
            navigate("/")
        } catch (err) {
            setError(err.response?.data?.message || err.message || "An error occurred while adding the recipe.")
            setLoading(false)
        }
    }

    return (
        <>
            <div className='container edit-recipe-container' >
                <button className='detail-back-btn' onClick={() => navigate(-1)}>
                    <BsArrowLeft /> Back
                </button>
                <form className='form edit-recipe-form' onSubmit={onHandleSubmit}>
                    <h2 className='edit-recipe-title'>Share Recipe</h2>
                    <div className='form-control'>
                        <label>Title</label>
                        <input type="text" className='input' name="title" onChange={onHandleChange}></input>
                    </div>
                    <div className='form-control'>
                        <label>Time</label>
                        <input type="text" className='input' name="time" onChange={onHandleChange}></input>
                    </div>
                    <div className='form-control'>
                        <label>Ingredients</label>
                        <textarea type="text" className='input-textarea' name="ingredients" rows="5" onChange={onHandleChange}></textarea>
                    </div>
                    <div className='form-control'>
                        <label>Instructions</label>
                        <textarea type="text" className='input-textarea' name="instructions" rows="5" onChange={onHandleChange}></textarea>
                    </div>
                    <div className='form-control'>
                        <label>Recipe Image</label>
                        <input type="file" className='input' name="file" onChange={onHandleChange}></input>
                    </div>
                    {error && <h6 className='error' style={{ marginTop: '15px', textAlign: 'center' }}>{error}</h6>}
                    <button type="submit" disabled={loading}>
                        {loading && <span className="btn-spinner"></span>}
                        {loading ? "Adding..." : "Add Recipe"}
                    </button>
                </form>
            </div>
        </>
    )
}
