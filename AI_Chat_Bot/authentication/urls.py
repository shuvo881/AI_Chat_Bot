from django.urls import path, reverse, reverse_lazy, include
from .views import user_login, dashboard, user_logout, UserRegistration

urlpatterns = [
    path('', user_login, name='login'),
    path('dashboard/', dashboard, name='dashboard'),
    path('logout/', user_logout, name='logout'),
    path('registration/', UserRegistration.as_view(), name='registration')

]

