"""Create assessment tables

Revision ID: create_assessment_tables
Revises: 8f68946c67e8
Create Date: 2024-12-19 12:00:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = 'create_assessment_tables'
down_revision = '8f68946c67e8'
branch_labels = None
depends_on = None


def upgrade():
    # Create assessments table
    op.create_table('assessments',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('title', sa.String(length=255), nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('subject', sa.String(length=100), nullable=False),
        sa.Column('grade', sa.Integer(), nullable=False),
        sa.Column('teacher_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('bloom_levels', sa.JSON(), nullable=False),
        sa.Column('topics', sa.JSON(), nullable=False),
        sa.Column('question_count', sa.Integer(), nullable=False),
        sa.Column('time_limit', sa.Integer(), nullable=False),
        sa.Column('difficulty', sa.String(length=20), nullable=False),
        sa.Column('scheduled_date', sa.DateTime(), nullable=True),
        sa.Column('due_date', sa.DateTime(), nullable=True),
        sa.Column('assigned_classes', sa.JSON(), nullable=False),
        sa.Column('is_published', sa.Boolean(), nullable=True),
        sa.Column('is_active', sa.Boolean(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.Column('updated_at', sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(['teacher_id'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id')
    )

    # Create assessment_questions table
    op.create_table('assessment_questions',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('assessment_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('question_type', sa.String(length=50), nullable=False),
        sa.Column('question_text', sa.Text(), nullable=False),
        sa.Column('options', sa.JSON(), nullable=True),
        sa.Column('correct_answer', sa.Text(), nullable=False),
        sa.Column('explanation', sa.Text(), nullable=True),
        sa.Column('bloom_level', sa.Integer(), nullable=False),
        sa.Column('topic', sa.String(length=200), nullable=False),
        sa.Column('difficulty', sa.Integer(), nullable=False),
        sa.Column('points', sa.Integer(), nullable=False),
        sa.Column('order_index', sa.Integer(), nullable=False),
        sa.Column('source_references', sa.JSON(), nullable=True),
        sa.Column('quality_score', sa.Float(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(['assessment_id'], ['assessments.id'], ),
        sa.PrimaryKeyConstraint('id')
    )

    # Create assessment_rubrics table
    op.create_table('assessment_rubrics',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('assessment_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('title', sa.String(length=255), nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('total_points', sa.Integer(), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.Column('updated_at', sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(['assessment_id'], ['assessments.id'], ),
        sa.PrimaryKeyConstraint('id')
    )

    # Create rubric_criteria table
    op.create_table('rubric_criteria',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('rubric_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('name', sa.String(length=255), nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('weight', sa.Float(), nullable=False),
        sa.Column('order_index', sa.Integer(), nullable=False),
        sa.ForeignKeyConstraint(['rubric_id'], ['assessment_rubrics.id'], ),
        sa.PrimaryKeyConstraint('id')
    )

    # Create rubric_levels table
    op.create_table('rubric_levels',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('criterion_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('name', sa.String(length=100), nullable=False),
        sa.Column('description', sa.Text(), nullable=False),
        sa.Column('points', sa.Integer(), nullable=False),
        sa.Column('order_index', sa.Integer(), nullable=False),
        sa.ForeignKeyConstraint(['criterion_id'], ['rubric_criteria.id'], ),
        sa.PrimaryKeyConstraint('id')
    )

    # Create assessment_attempts table
    op.create_table('assessment_attempts',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('assessment_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('student_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('started_at', sa.DateTime(), nullable=False),
        sa.Column('completed_at', sa.DateTime(), nullable=True),
        sa.Column('time_taken_seconds', sa.Integer(), nullable=True),
        sa.Column('total_score', sa.Integer(), nullable=True),
        sa.Column('max_score', sa.Integer(), nullable=False),
        sa.Column('percentage', sa.Float(), nullable=True),
        sa.Column('is_submitted', sa.Boolean(), nullable=True),
        sa.Column('is_graded', sa.Boolean(), nullable=True),
        sa.Column('graded_by', postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column('graded_at', sa.DateTime(), nullable=True),
        sa.Column('teacher_feedback', sa.Text(), nullable=True),
        sa.Column('rubric_scores', sa.JSON(), nullable=True),
        sa.ForeignKeyConstraint(['assessment_id'], ['assessments.id'], ),
        sa.ForeignKeyConstraint(['graded_by'], ['users.id'], ),
        sa.ForeignKeyConstraint(['student_id'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id')
    )

    # Create assessment_responses table
    op.create_table('assessment_responses',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('attempt_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('question_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('student_answer', sa.Text(), nullable=False),
        sa.Column('is_correct', sa.Boolean(), nullable=True),
        sa.Column('points_earned', sa.Integer(), nullable=True),
        sa.Column('time_taken_seconds', sa.Integer(), nullable=True),
        sa.Column('is_flagged', sa.Boolean(), nullable=True),
        sa.Column('teacher_comments', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(['attempt_id'], ['assessment_attempts.id'], ),
        sa.ForeignKeyConstraint(['question_id'], ['assessment_questions.id'], ),
        sa.PrimaryKeyConstraint('id')
    )

    # Create assessment_analytics table
    op.create_table('assessment_analytics',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('assessment_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('total_attempts', sa.Integer(), nullable=True),
        sa.Column('completion_rate', sa.Float(), nullable=True),
        sa.Column('average_score', sa.Float(), nullable=True),
        sa.Column('average_time_minutes', sa.Float(), nullable=True),
        sa.Column('question_analytics', sa.JSON(), nullable=True),
        sa.Column('class_comparisons', sa.JSON(), nullable=True),
        sa.Column('difficulty_analysis', sa.JSON(), nullable=True),
        sa.Column('updated_at', sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(['assessment_id'], ['assessments.id'], ),
        sa.PrimaryKeyConstraint('id')
    )

    # Set default values
    op.execute("ALTER TABLE assessments ALTER COLUMN is_published SET DEFAULT false")
    op.execute("ALTER TABLE assessments ALTER COLUMN is_active SET DEFAULT true")
    op.execute("ALTER TABLE assessments ALTER COLUMN question_count SET DEFAULT 10")
    op.execute("ALTER TABLE assessments ALTER COLUMN difficulty SET DEFAULT 'medium'")
    
    op.execute("ALTER TABLE assessment_questions ALTER COLUMN points SET DEFAULT 1")
    
    op.execute("ALTER TABLE rubric_criteria ALTER COLUMN weight SET DEFAULT 1.0")
    
    op.execute("ALTER TABLE assessment_attempts ALTER COLUMN total_score SET DEFAULT 0")
    op.execute("ALTER TABLE assessment_attempts ALTER COLUMN is_submitted SET DEFAULT false")
    op.execute("ALTER TABLE assessment_attempts ALTER COLUMN is_graded SET DEFAULT false")
    
    op.execute("ALTER TABLE assessment_responses ALTER COLUMN points_earned SET DEFAULT 0")
    op.execute("ALTER TABLE assessment_responses ALTER COLUMN is_flagged SET DEFAULT false")
    
    op.execute("ALTER TABLE assessment_analytics ALTER COLUMN total_attempts SET DEFAULT 0")
    op.execute("ALTER TABLE assessment_analytics ALTER COLUMN completion_rate SET DEFAULT 0.0")
    op.execute("ALTER TABLE assessment_analytics ALTER COLUMN average_score SET DEFAULT 0.0")
    op.execute("ALTER TABLE assessment_analytics ALTER COLUMN average_time_minutes SET DEFAULT 0.0")


def downgrade():
    op.drop_table('assessment_analytics')
    op.drop_table('assessment_responses')
    op.drop_table('assessment_attempts')
    op.drop_table('rubric_levels')
    op.drop_table('rubric_criteria')
    op.drop_table('assessment_rubrics')
    op.drop_table('assessment_questions')
    op.drop_table('assessments')