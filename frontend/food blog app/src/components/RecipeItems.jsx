import { useLoaderData } from 'react-router-dom'
import foodImg from '../assets/foodRecipe.png'
import { BsStopwatchFill } from "react-icons/bs";
import { FaHeart } from "react-icons/fa";



export default function RecipeItems() {
  const allRecipes = useLoaderData();
  console.log(allRecipes);

  return (
    <>
      <div className='card-container'>
        {
          allRecipes?.map((item, index) => {
            return (
              <div key={index} className='card'>
                <img src={`http://localhost:5000/images/${item.coverImage}`} width="120px" height='100px' />
                <div className="card-body">
                  <div className="title">{item.title}</div>
                  <div className="icons">
                    <div className="timer"><BsStopwatchFill />30min</div>
                    <FaHeart />
                  </div>
                </div>
              </div>
            )
          })
        }
      </div>
    </>
  )
}