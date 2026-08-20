# Social Media Platform

A full-stack social media application built with Django REST Framework and React + Vite.

## Features

- **Authentication**: JWT-based user authentication
- **Posts**: Create, view, and interact with posts
- **Comments**: Nested comments on posts
- **Likes**: Toggle likes on posts
- **Follow System**: Follow/unfollow users
- **Feed**: Personalized feed from followed users
- **Explore**: Discover all posts and search for users
- **Profiles**: View user profiles with stats

## Tech Stack

### Backend
- Django 5.0.7
- Django REST Framework 3.15.2
- Simple JWT for authentication
- SQLite database

### Frontend
- React 18
- Vite 5
- React Router 6
- Axios

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd social-media-platform/backend
   ```

2. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Run migrations:
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

5. Create a superuser (optional):
   ```bash
   python manage.py createsuperuser
   ```

6. Run the development server:
   ```bash
   python manage.py runserver
   ```

The API will be available at `http://localhost:8000`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd social-media-platform/frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

The app will be available at `http://localhost:5174`

## API Endpoints

### Authentication
- `POST /api/auth/` - Register new user
- `POST /api/auth/login/` - Login user
- `POST /api/auth/logout/` - Logout user
- `GET /api/auth/users/me/` - Get current user

### Posts
- `GET /api/posts/` - List all posts
- `POST /api/posts/` - Create new post
- `GET /api/posts/{id}/` - Get specific post
- `PUT /api/posts/{id}/` - Update post
- `DELETE /api/posts/{id}/` - Delete post
- `POST /api/posts/{id}/like/` - Like a post
- `POST /api/posts/{id}/unlike/` - Unlike a post
- `GET /api/posts/{id}/comments/` - Get post comments
- `POST /api/posts/{id}/add_comment/` - Add comment

### Feed
- `GET /api/posts/feed/my-feed/` - Get personalized feed
- `GET /api/posts/feed/explore/` - Get all posts

### Profiles
- `GET /api/profiles/{id}/` - Get user profile
- `POST /api/profiles/{id}/follow/` - Follow user
- `POST /api/profiles/{id}/unfollow/` - Unfollow user
- `GET /api/profiles/{id}/followers/` - Get followers
- `GET /api/profiles/{id}/following/` - Get following
- `GET /api/profiles/search/?q=query` - Search users

## Database Schema

### Users
- id (Primary Key)
- username
- email
- bio
- profile_picture
- created_at
- updated_at

### Posts
- id (Primary Key)
- user_id (Foreign Key)
- content
- created_at
- updated_at

### Comments
- id (Primary Key)
- post_id (Foreign Key)
- user_id (Foreign Key)
- parent_id (Foreign Key, nullable)
- content
- created_at
- updated_at

### Likes
- id (Primary Key)
- post_id (Foreign Key)
- user_id (Foreign Key)
- created_at

### Followers
- id (Primary Key)
- follower_id (Foreign Key)
- following_id (Foreign Key)
- created_at
