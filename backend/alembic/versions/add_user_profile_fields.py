"""Add phone, date_of_birth, school, district fields to users

Revision ID: add_user_profile_fields
Revises: e59c018bd6f1
Create Date: 2025-12-25 07:00:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'add_user_profile_fields'
down_revision = 'e59c018bd6f1'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Add new columns to users table
    op.add_column('users', sa.Column('phone', sa.String(length=20), nullable=True))
    op.add_column('users', sa.Column('date_of_birth', sa.Date(), nullable=True))
    op.add_column('users', sa.Column('school', sa.String(length=255), nullable=True))
    op.add_column('users', sa.Column('district', sa.String(length=100), nullable=True))


def downgrade() -> None:
    # Remove the added columns
    op.drop_column('users', 'district')
    op.drop_column('users', 'school')
    op.drop_column('users', 'date_of_birth')
    op.drop_column('users', 'phone')