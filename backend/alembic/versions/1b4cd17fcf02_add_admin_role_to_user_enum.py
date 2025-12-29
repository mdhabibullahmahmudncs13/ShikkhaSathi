"""Add admin role to user enum

Revision ID: 1b4cd17fcf02
Revises: add_user_profile_fields
Create Date: 2025-12-28 23:21:50.874768

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '1b4cd17fcf02'
down_revision = 'add_user_profile_fields'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Add 'admin' to the userrole enum
    op.execute("ALTER TYPE userrole ADD VALUE 'admin'")


def downgrade() -> None:
    # Note: PostgreSQL doesn't support removing enum values directly
    # This would require recreating the enum type
    pass