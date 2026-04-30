import { CodeDiff } from "@/components/blog/interactive/code-diff";
import type { DiffLine } from "@/components/blog/interactive/code-diff";

const MODELS_DIFF: DiffLine[] = [
  { type: "removed", content: "from sqlalchemy import Column, Integer, String, Boolean, DateTime, Index" },
  { type: "added",   content: "from sqlalchemy import Column, Integer, String, Boolean, DateTime, Index, ForeignKey" },
  { type: "context", content: "from datetime import datetime, UTC" },
  { type: "context", content: "from database import Base" },
  { type: "context", content: "" },
  { type: "added",   content: "class User(Base):" },
  { type: "added",   content: '    __tablename__ = "users"' },
  { type: "added",   content: "" },
  { type: "added",   content: "    id = Column(Integer, primary_key=True)" },
  { type: "added",   content: "    email = Column(String, unique=True, nullable=False, index=True)" },
  { type: "added",   content: "    hashed_password = Column(String, nullable=False)" },
  { type: "added",   content: "    created_at = Column(DateTime, default=lambda: datetime.now(UTC))" },
  { type: "added",   content: "" },
  { type: "context", content: "class Task(Base):" },
  { type: "context", content: '    __tablename__ = "tasks"' },
  { type: "context", content: "" },
  { type: "context", content: "    id = Column(Integer, primary_key=True)" },
  { type: "context", content: "    title = Column(String, nullable=False)" },
  { type: "context", content: "    description = Column(String, nullable=True)" },
  { type: "context", content: "    done = Column(Boolean, default=False)" },
  { type: "context", content: "    created_at = Column(DateTime, default=lambda: datetime.now(UTC))" },
  { type: "added",   content: "    user_id = Column(Integer, ForeignKey(\"users.id\"), nullable=False)" },
  { type: "context", content: "" },
  { type: "context", content: "    __table_args__ = (" },
  { type: "removed", content: '        Index("idx_tasks_created_at", "created_at"),' },
  { type: "added",   content: '        Index("idx_tasks_user_created", "user_id", "created_at"),' },
  { type: "context", content: "    )" },
];

const MODELS_BEFORE = `from sqlalchemy import Column, Integer, String, Boolean, DateTime, Index
from datetime import datetime, UTC
from database import Base

class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True)
    title = Column(String, nullable=False)
    description = Column(String, nullable=True)
    done = Column(Boolean, default=False)
    created_at = Column(DateTime, default=lambda: datetime.now(UTC))

    __table_args__ = (
        Index("idx_tasks_created_at", "created_at"),
    )`;

const MODELS_AFTER = `from sqlalchemy import Column, Integer, String, Boolean, DateTime, Index, ForeignKey
from datetime import datetime, UTC
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)
    email = Column(String, unique=True, nullable=False, index=True)
    hashed_password = Column(String, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(UTC))

class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True)
    title = Column(String, nullable=False)
    description = Column(String, nullable=True)
    done = Column(Boolean, default=False)
    created_at = Column(DateTime, default=lambda: datetime.now(UTC))
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    __table_args__ = (
        Index("idx_tasks_user_created", "user_id", "created_at"),
    )`;

export function UsersSection() {
  return (
    <section id="users-and-auth">
      <h2 className="text-xl font-semibold mt-12 mb-4 scroll-mt-24">
        Users, Password Hashing, and JWT
      </h2>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        Two new dependencies handle password hashing and token signing. No other
        cryptographic libraries are needed.
      </p>

      <div className="bg-card border border-border rounded-xl p-4 mb-6 not-prose">
        <p className="text-[9px] uppercase tracking-wider text-muted-foreground/50 mb-3">
          requirements.txt -- additions
        </p>
        <pre className="text-[10px] font-mono bg-muted rounded-xl px-4 py-3">
{`python-jose[cryptography]==3.3.0   # JWT encode/decode
passlib[bcrypt]==1.7.4             # password hashing`}
        </pre>
      </div>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        The <code className="text-[13px] font-mono bg-muted px-1 py-0.5 rounded">User</code> table
        stores an email and a bcrypt hash of the password -- never the plaintext.
        The <code className="text-[13px] font-mono bg-muted px-1 py-0.5 rounded">Task</code> table
        gains a <code className="text-[13px] font-mono bg-muted px-1 py-0.5 rounded">user_id</code> foreign
        key. The index is upgraded from a single-column <code className="text-[13px] font-mono bg-muted px-1 py-0.5 rounded">created_at</code> index
        to a composite <code className="text-[13px] font-mono bg-muted px-1 py-0.5 rounded">(user_id, created_at)</code> index,
        because every list query now filters by <code className="text-[13px] font-mono bg-muted px-1 py-0.5 rounded">user_id</code> first.
      </p>

      <CodeDiff filename="models.py" before={MODELS_BEFORE} after={MODELS_AFTER} diff={MODELS_DIFF} />

      <h3 className="text-base font-semibold mt-8 mb-3">auth.py</h3>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        All auth logic lives in a dedicated module. The
        <code className="text-[13px] font-mono bg-muted px-1 py-0.5 rounded"> get_current_user</code> dependency
        is what endpoints inject to require authentication -- FastAPI calls it before the
        handler runs, and raises 401 automatically if the token is missing or invalid.
      </p>

      <div className="bg-card border border-border rounded-xl p-4 not-prose">
        <p className="text-[9px] uppercase tracking-wider text-muted-foreground/50 mb-3">
          auth.py (new file)
        </p>
        <pre className="text-[10px] font-mono bg-muted rounded-xl px-4 py-3 overflow-x-auto leading-relaxed">
{`from datetime import datetime, timedelta, UTC
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from database import get_db
from models import User

SECRET_KEY = "change-this-before-production"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
bearer_scheme = HTTPBearer()


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)


def create_access_token(user_id: int) -> str:
    expire = datetime.now(UTC) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    return jwt.encode(
        {"sub": str(user_id), "exp": expire},
        SECRET_KEY,
        algorithm=ALGORITHM,
    )


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
    db: AsyncSession = Depends(get_db),
) -> User:
    exc = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid or expired token",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(
            credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM]
        )
        user_id = int(payload["sub"])
    except (JWTError, KeyError, ValueError):
        raise exc

    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    if user is None:
        raise exc
    return user`}
        </pre>
      </div>

      <div className="mt-4 p-4 bg-muted/30 border border-border rounded-xl text-[11px] space-y-2">
        <p className="font-semibold text-foreground/80">Why the composite index column order matters</p>
        <p className="text-muted-foreground">
          A composite index <code className="font-mono bg-muted px-1 py-0.5 rounded text-[10px]">(user_id, created_at)</code> serves
          queries that filter on <code className="font-mono bg-muted px-1 py-0.5 rounded text-[10px]">user_id</code> alone
          or on <code className="font-mono bg-muted px-1 py-0.5 rounded text-[10px]">user_id AND created_at</code>.
          It does not serve queries that filter on <code className="font-mono bg-muted px-1 py-0.5 rounded text-[10px]">created_at</code> alone,
          because the index is sorted by <code className="font-mono bg-muted px-1 py-0.5 rounded text-[10px]">user_id</code> first.
          Put the equality condition column first; put the range or sort column second.
        </p>
      </div>
    </section>
  );
}
