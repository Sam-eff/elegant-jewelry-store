from django.contrib import admin
from .models import *


class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'price', 'category','is_featured' ,'is_trending', 'is_top', 'is_bestselling')

admin.site.register(Product, ProductAdmin)
admin.site.register(Category)
admin.site.register(Cart)
admin.site.register(CartItem)
admin.site.register(WishlistItem)
admin.site.register(Order)
admin.site.register(OrderItem)
admin.site.register(Payment)
admin.site.register(Profile)
admin.site.register(Review)
