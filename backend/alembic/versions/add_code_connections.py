"""Add code-based connections

Revision ID: add_code_connections
Revises: 1b4cd17fcf02
Create Date: 2025-12-31 06:20:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = 'add_code_connections'
down_revision = 'a5e5909f6b47'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Add class code fields to teacher_classes
    op.add_column('teacher_classes', sa.Column('class_code', sa.String(length=10), nullable=True))
    op.add_column('teacher_classes', sa.Column('code_enabled', sa.Boolean(), nullable=True, default=True))
    op.add_column('teacher_classes', sa.Column('code_expires_at', sa.DateTime(), nullable=True))
    
    # Create unique constraint on class_code
    op.create_unique_constraint('uq_teacher_classes_class_code', 'teacher_classes', ['class_code'])
    
    # Create parent_child_relationships table
    op.create_table('parent_child_relationships',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False, primary_key=True),
        sa.Column('parent_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('child_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('relationship_type', sa.String(length=20), nullable=False, default='guardian'),
        sa.Column('is_primary', sa.Boolean(), nullable=True, default=True),
        sa.Column('is_emergency_contact', sa.Boolean(), nullable=True, default=True),
        sa.Column('is_active', sa.Boolean(), nullable=True, default=True),
        sa.Column('can_view_progress', sa.Boolean(), nullable=True, default=True),
        sa.Column('can_receive_notifications', sa.Boolean(), nullable=True, default=True),
        sa.Column('can_communicate_with_teachers', sa.Boolean(), nullable=True, default=True),
        sa.Column('is_verified', sa.Boolean(), nullable=True, default=False),
        sa.Column('verification_method', sa.String(length=50), nullable=True),
        sa.Column('verified_at', sa.DateTime(), nullable=True),
        sa.Column('verified_by', postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True, default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime(), nullable=True, default=sa.func.now()),
        sa.Column('created_by', postgresql.UUID(as_uuid=True), nullable=True),
        sa.ForeignKeyConstraint(['child_id'], ['users.id']),
        sa.ForeignKeyConstraint(['parent_id'], ['users.id']),
        sa.ForeignKeyConstraint(['verified_by'], ['users.id']),
        sa.ForeignKeyConstraint(['created_by'], ['users.id']),
        sa.UniqueConstraint('parent_id', 'child_id', name='unique_parent_child')
    )
    
    # Create parent_child_invitations table
    op.create_table('parent_child_invitations',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False, primary_key=True),
        sa.Column('parent_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('child_email', sa.String(length=255), nullable=True),
        sa.Column('child_name', sa.String(length=255), nullable=True),
        sa.Column('relationship_type', sa.String(length=20), nullable=False, default='guardian'),
        sa.Column('invitation_code', sa.String(length=8), nullable=False),
        sa.Column('code_type', sa.String(length=20), nullable=True, default='parent_child'),
        sa.Column('status', sa.String(length=20), nullable=True, default='pending'),
        sa.Column('expires_at', sa.DateTime(), nullable=False),
        sa.Column('accepted_at', sa.DateTime(), nullable=True),
        sa.Column('accepted_by', postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column('rejection_reason', sa.String(length=500), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True, default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime(), nullable=True, default=sa.func.now()),
        sa.ForeignKeyConstraint(['parent_id'], ['users.id']),
        sa.ForeignKeyConstraint(['accepted_by'], ['users.id']),
        sa.UniqueConstraint('invitation_code')
    )


def downgrade() -> None:
    # Drop tables
    op.drop_table('parent_child_invitations')
    op.drop_table('parent_child_relationships')
    
    # Remove class code fields
    op.drop_constraint('uq_teacher_classes_class_code', 'teacher_classes', type_='unique')
    op.drop_column('teacher_classes', 'code_expires_at')
    op.drop_column('teacher_classes', 'code_enabled')
    op.drop_column('teacher_classes', 'class_code')