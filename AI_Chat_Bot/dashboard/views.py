import openai
from django.contrib.auth.decorators import login_required
from django.shortcuts import render
from django.http import JsonResponse
import openai

# Create your views here.


OPEN_AI_SECRET_KEY = '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'
openai.api_key = OPEN_AI_SECRET_KEY


def asking_openai(message):
    try:
        response = openai.Completion.create(
            engine="ada",  # You can use other engines as well
            prompt=message,
            max_tokens=50,  # Adjust the response length as needed
            temperature=0.7,  # Adjust the creativity of responses
        )
        reply = response.choise[0].text.strip()
    except Exception as e:
        reply = e

    print(reply)

    return str(reply)


@login_required
def dashboard(request):
    # Add your dashboard logic here
    print("No: ", request.method)
    if request.method == 'POST':
        print("yes")
        message = request.POST['message']
        response = asking_openai(message)
        return JsonResponse({'message': message, 'response': response})
    return render(request, 'dashboard.html')
