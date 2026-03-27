from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class Subscription(models.Model):
    plan = models.CharField(max_length=100)
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.plan

class Price(models.Model):
    subscription = models.ForeignKey(Subscription, on_delete=models.CASCADE, related_name='prices')
    amount = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.amount} - {self.subscription.plan}"

class UserSubscription(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    subscription = models.ForeignKey(Subscription, on_delete=models.CASCADE)
    transaction_id = models.IntegerField()
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    amount = models.IntegerField()
    payment_method = models.CharField(max_length=50)
    status = models.CharField(max_length=50)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.username} - {self.subscription.plan}"
