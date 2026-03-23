import type { ChallengeContent } from "@/types/challenge";

export const djangoChallenges: Record<string, ChallengeContent> = {
  // ── Django Models Deep Dive ──
  // 1. MCQ — Easy
  "dm-1": {
    problemId: "dm-1",
    title: "Choosing the Right Field Type",
    type: "mcq",
    description: "You're building a Django model to store product prices in an e-commerce app.\n\nWhich field type is the most appropriate for storing monetary values like `19.99`?",
    requirements: [
      "Consider precision, rounding errors, and Django best practices",
      "Think about why some numeric types are unsuitable for currency",
    ],
    hints: [
      "FloatField uses IEEE 754 floating point — it can introduce tiny rounding errors (e.g. 0.1 + 0.2 ≠ 0.3)",
      "IntegerField would require storing cents and converting everywhere",
    ],
    starterCode: "",
    options: [
      { id: "a", label: "FloatField", code: "price = models.FloatField()" },
      { id: "b", label: "DecimalField", code: "price = models.DecimalField(max_digits=10, decimal_places=2)" },
      { id: "c", label: "IntegerField (store cents)", code: "price = models.IntegerField()  # store as cents" },
      { id: "d", label: "CharField (store as string)", code: 'price = models.CharField(max_length=20)' },
    ],
    correctOptionId: "b",
    explanation: "DecimalField uses Python's `decimal.Decimal` type, which avoids floating-point rounding errors. It's the standard for currency in Django. FloatField can cause subtle bugs (e.g. `0.1 + 0.2 = 0.30000000000000004`). Storing cents as IntegerField works but adds conversion complexity. CharField loses all numeric validation.",
  },

  // 2. Incomplete Code — Easy
  "dm-2": {
    problemId: "dm-2",
    title: "Complete the Blog Post Model",
    type: "code",
    description: "A junior developer started writing a `Post` model for a blog app but left several fields incomplete. Fill in the missing field definitions to match the requirements.\n\nThe model should represent a blog post with a title, body, author reference, and automatic timestamps.",
    requirements: [
      "Use `CharField` for title with max_length=200",
      "Use `TextField` for body",
      "Add a `ForeignKey` to `settings.AUTH_USER_MODEL` with `on_delete=CASCADE` and `related_name='posts'`",
      "Add `created_at` with `auto_now_add=True`",
      "Add `updated_at` with `auto_now=True`",
      "Implement `__str__` returning the title",
      "Set `ordering = ['-created_at']` in Meta",
    ],
    hints: [
      "auto_now_add sets the timestamp only on creation; auto_now updates it on every save",
      "Always use settings.AUTH_USER_MODEL instead of importing User directly",
      "related_name lets you do user.posts.all() for reverse lookups",
    ],
    starterCode: `from django.db import models
from django.conf import settings


class Post(models.Model):
    title = ___  # CharField, max 200
    body = ___   # TextField
    author = ___ # FK to auth user, cascade, related_name='posts'
    created_at = ___  # auto timestamp on create
    updated_at = ___  # auto timestamp on save

    class Meta:
        ordering = ___

    def __str__(self):
        return ___`,
    exampleOutput: `>>> post = Post(title="Hello World", body="...", author=user)
>>> str(post)
'Hello World'
>>> Post._meta.ordering
['-created_at']`,
  },

  // 3. MCQ — Medium
  "dm-3": {
    problemId: "dm-3",
    title: "Understanding on_delete Behaviour",
    type: "mcq",
    description: "You have the following Django models:\n\n```python\nclass Author(models.Model):\n    name = models.CharField(max_length=100)\n\nclass Book(models.Model):\n    title = models.CharField(max_length=200)\n    author = models.ForeignKey(Author, on_delete=???)\n```\n\nYou want the following behaviour: when an Author is deleted, all their books should remain in the database but with `author` set to `NULL`.\n\nWhich `on_delete` option achieves this?",
    requirements: [
      "Books must not be deleted when an Author is removed",
      "The author field on orphaned books should become NULL",
      "Consider which on_delete options Django provides",
    ],
    hints: [
      "CASCADE deletes all related objects — the opposite of what you want",
      "PROTECT would raise an error and prevent deletion entirely",
      "You'll also need `null=True` on the ForeignKey field for this to work",
    ],
    starterCode: "",
    options: [
      { id: "a", label: "CASCADE", code: "author = models.ForeignKey(Author, on_delete=models.CASCADE)" },
      { id: "b", label: "PROTECT", code: "author = models.ForeignKey(Author, on_delete=models.PROTECT)" },
      { id: "c", label: "SET_NULL", code: "author = models.ForeignKey(Author, on_delete=models.SET_NULL, null=True)" },
      { id: "d", label: "SET_DEFAULT", code: "author = models.ForeignKey(Author, on_delete=models.SET_DEFAULT, default=1)" },
    ],
    correctOptionId: "c",
    explanation: "SET_NULL sets the ForeignKey to NULL when the referenced object is deleted. This requires `null=True` on the field. CASCADE would delete all books (dangerous). PROTECT blocks the delete entirely. SET_DEFAULT would require a valid default author PK which is fragile and creates a false relationship.",
  },

  // 4. Fix unoptimised/buggy code — Medium-Hard
  "dm-4": {
    problemId: "dm-4",
    title: "Fix the Broken Order Model",
    type: "fix-code",
    description: "The following Order model has **several bugs and anti-patterns**. Your task is to identify and fix all the issues.\n\nThe model should represent an order with line items, a status workflow, and a computed total.",
    issueDescription: "This model has 5 issues: wrong field types, missing constraints, an incorrect property, a bad default, and a Meta class problem.",
    requirements: [
      "Fix the price field — FloatField causes rounding errors for currency",
      "Fix the status field — it should use TextChoices, not a plain CharField with no constraints",
      "Fix the `total` property — it currently doesn't use `F()` expressions and would fail on empty orders",
      "Fix the `created_at` field — it uses `auto_now` but should use `auto_now_add`",
      "Fix the `unique_together` — it should prevent duplicate products in the same order",
    ],
    hints: [
      "DecimalField(max_digits=10, decimal_places=2) is the standard for money fields",
      "TextChoices provides validation, admin dropdowns, and human-readable labels for free",
      "Use aggregate() with Coalesce to handle empty querysets returning None",
      "auto_now updates on every save — auto_now_add only sets once on creation",
    ],
    starterCode: `from django.db import models
from django.conf import settings

class Order(models.Model):
    customer = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='orders'
    )
    status = models.CharField(max_length=20, default='pending')  # BUG: no validation
    created_at = models.DateTimeField(auto_now=True)  # BUG: wrong auto field
    notes = models.TextField(blank=True)

    @property
    def total(self):
        # BUG: doesn't handle empty orders, no F() expression
        total = 0
        for item in self.items.all():
            total += item.price * item.quantity
        return total

    def __str__(self):
        return f"Order #{self.pk} — {self.status}"


class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    product_name = models.CharField(max_length=200)
    price = models.FloatField()  # BUG: use DecimalField for money
    quantity = models.PositiveIntegerField(default=1)

    class Meta:
        pass  # BUG: missing unique_together

    def __str__(self):
        return f"{self.quantity}x {self.product_name}"`,
    exampleOutput: `# Fixed version should:
# - Use DecimalField for price
# - Use TextChoices for status
# - Use aggregate + Coalesce for total
# - Use auto_now_add for created_at
# - Have unique_together = ['order', 'product_name']`,
  },

  // 5. Incomplete Code — Hard
  "dm-5": {
    problemId: "dm-5",
    title: "Abstract Base Model with Inheritance",
    type: "code",
    description: "Build a content management system using Django's abstract base model pattern. You need a `TimeStampedModel` abstract base, and two concrete models (`Article` and `Video`) that inherit from it.\n\nThis tests your understanding of abstract inheritance, custom managers, Meta inheritance, and model methods.",
    requirements: [
      "Create `TimeStampedModel` as an abstract model with `created_at` (auto_now_add) and `updated_at` (auto_now)",
      "Create a custom `PublishedManager` that filters `status='published'`",
      "Create `Article(TimeStampedModel)` with title, slug (unique), body, status (draft/published/archived using TextChoices), and author FK",
      "Create `Video(TimeStampedModel)` with title, url (URLField), duration_seconds (PositiveIntegerField), and status (reuse same TextChoices)",
      "Add `objects` (default manager) and `published` (PublishedManager) to both models",
      "Add `__str__` on both models returning the title",
      "Add `class Meta: ordering = ['-created_at']` on the abstract model so children inherit it",
      "Add a `is_published` property on TimeStampedModel (returns True if status == 'published')",
    ],
    hints: [
      "Abstract models use `class Meta: abstract = True` — they don't create database tables",
      "Children inherit fields AND Meta options from abstract parents (except abstract=True itself)",
      "Custom managers: class PublishedManager(models.Manager): def get_queryset(self): ...",
      "Both models should define their own Status TextChoices or share one at module level",
    ],
    starterCode: `from django.db import models
from django.conf import settings


class Status(models.TextChoices):
    ___  # Define DRAFT, PUBLISHED, ARCHIVED


class PublishedManager(models.Manager):
    def get_queryset(self):
        return ___  # filter to published only


class TimeStampedModel(models.Model):
    created_at = ___
    updated_at = ___

    class Meta:
        abstract = ___
        ordering = ___

    @property
    def is_published(self):
        return ___


class Article(TimeStampedModel):
    title = ___
    slug = ___
    body = ___
    status = ___
    author = ___

    objects = models.Manager()
    published = ___

    def __str__(self):
        return ___


class Video(TimeStampedModel):
    title = ___
    url = ___
    duration_seconds = ___
    status = ___

    objects = models.Manager()
    published = ___

    def __str__(self):
        return ___`,
    exampleOutput: `>>> Article.published.all()  # only published articles
>>> Article.objects.all()    # all articles
>>> a = Article(title="Test", status=Status.DRAFT)
>>> a.is_published
False
>>> Video._meta.ordering
['-created_at']  # inherited from abstract parent`,
  },
};
