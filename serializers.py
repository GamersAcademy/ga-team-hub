
from rest_framework import serializers
from .models import User, Order, Task, KnowledgeArticle, Attendance

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'name', 'role', 'department']

class OrderSerializer(serializers.ModelSerializer):
    assigned_to = UserSerializer(read_only=True)
    
    class Meta:
        model = Order
        fields = '__all__'

class TaskSerializer(serializers.ModelSerializer):
    assigned_to = UserSerializer(read_only=True)
    created_by = UserSerializer(read_only=True)
    
    class Meta:
        model = Task
        fields = '__all__'

class KnowledgeArticleSerializer(serializers.ModelSerializer):
    created_by = UserSerializer(read_only=True)
    
    class Meta:
        model = KnowledgeArticle
        fields = '__all__'

class AttendanceSerializer(serializers.ModelSerializer):
    staff = UserSerializer(read_only=True)
    
    class Meta:
        model = Attendance
        fields = '__all__'
