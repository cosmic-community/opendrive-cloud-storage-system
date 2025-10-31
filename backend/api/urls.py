# backend/api/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'files', views.FileViewSet, basename='file')
router.register(r'folders', views.FolderViewSet, basename='folder')

urlpatterns = [
    path('', include(router.urls)),
    path('register/', views.register, name='register'),
    path('login/', views.login, name='login'),
    path('logout/', views.logout, name='logout'),
    path('user/', views.current_user, name='current-user'),
    path('upload/', views.upload_file, name='upload-file'),
    path('storage/', views.storage_info, name='storage-info'),
]