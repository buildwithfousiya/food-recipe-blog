import { useNavigate } from "react-router-dom"
import { BsArrowLeft } from "react-icons/bs"

export default function NotFound() {
  const navigate = useNavigate()

  return (
    <div className="not-found-container">
      <div className="not-found-card">
        <h1 className="not-found-title">404</h1>
        <h2 className="not-found-subtitle">Oops! This recipe page went cold.</h2>
        <p className="not-found-text">
          The page you are looking for has either been eaten, expired, or never existed in our cookbook.
        </p>
        <button className="not-found-btn" onClick={() => navigate("/")}>
          <BsArrowLeft /> Back to Home
        </button>
      </div>
    </div>
  )
}
