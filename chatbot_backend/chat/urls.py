from django.urls import path, include
from rest_framework_nested import routers
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import ChatTopicViewSet, ChatMessageViewSet, register_user

# Main router for topics
router = routers.DefaultRouter()
router.register(r'topics', ChatTopicViewSet, basename='chat-topic')

# Nested router for messages under topics
topics_router = routers.NestedDefaultRouter(router, r'topics', lookup='topic')
topics_router.register(r'messages', ChatMessageViewSet, basename='chat-messages')

urlpatterns = [
    path('', include(router.urls)),
    path('', include(topics_router.urls)),  # Include nested routes
    path('register/', register_user, name='register'),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('dj-rest-auth/', include('dj_rest_auth.urls')),
    path('dj-rest-auth/registration/', include('dj_rest_auth.registration.urls')),
]
