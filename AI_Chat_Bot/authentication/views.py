
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.http import HttpResponse
from django.shortcuts import render, redirect
from django.contrib import messages
from django.urls import reverse, reverse_lazy

from django.contrib.auth.views import LoginView
from django.views.generic import CreateView

from .forms import CustomLoginForm, RegistrationForm


def user_login(request):
    if request.user.is_authenticated:
        return redirect(reverse('dashboard'))
    if request.method == 'POST':
        username = request.POST['username']
        password = request.POST['password']
        try:
            user = authenticate(request, username=username, password=password)
            if user is not None:
                login(request, user)
                messages.success(request, "Login successful, enjoy the website")
                return redirect(reverse('dashboard'))
            messages.warning(request, "Wrong username or password")
        except Exception as e:
            messages.error(e)
    form = CustomLoginForm()
    return render(request, 'authentication/login.html', {"form": form})


def user_logout(request):
    logout(request)
    messages.success(request, "Logout successful...")
    return redirect(reverse('login'))


class UserRegistration(CreateView):
    form_class = RegistrationForm
    template_name = 'authentication/registration.html'
    success_url = reverse_lazy('login')

    def form_valid(self, form):
        # Add a success message
        messages.success(self.request, 'Registration successful. You can now log in.')
        return super().form_valid(form)

    def form_invalid(self, form):
        # Add an error message
        messages.error(self.request, 'Registration failed. Please correct the errors below.')
        return super().form_invalid(form)





