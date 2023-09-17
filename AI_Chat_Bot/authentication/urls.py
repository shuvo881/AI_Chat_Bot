from django.urls import path, reverse, reverse_lazy, include
from .views import user_login, dashboard

urlpatterns = [
    path('', user_login, name='login'),
    path('dashboard/', dashboard, name='dashboard'),

]

