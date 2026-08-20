import { useState, useEffect } from 'react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import PostCard from '../components/PostCard'

function FeedPage() {
  const { user } = useAuth()
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [newPostContent, setNewPostContent] = useState('')
  const [posting, setPosting] = useState(false)

  useEffect(() => {
    fetchFeed()
  }, [])

  const fetchFeed = async () => {
    try {
      const response = await axios.get('/api/posts/feed/my-feed/')
      setPosts(response.data)
    } catch (err) {
      console.error('Failed to load feed')
    } finally {
      setLoading(false)
    }
  }

  const handleCreatePost = async (e) => {
    e.preventDefault()
    if (!newPostContent.trim()) return

    setPosting(true)
    try {
      const response = await axios.post('/api/posts/', {
        content: newPostContent
      })
      setPosts([response.data, ...posts])
      setNewPostContent('')
    } catch (err) {
      console.error('Failed to create post')
    } finally {
      setPosting(false)
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
        <h1>Your Feed</h1>
        <p>Posts from people you follow</p>
      </div>

      <div className="create-post">
        <form onSubmit={handleCreatePost}>
          <textarea
            placeholder="What's on your mind?"
            value={newPostContent}
            onChange={(e) => setNewPostContent(e.target.value)}
            maxLength={1000}
            rows={3}
          />
          <div className="create-post-actions">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={posting || !newPostContent.trim()}
            >
              {posting ? 'Posting...' : 'Post'}
            </button>
          </div>
        </form>
      </div>

      {posts.length === 0 ? (
        <div className="empty-state">
          <p>Your feed is empty.</p>
          <p>Follow some users to see their posts here!</p>
        </div>
      ) : (
        posts.map(post => (
          <PostCard key={post.id} post={post} onPostUpdate={fetchFeed} />
        ))
      )}
    </div>
  )
}

export default FeedPage
