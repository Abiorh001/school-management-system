from rest_framework.views import APIView
from rest_framework import status
from rest_framework.request import Request
from rest_framework.response import Response
from .models import CustomUser, Role
from .serializers import CustomUserSerializer, RoleSerializer, UserResetPasswordSerailizer
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser
from django.core.mail import send_mail
from django.core.exceptions import ObjectDoesNotExist
import uuid
from rest_framework_simplejwt.views import TokenObtainPairView
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from school_module.models import School
from department_module.models import Department
from django.db import connection




class ApiStatusView(APIView):
    permission_classes = [AllowAny]
    
    @swagger_auto_schema(
        operation_summary="API status",
        responses={
            200: "API is running"},
    )
    def get(self, request):
        response = {"status": "success",
                    "message": "API is running"}
        return Response(response, status=status.HTTP_200_OK)


class CreateListRoles(APIView):
    """
    CreateListRoles class handles the creation and listing of roles.

    POST: Create a new role.
    GET: List all roles.
    """
    
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(
        operation_summary="School Admin Create a new user role",
        request_body=RoleSerializer,
        responses={
            201: "Role created successfully",
            400: 'Bad Request',
            403: 'User Not Authorized to perform action'},
    )
    def post(self, request: Request):
        """
        POST method to create a new role.
        """
        user = request.user
        user_role = Role.objects.filter(role_id=user.role_id).first()
        user_role_name = user_role.role_name
        if user_role_name != ("SCHOOLADMIN") and user_role_name != ("superuser"):
            response = {
                "status": "failed",
                "message": "User Not Authorized to perform action"
            }
            return Response(response, status=status.HTTP_403_FORBIDDEN)

        data = request.data
        serializer = RoleSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            response = {
                "status": "success",
                "message": "User role created successfully",
                "data": serializer.data,
            }
            return Response(response, status=status.HTTP_201_CREATED)
        bad_request_response = {
            "status": "failed",
            "message": "User role not created",
            "error_message: ": serializer.errors,
        }
        return Response(bad_request_response, status=status.HTTP_400_BAD_REQUEST)
    
    @swagger_auto_schema(
        operation_summary="School Admin list all user role",
        responses={
            200: "User roles retrieved successfully",
            400: 'Bad Request',
            403: 'User Not Authorized to perform action'},
    )
    def get(self, request: Request):
        """
        GET method to list all roles.
        """
        user = request.user
        user_role = Role.objects.filter(role_id=user.role_id).first()
        user_role_name = user_role.role_name
        if user_role_name != ("SCHOOLADMIN") and user_role_name != ("superuser"):
            response = {
                "status": "failed",
                "message": "User Not Authorized to perform action"
            }
            return Response(response, status=status.HTTP_403_FORBIDDEN)

        queryset = Role.objects.all()
        serializer = RoleSerializer(instance=queryset, many=True)
        response = {
                "status": "success",
                "message": "All User roles retrieved successfully",
                "data": serializer.data,
            }
        return Response(response, status=status.HTTP_200_OK)


class RetrieveUpdateRole(APIView):
    """
    RetrieveUpdateRole class handles the retrieval and update of a role.

    GET: Retrieve detailed information about a specific role.
    PUT: Update role information (allows partial updates).
    """
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(
        operation_summary="School Admin retrieve a specific user role",
        responses={
            200: "User role retrieved successfully",
            400: 'Bad Request',
            403: 'User Not Authorized to perform action'},
    )
    def get(self, request: Request, pk):
        """
        GET method to retrieve detailed information about a specific role by using its id.
        """

        user = request.user
        user_role = Role.objects.filter(role_id=user.role_id).first()
        user_role_name = user_role.role_name
        if user_role_name != ("SCHOOLADMIN") and user_role_name != ("superuser"):
            response = {
                "status": "failed",
                "message": "User Not Authorized to perform action"
            }
            return Response(response, status=status.HTTP_403_FORBIDDEN)
        try:
            queryset = Role.objects.get(pk=pk)
        except Role.DoesNotExist:
            error_response = {
                "status": "error",
                "message": "User role not found"
            }
            return Response(error_response, status=status.HTTP_404_NOT_FOUND)
        
        serializer = RoleSerializer(instance=queryset)
        response = {
            "status": "success",
            "message": "User role retrieved successfully",
            "data": serializer.data
        }
        return Response(response, status=status.HTTP_200_OK)
    
    @swagger_auto_schema(
        operation_summary="School Admin update  a specific user role",
        request_body=RoleSerializer,
        responses={
            200: "User role updated successfully",
            400: 'Bad Request',
            403: 'User Not Authorized to perform action'},
    ) 
    def put(self, request: Request, pk):
        """
        PUT method to update role information (allows partial updates).
        """
        user = request.user
        user_role = Role.objects.filter(role_id=user.role_id).first()
        user_role_name = user_role.role_name
        if user_role_name != ("SCHOOLADMIN") and user_role_name != ("superuser"):
            response = {
                "status": "failed",
                "message": "User Not Authorized to perform action"
            }
            return Response(response, status=status.HTTP_403_FORBIDDEN)
        try:
            queryset = Role.objects.get(pk=pk)
        except Role.DoesNotExist:
            error_response = {
                "status": "error",
                "message": "User role not found"
            }
            return Response(error_response, status=status.HTTP_404_NOT_FOUND)
        
        data = request.data
        serializer = RoleSerializer(queryset, data=data)
        if serializer.is_valid():
            serializer.save()
            response = {
                "status": "success",
                "message": "User role updated successfully",
                "data": serializer.data,
            }
            return Response(response, status=status.HTTP_200_OK)
        error_response = {
            "status": "failed",
            "message": "User role update failed",
            "error_message: ": serializer.errors,
        }
        return Response(error_response, status=status.HTTP_400_BAD_REQUEST)
    

class CreateUsers(APIView):
    """
    CreateUsers class handles the creation of user accounts.

    POST: Create a new user account and send a confirmation email(requires admin authentication)..
    """
    permission_classes = [AllowAny]

    @swagger_auto_schema(
        operation_summary="School Admin Create a new user account",
        request_body=CustomUserSerializer,
        responses={
            201: "User created successfully",
            400: 'Bad Request',
            403: 'User Not Authorized to perform action'},
    )
    def post(self, request: Request):
        """
        POST method to create a new user account and send a confirmation email(requires admin authentication)..
        """
        user = request.user
        user_role = Role.objects.filter(role_id=user.role_id).first()
        user_role_name = user_role.role_name
        if user_role_name != ("SCHOOLADMIN") and user_role_name != ("superuser"):
            response = {
                "status": "failed",
                "message": "User Not Authorized to perform action"
            }
            return Response(response, status=status.HTTP_403_FORBIDDEN)
        
        data = request.data
        serializer = CustomUserSerializer(data=data)
        if serializer.is_valid():
            user = serializer.save()
            # Send a confirmation email with a confirmation link
            subject = 'Confirm your email address'
            message = 'Click the link to confirm your email address'
            from_email = 'abiolaadedayo1993@gmail.com'
            recipient_list = [user.email]

            # Generate a confirmation URL
            
            confirmation_url = f"https://smartedconnect.netlify.app/confirm_email/?user_id={user.id}&token={user.confirm_email_token}"

            message += f'\n\n{confirmation_url}'

            send_mail(subject, message, from_email, recipient_list)
            response = {
                "status": "success",
                "message": "Account created successfully. Please check your email for a confirmation link.",
                "data": serializer.data
                }
            return Response(response, status=status.HTTP_201_CREATED)
        bad_request_response = {
            "status": "failed",
            "message": "Account not created",
            "error_message": serializer.errors
        }
        return Response(bad_request_response, status=status.HTTP_400_BAD_REQUEST)


# Create your views here.
class UserLoginView(TokenObtainPairView):
    permission_classes = [AllowAny]
    
    @swagger_auto_schema(
        operation_summary="Exsiting user can login",
        responses={
            200: "successfully logged in",
            400: 'Bad Request'},
    )
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        if response.status_code == status.HTTP_200_OK:
            email = request.data.get('email')
            if email:
                try:
                    with connection.cursor() as cursor:
                        # Execute an SQL query to retrieve the user by email
                        cursor.execute("SELECT * FROM User WHERE email = %s", [email])
                        user = cursor.fetchone()

                    if user:
                        user_profile_data = {
                            "id": user[0],
                            "first_name": user[1],
                            "last_name": user[2],
                            "email": user[3],
                        }
                        response.data["data"] = user_profile_data
                    else:
                        bad_request_response = {
                            "status": "failed",
                            "message": "User not found"
                        }
                        return Response(bad_request_response, status=status.HTTP_400_BAD_REQUEST)
                except ObjectDoesNotExist:
                    bad_request_response = {
                        "status": "failed",
                        "message": "User not found"
                    }
                    return Response(bad_request_response, status=status.HTTP_400_BAD_REQUEST)
                except Exception as e:
                    error_response = {
                        "status": "error",
                        "message": "An error occurred while retrieving user data."
                    }
                    return Response(error_response, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        return response
        # if response.status_code == 200:
        #     email = request.data['email']
        #     try:
        #          with conn.cursor() as cursor:
        #     # Execute an SQL query to retrieve the user by email
        #     cursor.execute("SELECT * FROM User WHERE email = %s", (email,))
        #     user = cursor.fetchone()
                # user = CustomUser.objects.get(email=request.data['email'])
                # user_role_name = Role.objects.filter(role_id=user.role_id).first()
                # if user_role_name:
                #     user_role = user_role_name.role_name
                # else:
                #     user_role = None
                # user_school_name = School.objects.filter(school_id=user.school_id).first()
                # if user_school_name:
                #     user_school = user_school_name.school_name
                # else:
                #     user_school = None
                # user_department = Department.objects.filter(school_id=user.school_id).first()
                # if user_department:
                #     user_department_name = user_department.department_name
                #     user_department_id = user_department.department_id
                # else:
                #     user_department_name = None
                #     user_department_id = None

                # user_profile_data = {
                #     "id": user.id,
                #     "first_name": user.first_name,
                #     "last_name": user.last_name,
                #     "email": user.email,
                    # "role": user_role,
                    # "role_id": user.role_id,
                    # "school": user_school,
                    # "school_id": user.school_id,
                    # "department": user_department_name,
                    # "department_id": user_department_id,

        #         }
        #         response.data["data"] = user_profile_data
        #     except CustomUser.DoesNotExist:
        #         bad_request_response = {
        #             "status": "failed",
        #             "message": "User not found"
        #         }
        #         return Response(bad_request_response, status=status.HTTP_400_BAD_REQUEST)
        # return response


class ListUsers(APIView):
    """
    ListUsers class handles the listing of user accounts.

    GET: List all user accounts (requires admin authentication).
    """
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(
        operation_summary="School Admin Can list all user accounts",
        responses={
            200: "All Users  retrived successfully",
            400: 'Bad Request',
            403: 'User Not Authorized to perform action'},
    ) 
    def get(self, request: Request):
        """
        GET method to list all user accounts (requires admin authentication).
        """
        user =  request.user
        role = Role.objects.filter(role_id=user.role_id).first()
        role_name = role.role_name
        if role_name != "SCHOOLADMIN" and "superuser":
            forbideen_response = {
                "status": "failed",
                "message": "user not authorized to perform this action"
            }
            return Response(forbideen_response, status=status.HTTP_403_FORBIDDEN)

        queryset = CustomUser.objects.all()
        serializer = CustomUserSerializer(instance=queryset, many=True)
        response = {
            "status": "success",
            "message": "All Users retrieved successfully",
            "data": serializer.data
        }
        return Response(response, status=status.HTTP_200_OK)


class RetrieveUpdateDeleteUser(APIView):
    """
    RetrieveUpdateDeleteUser class handles the retrieval, update, and deletion of user accounts.

    GET: Retrieve detailed information about a specific user account.
    PUT: Update user account information (allows partial updates).
    DELETE: Delete a specific user account.
    """
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(
        operation_summary="Authenicated user can retrieved their user account",
        responses={
            200: "User retrieved successfully",
            400: 'Bad Request',
            403: "User not permitted to perform this action"},
    )
    def get(self, request: Request, pk):
        """
        GET method to retrieve detailed information about a specific user account by using its id.
        """
        try:
            
            queryset = CustomUser.objects.get(pk=pk)
        except CustomUser.DoesNotExist:
            error_response = {
                "status": "error",
                "message": "User not found"
            }
            return Response(error_response, status=status.HTTP_404_NOT_FOUND)
        
        serializer = CustomUserSerializer(instance=queryset)
        user = request.user
        if (user.email != queryset.email):
            authentication_response = {
                "status": "failed",
                "message": "User Not Authorized"
            }
            return Response(authentication_response, status=status.HTTP_403_FORBIDDEN)
        response = {
            "status": "success",
            "message": "User retrieved successfully",
            "data": serializer.data
        }
        return Response(response, status=status.HTTP_200_OK)
    
    @swagger_auto_schema(
        operation_summary="Authenticated user can update theeir user account",
        request_body=CustomUserSerializer,
        responses={
            200: "User Account updated successfully",
            400: 'Bad Request',
            403: "User not permitted to perform this action"},
    )
    def put(self, request: Request, pk):
        """
        PUT method to update user account information (allows partial updates).
        """
        try:
            queryset = CustomUser.objects.get(pk=pk)
        except CustomUser.DoesNotExist:
            error_response = {
                "status": "error",
                "message": "User not found"
            }
            return Response(error_response, status=status.HTTP_404_NOT_FOUND)
        
        user = request.user
        if (user.email != queryset.email):
            authentication_response = {
                "status": "failed",
                "message": "User Not Authorized"
            }
            return Response(authentication_response, status=status.HTTP_403_FORBIDDEN)
        data = request.data
        serializer = CustomUserSerializer(queryset, data=data, partial=True)
        if serializer.is_valid():
            serializer.save()
            response = {
                "status": "success",
                "message": " User Account updated suucessfully",
                "data": serializer.data
            }
            return Response(response, status=status.HTTP_202_ACCEPTED)
        bad_request_response = {
            "status": "failed",
            "message": "Account update failed",
            "error_message": serializer.errors
        }
        return Response(bad_request_response, status=status.HTTP_400_BAD_REQUEST)
    
    @swagger_auto_schema(
        operation_summary="Authenticated user can delete their account",
        responses={
            204: "User account deletedd successfully",
            400: 'Bad Request',
            403: "User not permitted to perform this action"},
    )
    def delete(self, request: Request, pk):
        try:
            queryset = CustomUser.objects.get(pk=pk)
        except CustomUser.DoesNotExist:
            error_response = {
                "status": "error",
                "message": "User not found"
            }
            return Response(error_response, status=status.HTTP_404_NOT_FOUND)
        user = request.user
        if (user.email != queryset.email):
            authentication_response = {
                "status": "failed",
                "message": "User Not Authorized"
            }
            return Response(authentication_response, status=status.HTTP_403_FORBIDDEN)
        queryset.delete()
        response = {
            "status": "success",
            "message": "Account deleted successfully."
        }
        return Response(response, status=status.HTTP_200_OK)


class UserConfirmEmailAddress(APIView):
    """
    UserConfirmEmailAddress class handles the confirmation of a user's email address.

    GET: Confirm a user's email address with a valid token.
    """
    permission_classes = [AllowAny]

    email_param = openapi.Parameter(
        name="email",
        in_=openapi.IN_QUERY,
        type=openapi.TYPE_STRING,
        description="Email address of the user",
    )

    token_param = openapi.Parameter(
        name="token",
        in_=openapi.IN_QUERY,
        type=openapi.TYPE_STRING,
        description="Confirmation token",
    )

    @swagger_auto_schema(
        operation_summary="New user can confirm their email address",
        manual_parameters=[email_param, token_param],
        responses={
            200: "User account confirmed successfully",
            400: 'Bad Request'},
    )
    def get(self, request: Request):
        """
        GET method to confirm a user's email address with a valid token.
        """
        user_id = request.query_params.get("user_id")
        confirm_email_token = request.query_params.get("token")
        
        try:
            user = CustomUser.objects.get(pk=user_id)
        except CustomUser.DoesNotExist:
            error_response = {
                "status": "error",
                "message": "User not found"
            }
            return Response(error_response, status=status.HTTP_404_NOT_FOUND)
        
        if (user_id != str(user.pk) or confirm_email_token != str(user.confirm_email_token)):
            authentication_response = {
                "status": "failed",
                "message": "User Not Authorized"
            }
            return Response(authentication_response, status=status.HTTP_403_FORBIDDEN)
        
        if (confirm_email_token == str(user.confirm_email_token)):
            user.confirm_email_token = None
            user.save()
            response = {
                "status": "success",
                "Message": "User Account email confirmed"
            }
            return Response(response, status=status.HTTP_200_OK)
        error_response = {
            "status": "failed",
            "message": "Invalid Token"
        }
        return Response(error_response, status=status.HTTP_400_BAD_REQUEST)
    

class UserForgetPassword(APIView):
    """
    UserForgetPassword class handles the initiation of the forget password process.

    GET: Initiate the forget password process by sending an email with a reset password link.
    """
    permission_classes = [AllowAny]

    @swagger_auto_schema(
        operation_summary="Existing user forget password request",
        responses={
            200: "password reset link sent successfully",
            400: 'Bad Request'},
    )
    def get(self, request: Request):
        """
        GET method to initiate the forget password process by sending an email with a reset password link.
        """
        email = request.query_params.get("email")
        try:
            user = CustomUser.objects.get(email=email)
        except ObjectDoesNotExist:
            error_response = {
                "status": "error",
                "message": "User not found"
            }
            return Response(error_response, status=status.HTTP_404_NOT_FOUND)
        
        # Send a confirmation email with a forget password link
        subject = 'Reset your password'
        message = 'Click the link to reset your password'
        from_email = 'abiolaadedayo1993@gmail.com'
        recipient_list = [email]

        # Generate a forget password URL
            
        forget_password_url = f"https://smartedconnect.netlify.app/reset_password/?user_id={user.id}&token={user.reset_password_token}"

        message += f'\n\n{forget_password_url}'

        try:
            send_mail(subject, message, from_email, recipient_list)
            response = {
                "status": "success",
                "message": "Email sent successfully"
            }
            return Response(response, status=status.HTTP_200_OK)
        except Exception as e:
            failed_response = {
                "status": "failed",
                "message": f"Email not sent: {str(e)}"
            }
            return Response(failed_response, status=status.HTTP_400_BAD_REQUEST)


class UserResetPassword(APIView):
    """
    UserResetPassword class handles the reset of a user's password.

    PUT: Reset a user's password with a valid token.
    """
    permission_classes = [AllowAny]

    @swagger_auto_schema(
        operation_summary="Existing user reset their old password to new one",
        request_body=UserResetPasswordSerailizer,
        responses={
            200: "password reset successfully",
            400: 'Bad Request'},
    )

    def put(self, request: Request):
        """
        PUT method to reset a user's password with a valid token.
        """
        user_id = request.query_params.get("user_id")
        reset_password_token = request.query_params.get("token")

        try:
            user = CustomUser.objects.get(pk=user_id)
        except CustomUser.DoesNotExist:
            error_response = {
                "status": "error",
                "message": "User not found"
            }
            return Response(error_response, status=status.HTTP_404_NOT_FOUND)
        
        if (user_id != str(user.id) or reset_password_token != str(user.reset_password_token)):
            authentication_response = {
                "status": "failed",
                "message": "User Not Authorized"
            }
            return Response(authentication_response, status=status.HTTP_403_FORBIDDEN)
        
        if (reset_password_token == str(user.reset_password_token)):
            user.reset_password_token = uuid.uuid4()
            data = request.data
            serializer = CustomUserSerializer(user, data=data, partial=True)
            if serializer.is_valid():
                serializer.save()
                response = {
                    "status": "success",
                    "message": "Password reset successfully"
                }
                return Response(response, status=status.HTTP_200_OK)
        bad_request_response = {
            "status": "failed",
            "message": "Account update failed",
            "error_message": serializer.errors
        }   
        return Response(bad_request_response, status=status.HTTP_400_BAD_REQUEST)
