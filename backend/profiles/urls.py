from django.urls import path
from .views import ProfileViewSet

urlpatterns = [
    path('<int:pk>/', ProfileViewSet.as_view({'get': 'profile'}), name='profile'),
    path('<int:pk>/follow/', ProfileViewSet.as_view({'post': 'follow'}), name='follow'),
    path('<int:pk>/unfollow/', ProfileViewSet.as_view({'post': 'unfollow'}), name='unfollow'),
    path('<int:pk>/followers/', ProfileViewSet.as_view({'get': 'followers'}), name='followers'),
    path('<int:pk>/following/', ProfileViewSet.as_view({'get': 'following'}), name='following'),
    path('search/', ProfileViewSet.as_view({'get': 'search'}), name='search-users'),
]
