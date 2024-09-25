# serializers.py
from rest_framework import serializers
from .models import ChatTopic, ChatMessage

class ChatTopicSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatTopic
        fields = ['id', 'topic', 'create_at', 'create_by']  # Include 'create_by' in read-only mode
        read_only_fields = ['create_by']  # Automatically set 'create_by'

class ChatMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatMessage
        fields = ['id', 'topic', 'user_message', 'bot_response', 'timestamp']
