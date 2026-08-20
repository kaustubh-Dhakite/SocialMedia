from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PostViewSet, CommentViewSet, FeedViewSet

router = DefaultRouter()
router.register(r'', PostViewSet)
router.register(r'comments', CommentViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('feed/my-feed/', FeedViewSet.as_view({'get': 'my_feed'}), name='my-feed'),
    path('feed/explore/', FeedViewSet.as_view({'get': 'explore'}), name='explore'),
]
