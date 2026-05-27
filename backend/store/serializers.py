from rest_framework import serializers
from .models import *
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer



class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'
        
class ReviewSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = Review
        fields = ['id', 'user', 'rating', 'comment', 'created_at']       

class ProductSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    reviews = ReviewSerializer(many=True, read_only=True)
    related_products = serializers.PrimaryKeyRelatedField(many=True, read_only=True)


    class Meta:
        model = Product
        fields = '__all__'



class CartItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    product_id = serializers.PrimaryKeyRelatedField(
        queryset=Product.objects.all(),
        source='product',
        write_only=True
    )

    class Meta:
        model = CartItem
        fields = ['id', 'product', 'product_id', 'quantity']
        
        def get_price(self, obj):
            return obj.product.price

        def get_total_price(self, obj):
            return obj.quantity * obj.product.price

class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)

    class Meta:
        model = Cart
        fields = ['id', 'user', 'items']
        read_only_fields = ['user']


class WishlistItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    product_id = serializers.PrimaryKeyRelatedField(
        queryset=Product.objects.all(), source='product', write_only=True
    )

    class Meta:
        model = WishlistItem
        fields = ['id', 'product', 'product_id']


class OrderItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)
    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'product_name', 'quantity', 'price']
        read_only_fields = ['price']
        extra_kwargs = {
            'product': {'write_only': True},
            'quantity': {'required': True}
        }

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True)
    is_paid = serializers.BooleanField(read_only=True)
    payment_status = serializers.SerializerMethodField()

    class Meta:
        model = Order
        fields = ['id', 'user', 'created_at', 'is_paid', 'shipping_address', 'total_price', 'items', 'payment_status']
        read_only_fields = ['user', 'created_at', 'is_paid', 'total_price']
        
    def get_payment_status(self, obj):
        latest_payment = obj.payments.order_by('-created_at').first()
        return latest_payment.status if latest_payment else 'Pending'

    def create(self, validated_data):
        items_data = validated_data.pop('items')
        
        # Calculate total price on the backend
        total_price = 0
        order_items_to_create = []
        
        for item_data in items_data:
            product = item_data['product']
            quantity = item_data['quantity']
            # Fetch actual price from database to prevent price tampering
            price = product.price
            item_total = price * quantity
            total_price += item_total
            order_items_to_create.append((product, quantity, price))
            
        validated_data['total_price'] = total_price
        order = Order.objects.create(**validated_data)

        for product, quantity, price in order_items_to_create:
            OrderItem.objects.create(order=order, product=product, quantity=quantity, price=price)
            
        return order


class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('username', 'email', 'password')
        extra_kwargs = {'password': {'write_only': True}}

    def validate_password(self, value):
        from django.contrib.auth.password_validation import validate_password
        validate_password(value)
        return value

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user

class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()

    def validate(self, data):
        user = authenticate(**data)
        if user:
            return user
        raise serializers.ValidationError("Invalid credentials")
    
class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)

        user = self.user
        data['user'] = {
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'avatar': user.profile.avatar.url if user.profile.avatar else None,
        }

        return data

class UserProfileSerializer(serializers.ModelSerializer):
    avatar = serializers.ImageField(source='profile.avatar')

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'avatar']
        
        
class AvatarUploadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile  # your profile model
        fields = ['avatar']
