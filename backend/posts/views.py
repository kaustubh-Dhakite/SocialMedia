from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters

from .models import Post, Like, Comment
from .serializers import (
    PostSerializer, PostCreateSerializer,
    CommentSerializer, CommentCreateSerializer,
    LikeSerializer
)


class PostViewSet(viewsets.ModelViewSet):
    """ViewSet for post operations."""
    queryset = Post.objects.all()
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['user']
    search_fields = ['content']
    ordering_fields = ['created_at', 'likes_count']
    ordering = ['-created_at']

    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return PostCreateSerializer
        return PostSerializer

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def perform_update(self, serializer):
        if self.request.user != self.get_object().user:
            return Response(
                {'error': 'You can only edit your own posts'},
                status=status.HTTP_403_FORBIDDEN
            )
        serializer.save()

    def perform_destroy(self, instance):
        if self.request.user != instance.user:
            return Response(
                {'error': 'You can only delete your own posts'},
                status=status.HTTP_403_FORBIDDEN
            )
        instance.delete()

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def like(self, request, pk=None):
        """Like a post."""
        post = self.get_object()

        # Check if already liked
        if Like.objects.filter(user=request.user, post=post).exists():
            return Response(
                {'error': 'Post already liked'},
                status=status.HTTP_400_BAD_REQUEST
            )

        Like.objects.create(user=request.user, post=post)
        return Response({'message': 'Post liked'}, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def unlike(self, request, pk=None):
        """Unlike a post."""
        post = self.get_object()

        try:
            like = Like.objects.get(user=request.user, post=post)
            like.delete()
            return Response({'message': 'Post unliked'})
        except Like.DoesNotExist:
            return Response(
                {'error': 'Post not liked'},
                status=status.HTTP_400_BAD_REQUEST
            )

    @action(detail=True, methods=['get'])
    def comments(self, request, pk=None):
        """Get comments for a post."""
        post = self.get_object()
        comments = post.comments.all()
        serializer = CommentSerializer(comments, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def add_comment(self, request, pk=None):
        """Add a comment to a post."""
        post = self.get_object()
        serializer = CommentCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(user=request.user, post=post)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class CommentViewSet(viewsets.ModelViewSet):
    """ViewSet for comment operations."""
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return CommentCreateSerializer
        return CommentSerializer

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def perform_destroy(self, instance):
        if self.request.user != instance.user:
            return Response(
                {'error': 'You can only delete your own comments'},
                status=status.HTTP_403_FORBIDDEN
            )
        instance.delete()


class FeedViewSet(viewsets.ViewSet):
    """ViewSet for feed operations."""

    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def my_feed(self, request):
        """Get posts from followed users."""
        # Get users that current user follows
        following_users = request.user.following.values_list('following_id', flat=True)

        # Include own posts in feed
        following_users = list(following_users) + [request.user.id]

        posts = Post.objects.filter(user_id__in=following_users)[:50]
        serializer = PostSerializer(posts, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def explore(self, request):
        """Get all posts for explore page."""
        posts = Post.objects.all()[:50]
        serializer = PostSerializer(posts, many=True)
        return Response(serializer.data)
