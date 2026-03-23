import type { ChallengeContent } from "@/types/challenge";

export const djangoFundamentalsChallenges: Record<string, ChallengeContent> = {
  // ── Django Fundamentals ──
  "dj-1": {
    problemId: "dj-1",
    title: "Create a Django Project & App",
    type: "code",
    description: "Set up a new Django project called `mysite` and create an app called `blog` within it. Write the commands and configuration needed to register the app.",
    requirements: [
      "Show the terminal commands to create the project and app",
      "Update `INSTALLED_APPS` in `settings.py` to include the new app",
      "Explain what `manage.py` does and how the project structure works",
    ],
    hints: [
      "Use `django-admin startproject` and `python manage.py startapp`",
      "The app name goes into the INSTALLED_APPS list as a string",
    ],
    starterCode: `# Terminal commands:\n# 1. \n# 2. \n\n# settings.py\nINSTALLED_APPS = [\n    'django.contrib.admin',\n    'django.contrib.auth',\n    'django.contrib.contenttypes',\n    'django.contrib.sessions',\n    'django.contrib.messages',\n    'django.contrib.staticfiles',\n    # Add your app here\n]`,
  },
  "dj-2": {
    problemId: "dj-2",
    title: "Define a Blog Post Model",
    type: "code",
    description: "Create a Django model called `Post` in your `blog` app that represents a blog post with the following fields: title, body, author, and timestamps for creation and last update.\n\nThe model should use appropriate field types and include a `__str__` method that returns the post title.",
    requirements: [
      "Define a `Post` model inheriting from `models.Model`",
      "Use `CharField` for title (max 200 chars)",
      "Use `TextField` for body content",
      "Use `ForeignKey` to link to Django's built-in `User` model",
      "Add `created_at` with `auto_now_add=True` and `updated_at` with `auto_now=True`",
      "Implement `__str__` to return the title",
      "Add a `Meta` class with `ordering = ['-created_at']`",
    ],
    hints: [
      "Import `from django.contrib.auth.models import User`",
      "ForeignKey needs an `on_delete` argument — use `models.CASCADE`",
      "auto_now_add sets the field when the object is first created",
    ],
    starterCode: `from django.db import models\n\n\nclass Post(models.Model):\n    # Define your fields here\n    \n    class Meta:\n        pass\n    \n    def __str__(self):\n        pass`,
    exampleOutput: `>>> post = Post(title="Hello World")\n>>> str(post)\n'Hello World'\n>>> Post.objects.all().query  # should order by -created_at`,
  },
  "dj-3": {
    problemId: "dj-3",
    title: "Run & Write Migrations",
    type: "code",
    description: "After defining your `Post` model, create and apply the database migrations. Also write a custom data migration that creates a default admin user.",
    requirements: [
      "Show the commands to create and apply migrations",
      "Write a custom migration function using `RunPython`",
      "The function should create a superuser with username 'admin'",
    ],
    hints: [
      "`makemigrations` detects model changes, `migrate` applies them",
      "Use `migrations.RunPython(func)` for data migrations",
    ],
    starterCode: `# Terminal commands:\n# 1. Create migrations: \n# 2. Apply migrations: \n\n# Custom data migration\nfrom django.db import migrations\n\ndef create_superuser(apps, schema_editor):\n    # Write your migration function here\n    pass\n\nclass Migration(migrations.Migration):\n    dependencies = [\n        # Add dependency\n    ]\n    operations = [\n        # Add operation\n    ]`,
  },
  "dj-4": {
    problemId: "dj-4",
    title: "Register Models in Admin",
    type: "code",
    description: "Register the `Post` model in Django's admin interface with a customized display showing the title, author, and creation date in the list view.",
    requirements: [
      "Register `Post` with a custom `ModelAdmin`",
      "Set `list_display` to show title, author, created_at",
      "Add `list_filter` for created_at and author",
      "Add `search_fields` for title and body",
    ],
    hints: [
      "Use the `@admin.register` decorator for cleaner syntax",
      "list_display takes a tuple of field name strings",
    ],
    starterCode: `from django.contrib import admin\nfrom .models import Post\n\n\n# Register your model with a custom admin class\n`,
  },
  "dj-5": {
    problemId: "dj-5",
    title: "QuerySet Filtering & Chaining",
    type: "code",
    description: "Write a series of Django ORM queries to retrieve blog posts using various filtering techniques. Each query should be written as a single chained expression.",
    requirements: [
      "Get all published posts ordered by newest first",
      "Filter posts by a specific author's username",
      "Find posts where title contains 'django' (case-insensitive)",
      "Get posts created in the last 7 days",
      "Exclude posts with empty body, limit to 5 results",
      "Use `.values_list()` to get just titles",
    ],
    hints: [
      "Use `__icontains` for case-insensitive search",
      "Use `from django.utils import timezone` and `timedelta` for date filtering",
      "Chain `.exclude()` after `.filter()` for compound queries",
    ],
    starterCode: `from django.utils import timezone\nfrom datetime import timedelta\nfrom blog.models import Post\n\n# 1. All posts, newest first\nquery_1 = \n\n# 2. Posts by author username "alice"\nquery_2 = \n\n# 3. Posts with "django" in title (case-insensitive)\nquery_3 = \n\n# 4. Posts from last 7 days\nquery_4 = \n\n# 5. Non-empty body, limit 5\nquery_5 = \n\n# 6. Just the titles as a flat list\nquery_6 = `,
  },

  // ── FastAPI ──
  "fa-1": {
    problemId: "fa-1",
    title: "Hello World with FastAPI",
    type: "code",
    description: "Create a minimal FastAPI application with a single endpoint that returns a JSON greeting.",
    requirements: [
      "Import FastAPI and create an app instance",
      "Define a GET endpoint at `/`",
      "Return `{\"message\": \"Hello, World!\"}`",
      "Show the uvicorn run command",
    ],
    hints: [
      "Use the `@app.get('/')` decorator",
      "FastAPI auto-converts dicts to JSON responses",
    ],
    starterCode: `from fastapi import FastAPI\n\n# Create your app\n\n\n# Define your endpoint\n\n\n# Run command: uvicorn main:app --reload`,
  },
  "fa-5": {
    problemId: "fa-5",
    title: "Dependency Injection Basics",
    type: "code",
    description: "Create a FastAPI app that uses dependency injection for common parameters. Implement a `common_params` dependency that extracts pagination parameters (`skip` and `limit`) from query strings, and a `get_db` dependency that simulates a database session.",
    requirements: [
      "Create a `common_params` dependency function with `skip: int = 0` and `limit: int = 10`",
      "Create a `get_db` generator dependency that yields a mock DB session",
      "Use `Depends()` in your endpoint signature",
      "Return the items with pagination applied",
    ],
    hints: [
      "`Depends()` wraps a callable and injects its return value",
      "Generator dependencies use `yield` — code after yield runs on cleanup",
    ],
    starterCode: `from fastapi import FastAPI, Depends\n\napp = FastAPI()\n\n# Fake data\nitems_db = [{"name": f"Item {i}"} for i in range(50)]\n\n\n# Define common_params dependency\n\n\n# Define get_db dependency (generator)\n\n\n# Endpoint using dependencies\n@app.get("/items")\ndef read_items():\n    pass`,
  },
};
