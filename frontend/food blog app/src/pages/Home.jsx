import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import foodRecipe from '../assets/foodRecipe.png'
import RecipeItems from '../components/RecipeItems'
import Modal from '../components/Modal'
import InputForm from '../components/InputForm'

export default function Home() {
    const navigate = useNavigate()
    const [isOpen, setIsOpen] = useState(false)

    const addRecipe = () => {
        let token = localStorage.getItem("token")
        if (token) {
            navigate("/addRecipe")
        } else {
            setIsOpen(true)
        }
    }

    return (
        <>
            <section className='home'>
                <div className='left'>
                    <h1>Food Recipe</h1>
                    <p>Welcome to Food Recipe, your ultimate destination for culinary inspiration. Share your unique recipes, connect with a global community of food lovers, and discover new favorites. Start your journey of creating and sharing delicious meals with us today.</p>
                    <button onClick={addRecipe}>Share your recipe</button>
                </div>
                <div className='right'>
                    <img src={foodRecipe} width="320" height="300" />
                </div>
            </section>
            <div className='bg'>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path fill="#d4f6e8" fillOpacity="1" d="M0,0L24,37.3C48,75,96,149,144,160C192,171,240,117,288,85.3C336,53,384,43,432,37.3C480,32,528,32,576,80C624,128,672,224,720,224C768,224,816,128,864,112C912,96,960,160,1008,202.7C1056,245,1104,267,1152,256C1200,245,1248,203,1296,176C1344,149,1392,139,1416,133.3L1440,128L1440,320L1416,320C1392,320,1344,320,1296,320C1248,320,1200,320,1152,320C1104,320,1056,320,1008,320C960,320,912,320,864,320C816,320,768,320,720,320C672,320,624,320,576,320C528,320,480,320,432,320C384,320,336,320,288,320C240,320,192,320,144,320C96,320,48,320,24,320L0,320Z"></path></svg>
            </div>
            {(isOpen) && <Modal onClose={() => setIsOpen(false)}><InputForm setIsOpen={() => setIsOpen(false)} /></Modal>}
            <div className='recipe'>
                <RecipeItems />
            </div>
        </>
    )
}
