from django.urls import path, include
from rest_framework_nested import routers
from .views import ChatTopicViewSet, ChatMessageViewSet, register_user
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

router = routers.DefaultRouter()
router.register(r'topics', ChatTopicViewSet, basename='chat-topic')

# Nested router for ChatMessage (under each topic)
topics_router = routers.NestedDefaultRouter(router, r'topics', lookup='topic')
topics_router.register(r'messages', ChatMessageViewSet, basename='chat-messages')

urlpatterns = [
    path('', include(router.urls)),
    path('', include(topics_router.urls)),
    path('register/', register_user),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
