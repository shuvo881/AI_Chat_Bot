from django.urls import path, reverse, reverse_lazy, include
from .views import login

urlpatterns = [
    path('', login, name='login')
]

