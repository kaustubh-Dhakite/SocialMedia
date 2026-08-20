from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AuthViewSet, UserViewSet

router = DefaultRouter()
router.register(r'users', UserViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('', AuthViewSet.as_view({'post': 'register'}), name='register'),
    path('login/', AuthViewSet.as_view({'post': 'login'}), name='login'),
    path('logout/', AuthViewSet.as_view({'post': 'logout'}), name='logout'),
]
