from django.contrib import admin
from .models import Post, Like, Comment


@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'content_preview', 'likes_count', 'comments_count', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('content', 'user__username')
    readonly_fields = ('created_at', 'updated_at')

    def content_preview(self, obj):
        return obj.content[:50] + '...' if len(obj.content) > 50 else obj.content


@admin.register(Like)
class LikeAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'post', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('user__username',)


@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'post', 'content_preview', 'is_reply', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('content', 'user__username')

    def content_preview(self, obj):
        return obj.content[:30] + '...' if len(obj.content) > 30 else obj.content
