from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .models import Quote

import random
import requests

@api_view(['GET'])
def get_random_quote(request):
    # Count how many quotes we have
    count = Quote.objects.count()
    
    if count == 0:
        return Response({
            'text': "Database is empty! Go to /admin to add quotes.",
            'author': "System"
        })

    random_index = random.randint(0, count - 1)
    
    selected_quote = Quote.objects.all()[random_index]
    
    return Response({
        'text': selected_quote.text,
        'author': selected_quote.author
    })