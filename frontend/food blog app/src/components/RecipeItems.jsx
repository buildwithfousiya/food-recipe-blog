import axios from 'axios';
import { useEffect, useState } from 'react';
import { BsStopwatchFill } from "react-icons/bs";
import { FaEdit } from "react-icons/fa";
import { FaHeart } from "react-icons/fa6";
import { MdDelete } from "react-icons/md";
import { Link, useLoaderData, useNavigate } from 'react-router-dom';
import Modal from './Modal';
import InputForm from './InputForm';

export default function RecipeItems() {
  const recipes = useLoaderData()
  const navigate = useNavigate()
  const [allRecipes, setAllRecipes] = useState()
  let path = window.location.pathname === "/myRecipe" ? true : false
  const user = JSON.parse(localStorage.getItem("user"))
  const favKey = user ? `fav_${user._id}` : "fav"
  let favItems = JSON.parse(localStorage.getItem(favKey)) ?? []
  const [isFavRecipe, setIsFavRecipe] = useState(false)
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const [deleteConfirmId, setDeleteConfirmId] = useState(null)


  useEffect(() => {
    setAllRecipes(recipes)
  }, [recipes])

  const onDelete = async (id) => {
    await axios.delete(`${import.meta.env.VITE_API_URL}/recipe/${id}`, {
      headers: {
        authorization: 'bearer ' + localStorage.getItem("token")
      }
    })
      .then((res) => console.log(res))
    setAllRecipes(recipes => recipes.filter(recipe => recipe._id !== id))
    let filterItem = favItems.filter(recipe => recipe._id !== id)
    localStorage.setItem(favKey, JSON.stringify(filterItem))
  }
  const favRecipe = (item) => {
    let token = localStorage.getItem("token")
    if (!token) {
      setIsLoginOpen(true)
      return
    }
    let filterItem = favItems.filter(recipe => recipe._id !== item._id)
    favItems = favItems.filter(recipe => recipe._id === item._id).length === 0 ? [...favItems, item] : filterItem
    localStorage.setItem(favKey, JSON.stringify(favItems))
    setIsFavRecipe(pre => !pre)
  }

  return (
    <>
      <div className='card-container'>
        {
          allRecipes?.map((item, index) => {
            return (
              <div key={index} className='card' onClick={() => navigate(`/recipe/${item._id}`)}>
                <img src={`${import.meta.env.VITE_API_URL}/images/${item.coverImage}`} width="120px" height="100px"></img>
                <div className='card-body'>
                  <div className='title'>{item.title}</div>
                  <div className='icons'>
                    <div className='timer'><BsStopwatchFill />{item.time}</div>
                    {(!path) ? <FaHeart onClick={(e) => { e.stopPropagation(); favRecipe(item); }} style={{ color: (favItems.some(res => res._id === item._id)) ? "red" : "" }} /> :
                      <div className='action'>
                        <Link to={`/editRecipe/${item._id}`} className="editIcon" onClick={(e) => e.stopPropagation()}><FaEdit /></Link>
                        <MdDelete onClick={(e) => { e.stopPropagation(); setDeleteConfirmId(item._id); }} className='deleteIcon' />
                      </div>
                    }
                  </div>
                </div>
              </div>
            )
          })
        }
      </div>
      {isLoginOpen && <Modal onClose={() => setIsLoginOpen(false)}><InputForm setIsOpen={() => setIsLoginOpen(false)} /></Modal>}
      {deleteConfirmId && (
        <Modal onClose={() => setDeleteConfirmId(null)}>
          <div className="confirm-modal-content">
            <h3>Delete Recipe</h3>
            <p>Are you sure you want to delete this recipe? This action cannot be undone.</p>
            <div className="confirm-modal-buttons">
              <button className="confirm-btn-cancel" onClick={() => setDeleteConfirmId(null)}>Cancel</button>
              <button className="confirm-btn-delete" onClick={() => { onDelete(deleteConfirmId); setDeleteConfirmId(null); }}>Delete</button>
            </div>
          </div>
        </Modal>
      )}
    </>
  )
}