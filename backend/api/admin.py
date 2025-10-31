# backend/api/admin.py
from django.contrib import admin
from .models import File, Folder

@admin.register(File)
class FileAdmin(admin.ModelAdmin):
    list_display = ['name', 'user', 'folder', 'size', 'file_type', 'is_trashed', 'created_at']
    list_filter = ['is_trashed', 'file_type', 'created_at']
    search_fields = ['name', 'user__username']
    date_hierarchy = 'created_at'

@admin.register(Folder)
class FolderAdmin(admin.ModelAdmin):
    list_display = ['name', 'user', 'parent', 'created_at']
    list_filter = ['created_at']
    search_fields = ['name', 'user__username']
    date_hierarchy = 'created_at'