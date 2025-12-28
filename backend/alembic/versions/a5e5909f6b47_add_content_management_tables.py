"""Add content management tables

Revision ID: a5e5909f6b47
Revises: 1b4cd17fcf02
Create Date: 2025-12-29 05:08:14.606076

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'a5e5909f6b47'
down_revision = '1b4cd17fcf02'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Create arenas table
    op.create_table('arenas',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('name', sa.String(length=255), nullable=False),
        sa.Column('description', sa.Text(), nullable=False),
        sa.Column('subject', sa.String(length=100), nullable=False),
        sa.Column('grade', sa.Integer(), nullable=False),
        sa.Column('difficulty_level', sa.String(length=50), nullable=True),
        sa.Column('learning_objectives', sa.JSON(), nullable=True),
        sa.Column('prerequisites', sa.JSON(), nullable=True),
        sa.Column('is_active', sa.Boolean(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.Column('updated_at', sa.DateTime(), nullable=True),
        sa.Column('created_by', sa.UUID(), nullable=True),
        sa.ForeignKeyConstraint(['created_by'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_arenas_grade'), 'arenas', ['grade'], unique=False)
    op.create_index(op.f('ix_arenas_id'), 'arenas', ['id'], unique=False)
    op.create_index(op.f('ix_arenas_name'), 'arenas', ['name'], unique=False)
    op.create_index(op.f('ix_arenas_subject'), 'arenas', ['subject'], unique=False)

    # Create adventures table
    op.create_table('adventures',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('name', sa.String(length=255), nullable=False),
        sa.Column('description', sa.Text(), nullable=False),
        sa.Column('arena_id', sa.Integer(), nullable=False),
        sa.Column('difficulty_level', sa.String(length=50), nullable=True),
        sa.Column('estimated_duration', sa.Integer(), nullable=False),
        sa.Column('content_type', sa.String(length=50), nullable=True),
        sa.Column('learning_objectives', sa.JSON(), nullable=True),
        sa.Column('bloom_levels', sa.JSON(), nullable=True),
        sa.Column('content_data', sa.JSON(), nullable=True),
        sa.Column('is_active', sa.Boolean(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.Column('updated_at', sa.DateTime(), nullable=True),
        sa.Column('created_by', sa.UUID(), nullable=True),
        sa.ForeignKeyConstraint(['arena_id'], ['arenas.id'], ),
        sa.ForeignKeyConstraint(['created_by'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_adventures_id'), 'adventures', ['id'], unique=False)
    op.create_index(op.f('ix_adventures_name'), 'adventures', ['name'], unique=False)

    # Create study_materials table
    op.create_table('study_materials',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('title', sa.String(length=255), nullable=False),
        sa.Column('description', sa.Text(), nullable=False),
        sa.Column('subject', sa.String(length=100), nullable=False),
        sa.Column('grade', sa.Integer(), nullable=False),
        sa.Column('material_type', sa.String(length=50), nullable=False),
        sa.Column('tags', sa.JSON(), nullable=True),
        sa.Column('file_path', sa.String(length=500), nullable=False),
        sa.Column('file_name', sa.String(length=255), nullable=False),
        sa.Column('file_size', sa.Integer(), nullable=False),
        sa.Column('file_type', sa.String(length=100), nullable=False),
        sa.Column('adventure_id', sa.Integer(), nullable=True),
        sa.Column('arena_id', sa.Integer(), nullable=True),
        sa.Column('is_active', sa.Boolean(), nullable=True),
        sa.Column('download_count', sa.Integer(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.Column('updated_at', sa.DateTime(), nullable=True),
        sa.Column('uploaded_by', sa.UUID(), nullable=True),
        sa.ForeignKeyConstraint(['adventure_id'], ['adventures.id'], ),
        sa.ForeignKeyConstraint(['arena_id'], ['arenas.id'], ),
        sa.ForeignKeyConstraint(['uploaded_by'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_study_materials_grade'), 'study_materials', ['grade'], unique=False)
    op.create_index(op.f('ix_study_materials_id'), 'study_materials', ['id'], unique=False)
    op.create_index(op.f('ix_study_materials_material_type'), 'study_materials', ['material_type'], unique=False)
    op.create_index(op.f('ix_study_materials_subject'), 'study_materials', ['subject'], unique=False)
    op.create_index(op.f('ix_study_materials_title'), 'study_materials', ['title'], unique=False)


def downgrade() -> None:
    # Drop study_materials table
    op.drop_index(op.f('ix_study_materials_title'), table_name='study_materials')
    op.drop_index(op.f('ix_study_materials_subject'), table_name='study_materials')
    op.drop_index(op.f('ix_study_materials_material_type'), table_name='study_materials')
    op.drop_index(op.f('ix_study_materials_id'), table_name='study_materials')
    op.drop_index(op.f('ix_study_materials_grade'), table_name='study_materials')
    op.drop_table('study_materials')

    # Drop adventures table
    op.drop_index(op.f('ix_adventures_name'), table_name='adventures')
    op.drop_index(op.f('ix_adventures_id'), table_name='adventures')
    op.drop_table('adventures')

    # Drop arenas table
    op.drop_index(op.f('ix_arenas_subject'), table_name='arenas')
    op.drop_index(op.f('ix_arenas_name'), table_name='arenas')
    op.drop_index(op.f('ix_arenas_id'), table_name='arenas')
    op.drop_index(op.f('ix_arenas_grade'), table_name='arenas')
    op.drop_table('arenas')