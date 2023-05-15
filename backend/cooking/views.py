from django.shortcuts import render
from rest_framework import viewsets
from .serializers import DishSerializer, IngredientsSerializer
from .models import Dish, AvailableIngredients
from django.views import View
from django.http import HttpResponse, JsonResponse
import json

# # Create your views here.
# class DishView(viewsets.ModelViewSet):
#     serializer_class = DishSerializer
#     queryset = Dish.objects.all()
    

# class IngredientView(viewsets.ModelViewSet):
#     serializer_class = IngredientsSerializer
#     queryset = AvailableIngredients.objects.all()
    

class DishView(View):
    def post(self, request):
        data = json.loads(request.body.decode('utf-8'))
        name = data.get('name', '')
        if name:
            dish_obj = Dish.objects.create(dish_name=name)
            serialized = DishSerializer(dish_obj)
            return JsonResponse({'dish': serialized.data}, status=200)
        else:
            queryset = Dish.objects.all()
            serialized = DishSerializer(queryset, many=True)
            return JsonResponse({
                'dish': serialized.data
            }, status=200)

class IngredientView(viewsets.ModelViewSet):
    serializer_class = IngredientsSerializer
    queryset = AvailableIngredients.objects.all()