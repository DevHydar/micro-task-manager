from fastapi import FastAPI, Depends,HTTPException
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from pydantic import BaseModel

from auth import (
    hash_password,
    verify_password,
    create_access_token,
    decode_access_token
)
from fastapi.security import OAuth2PasswordBearer
import models
from database import engine, SessionLocal


# Create database tables
models.Base.metadata.create_all(bind=engine)


app = FastAPI()
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
):
    payload = decode_access_token(token)

    if not payload:
        raise HTTPException(
            status_code=401,
            detail="Invalid or expired token"
        )

    username = payload.get("sub")

    if not username:
        raise HTTPException(
            status_code=401,
            detail="Invalid token"
        )

    user = db.query(models.User).filter(
        models.User.username == username
    ).first()

    if not user:
        raise HTTPException(
            status_code=401,
            detail="User not found"
        )

    return user

# Database session


# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Request models
class RegisterRequest(BaseModel):
    username: str
    password: str


class LoginRequest(BaseModel):
    username: str
    password: str


# =========================
# AUTHENTICATION
# =========================

@app.post("/register")
def register(
    user: RegisterRequest,
    db: Session = Depends(get_db)
):

    existing_user = db.query(models.User).filter(
        models.User.username == user.username
    ).first()

    if existing_user:
        return {"error": "Username already exists"}

    new_user = models.User(
        username=user.username,
        hashed_password=hash_password(user.password)
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {
        "message": "User registered successfully",
        "username": new_user.username
    }


@app.post("/login")
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    existing_user = db.query(models.User).filter(
        models.User.username == form_data.username
    ).first()

    if not existing_user:
        raise HTTPException(
            status_code=401,
            detail="Invalid username or password"
        )

    if not verify_password(
        form_data.password,
        existing_user.hashed_password
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid username or password"
        )

    token = create_access_token(
        {"sub": existing_user.username}
    )

    return {
        "access_token": token,
        "token_type": "bearer"
    }
    # Find user
    existing_user = db.query(models.User).filter(
        models.User.username == user.username
    ).first()

    # Username doesn't exist
    if not existing_user:
        return {"error": "Invalid username or password"}

    # Password doesn't match
    if not verify_password(
        user.password,
        existing_user.hashed_password
    ):
        return {"error": "Invalid username or password"}

    # Create JWT
    token = create_access_token(
        {"sub": existing_user.username}
    )

    return {
        "access_token": token,
        "token_type": "bearer"
    }


# =========================
# GENERAL
# =========================

@app.get("/")
def home():
    return {
        "message": "Micro Task Manager API is running!"
    }


# =========================
# TASKS
# =========================

@app.post("/tasks")
def create_task(
    title: str,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    task = models.Task(
        title=title,
        user_id=current_user.id
    )

    db.add(task)
    db.commit()
    db.refresh(task)

    return task

    task = models.Task(title=title)

    db.add(task)
    db.commit()
    db.refresh(task)

    return task


@app.get("/tasks")
def get_tasks(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    return db.query(models.Task).filter(
        models.Task.user_id == current_user.id
    ).all()

@app.put("/tasks/{task_id}")
def update_task(
    task_id: int,
    completed: bool,
    db: Session = Depends(get_db)
):

    task = db.query(models.Task).filter(
        models.Task.id == task_id
    ).first()

    if not task:
        return {"error": "Task not found"}

    task.completed = completed

    db.commit()
    db.refresh(task)

    return task


@app.delete("/tasks/{task_id}")
def delete_task(
    task_id: int,
    db: Session = Depends(get_db)
):

    task = db.query(models.Task).filter(
        models.Task.id == task_id
    ).first()

    if not task:
        return {"error": "Task not found"}

    db.delete(task)
    db.commit()

    return {
        "message": "Task deleted successfully"
    }
