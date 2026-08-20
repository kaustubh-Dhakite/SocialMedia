import { useState, useEffect } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import PostCard from '../components/PostCard'

function ExplorePage() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [searching, setSearching] = useState(false)

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      const response = await axios.get('/api/posts/feed/explore/')
      setPosts(response.data)
    } catch (err) {
      console.error('Failed to load posts')
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!searchQuery.trim()) {
      setSearchResults([])
      return
    }

    setSearching(true)
    try {
      const response = await axios.get(`/api/profiles/search/?q=${searchQuery}`)
      setSearchResults(response.data)
    } catch (err) {
      console.error('Search failed')
    } finally {
      setSearching(false)
    }
  }

  if (loading) {
    return (
      <div className="loader">
        <div className="spinner"></div>
      </div>
    )
  }

  return (
    <div>
      <div className="page-header">
        <h1>Explore</h1>
        <p>Discover posts and users</p>
      </div>

      <div className="search-box">
        <form onSubmit={handleSearch}>
          <input
            type="text"
            className="search-input"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>

        {searchResults.length > 0 && (
          <div className="search-results" style={{ marginTop: '1rem' }}>
            {searchResults.map(user => (
              <Link
                key={user.id}
                to={`/profile/${user.id}`}
                className="search-result"
              >
                <div className="post-avatar" style={{ width: '40px', height: '40px', fontSize: '1rem' }}>
                  {user.username.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div style={{ fontWeight: '600' }}>{user.username}</div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--text-light)' }}>
                    {user.followers_count} followers
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <h2 style={{ marginBottom: '1rem', fontSize: '1.25rem' }}>Recent Posts</h2>

      {posts.length === 0 ? (
        <div className="empty-state">
          <p>No posts yet.</p>
        </div>
      ) : (
        posts.map(post => (
          <PostCard key={post.id} post={post} onPostUpdate={fetchPosts} />
        ))
      )}
    </div>
  )
}

export default ExplorePage
