import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import PostCard from '../components/PostCard'

function ProfilePage() {
  const { id } = useParams()
  const { user: currentUser } = useAuth()
  const [profile, setProfile] = useState(null)
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [isFollowing, setIsFollowing] = useState(false)

  useEffect(() => {
    fetchProfile()
  }, [id])

  const fetchProfile = async () => {
    setLoading(true)
    try {
      const [profileRes, postsRes] = await Promise.all([
        axios.get(`/api/profiles/${id}/`),
        axios.get(`/api/posts/?user=${id}`)
      ])
      setProfile(profileRes.data)
      setPosts(postsRes.data.results || postsRes.data)
    } catch (err) {
      console.error('Failed to load profile')
    } finally {
      setLoading(false)
    }
  }

  const handleFollow = async () => {
    try {
      if (isFollowing) {
        await axios.post(`/api/profiles/${id}/unfollow/`)
        setIsFollowing(false)
        setProfile(prev => ({
          ...prev,
          followers_count: prev.followers_count - 1
        }))
      } else {
        await axios.post(`/api/profiles/${id}/follow/`)
        setIsFollowing(true)
        setProfile(prev => ({
          ...prev,
          followers_count: prev.followers_count + 1
        }))
      }
    } catch (err) {
      console.error('Failed to toggle follow')
    }
  }

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="loader">
        <div className="spinner"></div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="empty-state">
        <p>User not found</p>
      </div>
    )
  }

  const isOwnProfile = currentUser?.id === parseInt(id)

  return (
    <div>
      <div className="profile-header">
        <div className="profile-info">
          <div className="profile-avatar">
            {profile.username.charAt(0).toUpperCase()}
          </div>
          <div className="profile-details">
            <h1>{profile.username}</h1>
            <p className="profile-bio">{profile.bio || 'No bio yet'}</p>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-light)' }}>
              Joined {formatTime(profile.created_at)}
            </p>
          </div>
        </div>

        {!isOwnProfile && (
          <button
            className={`btn btn-outline ${isFollowing ? 'following' : ''}`}
            onClick={handleFollow}
            style={{ marginTop: '1rem' }}
          >
            {isFollowing ? 'Following' : 'Follow'}
          </button>
        )}

        <div className="profile-stats">
          <div className="stat">
            <div className="stat-value">{profile.posts_count}</div>
            <div className="stat-label">Posts</div>
          </div>
          <div className="stat">
            <div className="stat-value">{profile.followers_count}</div>
            <div className="stat-label">Followers</div>
          </div>
          <div className="stat">
            <div className="stat-value">{profile.following_count}</div>
            <div className="stat-label">Following</div>
          </div>
        </div>
      </div>

      <h2 style={{ marginBottom: '1rem', fontSize: '1.25rem' }}>Posts</h2>

      {posts.length === 0 ? (
        <div className="empty-state">
          <p>No posts yet.</p>
        </div>
      ) : (
        posts.map(post => (
          <PostCard key={post.id} post={post} onPostUpdate={fetchProfile} />
        ))
      )}
    </div>
  )
}

export default ProfilePage
