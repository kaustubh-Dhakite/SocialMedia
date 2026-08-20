import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function RegisterPage() {
  const navigate = useNavigate()
  const { register } = useAuth()
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password_confirm: '',
    bio: ''
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrors({})
    setLoading(true)

    if (formData.password !== formData.password_confirm) {
      setErrors({ password_confirm: 'Passwords do not match' })
      setLoading(false)
      return
    }

    try {
      await register(formData)
      navigate('/')
    } catch (err) {
      setErrors(err.response?.data || { non_field_errors: 'Registration failed' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: '400px', margin: '2rem auto' }}>
      <div className="page-header" style={{ textAlign: 'center' }}>
        <h1>Create Account</h1>
        <p>Join our community today</p>
      </div>

      {errors.non_field_errors && (
        <div className="alert alert-error">{errors.non_field_errors}</div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Username *</label>
          <input
            type="text"
            name="username"
            className="form-input"
            value={formData.username}
            onChange={handleChange}
            required
          />
          {errors.username && (
            <p style={{ color: 'var(--danger)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
              {Array.isArray(errors.username) ? errors.username.join(', ') : errors.username}
            </p>
          )}
        </div>

        <div className="form-group">
          <label className="form-label">Email *</label>
          <input
            type="email"
            name="email"
            className="form-input"
            value={formData.email}
            onChange={handleChange}
            required
          />
          {errors.email && (
            <p style={{ color: 'var(--danger)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
              {Array.isArray(errors.email) ? errors.email.join(', ') : errors.email}
            </p>
          )}
        </div>

        <div className="form-group">
          <label className="form-label">Password *</label>
          <input
            type="password"
            name="password"
            className="form-input"
            value={formData.password}
            onChange={handleChange}
            required
          />
          {errors.password && (
            <p style={{ color: 'var(--danger)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
              {Array.isArray(errors.password) ? errors.password.join(', ') : errors.password}
            </p>
          )}
        </div>

        <div className="form-group">
          <label className="form-label">Confirm Password *</label>
          <input
            type="password"
            name="password_confirm"
            className="form-input"
            value={formData.password_confirm}
            onChange={handleChange}
            required
          />
          {errors.password_confirm && (
            <p style={{ color: 'var(--danger)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
              {errors.password_confirm}
            </p>
          )}
        </div>

        <div className="form-group">
          <label className="form-label">Bio</label>
          <textarea
            name="bio"
            className="form-textarea"
            value={formData.bio}
            onChange={handleChange}
            maxLength={500}
            rows={3}
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary btn-full"
          disabled={loading}
          style={{ marginTop: '1rem' }}
        >
          {loading ? 'Creating Account...' : 'Create Account'}
        </button>
      </form>

      <p style={{ textAlign: 'center', marginTop: '1rem', color: 'var(--text-light)' }}>
        Already have an account?{' '}
        <Link to="/login" style={{ color: 'var(--primary)' }}>
          Sign in
        </Link>
      </p>
    </div>
  )
}

export default RegisterPage
