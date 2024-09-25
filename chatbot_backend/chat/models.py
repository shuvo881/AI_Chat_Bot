from django.db import models
from django.contrib.auth.models import User

class ChatTopic(models.Model):
    create_by = models.ForeignKey(User, on_delete=models.CASCADE)
    topic = models.CharField(max_length=100)
    create_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.topic


class ChatMessage(models.Model):
    topic = models.ForeignKey(ChatTopic, on_delete=models.CASCADE)
    user_message = models.TextField()
    bot_response = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'Message from {self.user_message[:50]}'
