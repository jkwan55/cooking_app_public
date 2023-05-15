from django.db import models
from django.core.validators import MaxValueValidator, MinValueValidator
from django.contrib.auth.models import User, AbstractUser
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.conf import settings

# Create your models here.
class Dish(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=120)
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    public = models.BooleanField(default=False)

class AvailableIngredients(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=120)
    count = models.IntegerField(default=1, validators=[
        MaxValueValidator(100),
        MinValueValidator(1)
    ])
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)

class DishIngredients(models.Model):
    id = models.AutoField(primary_key=True)
    dish = models.ForeignKey('Dish', on_delete=models.CASCADE)
    name = models.CharField(max_length=120)

class Client(AbstractUser):
    pass

class FavoriteDishes(models.Model):
    id = models.AutoField(primary_key=True)
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    dish = models.ForeignKey('Dish', on_delete=models.CASCADE)