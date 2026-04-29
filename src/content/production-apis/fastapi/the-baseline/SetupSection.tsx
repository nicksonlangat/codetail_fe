const FILE_TREE = [
  { name: "task-api/", indent: 0, type: "dir" },
  { name: "main.py", indent: 1, type: "file", note: "FastAPI app and routes" },
  { name: "database.py", indent: 1, type: "file", note: "SQLAlchemy engine and session" },
  { name: "models.py", indent: 1, type: "file", note: "ORM table definitions" },
  { name: "schemas.py", indent: 1, type: "file", note: "Pydantic request/response models" },
  { name: "requirements.txt", indent: 1, type: "file", note: "" },
];

export function SetupSection() {
  return (
    <section id="project-setup">
      <h2 className="text-xl font-semibold mt-12 mb-4 scroll-mt-24">Project Setup</h2>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        Four dependencies. One file per concern. SQLite so there is nothing to install.
        This is the simplest possible starting point.
      </p>

      <div className="bg-card border border-border rounded-xl p-4 mb-6 not-prose">
        <p className="text-[9px] uppercase tracking-wider text-muted-foreground/50 mb-3">
          requirements.txt
        </p>
        <pre className="text-[10px] font-mono bg-muted rounded-xl px-4 py-3 overflow-x-auto leading-relaxed">
{`fastapi==0.111.0
uvicorn[standard]==0.29.0
sqlalchemy==2.0.30
pydantic==2.7.1`}
        </pre>
      </div>

      <div className="bg-card border border-border rounded-xl p-4 mb-6 not-prose">
        <p className="text-[9px] uppercase tracking-wider text-muted-foreground/50 mb-3">
          Project structure
        </p>
        <div className="font-mono text-[10px] bg-muted rounded-xl px-4 py-3 space-y-0.5">
          {FILE_TREE.map(({ name, indent, type, note }) => (
            <div key={name} className="flex items-center gap-2" style={{ paddingLeft: `${indent * 16}px` }}>
              <span className={type === "dir" ? "text-primary" : "text-foreground/80"}>
                {type === "dir" ? "📁" : "📄"} {name}
              </span>
              {note && <span className="text-muted-foreground/50"># {note}</span>}
            </div>
          ))}
        </div>
      </div>

      <h3 className="text-base font-semibold mt-8 mb-3">Database setup</h3>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        SQLAlchemy connects to a local SQLite file. The <code className="text-[13px] font-mono bg-muted px-1 py-0.5 rounded">check_same_thread=False</code> flag
        is required for SQLite because FastAPI can call the same session from different threads.
        This flag is also the first thing that will cause problems under concurrent load.
      </p>

      <div className="bg-card border border-border rounded-xl p-4 mb-6 not-prose">
        <p className="text-[9px] uppercase tracking-wider text-muted-foreground/50 mb-3">
          database.py
        </p>
        <pre className="text-[10px] font-mono bg-muted rounded-xl px-4 py-3 overflow-x-auto leading-relaxed">
{`from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase

SQLALCHEMY_DATABASE_URL = "sqlite:///./tasks.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

class Base(DeclarativeBase):
    pass

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()`}
        </pre>
      </div>

      <h3 className="text-base font-semibold mt-8 mb-3">Data model and schemas</h3>

      <div className="grid gap-4 sm:grid-cols-2 not-prose">
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-[9px] uppercase tracking-wider text-muted-foreground/50 mb-3">
            models.py
          </p>
          <pre className="text-[10px] font-mono bg-muted rounded-xl px-4 py-3 overflow-x-auto leading-relaxed">
{`from sqlalchemy import Column, Integer
from sqlalchemy import String, Boolean, DateTime
from datetime import datetime, UTC
from database import Base

class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True)
    title = Column(String, nullable=False)
    description = Column(String, nullable=True)
    done = Column(Boolean, default=False)
    created_at = Column(
        DateTime,
        default=lambda: datetime.now(UTC),
    )`}
          </pre>
        </div>

        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-[9px] uppercase tracking-wider text-muted-foreground/50 mb-3">
            schemas.py
          </p>
          <pre className="text-[10px] font-mono bg-muted rounded-xl px-4 py-3 overflow-x-auto leading-relaxed">
{`from pydantic import BaseModel, ConfigDict
from datetime import datetime

class TaskCreate(BaseModel):
    title: str
    description: str | None = None

class TaskResponse(BaseModel):
    model_config = ConfigDict(
        from_attributes=True
    )

    id: int
    title: str
    description: str | None
    done: bool
    created_at: datetime`}
          </pre>
        </div>
      </div>
    </section>
  );
}
