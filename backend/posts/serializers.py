from rest_framework import serializers
from .models import Post, Like, Comment


class LikeSerializer(serializers.ModelSerializer):
    """Serializer for likes."""
    username = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = Like
        fields = ('id', 'user', 'username', 'created_at')
        read_only_fields = ('id', 'user', 'created_at')


class CommentSerializer(serializers.ModelSerializer):
    """Serializer for comments."""
    username = serializers.CharField(source='user.username', read_only=True)
    replies = serializers.SerializerMethodField()

    class Meta:
        model = Comment
        fields = (
            'id', 'user', 'username', 'post', 'parent',
            'content', 'replies', 'is_reply',
            'created_at', 'updated_at'
        )
        read_only_fields = ('id', 'user', 'post', 'created_at', 'updated_at')

    def get_replies(self, obj):
        replies = obj.replies.all()
        return CommentSerializer(replies, many=True).data


class CommentCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating comments."""

    class Meta:
        model = Comment
        fields = ('content', 'post', 'parent')


class PostSerializer(serializers.ModelSerializer):
    """Serializer for posts."""
    username = serializers.CharField(source='user.username', read_only=True)
    likes_count = serializers.ReadOnlyField()
    comments_count = serializers.ReadOnlyField()
    is_liked = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = (
            'id', 'user', 'username', 'content',
            'likes_count', 'comments_count', 'is_liked',
            'created_at', 'updated_at'
        )
        read_only_fields = ('id', 'user', 'created_at', 'updated_at')

    def get_is_liked(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return Like.objects.filter(user=request.user, post=obj).exists()
        return False


class PostCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating posts."""

    class Meta:
        model = Post
        fields = ('content',)
