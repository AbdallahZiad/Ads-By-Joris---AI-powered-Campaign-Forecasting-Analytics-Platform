import uuid
from typing import Any, List

from fastapi import APIRouter, HTTPException
from sqlmodel import func, select

from app.api.deps import CurrentUser, SessionDep
from app.models import (
    Project, ProjectCreate, ProjectUpdate, ProjectPublic, ProjectsPublic, ProjectCreateFull,
    Category, CategoryCreate, CategoryUpdate, CategoryPublic,
    Group, GroupCreate, GroupUpdate, GroupPublic,
    Keyword, KeywordCreate, KeywordBulkCreate, KeywordPublic,
    Message
)

router = APIRouter(prefix="/projects")

# ==================== PROJECTS ====================
@router.get("/", response_model=ProjectsPublic, tags=["Projects"])
def read_projects(session: SessionDep, current_user: CurrentUser, skip: int = 0, limit: int = 100) -> Any:
    count_stat = select(func.count()).select_from(Project).where(Project.owner_id == current_user.id)
    count = session.exec(count_stat).one()
    stat = select(Project).where(Project.owner_id == current_user.id).offset(skip).limit(limit)
    return ProjectsPublic(data=session.exec(stat).all(), count=count)

@router.get("/{id}", response_model=ProjectPublic, tags=["Projects"])
def read_project(session: SessionDep, current_user: CurrentUser, id: uuid.UUID) -> Any:
    project = session.get(Project, id)
    if not project or project.owner_id != current_user.id: raise HTTPException(status_code=404, detail="Project not found")
    return project

@router.post("/", response_model=ProjectPublic, tags=["Projects"])
def create_project(session: SessionDep, current_user: CurrentUser, project_in: ProjectCreate) -> Any:
    project = Project.model_validate(project_in, update={"owner_id": current_user.id})
    session.add(project); session.commit(); session.refresh(project)
    return project

@router.post("/tree", response_model=ProjectPublic, tags=["Projects"])
def create_project_tree(session: SessionDep, current_user: CurrentUser, project_full: ProjectCreateFull) -> Any:
    project = Project(title=project_full.title, owner_id=current_user.id)
    for c in project_full.categories:
        cat = Category(name=c.name)
        for g in c.groups:
            grp = Group(name=g.name)
            for k in g.keywords: grp.keywords.append(Keyword(text=k))
            cat.groups.append(grp)
        project.categories.append(cat)
    session.add(project); session.commit(); session.refresh(project)
    return project

@router.patch("/{id}", response_model=ProjectPublic, tags=["Projects"])
def update_project(session: SessionDep, current_user: CurrentUser, id: uuid.UUID, project_in: ProjectUpdate) -> Any:
    project = session.get(Project, id)
    if not project or project.owner_id != current_user.id: raise HTTPException(status_code=404, detail="Project not found")
    project.sqlmodel_update(project_in.model_dump(exclude_unset=True))
    session.add(project); session.commit(); session.refresh(project)
    return project

@router.delete("/{id}", response_model=Message, tags=["Projects"])
def delete_project(session: SessionDep, current_user: CurrentUser, id: uuid.UUID) -> Any:
    project = session.get(Project, id)
    if not project or project.owner_id != current_user.id: raise HTTPException(status_code=404, detail="Project not found")
    session.delete(project); session.commit()
    return Message(message="Project deleted")

# ==================== CATEGORIES ====================
@router.post("/{project_id}/categories", response_model=CategoryPublic, tags=["Categories"])
def create_category(session: SessionDep, current_user: CurrentUser, project_id: uuid.UUID, category_in: CategoryCreate) -> Any:
    project = session.get(Project, project_id)
    if not project or project.owner_id != current_user.id: raise HTTPException(status_code=404, detail="Project not found")
    category = Category(name=category_in.name, project_id=project_id)
    session.add(category); session.commit(); session.refresh(category)
    return category

@router.patch("/categories/{id}", response_model=CategoryPublic, tags=["Categories"])
def update_category(session: SessionDep, current_user: CurrentUser, id: uuid.UUID, category_in: CategoryUpdate) -> Any:
    category = session.get(Category, id)
    if not category or category.project.owner_id != current_user.id: raise HTTPException(status_code=404, detail="Category not found")
    if category_in.name: category.name = category_in.name
    session.add(category); session.commit(); session.refresh(category)
    return category

@router.delete("/categories/{id}", response_model=Message, tags=["Categories"])
def delete_category(session: SessionDep, current_user: CurrentUser, id: uuid.UUID) -> Any:
    category = session.get(Category, id)
    if not category or category.project.owner_id != current_user.id: raise HTTPException(status_code=404, detail="Category not found")
    session.delete(category); session.commit()
    return Message(message="Category deleted")

# ==================== GROUPS ====================
@router.post("/categories/{category_id}/groups", response_model=GroupPublic, tags=["Groups"])
def create_group(session: SessionDep, current_user: CurrentUser, category_id: uuid.UUID, group_in: GroupCreate) -> Any:
    cat = session.get(Category, category_id)
    if not cat or cat.project.owner_id != current_user.id: raise HTTPException(status_code=404, detail="Category not found")
    group = Group(name=group_in.name, category_id=category_id)
    session.add(group); session.commit(); session.refresh(group)
    return group

@router.patch("/groups/{id}", response_model=GroupPublic, tags=["Groups"])
def update_group(session: SessionDep, current_user: CurrentUser, id: uuid.UUID, group_in: GroupUpdate) -> Any:
    group = session.get(Group, id)
    if not group or group.category.project.owner_id != current_user.id: raise HTTPException(status_code=404, detail="Group not found")
    data = group_in.model_dump(exclude_unset=True)
    if "google_ad_group_id" in data: del data["google_ad_group_id"] # Block direct link update
    group.sqlmodel_update(data)
    session.add(group); session.commit(); session.refresh(group)
    return group

@router.delete("/groups/{id}", response_model=Message, tags=["Groups"])
def delete_group(session: SessionDep, current_user: CurrentUser, id: uuid.UUID) -> Any:
    group = session.get(Group, id)
    if not group or group.category.project.owner_id != current_user.id: raise HTTPException(status_code=404, detail="Group not found")
    session.delete(group); session.commit()
    return Message(message="Group deleted")

# ==================== KEYWORDS ====================
@router.post("/groups/{group_id}/keywords", response_model=KeywordPublic, tags=["Keywords"])
def create_keyword(session: SessionDep, current_user: CurrentUser, group_id: uuid.UUID, keyword_in: KeywordCreate) -> Any:
    group = session.get(Group, group_id)
    if not group or group.category.project.owner_id != current_user.id: raise HTTPException(status_code=404, detail="Group not found")
    kw = Keyword(text=keyword_in.text, group_id=group_id)
    session.add(kw); session.commit(); session.refresh(kw)
    return kw

@router.post("/groups/{group_id}/keywords/bulk", response_model=List[KeywordPublic], tags=["Keywords"])
def create_keywords_bulk(session: SessionDep, current_user: CurrentUser, group_id: uuid.UUID, bulk_in: KeywordBulkCreate) -> Any:
    group = session.get(Group, group_id)
    if not group or group.category.project.owner_id != current_user.id: raise HTTPException(status_code=404, detail="Group not found")
    kws = [Keyword(text=t, group_id=group_id) for t in bulk_in.keywords]
    for k in kws: session.add(k)
    session.commit()
    for k in kws: session.refresh(k)
    return kws

@router.delete("/keywords/{id}", response_model=Message, tags=["Keywords"])
def delete_keyword(session: SessionDep, current_user: CurrentUser, id: uuid.UUID) -> Any:
    kw = session.get(Keyword, id)
    if not kw or kw.group.category.project.owner_id != current_user.id: raise HTTPException(status_code=404, detail="Keyword not found")
    session.delete(kw); session.commit()
    return Message(message="Keyword deleted")