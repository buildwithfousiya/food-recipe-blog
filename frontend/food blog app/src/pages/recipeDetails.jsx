import { FaUserCircle } from 'react-icons/fa'
import { BsStopwatchFill, BsArrowLeft } from 'react-icons/bs'
import { useLoaderData, useNavigate } from 'react-router-dom'

export default function RecipeDetails() {
    const recipe = useLoaderData()
    const navigate = useNavigate()

  return (
   <>
    <div className='detail-page'>
      <div className='detail-hero'>
        <img src={`${import.meta.env.VITE_API_URL}/images/${recipe.coverImage}`} alt={recipe.title} />
        <div className='detail-hero-overlay'></div>
        <button className='detail-back-btn' onClick={() => navigate(-1)}>
          <BsArrowLeft /> Back
        </button>
      </div>

      <div className='detail-content'>
        <div className='detail-header'>
          <h1 className='detail-title'>{recipe.title}</h1>
          <div className='detail-meta'>
            <div className='detail-author'>
              <FaUserCircle size={36} color="#00a884" />
              <span>{recipe.email}</span>
            </div>
            {recipe.time && (
              <div className='detail-time'>
                <BsStopwatchFill />
                <span>{recipe.time}</span>
              </div>
            )}
          </div>
        </div>

        <div className='detail-sections'>
          <div className='detail-ingredients'>
            <h2>Ingredients</h2>
            <ul>
              {recipe.ingredients.map((item, index) => (
                <li key={index}>
                  <span className='ingredient-dot'></span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className='detail-instructions'>
            <h2>Instructions</h2>
            <p>{recipe.instructions}</p>
          </div>
        </div>
      </div>
    </div>
   </>
  )
}
