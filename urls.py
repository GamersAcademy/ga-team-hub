
from django.contrib import admin
from django.urls import path
from . import views

urlpatterns = [
    # Admin
    path('admin/', admin.site.urls),
    
    # API Endpoints
    path('api/login/', views.login_view, name='api_login'),
    path('api/logout/', views.logout_view, name='api_logout'),
    path('api/user/', views.get_user, name='api_user'),
    path('api/orders/', views.orders_list, name='api_orders'),
    path('api/tasks/', views.tasks_list, name='api_tasks'),
    path('api/knowledge/', views.knowledge_articles_list, name='api_knowledge'),
    path('api/team/', views.team_members_list, name='api_team'),
    path('api/attendance/', views.record_attendance, name='api_attendance'),
    
    # HTML views
    path('', views.index_view, name='index'),
    path('login/', views.login_page, name='login_page'),
    path('admin/dashboard/', views.admin_dashboard, name='admin_dashboard'),
    path('team/dashboard/', views.team_dashboard, name='team_dashboard'),
    path('developer/dashboard/', views.developer_dashboard, name='developer_dashboard'),
    path('not-found/', views.not_found, name='not_found'),
]
