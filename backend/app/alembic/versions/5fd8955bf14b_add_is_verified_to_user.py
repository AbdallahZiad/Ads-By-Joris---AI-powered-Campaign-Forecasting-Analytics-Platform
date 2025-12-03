"""Add is_verified to User

Revision ID: 5fd8955bf14b
Revises: 78b1569844af
Create Date: 2025-12-01 20:23:57.185722

"""
from alembic import op
import sqlalchemy as sa
import sqlmodel.sql.sqltypes


# revision identifiers, used by Alembic.
revision = '5fd8955bf14b'
down_revision = '78b1569844af'
branch_labels = None
depends_on = None


def upgrade():
    # 1. Add column as NULLABLE first
    op.add_column('user', sa.Column('is_verified', sa.Boolean(), nullable=True))

    # 2. Update existing rows to TRUE (Verified)
    op.execute("UPDATE \"user\" SET is_verified = true")

    # 3. Alter column to be NOT NULL now that data is safe
    op.alter_column('user', 'is_verified', nullable=False)


def downgrade():
    op.drop_column('user', 'is_verified')