# backend/api/serializers.py
from rest_framework import serializers
from django.contrib.auth.models import User
from .models import File, Folder

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})
    password2 = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'}, label='Confirm Password')

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'password2', 'first_name', 'last_name']

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        return attrs

    def create(self, validated_data):
        validated_data.pop('password2')
        user = User.objects.create_user(**validated_data)
        return user

class FolderSerializer(serializers.ModelSerializer):
    file_count = serializers.SerializerMethodField()
    subfolder_count = serializers.SerializerMethodField()

    class Meta:
        model = Folder
        fields = ['id', 'name', 'parent', 'file_count', 'subfolder_count', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']

    def get_file_count(self, obj):
        return obj.files.filter(is_trashed=False).count()

    def get_subfolder_count(self, obj):
        return obj.subfolders.count()

class FileSerializer(serializers.ModelSerializer):
    url = serializers.SerializerMethodField()

    class Meta:
        model = File
        fields = ['id', 'name', 'file', 'url', 'folder', 'size', 'file_type', 'is_trashed', 'created_at', 'updated_at']
        read_only_fields = ['size', 'file_type', 'created_at', 'updated_at']

    def get_url(self, obj):
        request = self.context.get('request')
        if obj.file and request:
            return request.build_absolute_uri(obj.file.url)
        return None