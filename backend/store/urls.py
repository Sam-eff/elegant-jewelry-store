from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CategoryViewSet, ProductViewSet, CartViewSet, WishlistItemViewSet, WishlistDeleteView, RegisterView, UserView, CustomTokenObtainPairView, AvatarUploadView, ContactAPIView, OrderViewSet, InitializePayment
from .views import *
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

app_name = 'store'

router = DefaultRouter()
router.register(r'categories', CategoryViewSet)
router.register(r'products', ProductViewSet, basename='product')
router.register(r'cart', CartViewSet, basename='cart')
router.register(r'wishlist', WishlistItemViewSet, basename='wishlist')
router.register(r'orders', OrderViewSet, basename='order')



cart_list = CartViewSet.as_view({
    'get': 'list',
})
cart_add = CartViewSet.as_view({
    'post': 'add_item',
})
cart_remove = CartViewSet.as_view({
    'delete': 'remove_item',
})
cart_clear = CartViewSet.as_view({
    'post': 'clear',
})

cart_update = CartViewSet.as_view({
    'post': 'update_item',
})

urlpatterns = [
    path('', include(router.urls)),
    path('wishlist/<int:pk>/', WishlistDeleteView.as_view(), name='wishlist-delete'),
    
    path('cart/', cart_list, name='cart'),
    path('cart/add/', cart_add, name='cart-add'),
    path('cart/remove/<int:pk>/', cart_remove, name='cart-remove'),
    path('cart/clear/', cart_clear, name='cart-clear'),
    path('cart/update/<int:pk>/', cart_update, name='cart-update'),
    
    
    
    path('register/', RegisterView.as_view(), name='register'),
    path('token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('me/', UserView.as_view(), name='me'),
    path('upload-avatar/', AvatarUploadView.as_view(), name='upload-avatar'),
    
    path('contact/', ContactAPIView.as_view(), name='contact'),
    
    path('init-payment/', InitializePayment.as_view(), name='init-payment'),
    path('payments/stripe/verify/<int:order_id>/', verify_stripe_payment),
    
    
    # path('webhooks/stripe/', stripe_webhook, name='stripe-webhook'),
    # path('webhooks/paystack/', paystack_webhook, name='paystack-webhook'),

    

    
    
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]