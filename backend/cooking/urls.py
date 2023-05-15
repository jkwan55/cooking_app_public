
from django.urls import path, include
from .views import DishView
from django.views.decorators.csrf import csrf_exempt

app_name = 'cooking'

urlpatterns = [
    # path(r'all_dishes/', csrf_exempt(AllDishView.as_view()), name='AllDishes'),
    path(r'dish/', csrf_exempt(DishView.as_view()), name='Dish')
]
