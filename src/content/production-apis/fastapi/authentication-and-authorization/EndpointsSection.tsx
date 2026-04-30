import { CodeDiff } from "@/components/blog/interactive/code-diff";
import type { DiffLine } from "@/components/blog/interactive/code-diff";

const AUTH_ENDPOINTS = `from auth import hash_password, verify_password, create_access_token, get_current_user

class UserCreate(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8)

class UserResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    email: str
    created_at: datetime

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


@app.post("/auth/register", response_model=UserResponse, status_code=201)
async def register(body: UserCreate, db: AsyncSession = Depends(get_db)):
    existing = await db.execute(select(User).where(User.email == body.email))
    if existing.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Email already registered")
    user = User(email=body.email, hashed_password=hash_password(body.password))
    db.add(user)
    await db.commit()
    await db.refresh(user)
    return user


@app.post("/auth/login", response_model=TokenResponse)
async def login(body: UserCreate, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.email == body.email))
    user = result.scalar_one_or_none()
    if not user or not verify_password(body.password, user.hashed_password):
        raise HTTPException(
            status_code=401,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return TokenResponse(access_token=create_access_token(user.id))`;

const CREATE_BEFORE = `@app.post("/tasks", response_model=TaskResponse, status_code=201)
async def create_task(
    body: TaskCreate,
    db: AsyncSession = Depends(get_db),
):
    task = Task(**body.model_dump())
    db.add(task)
    await db.commit()
    await db.refresh(task)
    return task`;

const CREATE_AFTER = `@app.post("/tasks", response_model=TaskResponse, status_code=201)
async def create_task(
    body: TaskCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    task = Task(**body.model_dump(), user_id=current_user.id)
    db.add(task)
    await db.commit()
    await db.refresh(task)
    return task`;

const CREATE_DIFF: DiffLine[] = [
  { type: "context", content: "@app.post(\"/tasks\", response_model=TaskResponse, status_code=201)" },
  { type: "context", content: "async def create_task(" },
  { type: "context", content: "    body: TaskCreate," },
  { type: "context", content: "    db: AsyncSession = Depends(get_db)," },
  { type: "added",   content: "    current_user: User = Depends(get_current_user)," },
  { type: "context", content: "):" },
  { type: "removed", content: "    task = Task(**body.model_dump())" },
  { type: "added",   content: "    task = Task(**body.model_dump(), user_id=current_user.id)" },
  { type: "context", content: "    db.add(task)" },
  { type: "context", content: "    await db.commit()" },
  { type: "context", content: "    await db.refresh(task)" },
  { type: "context", content: "    return task" },
];

const LIST_BEFORE = `@app.get("/tasks", response_model=TaskListResponse)
async def list_tasks(
    cursor: datetime | None = Query(default=None),
    limit: int = Query(default=20, le=100),
    db: AsyncSession = Depends(get_db),
):
    stmt = (
        select(Task)
        .order_by(Task.created_at.desc())
        .limit(limit + 1)
    )
    if cursor:
        stmt = stmt.where(Task.created_at < cursor)
    result = await db.execute(stmt)
    tasks = result.scalars().all()
    has_more = len(tasks) > limit
    items = tasks[:limit]
    return TaskListResponse(
        items=items,
        next_cursor=items[-1].created_at if has_more else None,
    )`;

const LIST_AFTER = `@app.get("/tasks", response_model=TaskListResponse)
async def list_tasks(
    cursor: datetime | None = Query(default=None),
    limit: int = Query(default=20, le=100),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    stmt = (
        select(Task)
        .where(Task.user_id == current_user.id)
        .order_by(Task.created_at.desc())
        .limit(limit + 1)
    )
    if cursor:
        stmt = stmt.where(Task.created_at < cursor)
    result = await db.execute(stmt)
    tasks = result.scalars().all()
    has_more = len(tasks) > limit
    items = tasks[:limit]
    return TaskListResponse(
        items=items,
        next_cursor=items[-1].created_at if has_more else None,
    )`;

const LIST_DIFF: DiffLine[] = [
  { type: "context", content: "@app.get(\"/tasks\", response_model=TaskListResponse)" },
  { type: "context", content: "async def list_tasks(" },
  { type: "context", content: "    cursor: datetime | None = Query(default=None)," },
  { type: "context", content: "    limit: int = Query(default=20, le=100)," },
  { type: "context", content: "    db: AsyncSession = Depends(get_db)," },
  { type: "added",   content: "    current_user: User = Depends(get_current_user)," },
  { type: "context", content: "):" },
  { type: "context", content: "    stmt = (" },
  { type: "context", content: "        select(Task)" },
  { type: "added",   content: "        .where(Task.user_id == current_user.id)" },
  { type: "context", content: "        .order_by(Task.created_at.desc())" },
  { type: "context", content: "        .limit(limit + 1)" },
  { type: "context", content: "    )" },
  { type: "context", content: "    if cursor:" },
  { type: "context", content: "        stmt = stmt.where(Task.created_at < cursor)" },
  { type: "context", content: "    result = await db.execute(stmt)" },
  { type: "context", content: "    tasks = result.scalars().all()" },
  { type: "context", content: "    has_more = len(tasks) > limit" },
  { type: "context", content: "    items = tasks[:limit]" },
  { type: "context", content: "    return TaskListResponse(" },
  { type: "context", content: "        items=items," },
  { type: "context", content: "        next_cursor=items[-1].created_at if has_more else None," },
  { type: "context", content: "    )" },
];

export function EndpointsSection() {
  return (
    <section id="endpoints">
      <h2 className="text-xl font-semibold mt-12 mb-4 scroll-mt-24">
        Auth Endpoints and Scoped Queries
      </h2>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        Two new endpoints handle registration and login. They use the same
        <code className="text-[13px] font-mono bg-muted px-1 py-0.5 rounded"> UserCreate</code> schema
        because both accept an email and password -- the register endpoint hashes before storing,
        the login endpoint verifies against the stored hash and returns a token.
      </p>

      <div className="bg-card border border-border rounded-xl p-4 mb-6 not-prose">
        <p className="text-[9px] uppercase tracking-wider text-muted-foreground/50 mb-3">
          main.py -- new auth endpoints
        </p>
        <pre className="text-[10px] font-mono bg-muted rounded-xl px-4 py-3 overflow-x-auto leading-relaxed">
          {AUTH_ENDPOINTS}
        </pre>
      </div>

      <div className="mt-4 p-4 bg-muted/30 border border-border rounded-xl text-[11px] space-y-2 mb-8">
        <p className="font-semibold text-foreground/80">Why return 400, not 409, for duplicate email</p>
        <p className="text-muted-foreground">
          HTTP 409 Conflict is semantically correct, but many clients (and OpenAPI generators) treat
          400 as the generic "bad input" response and 409 as a special case requiring different handling.
          Using 400 here keeps the client-side error path uniform: all validation failures go to the same
          handler. Either is defensible -- the important thing is consistency across the API.
        </p>
      </div>

      <h3 className="text-base font-semibold mt-8 mb-3">Scoping existing endpoints</h3>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        Adding <code className="text-[13px] font-mono bg-muted px-1 py-0.5 rounded">Depends(get_current_user)</code> to
        an endpoint does two things: it rejects unauthenticated requests with 401 before the handler
        runs, and it provides the authenticated user as a typed Python object. The
        <code className="text-[13px] font-mono bg-muted px-1 py-0.5 rounded"> user_id</code> is
        then threaded through to every query and every new record.
      </p>

      <p className="text-[13px] font-semibold mb-2">POST /tasks</p>
      <CodeDiff filename="main.py" before={CREATE_BEFORE} after={CREATE_AFTER} diff={CREATE_DIFF} />

      <p className="text-[13px] font-semibold mb-2 mt-6">GET /tasks (list)</p>
      <CodeDiff filename="main.py" before={LIST_BEFORE} after={LIST_AFTER} diff={LIST_DIFF} />

      <div className="mt-4 p-4 bg-muted/30 border border-border rounded-xl text-[11px] space-y-2">
        <p className="font-semibold text-foreground/80">The composite index pays off here</p>
        <p className="text-muted-foreground">
          The list query now always includes{" "}
          <code className="font-mono bg-muted px-1 py-0.5 rounded text-[10px]">WHERE user_id = $1</code>.
          The composite index{" "}
          <code className="font-mono bg-muted px-1 py-0.5 rounded text-[10px]">(user_id, created_at)</code>{" "}
          from the models diff satisfies both the equality filter and the cursor sort in a single
          index scan. A single-column index on{" "}
          <code className="font-mono bg-muted px-1 py-0.5 rounded text-[10px]">created_at</code>{" "}
          would still require a filter on every page.
        </p>
      </div>
    </section>
  );
}
