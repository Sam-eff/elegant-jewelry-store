from rest_framework import viewsets, filters, permissions, generics, status, serializers
from .models import *
from .serializers import *
from django_filters.rest_framework import DjangoFilterBackend
from django.contrib.auth.models import User
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from django.db import IntegrityError
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.decorators import action
from django.contrib.auth import get_user_model
from rest_framework.decorators import api_view, permission_classes
import stripe
from django.conf import settings
import requests
import uuid
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse, HttpResponse
import json
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string




class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

    @action(detail=True, methods=['get'])
    def products(self, request, pk=None):
        category = self.get_object()
        products = category.products.all()
        serializer = ProductSerializer(products, many=True, context={'request': request})
        return Response({
            'category_name': category.name,
            'products': serializer.data
        })
    
class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all().order_by('-id')
    serializer_class = ProductSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['is_featured', 'is_trending', 'is_top', 'is_bestselling', 'category']
    search_fields = ['name', 'description']
    
    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def reviews(self, request, pk=None):
        product = self.get_object()
        serializer = ReviewSerializer(data=request.data)
        if serializer.is_valid():
            try:
                serializer.save(product=product, user=request.user)
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            except IntegrityError:
                return Response(
                    {"detail": "You have already reviewed this product."},
                    status=status.HTTP_400_BAD_REQUEST
                )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['get'])
    def related(self, request, pk=None):
        product = self.get_object()
        related_products = product.related_products.all()
        serializer = ProductSerializer(related_products, many=True)
        return Response(serializer.data)



class CartViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]

    def list(self, request):
        cart, created = Cart.objects.get_or_create(user=request.user)
        serializer = CartSerializer(cart)
        return Response(serializer.data)

    def add_item(self, request):
        cart, _ = Cart.objects.get_or_create(user=request.user)
        serializer = CartItemSerializer(data=request.data)
        if serializer.is_valid():
            product = serializer.validated_data['product']
            quantity = serializer.validated_data['quantity']

            item, created = CartItem.objects.get_or_create(cart=cart, product=product)
            if not created:
                item.quantity += quantity
                item.save()
            else:
                item.quantity = quantity
                item.save()

            return Response(CartSerializer(cart).data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def remove_item(self, request, pk=None):
        cart = Cart.objects.get(user=request.user)
        try:
            item = cart.items.get(pk=pk)
            item.delete()
            return Response({'detail': 'Item removed.'})
        except CartItem.DoesNotExist:
            return Response({'detail': 'Item not found.'}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=False, methods=['delete'])
    def clear(self, request):
        cart = Cart.objects.get(user=request.user)
        cart.items.all().delete()
        return Response({'detail': 'Cart cleared.'})
    
    
    def update_item(self, request, pk=None):
        cart, _ = Cart.objects.get_or_create(user=request.user)
        try:
            item = cart.items.get(pk=pk)
            quantity = request.data.get('quantity')
            
            if quantity is None:
                return Response({'detail': 'Quantity is required.'}, status=status.HTTP_400_BAD_REQUEST)

            quantity = int(quantity)

            if quantity < 1:
                item.delete()
                return Response({'detail': 'Item removed because quantity was zero.'})
            
            item.quantity = quantity
            item.save()
            return Response({'detail': 'Item updated.'})
        
        except CartItem.DoesNotExist:
            return Response({'detail': 'Item not found.'}, status=status.HTTP_404_NOT_FOUND)

class WishlistItemViewSet(viewsets.ModelViewSet):
    serializer_class = WishlistItemSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return WishlistItem.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        try:
            serializer.save(user=self.request.user)
        except IntegrityError:
            raise serializers.ValidationError({'details': "This product is already in your wishlist."})
        


class WishlistDeleteView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request, pk):
        try:
            item = WishlistItem.objects.get(pk=pk, user=request.user)
            item.delete()
            return Response({"detail": "Item removed from wishlist."}, status=status.HTTP_204_NO_CONTENT)
        except WishlistItem.DoesNotExist:
            return Response({"detail": "Item not found."}, status=status.HTTP_404_NOT_FOUND)


class OrderViewSet(viewsets.ModelViewSet):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]
    queryset = Order.objects.all()

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)



# Register User View


class RegisterView(APIView):
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'detail': 'Account created successfully.'}, status=status.HTTP_201_CREATED)
        
        # Format errors for cleaner Toast messages
        error_details = serializer.errors
        first_error_field = next(iter(error_details))
        first_error_msg = error_details[first_error_field]
        if isinstance(first_error_msg, list):
            first_error_msg = first_error_msg[0]
        return Response({'detail': f"{first_error_field.capitalize()}: {first_error_msg}"}, status=status.HTTP_400_BAD_REQUEST)




class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


        
class UserView(generics.RetrieveAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = UserProfileSerializer

    def get_object(self):
        return self.request.user
    
        

class AvatarUploadView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request):
        serializer = AvatarUploadSerializer(request.user.profile, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response({'avatar': serializer.data['avatar']}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ContactAPIView(APIView):
    def post(self, request):
        # save or email the data
        return Response({'message': 'Received!'})
    
    
    

stripe.api_key = settings.STRIPE_SECRET_KEY

class InitializePayment(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        method = request.data.get('method')
        order_id = request.data.get('order_id')

        # Get the order
        try:
            order = Order.objects.get(id=order_id, user=request.user)
        except Order.DoesNotExist:
            return Response({"error": "Order not found."}, status=404)

        if method == "stripe":
            stripe.api_key = settings.STRIPE_SECRET_KEY

            session = stripe.checkout.Session.create(
                payment_method_types=['card'],
                line_items=[
                    {
                        'price_data': {
                            'currency': 'usd',
                            'unit_amount': int(order.total_price * 100),
                            'product_data': {
                                'name': f"Order #{order.id}",
                            },
                        },
                        'quantity': 1,
                    },
                ],
                mode='payment',
                success_url=f'http://localhost:5173/order-success/{order.id}',
                cancel_url=f'http://localhost:5173/checkout',
            )
            
            # Save the payment
            Payment.objects.create(
                user=request.user,
                order=order,
                provider="stripe",
                amount=order.total_price,
                reference=session.id,
                status="pending",)
            return Response({"url": session.url})

        elif method == "paystack":
            headers = {
                "Authorization": f"Bearer {settings.PAYSTACK_SECRET_KEY}",
                "Content-Type": "application/json",
            }
            
            reference = str(uuid.uuid4())
            
            data = {
                "email": request.user.email,
                "amount": int(order.total_price * 100),
                "reference": reference,
                "callback_url": f"http://localhost:5173/order-success/{order.id}",
            }
            res = requests.post("https://api.paystack.co/transaction/initialize", json=data, headers=headers)
            res_data = res.json()
            
            # Save the payment
            Payment.objects.create(
                user=request.user,
                order=order,
                provider="paystack",
                amount=order.total_price,
                reference=reference,
                status="pending",
                )
            
            return Response({"data": res_data['data']})

        return Response({"error": "Invalid payment method."}, status=400)
    
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def verify_stripe_payment(request, order_id):
    try:
        order = Order.objects.get(id=order_id, user=request.user)
        payment = order.payments.filter(provider="stripe").latest('created_at')
    except (Order.DoesNotExist, Payment.DoesNotExist):
        return Response({"error": "Order or payment not found."}, status=404)

    try:
        stripe.api_key = settings.STRIPE_SECRET_KEY
        session = stripe.checkout.Session.retrieve(payment.reference)

        if session.payment_status == 'paid':
            payment.status = 'success'
            payment.save()

            order.is_paid = True
            order.save()

            # Clear cart on successful payment
            try:
                cart = Cart.objects.get(user=request.user)
                cart.items.all().delete()
            except Cart.DoesNotExist:
                pass

            return Response({"message": "Payment verified", "paid": True})
        else:
            return Response({"message": "Payment not completed", "paid": False})

    except Exception as e:
        return Response({"error": str(e)}, status=400)   
    
    
    

# @csrf_exempt
# def stripe_webhook(request):
#     payload = request.body
#     sig_header = request.META['HTTP_STRIPE_SIGNATURE']
#     endpoint_secret = settings.STRIPE_WEBHOOK_SECRET

#     try:
#         event = stripe.Webhook.construct_event(payload, sig_header, endpoint_secret)
#     except stripe.error.SignatureVerificationError:
#         return HttpResponse(status=400)

#     if event['type'] == 'checkout.session.completed':
#         session = event['data']['object']
#         reference = session.get('id')
#         customer_email = session.get('customer_email')

#         # Find payment and update status
#         try:
#             payment = Payment.objects.get(reference=reference)
#             print("✅ Payment matched:", payment.id)
#             payment.status = 'success'
#             payment.save()

#             order = payment.order
#             order.is_paid = True
#             order.save()
#             send_order_confirmation_email(order.user, order)
#         except Payment.DoesNotExist:
#             print("❌ Payment not found for reference:", reference)
#             pass

#     return HttpResponse(status=200)


# @csrf_exempt
# def paystack_webhook(request):
#     data = json.loads(request.body)
#     event = data.get('event')

#     if event == 'charge.success':
#         reference = data['data']['reference']
#         try:
#             payment = Payment.objects.get(reference=reference, provider='paystack')
#             payment.status = 'success'
#             payment.save()

#             order = payment.order
#             order.is_paid = True
#             order.save()
#             send_order_confirmation_email(order.user, order)
#         except Payment.DoesNotExist:
#             pass

#     return JsonResponse({"status": "ok"})


# def send_order_confirmation_email(user, order):
#     subject = f"Order #{order.id} Confirmation"
#     from_email = settings.DEFAULT_FROM_EMAIL
#     to = [user.email]

#     # Plain text fallback
#     text_content = f"""
# Hi {user.first_name or user.username},

# Thank you for your order!

# Order ID: {order.id}
# Total: ${order.total_price}
# Shipping Address:
# {order.shipping_address}

# We'll notify you when your order ships.
# """

#     # HTML version
#     html_content = render_to_string('emails/order_confirmation.html', {
#         'user': user,
#         'order': order,
#     })

#     msg = EmailMultiAlternatives(subject, text_content, from_email, to)
#     msg.attach_alternative(html_content, "text/html")
#     msg.send()