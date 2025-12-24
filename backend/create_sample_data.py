#!/usr/bin/env python3
"""
Create sample data for ShikkhaSathi platform
"""

import asyncio
import sys
import os
from datetime import datetime, timedelta

from sqlalchemy.orm import Session

from app.db.session import SessionLocal
from app.models.user import User, UserRole
from app.models.question import Question, Quiz
from app.models.quiz_attempt import QuizAttempt
from app.models.gamification import Gamification
from app.models.student_progress import StudentProgress, MasteryLevel

from app.core.security import get_password_hash

def hash_password(password: str) -> str:
    return get_password_hash(password)

def create_sample_users(db: Session):
    """Create sample users for testing"""
    print("Creating sample users...")
    
    # Sample students
    students = [
        {
            "email": "student1@shikkhasathi.com",
            "password": "student123",
            "full_name": "রাহুল আহমেদ",
            "role": UserRole.STUDENT,
            "grade": 9,
            "is_active": True
        },
        {
            "email": "student2@shikkhasathi.com", 
            "password": "student123",
            "full_name": "সারা খান",
            "role": UserRole.STUDENT,
            "grade": 10,
            "is_active": True
        },
        {
            "email": "student3@shikkhasathi.com",
            "password": "student123", 
            "full_name": "তানভীর রহমান",
            "role": UserRole.STUDENT,
            "grade": 9,
            "is_active": True
        },
        {
            "email": "student4@shikkhasathi.com",
            "password": "student123", 
            "full_name": "নাফিসা আক্তার",
            "role": UserRole.STUDENT,
            "grade": 10,
            "is_active": True
        },
        {
            "email": "student5@shikkhasathi.com",
            "password": "student123", 
            "full_name": "আরিফ হাসান",
            "role": UserRole.STUDENT,
            "grade": 10,
            "is_active": True
        }
    ]
    
    # Sample teachers
    teachers = [
        {
            "email": "teacher1@shikkhasathi.com",
            "password": "teacher123",
            "full_name": "ড. ফাতেমা বেগম",
            "role": UserRole.TEACHER,
            "is_active": True
        },
        {
            "email": "teacher2@shikkhasathi.com",
            "password": "teacher123", 
            "full_name": "মোহাম্মদ করিম",
            "role": UserRole.TEACHER,
            "is_active": True
        }
    ]
    
    # Sample parents
    parents = [
        {
            "email": "parent1@shikkhasathi.com",
            "password": "parent123",
            "full_name": "নাসির উদ্দিন",
            "role": UserRole.PARENT,
            "is_active": True
        },
        {
            "email": "parent2@shikkhasathi.com",
            "password": "parent123",
            "full_name": "রোকেয়া খাতুন", 
            "role": UserRole.PARENT,
            "is_active": True
        }
    ]
    
    all_users = students + teachers + parents
    created_users = []
    
    for user_data in all_users:
        # Check if user already exists
        existing_user = db.query(User).filter(User.email == user_data["email"]).first()
        if existing_user:
            print(f"User {user_data['email']} already exists, skipping...")
            created_users.append(existing_user)
            continue
            
        user = User(
            email=user_data["email"],
            password_hash=hash_password(user_data["password"]),
            full_name=user_data["full_name"],
            role=user_data["role"],
            grade=user_data.get("grade"),
            is_active=user_data["is_active"]
        )
        db.add(user)
        created_users.append(user)
        print(f"Created user: {user.full_name} ({user.email})")
    
    db.commit()
    return created_users

def create_sample_questions(db: Session):
    """Create sample quiz questions"""
    print("Creating sample questions...")
    
    # Physics questions for Grade 9 & 10
    physics_questions = [
        # Grade 9 Physics
        {
            "subject": "physics",
            "grade": 9,
            "topic": "Force and Motion",
            "question_text": "What is Newton's First Law of Motion?",
            "question_text_bn": "নিউটনের প্রথম গতিসূত্র কী?",
            "options": [
                "An object at rest stays at rest unless acted upon by a force",
                "Force equals mass times acceleration", 
                "For every action there is an equal and opposite reaction",
                "Energy cannot be created or destroyed"
            ],
            "options_bn": [
                "একটি স্থির বস্তু বল প্রয়োগ না করা পর্যন্ত স্থির থাকে",
                "বল = ভর × ত্বরণ",
                "প্রতিটি ক্রিয়ার একটি সমান ও বিপরীত প্রতিক্রিয়া আছে", 
                "শক্তি সৃষ্টি বা ধ্বংস করা যায় না"
            ],
            "correct_answer": 0,
            "difficulty": "easy",
            "explanation": "Newton's First Law states that an object at rest stays at rest and an object in motion stays in motion unless acted upon by an external force.",
            "explanation_bn": "নিউটনের প্রথম সূত্র বলে যে একটি স্থির বস্তু স্থির থাকে এবং গতিশীল বস্তু গতিশীল থাকে যতক্ষণ না বাহ্যিক বল প্রয়োগ করা হয়।"
        },
        {
            "subject": "physics",
            "grade": 9,
            "topic": "Force and Motion", 
            "question_text": "If a car accelerates at 2 m/s² and has a mass of 1000 kg, what is the net force?",
            "question_text_bn": "যদি একটি গাড়ি ২ মি/সে² ত্বরণে চলে এবং এর ভর ১০০০ কেজি হয়, তাহলে নিট বল কত?",
            "options": ["500 N", "1000 N", "2000 N", "4000 N"],
            "options_bn": ["৫০০ নিউটন", "১০০০ নিউটন", "২০০০ নিউটন", "৪০০০ নিউটন"],
            "correct_answer": 2,
            "difficulty": "medium",
            "explanation": "Using F = ma, Force = 1000 kg × 2 m/s² = 2000 N",
            "explanation_bn": "F = ma সূত্র ব্যবহার করে, বল = ১০০০ কেজি × ২ মি/সে² = ২০০০ নিউটন"
        },
        # Grade 10 Physics
        {
            "subject": "physics",
            "grade": 10,
            "topic": "Light and Optics",
            "question_text": "What is the speed of light in vacuum?",
            "question_text_bn": "শূন্যস্থানে আলোর গতি কত?",
            "options": ["3 × 10⁸ m/s", "3 × 10⁶ m/s", "3 × 10¹⁰ m/s", "3 × 10⁴ m/s"],
            "options_bn": ["৩ × ১০⁸ মি/সে", "৩ × ১০⁶ মি/সে", "৩ × ১০¹⁰ মি/সে", "৩ × ১০⁴ মি/সে"],
            "correct_answer": 0,
            "difficulty": "easy",
            "explanation": "The speed of light in vacuum is approximately 3 × 10⁸ meters per second.",
            "explanation_bn": "শূন্যস্থানে আলোর গতি প্রায় ৩ × ১০⁸ মিটার প্রতি সেকেন্ড।"
        },
        {
            "subject": "physics",
            "grade": 10,
            "topic": "Electricity",
            "question_text": "What is Ohm's Law?",
            "question_text_bn": "ওহমের সূত্র কী?",
            "options": ["V = IR", "P = VI", "E = mc²", "F = ma"],
            "options_bn": ["V = IR", "P = VI", "E = mc²", "F = ma"],
            "correct_answer": 0,
            "difficulty": "easy",
            "explanation": "Ohm's Law states that voltage (V) equals current (I) times resistance (R).",
            "explanation_bn": "ওহমের সূত্র বলে যে ভোল্টেজ (V) = কারেন্ট (I) × রোধ (R)।"
        }
    ]
    
    # Math questions for Grade 9 & 10
    math_questions = [
        # Grade 9 Math
        {
            "subject": "mathematics",
            "grade": 9,
            "topic": "Algebra",
            "question_text": "Solve for x: 2x + 5 = 13",
            "question_text_bn": "x এর মান নির্ণয় করো: 2x + 5 = 13",
            "options": ["x = 3", "x = 4", "x = 5", "x = 6"],
            "options_bn": ["x = ৩", "x = ৪", "x = ৫", "x = ৬"],
            "correct_answer": 1,
            "difficulty": "easy",
            "explanation": "2x + 5 = 13, so 2x = 8, therefore x = 4",
            "explanation_bn": "2x + 5 = 13, সুতরাং 2x = 8, অতএব x = 4"
        },
        {
            "subject": "mathematics",
            "grade": 9,
            "topic": "Geometry",
            "question_text": "What is the area of a triangle with base 6 cm and height 8 cm?",
            "question_text_bn": "৬ সেমি ভূমি এবং ৮ সেমি উচ্চতাবিশিষ্ট ত্রিভুজের ক্ষেত্রফল কত?",
            "options": ["24 cm²", "48 cm²", "14 cm²", "30 cm²"],
            "options_bn": ["২৪ বর্গ সেমি", "৪৮ বর্গ সেমি", "১ৄ বর্গ সেমি", "৩০ বর্গ সেমি"],
            "correct_answer": 0,
            "difficulty": "easy",
            "explanation": "Area of triangle = (1/2) × base × height = (1/2) × 6 × 8 = 24 cm²",
            "explanation_bn": "ত্রিভুজের ক্ষেত্রফল = (১/২) × ভূমি × উচ্চতা = (১/২) × ৬ × ৮ = ২৪ বর্গ সেমি"
        },
        # Grade 10 Math
        {
            "subject": "mathematics",
            "grade": 10,
            "topic": "Quadratic Equations",
            "question_text": "What are the roots of x² - 5x + 6 = 0?",
            "question_text_bn": "x² - 5x + 6 = 0 সমীকরণের মূল কত?",
            "options": ["x = 2, 3", "x = 1, 6", "x = -2, -3", "x = 0, 5"],
            "options_bn": ["x = ২, ৩", "x = ১, ৬", "x = -২, -৩", "x = ০, ৫"],
            "correct_answer": 0,
            "difficulty": "medium",
            "explanation": "Factoring: (x-2)(x-3) = 0, so x = 2 or x = 3",
            "explanation_bn": "উৎপাদকে বিশ্লেষণ: (x-2)(x-3) = 0, সুতরাং x = 2 অথবা x = 3"
        },
        {
            "subject": "mathematics",
            "grade": 10,
            "topic": "Trigonometry",
            "question_text": "What is sin(30°)?",
            "question_text_bn": "sin(30°) এর মান কত?",
            "options": ["1/2", "√3/2", "1", "√2/2"],
            "options_bn": ["১/২", "√৩/২", "১", "√২/২"],
            "correct_answer": 0,
            "difficulty": "easy",
            "explanation": "sin(30°) = 1/2",
            "explanation_bn": "sin(30°) = ১/২"
        }
    ]
    
    # Chemistry questions for Grade 9 & 10
    chemistry_questions = [
        # Grade 9 Chemistry
        {
            "subject": "chemistry",
            "grade": 9,
            "topic": "Atomic Structure",
            "question_text": "What is the atomic number of Carbon?",
            "question_text_bn": "কার্বনের পারমাণবিক সংখ্যা কত?",
            "options": ["4", "6", "8", "12"],
            "options_bn": ["৪", "৬", "৮", "১২"],
            "correct_answer": 1,
            "difficulty": "easy",
            "explanation": "Carbon has 6 protons, so its atomic number is 6",
            "explanation_bn": "কার্বনে ৬টি প্রোটন আছে, তাই এর পারমাণবিক সংখ্যা ৬"
        },
        {
            "subject": "chemistry",
            "grade": 9,
            "topic": "Periodic Table",
            "question_text": "Which element has the symbol 'Na'?",
            "question_text_bn": "'Na' প্রতীকটি কোন মৌলের?",
            "options": ["Nitrogen", "Sodium", "Nickel", "Neon"],
            "options_bn": ["নাইট্রোজেন", "সোডিয়াম", "নিকেল", "নিয়ন"],
            "correct_answer": 1,
            "difficulty": "easy",
            "explanation": "Na is the chemical symbol for Sodium (from Latin 'natrium')",
            "explanation_bn": "Na হল সোডিয়ামের রাসায়নিক প্রতীক (ল্যাটিন 'natrium' থেকে)"
        },
        # Grade 10 Chemistry
        {
            "subject": "chemistry",
            "grade": 10,
            "topic": "Acids and Bases",
            "question_text": "What is the pH of pure water at 25°C?",
            "question_text_bn": "২৫°সে তাপমাত্রায় বিশুদ্ধ পানির pH কত?",
            "options": ["6", "7", "8", "9"],
            "options_bn": ["৬", "৭", "৮", "৯"],
            "correct_answer": 1,
            "difficulty": "easy",
            "explanation": "Pure water has a pH of 7, which is neutral",
            "explanation_bn": "বিশুদ্ধ পানির pH ৭, যা নিরপেক্ষ"
        },
        {
            "subject": "chemistry",
            "grade": 10,
            "topic": "Chemical Bonding",
            "question_text": "What type of bond is formed between Na and Cl in NaCl?",
            "question_text_bn": "NaCl-এ Na এবং Cl এর মধ্যে কী ধরনের বন্ধন গঠিত হয়?",
            "options": ["Covalent bond", "Ionic bond", "Metallic bond", "Hydrogen bond"],
            "options_bn": ["সমযোজী বন্ধন", "আয়নিক বন্ধন", "ধাতব বন্ধন", "হাইড্রোজেন বন্ধন"],
            "correct_answer": 1,
            "difficulty": "medium",
            "explanation": "NaCl forms an ionic bond due to electron transfer from Na to Cl",
            "explanation_bn": "Na থেকে Cl-এ ইলেকট্রন স্থানান্তরের কারণে NaCl আয়নিক বন্ধন গঠন করে"
        }
    ]
    
    # Biology questions for Grade 9 & 10
    biology_questions = [
        # Grade 9 Biology
        {
            "subject": "biology",
            "grade": 9,
            "topic": "Cell Biology",
            "question_text": "What is the powerhouse of the cell?",
            "question_text_bn": "কোশের শক্তিঘর কোনটি?",
            "options": ["Nucleus", "Mitochondria", "Ribosome", "Chloroplast"],
            "options_bn": ["নিউক্লিয়াস", "মাইটোকন্ড্রিয়া", "রাইবোসোম", "ক্লোরোপ্লাস্ট"],
            "correct_answer": 1,
            "difficulty": "easy",
            "explanation": "Mitochondria produces ATP, the energy currency of the cell",
            "explanation_bn": "মাইটোকন্ড্রিয়া ATP তৈরি করে, যা কোশের শক্তির মুদ্রা"
        },
        {
            "subject": "biology",
            "grade": 9,
            "topic": "Photosynthesis",
            "question_text": "What gas is released during photosynthesis?",
            "question_text_bn": "সালোকসংশ্লেষণের সময় কোন গ্যাস নির্গত হয়?",
            "options": ["Carbon dioxide", "Oxygen", "Nitrogen", "Hydrogen"],
            "options_bn": ["কার্বন ডাইঅক্সাইড", "অক্সিজেন", "নাইট্রোজেন", "হাইড্রোজেন"],
            "correct_answer": 1,
            "difficulty": "easy",
            "explanation": "During photosynthesis, plants release oxygen as a byproduct",
            "explanation_bn": "সালোকসংশ্লেষণের সময় উদ্ভিদ উপজাত হিসেবে অক্সিজেন নির্গত করে"
        },
        # Grade 10 Biology
        {
            "subject": "biology",
            "grade": 10,
            "topic": "Genetics",
            "question_text": "What does DNA stand for?",
            "question_text_bn": "DNA এর পূর্ণরূপ কী?",
            "options": ["Deoxyribonucleic Acid", "Ribonucleic Acid", "Deoxyribose Acid", "Nucleic Acid"],
            "options_bn": ["ডিঅক্সিরাইবোনিউক্লিক অ্যাসিড", "রাইবোনিউক্লিক অ্যাসিড", "ডিঅক্সিরাইবোজ অ্যাসিড", "নিউক্লিক অ্যাসিড"],
            "correct_answer": 0,
            "difficulty": "easy",
            "explanation": "DNA stands for Deoxyribonucleic Acid",
            "explanation_bn": "DNA এর পূর্ণরূপ হল ডিঅক্সিরাইবোনিউক্লিক অ্যাসিড"
        },
        {
            "subject": "biology",
            "grade": 10,
            "topic": "Evolution",
            "question_text": "Who proposed the theory of evolution by natural selection?",
            "question_text_bn": "প্রাকৃতিক নির্বাচনের মাধ্যমে বিবর্তন তত্ত্ব কে প্রস্তাব করেছিলেন?",
            "options": ["Gregor Mendel", "Charles Darwin", "Louis Pasteur", "Alexander Fleming"],
            "options_bn": ["গ্রেগর মেন্ডেল", "চার্লস ডারউইন", "লুই পাস্তুর", "আলেকজান্ডার ফ্লেমিং"],
            "correct_answer": 1,
            "difficulty": "easy",
            "explanation": "Charles Darwin proposed the theory of evolution by natural selection",
            "explanation_bn": "চার্লস ডারউইন প্রাকৃতিক নির্বাচনের মাধ্যমে বিবর্তন তত্ত্ব প্রস্তাব করেছিলেন"
        }
    ]
    
    all_questions = physics_questions + math_questions + chemistry_questions + biology_questions
    created_questions = []
    
    for q_data in all_questions:
        # Check if question already exists
        existing_q = db.query(Question).filter(
            Question.question_text == q_data["question_text"]
        ).first()
        if existing_q:
            print(f"Question already exists: {q_data['question_text'][:50]}...")
            created_questions.append(existing_q)
            continue
            
        question = Question(
            subject=q_data["subject"],
            grade=q_data["grade"],
            topic=q_data["topic"],
            question_text=q_data["question_text"],
            question_text_bangla=q_data["question_text_bn"],
            option_a=q_data["options"][0],
            option_b=q_data["options"][1],
            option_c=q_data["options"][2],
            option_d=q_data["options"][3],
            option_a_bangla=q_data["options_bn"][0],
            option_b_bangla=q_data["options_bn"][1],
            option_c_bangla=q_data["options_bn"][2],
            option_d_bangla=q_data["options_bn"][3],
            correct_answer=["A", "B", "C", "D"][q_data["correct_answer"]],
            difficulty_level={"easy": 1, "medium": 3, "hard": 5}[q_data["difficulty"]],
            bloom_level=2,  # Default to comprehension level
            explanation=q_data["explanation"],
            explanation_bangla=q_data["explanation_bn"],
            is_active=True,
            created_at=datetime.utcnow()
        )
        db.add(question)
        created_questions.append(question)
        print(f"Created question: {question.subject} - {question.question_text[:50]}...")
    
    db.commit()
    return created_questions

def create_sample_gamification(db: Session, users):
    """Create sample gamification data for students"""
    print("Creating sample gamification data...")
    
    students = [u for u in users if u.role == UserRole.STUDENT]
    
    for student in students:
        # Check if gamification already exists
        existing_gamification = db.query(Gamification).filter(
            Gamification.user_id == student.id
        ).first()
        if existing_gamification:
            print(f"Gamification already exists for {student.full_name}")
            continue
            
        # Create gamification data
        gamification = Gamification(
            user_id=student.id,
            total_xp=150 + (hash(str(student.id)) % 500),  # Vary XP by student
            current_level=2 if hash(str(student.id)) % 2 == 0 else 1,
            current_streak=5 + (hash(str(student.id)) % 3),
            longest_streak=10 + (hash(str(student.id)) % 5),
            achievements=["first_quiz", "week_warrior"] if hash(str(student.id)) % 2 == 0 else ["first_quiz"],
            last_activity_date=datetime.utcnow().date(),
            streak_freeze_count=0
        )
        db.add(gamification)
        print(f"Created gamification for {student.full_name}")
    
    db.commit()

def create_sample_progress(db: Session, users, questions):
    """Create sample progress data for students"""
    print("Creating sample progress data...")
    
    students = [u for u in users if u.role == UserRole.STUDENT]
    
    for student in students:
        # Create progress for different subjects and topics
        subjects_topics = [
            ("physics", "Force and Motion"),
            ("mathematics", "Algebra"),
            ("mathematics", "Geometry"),
            ("chemistry", "Atomic Structure"),
            ("biology", "Cell Biology")
        ]
        
        for subject, topic in subjects_topics:
            # Check if progress already exists
            existing_progress = db.query(StudentProgress).filter(
                StudentProgress.user_id == student.id,
                StudentProgress.subject == subject,
                StudentProgress.topic == topic
            ).first()
            if existing_progress:
                continue
                
            # Create student progress
            progress = StudentProgress(
                user_id=student.id,
                subject=subject,
                topic=topic,
                bloom_level=2,  # Comprehension level
                completion_percentage=50.0 + (hash(str(student.id) + subject) % 40),  # 50-90%
                time_spent_minutes=60 + (hash(str(student.id) + topic) % 120),  # 60-180 minutes
                last_accessed=datetime.utcnow() - timedelta(hours=hash(str(student.id)) % 48),
                mastery_level=MasteryLevel.INTERMEDIATE if hash(str(student.id) + subject) % 2 else MasteryLevel.BEGINNER
            )
            db.add(progress)
        
        print(f"Created progress for {student.full_name}")
    
    db.commit()

def main():
    """Main function to create all sample data"""
    print("🚀 Creating sample data for ShikkhaSathi...")
    
    db = SessionLocal()
    try:
        # Create sample data
        users = create_sample_users(db)
        questions = create_sample_questions(db)
        create_sample_gamification(db, users)
        create_sample_progress(db, users, questions)
        
        print("\n✅ Sample data creation completed!")
        print(f"Created {len(users)} users")
        print(f"Created {len(questions)} questions")
        print("\n🎯 You can now test the platform with these accounts:")
        print("Students (Grade 9 & 10):")
        print("  - student1@shikkhasathi.com / student123 (Grade 9)")
        print("  - student2@shikkhasathi.com / student123 (Grade 10)") 
        print("  - student3@shikkhasathi.com / student123 (Grade 9)")
        print("  - student4@shikkhasathi.com / student123 (Grade 10)")
        print("  - student5@shikkhasathi.com / student123 (Grade 10)")
        print("Teachers:")
        print("  - teacher1@shikkhasathi.com / teacher123")
        print("  - teacher2@shikkhasathi.com / teacher123")
        print("Parents:")
        print("  - parent1@shikkhasathi.com / parent123")
        print("  - parent2@shikkhasathi.com / parent123")
        
    except Exception as e:
        print(f"❌ Error creating sample data: {e}")
        db.rollback()
        raise
    finally:
        db.close()

if __name__ == "__main__":
    main()