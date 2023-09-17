from django.http import HttpResponse
from django.shortcuts import render
from django.contrib import messages


# Create your views here.


def login(request):
    messages.success(request, "Yes login page...")
    return render(request, 'authentication/login.html')
