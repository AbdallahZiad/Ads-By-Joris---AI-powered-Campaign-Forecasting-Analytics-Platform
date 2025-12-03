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

# Prefix all routes with /projects
router = APIRouter(prefix="/projects", tags=["projects"])


# ==============================================================================
# 1. PROJECT ENDPOINTS
# ==============================================================================

@router.get("/", response_model=ProjectsPublic)
def read_projects(
        session: SessionDep,
        current_user: CurrentUser,
        skip: int = 0,
        limit: int = 100
) -> Any:
    """
    Retrieve all projects belonging to the current user.
    """
    count_statement = select(func.count()).select_from(Project).where(Project.owner_id == current_user.id)
    count = session.exec(count_statement).one()

    statement = select(Project).where(Project.owner_id == current_user.id).offset(skip).limit(limit)
    projects = session.exec(statement).all()

    return ProjectsPublic(data=projects, count=count)


@router.get("/{id}", response_model=ProjectPublic)
def read_project(
        session: SessionDep,
        current_user: CurrentUser,
        id: uuid.UUID
) -> Any:
    """
    Get a specific project by ID. Returns the full hierarchy (Categories -> Groups -> Keywords).
    """
    project = session.get(Project, id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    if project.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    return project


@router.post("/", response_model=ProjectPublic)
def create_project(
        *,
        session: SessionDep,
        current_user: CurrentUser,
        project_in: ProjectCreate
) -> Any:
    """
    Create a new empty project.
    """
    project = Project.model_validate(project_in, update={"owner_id": current_user.id})
    session.add(project)
    session.commit()
    session.refresh(project)
    return project


@router.post("/tree", response_model=ProjectPublic)
def create_project_tree(
        *,
        session: SessionDep,
        current_user: CurrentUser,
        project_full: ProjectCreateFull
) -> Any:
    """
    Create a complete Project hierarchy in one go.
    Useful for saving results from the AI Scanner or importing data.
    """
    # 1. Create Project
    project = Project(title=project_full.title, owner_id=current_user.id)

    # 2. Iterate Categories
    for cat_data in project_full.categories:
        category = Category(name=cat_data.name)

        # 3. Iterate Groups
        for grp_data in cat_data.groups:
            group = Group(name=grp_data.name)

            # 4. Iterate Keywords
            for kw_text in grp_data.keywords:
                keyword = Keyword(text=kw_text)
                group.keywords.append(keyword)

            category.groups.append(group)

        project.categories.append(category)

    session.add(project)
    session.commit()
    session.refresh(project)
    return project


@router.patch("/{id}", response_model=ProjectPublic)
def update_project(
        *,
        session: SessionDep,
        current_user: CurrentUser,
        id: uuid.UUID,
        project_in: ProjectUpdate,
) -> Any:
    """
    Update a project title.
    """
    project = session.get(Project, id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    if project.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not enough permissions")

    update_data = project_in.model_dump(exclude_unset=True)
    project.sqlmodel_update(update_data)
    session.add(project)
    session.commit()
    session.refresh(project)
    return project


@router.delete("/{id}", response_model=Message)
def delete_project(
        session: SessionDep,
        current_user: CurrentUser,
        id: uuid.UUID
) -> Any:
    """
    Delete a project and all its contents (Categories, Groups, Keywords).
    """
    project = session.get(Project, id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    if project.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not enough permissions")

    session.delete(project)
    session.commit()
    return Message(message="Project deleted successfully")


# ==============================================================================
# 2. CATEGORY ENDPOINTS
# ==============================================================================

@router.post("/{project_id}/categories", response_model=CategoryPublic)
def create_category(
        *,
        session: SessionDep,
        current_user: CurrentUser,
        project_id: uuid.UUID,
        category_in: CategoryCreate
) -> Any:
    """
    Add a category to a project.
    """
    project = session.get(Project, project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    if project.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not enough permissions")

    category = Category(name=category_in.name, project_id=project_id)
    session.add(category)
    session.commit()
    session.refresh(category)
    return category


@router.patch("/categories/{id}", response_model=CategoryPublic)
def update_category(
        *,
        session: SessionDep,
        current_user: CurrentUser,
        id: uuid.UUID,
        category_in: CategoryUpdate
) -> Any:
    """
    Update a category name.
    """
    category = session.get(Category, id)
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")

    # Verify Project Ownership
    if category.project.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not enough permissions")

    category.name = category_in.name
    session.add(category)
    session.commit()
    session.refresh(category)
    return category


@router.delete("/categories/{id}", response_model=Message)
def delete_category(
        session: SessionDep,
        current_user: CurrentUser,
        id: uuid.UUID
) -> Any:
    """
    Delete a category and its groups/keywords.
    """
    category = session.get(Category, id)
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")

    if category.project.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not enough permissions")

    session.delete(category)
    session.commit()
    return Message(message="Category deleted successfully")


# ==============================================================================
# 3. GROUP ENDPOINTS
# ==============================================================================

@router.post("/categories/{category_id}/groups", response_model=GroupPublic)
def create_group(
        *,
        session: SessionDep,
        current_user: CurrentUser,
        category_id: uuid.UUID,
        group_in: GroupCreate
) -> Any:
    """
    Add a group to a category.
    """
    category = session.get(Category, category_id)
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")

    # Verify Project Ownership (Traverse up: Category -> Project -> Owner)
    if category.project.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not enough permissions")

    group = Group(name=group_in.name, category_id=category_id)
    session.add(group)
    session.commit()
    session.refresh(group)
    return group


@router.patch("/groups/{id}", response_model=GroupPublic)
def update_group(
        *,
        session: SessionDep,
        current_user: CurrentUser,
        id: uuid.UUID,
        group_in: GroupUpdate
) -> Any:
    """
    Update a group (name or google_ad_group_id).
    """
    group = session.get(Group, id)
    if not group:
        raise HTTPException(status_code=404, detail="Group not found")

    if group.category.project.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not enough permissions")

    update_data = group_in.model_dump(exclude_unset=True)
    group.sqlmodel_update(update_data)
    session.add(group)
    session.commit()
    session.refresh(group)
    return group


@router.delete("/groups/{id}", response_model=Message)
def delete_group(
        session: SessionDep,
        current_user: CurrentUser,
        id: uuid.UUID
) -> Any:
    """
    Delete a group.
    """
    group = session.get(Group, id)
    if not group:
        raise HTTPException(status_code=404, detail="Group not found")

    if group.category.project.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not enough permissions")

    session.delete(group)
    session.commit()
    return Message(message="Group deleted successfully")


# ==============================================================================
# 4. KEYWORD ENDPOINTS
# ==============================================================================

@router.post("/groups/{group_id}/keywords", response_model=KeywordPublic)
def create_keyword(
        *,
        session: SessionDep,
        current_user: CurrentUser,
        group_id: uuid.UUID,
        keyword_in: KeywordCreate
) -> Any:
    """
    Add a single keyword to a group.
    """
    group = session.get(Group, group_id)
    if not group:
        raise HTTPException(status_code=404, detail="Group not found")

    if group.category.project.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not enough permissions")

    keyword = Keyword(text=keyword_in.text, group_id=group_id)
    session.add(keyword)
    session.commit()
    session.refresh(keyword)
    return keyword


@router.post("/groups/{group_id}/keywords/bulk", response_model=List[KeywordPublic])
def create_keywords_bulk(
        *,
        session: SessionDep,
        current_user: CurrentUser,
        group_id: uuid.UUID,
        bulk_in: KeywordBulkCreate
) -> Any:
    """
    Add multiple keywords to a group at once.
    """
    group = session.get(Group, group_id)
    if not group:
        raise HTTPException(status_code=404, detail="Group not found")

    if group.category.project.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not enough permissions")

    new_keywords = []
    for text in bulk_in.keywords:
        kw = Keyword(text=text, group_id=group_id)
        session.add(kw)
        new_keywords.append(kw)

    session.commit()
    for kw in new_keywords:
        session.refresh(kw)

    return new_keywords


@router.delete("/keywords/{id}", response_model=Message)
def delete_keyword(
        session: SessionDep,
        current_user: CurrentUser,
        id: uuid.UUID
) -> Any:
    """
    Delete a keyword.
    """
    keyword = session.get(Keyword, id)
    if not keyword:
        raise HTTPException(status_code=404, detail="Keyword not found")

    # Traverse ownership: Keyword -> Group -> Category -> Project -> Owner
    if keyword.group.category.project.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not enough permissions")

    session.delete(keyword)
    session.commit()
    return Message(message="Keyword deleted successfully")