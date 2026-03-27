from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.utils.translation import gettext_lazy as _
from django.utils.html import format_html
from .models import CustomUser


class CustomUserAdmin(BaseUserAdmin):

    # Show columns in admin list page
    list_display = (
        'email',
        'username',
        'profile_image_preview',
        'phone_number',
        'country',
        'city',
        'gender',
        'is_staff',
        'is_superuser',
        'is_active',
        'created_at'
    )

    list_filter = (
        'is_staff',
        'is_superuser',
        'is_active',
        'gender',
        'country'
    )

    search_fields = ('email', 'username', 'country', 'city')
    ordering = ('email',)

    # Group fields inside user edit page
    fieldsets = (
        (None, {'fields': ('email', 'password')}),

        (_('Personal Info'), {
            'fields': (
                'username',
                'profile_image',
                'phone_number',
                'gender',
                'birth_date',
                'country',
                'city',
            )
        }),

        (_('Subscription'), {
            'fields': (
                'subscription_status',
                'free_trials',
                'trials_left',
            )
        }),

        (_('Permissions'), {
            'fields': (
                'is_active',
                'is_staff',
                'is_superuser',
                'groups',
                'user_permissions',
            )
        }),

        (_('Important Dates'), {
            'fields': (
                'last_login',
                'created_at'
            )
        }),
    )

    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': (
                'email',
                'username',
                'phone_number',
                'gender',
                'birth_date',
                'country',
                'city',
                'password1',
                'password2',
            ),
        }),
    )

    filter_horizontal = ('groups', 'user_permissions')

    # 👇 Show image preview in admin list
    def profile_image_preview(self, obj):
        if obj.profile_image:
            return format_html(
                '<img src="{}" width="40" height="40" style="border-radius:50%;" />',
                obj.profile_image.url
            )
        return "No Image"

    profile_image_preview.short_description = "Profile Image"


# Register model
admin.site.register(CustomUser, CustomUserAdmin)
