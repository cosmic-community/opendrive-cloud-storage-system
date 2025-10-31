# backend/api/views.py
import jwt
from datetime import datetime, timedelta
from django.conf import settings
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.db.models import Sum, Q
from rest_framework import status, viewsets
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from django.http import FileResponse
from .models import File, Folder
from .serializers import UserSerializer, RegisterSerializer, FileSerializer, FolderSerializer

def generate_jwt_token(user):
    payload = {
        'user_id': user.id,
        'username': user.username,
        'exp': datetime.utcnow() + settings.JWT_EXPIRATION_DELTA,
        'iat': datetime.utcnow()
    }
    token = jwt.encode(payload, settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM)
    return token

@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        token = generate_jwt_token(user)
        return Response({
            'token': token,
            'user': UserSerializer(user).data
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    username = request.data.get('username')
    password = request.data.get('password')
    
    if not username or not password:
        return Response(
            {'error': 'Please provide both username and password'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    user = authenticate(username=username, password=password)
    
    if user:
        token = generate_jwt_token(user)
        return Response({
            'token': token,
            'user': UserSerializer(user).data
        })
    
    return Response(
        {'error': 'Invalid credentials'},
        status=status.HTTP_401_UNAUTHORIZED
    )

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout(request):
    return Response({'message': 'Logged out successfully'})

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def current_user(request):
    serializer = UserSerializer(request.user)
    return Response(serializer.data)

class FileViewSet(viewsets.ModelViewSet):
    serializer_class = FileSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = File.objects.filter(user=self.request.user)
        
        # Filter by folder
        folder_id = self.request.query_params.get('folder')
        if folder_id:
            queryset = queryset.filter(folder_id=folder_id)
        elif folder_id == '':
            queryset = queryset.filter(folder__isnull=True)
        
        # Filter by trashed status
        is_trashed = self.request.query_params.get('trashed')
        if is_trashed == 'true':
            queryset = queryset.filter(is_trashed=True)
        else:
            queryset = queryset.filter(is_trashed=False)
        
        # Search by name
        search = self.request.query_params.get('search')
        if search:
            queryset = queryset.filter(name__icontains=search)
        
        return queryset

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=True, methods=['get'])
    def download(self, request, pk=None):
        file_obj = self.get_object()
        if file_obj.file:
            response = FileResponse(file_obj.file.open('rb'))
            response['Content-Disposition'] = f'attachment; filename="{file_obj.name}"'
            return response
        return Response({'error': 'File not found'}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=True, methods=['put'])
    def rename(self, request, pk=None):
        file_obj = self.get_object()
        new_name = request.data.get('name')
        if new_name:
            file_obj.name = new_name
            file_obj.save()
            return Response(FileSerializer(file_obj, context={'request': request}).data)
        return Response({'error': 'Name is required'}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'])
    def trash(self, request, pk=None):
        file_obj = self.get_object()
        file_obj.is_trashed = True
        file_obj.save()
        return Response({'message': 'File moved to trash'})

    @action(detail=True, methods=['post'])
    def restore(self, request, pk=None):
        file_obj = self.get_object()
        file_obj.is_trashed = False
        file_obj.save()
        return Response({'message': 'File restored'})

class FolderViewSet(viewsets.ModelViewSet):
    serializer_class = FolderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = Folder.objects.filter(user=self.request.user)
        
        # Filter by parent folder
        parent_id = self.request.query_params.get('parent')
        if parent_id:
            queryset = queryset.filter(parent_id=parent_id)
        elif parent_id == '':
            queryset = queryset.filter(parent__isnull=True)
        
        return queryset

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def upload_file(request):
    if 'file' not in request.FILES:
        return Response({'error': 'No file provided'}, status=status.HTTP_400_BAD_REQUEST)
    
    file = request.FILES['file']
    folder_id = request.data.get('folder')
    
    file_obj = File(
        name=file.name,
        file=file,
        user=request.user,
        folder_id=folder_id if folder_id else None
    )
    file_obj.save()
    
    serializer = FileSerializer(file_obj, context={'request': request})
    return Response(serializer.data, status=status.HTTP_201_CREATED)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def storage_info(request):
    total_size = File.objects.filter(user=request.user, is_trashed=False).aggregate(
        total=Sum('size')
    )['total'] or 0
    
    # Storage quota (e.g., 5GB)
    quota = 5 * 1024 * 1024 * 1024  # 5GB in bytes
    
    return Response({
        'used': total_size,
        'quota': quota,
        'percentage': (total_size / quota * 100) if quota > 0 else 0
    })