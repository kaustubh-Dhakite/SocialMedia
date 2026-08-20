from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly

from django.contrib.auth import get_user_model
from .models import Follow
from .serializers import FollowSerializer

User = get_user_model()


class ProfileViewSet(viewsets.ViewSet):
    """ViewSet for profile operations."""

    @action(detail=True, methods=['get'])
    def profile(self, request, pk=None):
        """Get a user's profile."""
        try:
            user = User.objects.get(pk=pk)
            from authentication.serializers import UserSerializer
            serializer = UserSerializer(user)
            return Response(serializer.data)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def follow(self, request, pk=None):
        """Follow a user."""
        try:
            user_to_follow = User.objects.get(pk=pk)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

        if request.user == user_to_follow:
            return Response({'error': 'Cannot follow yourself'}, status=status.HTTP_400_BAD_REQUEST)

        # Check if already following
        if Follow.objects.filter(follower=request.user, following=user_to_follow).exists():
            return Response({'error': 'Already following'}, status=status.HTTP_400_BAD_REQUEST)

        Follow.objects.create(follower=request.user, following=user_to_follow)
        return Response({'message': f'Now following {user_to_follow.username}'}, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def unfollow(self, request, pk=None):
        """Unfollow a user."""
        try:
            user_to_unfollow = User.objects.get(pk=pk)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

        try:
            follow = Follow.objects.get(follower=request.user, following=user_to_unfollow)
            follow.delete()
            return Response({'message': f'Unfollowed {user_to_unfollow.username}'})
        except Follow.DoesNotExist:
            return Response({'error': 'Not following this user'}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['get'])
    def followers(self, request, pk=None):
        """Get a user's followers."""
        try:
            user = User.objects.get(pk=pk)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

        followers = Follow.objects.filter(following=user)
        serializer = FollowSerializer(followers, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['get'])
    def following(self, request, pk=None):
        """Get users that a user follows."""
        try:
            user = User.objects.get(pk=pk)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

        following = Follow.objects.filter(follower=user)
        serializer = FollowSerializer(following, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def search(self, request):
        """Search for users by username."""
        query = request.query_params.get('q', '')
        if not query:
            return Response({'error': 'Query parameter required'}, status=status.HTTP_400_BAD_REQUEST)

        users = User.objects.filter(username__icontains=query)[:10]
        from authentication.serializers import UserSerializer
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)
