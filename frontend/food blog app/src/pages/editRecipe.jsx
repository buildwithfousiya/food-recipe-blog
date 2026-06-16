import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import axios from "axios"
import { BsArrowLeft } from "react-icons/bs"

export default function EditRecipe() {
    const [recipeData, setRecipeData] = useState({})
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const { id } = useParams()

    useEffect(() => {
        const getData = async () => {
            await axios.get(`${import.meta.env.VITE_API_URL}/recipe/${id}`)
                .then(response => {
                    let res = response.data
                    setRecipeData({
                        title: res.title,
                        ingredients: res.ingredients.join(","),
                        instructions: res.instructions,
                        time: res.time
                    })
                })
        }
        getData()
    }, [])

    const onHandleChange = (e) => {
        let val = e.target.name === "ingredients"
            ? e.target.value.split(",")
            : (e.target.name === "file")
                ? e.target.files[0]
                : e.target.value
        setRecipeData(pre => ({ ...pre, [e.target.name]: val }))
    }

    const validateForm = (data) => {
        if (!data.title || (typeof data.title === 'string' && !data.title.trim())) return "Title is required."
        if (!data.time || (typeof data.time === 'string' && !data.time.trim())) return "Time is required."
        if (!data.ingredients) return "Ingredients are required."
        if (Array.isArray(data.ingredients)) {
            if (data.ingredients.length === 0 || data.ingredients.every(i => !i.trim())) {
                return "Ingredients are required."
            }
        } else if (typeof data.ingredients === 'string') {
            if (!data.ingredients.trim()) return "Ingredients are required."
        }
        if (!data.instructions || (typeof data.instructions === 'string' && !data.instructions.trim())) {
            return "Instructions are required."
        }
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
            await axios.put(`${import.meta.env.VITE_API_URL}/recipe/${id}`, recipeData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    'authorization': 'bearer ' + localStorage.getItem("token")
                }
            })
            navigate("/myRecipe")
        } catch (err) {
            setError(err.response?.data?.message || err.message || "An error occurred while updating the recipe.")
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
                    <h2 className='edit-recipe-title'>Edit Recipe</h2>
                    <div className='form-control'>
                        <label>Title</label>
                        <input type="text" className='input' name="title" onChange={onHandleChange} value={recipeData.title}></input>
                    </div>
                    <div className='form-control'>
                        <label>Time</label>
                        <input type="text" className='input' name="time" onChange={onHandleChange} value={recipeData.time}></input>
                    </div>
                    <div className='form-control'>
                        <label>Ingredients</label>
                        <textarea type="text" className='input-textarea' name="ingredients" rows="5" onChange={onHandleChange} value={recipeData.ingredients}></textarea>
                    </div>
                    <div className='form-control'>
                        <label>Instructions</label>
                        <textarea type="text" className='input-textarea' name="instructions" rows="5" onChange={onHandleChange} value={recipeData.instructions}></textarea>
                    </div>
                    <div className='form-control'>
                        <label>Recipe Image</label>
                        <input type="file" className='input' name="file" onChange={onHandleChange}></input>
                    </div>
                    {error && <h6 className='error' style={{ marginTop: '15px', textAlign: 'center' }}>{error}</h6>}
                    <button type="submit" disabled={loading}>
                        {loading && <span className="btn-spinner"></span>}
                        {loading ? "Saving..." : "Edit Recipe"}
                    </button>
                </form>
            </div>
        </>
    )
}
