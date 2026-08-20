import { useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

function PostCard({ post, onPostUpdate }) {
  const [liked, setLiked] = useState(post.is_liked)
  const [likesCount, setLikesCount] = useState(post.likes_count)
  const [showComments, setShowComments] = useState(false)
  const [comments, setComments] = useState([])
  const [commentText, setCommentText] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLike = async () => {
    try {
      if (liked) {
        await axios.post(`/api/posts/${post.id}/unlike/`)
        setLiked(false)
        setLikesCount(likesCount - 1)
      } else {
        await axios.post(`/api/posts/${post.id}/like/`)
        setLiked(true)
        setLikesCount(likesCount + 1)
      }
    } catch (err) {
      console.error('Failed to toggle like')
    }
  }

  const handleShowComments = async () => {
    if (!showComments && comments.length === 0) {
      try {
        const response = await axios.get(`/api/posts/${post.id}/comments/`)
        setComments(response.data)
      } catch (err) {
        console.error('Failed to load comments')
      }
    }
    setShowComments(!showComments)
  }

  const handleAddComment = async (e) => {
    e.preventDefault()
    if (!commentText.trim()) return

    setLoading(true)
    try {
      const response = await axios.post(`/api/posts/${post.id}/add_comment/`, {
        content: commentText,
        post: post.id
      })
      setComments([...comments, response.data])
      setCommentText('')
      if (onPostUpdate) {
        onPostUpdate()
      }
    } catch (err) {
      console.error('Failed to add comment')
    } finally {
      setLoading(false)
    }
  }

  const formatTime = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diff = (now - date) / 1000

    if (diff < 60) return 'Just now'
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
    return date.toLocaleDateString()
  }

  return (
    <div className="post-card">
      <div className="post-header">
        <div className="post-author">
          <Link to={`/profile/${post.user}`} className="post-avatar">
            {post.username?.charAt(0).toUpperCase()}
          </Link>
          <div className="post-user-info">
            <Link to={`/profile/${post.user}`} className="post-username">
              {post.username}
            </Link>
            <span className="post-time">{formatTime(post.created_at)}</span>
          </div>
        </div>
      </div>

      <p className="post-content">{post.content}</p>

      <div className="post-actions">
        <button
          className={`post-action ${liked ? 'liked' : ''}`}
          onClick={handleLike}
        >
          ❤️ {likesCount}
        </button>
        <button
          className="post-action"
          onClick={handleShowComments}
        >
          💬 {post.comments_count}
        </button>
      </div>

      {showComments && (
        <div className="comments-section">
          <form onSubmit={handleAddComment} className="comment-form">
            <input
              type="text"
              placeholder="Write a comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              disabled={loading}
            />
            <button type="submit" className="btn btn-primary" disabled={loading}>
              Post
            </button>
          </form>

          {comments.map(comment => (
            <div key={comment.id} className="comment">
              <Link to={`/profile/${comment.user}`} className="comment-avatar">
                {comment.username?.charAt(0).toUpperCase()}
              </Link>
              <div className="comment-content">
                <Link to={`/profile/${comment.user}`} className="comment-username">
                  {comment.username}
                </Link>
                <p className="comment-text">{comment.content}</p>
                <span className="comment-time">{formatTime(comment.created_at)}</span>
              </div>
            </div>
          ))}

          {comments.length === 0 && (
            <p style={{ color: 'var(--text-light)', fontSize: '0.875rem' }}>
              No comments yet. Be the first to comment!
            </p>
          )}
        </div>
      )}
    </div>
  )
}

export default PostCard
