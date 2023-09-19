from django.urls import path, reverse, reverse_lazy, include

from .views import user_login, user_logout, UserRegistration
from dashboard.views import dashboard
urlpatterns = [
    path('', user_login, name='login'),
    path('dashboard/', dashboard, name='dashboard'),
    path('logout/', user_logout, name='logout'),
    path('registration/', UserRegistration.as_view(), name='registration')
]

