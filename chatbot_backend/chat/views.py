from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.decorators import api_view
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from django.conf import settings
from django.db import transaction
from django.shortcuts import get_object_or_404
from rest_framework.exceptions import ValidationError
from .models import ChatTopic, ChatMessage
from .serializers import ChatTopicSerializer, ChatMessageSerializer
from .llm_model.main import get_response


class ChatTopicViewSet(viewsets.ModelViewSet):
    serializer_class = ChatTopicSerializer
    
    def get_queryset(self):
        queryset = ChatTopic.objects.all() 
        if self.request.user.is_authenticated:
            queryset = queryset.filter(create_by=self.request.user)
        elif self.request.user.is_anonymous and settings.DEBUG == False:
            queryset = queryset.none()
        
        return queryset

    def perform_create(self, serializer):
        if self.request.user.is_authenticated:
            serializer.save(create_by=self.request.user)
        elif self.request.user.is_anonymous and settings.DEBUG == False:
            serializer.save(create_by=User.objects.first())
        else:
            serializer.save()
            

class ChatMessageViewSet(viewsets.ModelViewSet):
    serializer_class = ChatMessageSerializer

    def get_queryset(self):
        topic_id = self.kwargs.get('topic_pk')
        if ChatTopic.objects.filter(id=topic_id).exists() and self.request.user.is_authenticated:
            return ChatMessage.objects.filter(topic_id=topic_id, topic__create_by=self.request.user)
        elif self.request.user.is_anonymous and settings.DEBUG == False:
            return ChatMessage.objects.none()
        return ChatMessage.objects.filter(topic_id=topic_id)

    def perform_create(self, serializer):
        user_message = serializer.validated_data.get('user_message', '').strip()

        if not user_message:
            raise ValidationError({'user_message': 'Message content cannot be empty.'})

        topic_id = self.kwargs.get('topic_pk')

        with transaction.atomic():
            if not topic_id:
                # Create a new topic with the first 20 characters of the user message as the topic name
                topic_name = (user_message[:20] + '...') if len(user_message) > 20 else user_message
                chat_topic = ChatTopic.objects.create(
                    topic=topic_name,
                    create_by=self.request.user,
                )
            else:
                chat_topic = get_object_or_404(ChatTopic, id=topic_id)

            # Placeholder for actual bot response logic
            bot_response = get_response(user_message)

            serializer.save(topic=chat_topic, bot_response=bot_response)

@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):
    data = request.data
    try:
        user = User.objects.create(
            username=data['username'],
            email=data.get('email', ''),
            password=make_password(data['password']),
        )
        return Response({
            'message': 'User created successfully',
            'user': {'username': user.username, 'email': user.email}
        }, status=status.HTTP_201_CREATED)
    except Exception as e:
        return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)
