from django.urls import path, reverse, reverse_lazy, include
from .views import dashboard

urlpatterns = [
    path('', dashboard, name='dashboard'),
]

