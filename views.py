
from django.shortcuts import render, redirect, get_object_or_404
from django.http import JsonResponse, HttpResponse
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.db.models import Q
from django.views.decorators.csrf import csrf_exempt
import json
from .models import User, Order, Task, KnowledgeArticle, Attendance
from .serializers import UserSerializer, OrderSerializer, TaskSerializer, KnowledgeArticleSerializer, AttendanceSerializer

# Authentication views
@csrf_exempt
def login_view(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        email = data.get('email')
        password = data.get('password')
        
        user = authenticate(request, username=email, password=password)
        
        if user is not None:
            login(request, user)
            return JsonResponse({
                'id': user.id,
                'email': user.email,
                'name': user.name,
                'role': user.role,
                'department': user.department,
            })
        else:
            return JsonResponse({'error': 'Invalid credentials'}, status=400)
    
    return JsonResponse({'error': 'Invalid method'}, status=405)

@login_required
def logout_view(request):
    logout(request)
    return JsonResponse({'success': True})

@login_required
def get_user(request):
    user = request.user
    return JsonResponse({
        'id': user.id,
        'email': user.email,
        'name': user.name,
        'role': user.role,
        'department': user.department,
    })

# Order views
@login_required
def orders_list(request):
    orders = Order.objects.all()
    serializer = OrderSerializer(orders, many=True)
    return JsonResponse(serializer.data, safe=False)

# Task views
@login_required
def tasks_list(request):
    user = request.user
    profile = user
    
    if user.role in ['admin', 'manager']:
        # Admin and managers can see all tasks in their department
        tasks = Task.objects.filter(Q(department=profile.department) | Q(assigned_to=user))
    else:
        # Regular team members only see their tasks
        tasks = Task.objects.filter(assigned_to=user)
    
    serializer = TaskSerializer(tasks, many=True)
    return JsonResponse(serializer.data, safe=False)

# Knowledge base views
@login_required
def knowledge_articles_list(request):
    user = request.user
    profile = user
    
    if user.role in ['admin', 'manager']:
        # Admin and managers can see all articles
        articles = KnowledgeArticle.objects.all()
    else:
        # Team members only see articles for their department
        articles = KnowledgeArticle.objects.filter(department=profile.department)
    
    serializer = KnowledgeArticleSerializer(articles, many=True)
    return JsonResponse(serializer.data, safe=False)

# Team views
@login_required
def team_members_list(request):
    if request.user.role not in ['admin', 'manager']:
        return JsonResponse({'error': 'Unauthorized'}, status=403)
    
    team_members = User.objects.filter(role='team')
    serializer = UserSerializer(team_members, many=True)
    return JsonResponse(serializer.data, safe=False)

# Attendance views
@login_required
def record_attendance(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        staff_id = data.get('staff_id')
        status = data.get('status')
        date = data.get('date')
        
        if not staff_id or not status:
            return JsonResponse({'error': 'Missing required fields'}, status=400)
        
        staff = get_object_or_404(User, id=staff_id)
        
        # Create or update attendance record
        attendance, created = Attendance.objects.update_or_create(
            staff=staff,
            date=date,
            defaults={'status': status}
        )
        
        serializer = AttendanceSerializer(attendance)
        return JsonResponse(serializer.data)
    
    return JsonResponse({'error': 'Invalid method'}, status=405)

# HTML views for the basic application
def index_view(request):
    return render(request, 'index.html')

def login_page(request):
    if request.user.is_authenticated:
        if request.user.role == 'admin' or request.user.role == 'manager':
            return redirect('admin_dashboard')
        elif request.user.role == 'team':
            return redirect('team_dashboard')
        elif request.user.role == 'developer':
            return redirect('developer_dashboard')
    return render(request, 'login.html')

@login_required
def admin_dashboard(request):
    if request.user.role not in ['admin', 'manager']:
        return redirect('login_page')
    return render(request, 'admin/dashboard.html')

@login_required
def team_dashboard(request):
    if request.user.role != 'team':
        return redirect('login_page')
    return render(request, 'team/dashboard.html')

@login_required
def developer_dashboard(request):
    if request.user.role != 'developer':
        return redirect('login_page')
    return render(request, 'developer/dashboard.html')

@login_required
def not_found(request):
    return render(request, 'not_found.html', status=404)
