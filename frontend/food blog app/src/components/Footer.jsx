import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <div className="footer">
      <p>
        @copyright foodie diary |{' '}
        <Link to="/admin" style={{ color: '#d4f6e8', textDecoration: 'underline', fontWeight: '500', marginLeft: '5px' }}>
          Admin Portal
        </Link>
      </p>
    </div>
  )
}
