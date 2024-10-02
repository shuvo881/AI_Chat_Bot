from django.contrib import admin
from .models import ChatTopic, ChatMessage

# Admin class to customize how ChatTopic is displayed in the admin
class ChatTopicAdmin(admin.ModelAdmin):
    list_display = ('topic', 'create_by', 'create_at')  # Fields to display in the list view
    search_fields = ('topic', 'create_by__username')    # Add search functionality
    list_filter = ('create_at',)                        # Add filters for the date

# Admin class to customize how ChatMessage is displayed in the admin
class ChatMessageAdmin(admin.ModelAdmin):
    list_display = ('topic', 'user_message', 'bot_response', 'timestamp')  # Fields to display
    search_fields = ('user_message', 'bot_response')                       # Add search functionality
    list_filter = ('timestamp',)                                           # Add filters for the timestamp

# Register the models and their admin classes
admin.site.register(ChatTopic, ChatTopicAdmin)
admin.site.register(ChatMessage, ChatMessageAdmin)