from django.contrib.auth import authenticate, login
from django.contrib.auth.decorators import login_required
from django.http import HttpResponse
from django.shortcuts import render, redirect
from django.contrib import messages
from django.urls import reverse, reverse_lazy

from django.contrib.auth.views import LoginView
from .forms import CustomLoginForm


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

@login_required
def dashboard(request):
    # Add your dashboard logic here
    return render(request, 'authentication/dashboard.html')
