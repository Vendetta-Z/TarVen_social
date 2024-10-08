from django.http import JsonResponse
from django.shortcuts import redirect, render
from django.contrib import messages
from django.contrib.auth import authenticate, login, logout

from Users.services import Users_services
from .models import User
from Posts.models import Posts


class User_views:

    def profile(self):
        if self.user.is_authenticated is False:
            return render(self, "authorization/login.html")

        userProfileData = Users_services.getUserProfileData(self)

        return render(self, "profile_page.html", userProfileData)

    def publication_feed(self):
        # TODO перенести всю бизнес логику ленты публикаций в сервисы
        publication = Posts.objects.all().order_by("-created")

        return render(self, "publication_feed.html", {"publication_list": publication})

    def get_user_profile(self, id):
        userById = User.objects.get(id=id)
        userProfileData = Users_services.getAnotherUserProfile(self, userById)

        return render(self, "another_user_profile.html", userProfileData)

    def change_user_data(self):
        if self.POST:
            requestFiles = ""

            if self.FILES:
                requestFiles = self.FILES["avatar"]
            return Users_services.changeUserData(self, requestFiles)

    def getUserSubscribes(self):
        subscribers = Users_services.getUserSubscribesData(self)
        return render(self, "user_subscribes.html", {"subscribes": subscribers})

    def subscribe(self):
        if self.POST:
            userId = self.POST.get("user_id")
            Users_services.subscribeUser(self, user_id=userId)
            return JsonResponse("successfull subscribed!", safe=False)

    def unsubscribe(self):
        if self.POST:
            followingUserId = self.POST.get("followingUserId")
            return Users_services.unsubscribeUser(self, followingUserId)
        return redirect("/publication_feed")

    # Define a view function for the home page
    def home(request):
        return render(request, "profile_page.html")

    def logout(request):
        if User.is_authenticated:
            logout(request)
            return redirect("/login/")
        else:
            return redirect("/login/")

    # Define a view function for the login page
    def login_page(request):
        # Check if the HTTP request method is POST (form submission)
        if request.method == "POST":
            username = request.POST.get("username")
            password = request.POST.get("password")

            # Check if a user with the provided username exists
            if not User.objects.filter(username=username).exists():
                # Display an error message if the username does not exist
                messages.error(request, "Invalid Username")
                return redirect("/login/")

            # Authenticate the user with the provided username and password
            user = authenticate(username=username, password=password)

            if user is None:
                # Display an error message if authentication fails (invalid password)
                messages.error(request, "Invalid Password")
                return redirect("/login/")
            else:
                # Log in the user and redirect to the home page upon successful login
                login(request, user)
                return redirect("/")

        # Render the login page template (GET request)
        return render(request, "authorization/login.html")

    # Define a view function for the registration page
    def register_page(request):
        # Check if the HTTP request method is POST (form submission)
        if request.method == "POST":
            first_name = request.POST.get("first_name")
            last_name = request.POST.get("last_name")
            username = request.POST.get("username")
            password = request.POST.get("password")

            # Check if a user with the provided username already exists
            user = User.objects.filter(username=username)

            if user.exists():
                # Display an information message if the username is taken
                messages.info(request, "Username already taken!")
                return redirect("/register/")

            # Create a new User object with the provided information
            user = User.objects.create_user(
                first_name=first_name, last_name=last_name, username=username
            )

            # Set the user's password and save the user object
            user.set_password(password)
            user.save()

            # Display an information message indicating successful account creation
            messages.info(request, "Account created Successfully!")
            return redirect("/register/")

        # Render the registration page template (GET request)
        return render(request, "authorization/register.html")
