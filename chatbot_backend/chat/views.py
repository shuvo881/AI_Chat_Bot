from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import ChatTopic, ChatMessage
from .serializers import ChatTopicSerializer, ChatMessageSerializer
from rest_framework.decorators import api_view
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes



class ChatTopicViewSet(viewsets.ModelViewSet):
    serializer_class = ChatTopicSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return ChatTopic.objects.filter(create_by=self.request.user)

    def perform_create(self, serializer):
        serializer.save(create_by=self.request.user)


class ChatMessageViewSet(viewsets.ModelViewSet):
    serializer_class = ChatMessageSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        topic_id = self.kwargs.get('topic_pk')
        return ChatMessage.objects.filter(topic_id=topic_id)

    def create(self, request, *args, **kwargs):
        user_message = request.data.get('user_message', '').strip()

        if not user_message:
            return Response({'error': 'Message content cannot be empty.'}, status=400)

        # If no topic is provided, create a new topic with the first 20 characters of the message
        topic_id = self.kwargs.get('topic_pk')

        if not topic_id:
            # Create a new topic with the first 20 characters of the user message as the topic name
            topic_name = user_message[:20] + '...' if len(user_message) > 20 else user_message
            chat_topic = ChatTopic.objects.create(
                topic=topic_name,
                create_by=request.user,  # Automatically set the creator as the authenticated user
            )
            topic_id = chat_topic.id

        # Create the message in the topic
        chat_topic = ChatTopic.objects.get(id=topic_id)
        bot_response = "This is a bot response."  # Placeholder for actual bot response

        chat_message = ChatMessage.objects.create(
            topic=chat_topic,
            user_message=user_message,
            bot_response=bot_response,
        )

        serializer = self.get_serializer(chat_message)
        return Response(serializer.data, status=201)

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
