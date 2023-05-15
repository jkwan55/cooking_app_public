from rest_framework import serializers
from .models import Dish, AvailableIngredients

class DishSerializer(serializers.ModelSerializer):
    class Meta:
        model = Dish
        fields = ('dish_id', 'dish_name')


class IngredientsSerializer(serializers.ModelSerializer):
    class Meta:
        model = AvailableIngredients
        fields = ('ingredient_id', 'ingredient_name', 'ingredient_count')