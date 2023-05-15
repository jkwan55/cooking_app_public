import graphene
from graphene_django import DjangoObjectType
from graphql import GraphQLError
import bcrypt
from graphql_auth.schema import UserQuery, MeQuery
from cooking.models import Dish, AvailableIngredients, DishIngredients, Client, FavoriteDishes
from graphql_auth import mutations

class DishType(DjangoObjectType):
    class Meta:
        model = Dish

class IngredientType(DjangoObjectType):
    class Meta:
        model = AvailableIngredients

class DishIngredientType(DjangoObjectType):
    class Meta:
        model = DishIngredients

class FavoriteType(DjangoObjectType):
    class Meta:
        model = FavoriteDishes

class OwnerType(DjangoObjectType):
    class Meta:
        model = Client

class Query(UserQuery, MeQuery, graphene.ObjectType):
    dishes = graphene.List(DishType)
    ingredients = graphene.List(IngredientType)
    dishIngredient = graphene.List(DishIngredientType, dishId=graphene.ID())
    favorites = graphene.List(FavoriteType)
    publicDishes = graphene.List(DishType)

    def resolve_dishes(self, info):
        user = info.context.user
        if user.is_authenticated:
            return Dish.objects.filter(owner=user)
        else:
            return GraphQLError('Credentials not provided (dishes)')

    def resolve_ingredients(self, info):
        user = info.context.user
        if user.is_authenticated:
            return AvailableIngredients.objects.filter(owner=user)
        else:
            return GraphQLError('Credentials not provided (ingredients)')

    def resolve_dishIngredient(self, info, dishId=None):
        return DishIngredients.objects.filter(dish_id=dishId)

    def resolve_favorites(self, info):
        user = info.context.user
        if user.is_authenticated:
            return FavoriteDishes.objects.filter(owner=user)
        else:
            return GraphQLError('Credentials not provided (favorites)')

    def resolve_publicDishes(self, info):
        return Dish.objects.filter(public=True)

class CreateDish(graphene.Mutation):
    id = graphene.ID()
    name = graphene.String()

    class Arguments:
        name = graphene.String()

    def mutate(self, info, name):
        user = info.context.user
        if user.is_authenticated:
            dish_model = Dish.objects.create(name=name, owner=user)
            return dish_model
        return GraphQLError('Credentials not provided (create dish)')
        

class CreateIngredients(graphene.Mutation):
    id = graphene.ID()
    name = graphene.String()
    count = graphene.Int()

    class Arguments:
        name = graphene.String()

    def mutate(self, info, name):
        user = info.context.user
        if user.is_authenticated:
            ingredient_model = AvailableIngredients.objects.create(name=name, count=1, owner=user)
            return ingredient_model
        return GraphQLError('Credentials not provided (create ingredients)')

class CreateDishIngredients(graphene.Mutation):
    dish = graphene.ID()
    name = graphene.String()

    class Arguments:
        dish = graphene.ID()
        name = graphene.String()

    def mutate(self, info, dish, name):
        intermediate_model = DishIngredients.objects.create(dish_id=dish, name=name)
        return intermediate_model

class CreateFavorite(graphene.Mutation):
    dish = graphene.ID()

    class Arguments:
        dish = graphene.ID()

    def mutate(self, info, dish):
        user = info.context.user
        if user.is_authenticated:
            favorite_model = FavoriteDishes.objects.create(dish_id=dish, owner=user)
            return favorite_model
        return GraphQLError('Credentials not provided (create favorites)')

class DeleteFavorite(graphene.Mutation):
    id = graphene.ID()

    class Arguments:
        id = graphene.ID()

    def mutate(self, info, id):
        FavoriteDishes.objects.get(id=id).delete()

class CreateClient(graphene.Mutation):
    username = graphene.String()
    password = graphene.String()

    class Arguments:
        username = graphene.String()
        password = graphene.String()

    def mutate(self, info, username, password):
        check_client = Client.objects.filter(username__iexact=username)

        if check_client.exists():
            return GraphQLError('That username already exists')
        else:
            client_model = Client.objects.create_user(username=username, password=password, is_staff=False)
            return client_model

class LoginClient(graphene.Mutation):
    username = graphene.String()
    password = graphene.String()

    class Arguments:
        username = graphene.String()
        password = graphene.String()

    def mutate(self, info, username, password):
        check_client = Client.objects.filter(username__iexact=username)

        if check_client.exists():
            auth = check_client.first().check_password(password)
            if auth:
                return check_client.first()
            else:
                return GraphQLError('Invalid credientals.')
        else:
            return GraphQLError('Invalid credientals.')

class DeleteDishIngredients(graphene.Mutation):
    id = graphene.ID()

    class Arguments:
        id = graphene.ID()

    def mutate(self, info, id):
        DishIngredients.objects.get(id=id).delete()

class DeleteIngredients(graphene.Mutation):
    id = graphene.ID()

    class Arguments:
        id = graphene.ID()

    def mutate(self, info, id):
        AvailableIngredients.objects.get(id=id).delete()

class UpdatePublic(graphene.Mutation):
    id = graphene.ID()
    public = graphene.Boolean()

    class Arguments:
        id = graphene.ID()
        public = graphene.Boolean()

    def mutate(self, info, id, public):
        dish_obj = Dish.objects.get(id=id)
        dish_obj.public = public
        dish_obj.save()

class AuthMutation(graphene.ObjectType):
    register = mutations.Register.Field()
    token_auth = mutations.ObtainJSONWebToken.Field()
    verify_token = mutations.VerifyToken.Field()
    refresh_token = mutations.RefreshToken.Field()

class Mutation(AuthMutation, graphene.ObjectType):
    create_dish = CreateDish.Field()
    create_ingredients = CreateIngredients.Field()
    create_dish_ingredients = CreateDishIngredients.Field()
    delete_dish_ingredients = DeleteDishIngredients.Field()
    delete_ingredients = DeleteIngredients.Field()
    create_client = CreateClient.Field()
    login_client = LoginClient.Field()
    create_favorite = CreateFavorite.Field()
    delete_favorite = DeleteFavorite.Field()
    update_public = UpdatePublic.Field()

schema = graphene.Schema(
    query=Query,
    mutation=Mutation
)
