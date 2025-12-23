# 👨‍👩‍👧‍👦 How to Add Students/Children to Your Dashboard

This guide explains how teachers and parents can add students/children to their ShikkhaSathi dashboards.

---

## 🧑‍🏫 **For Teachers: Adding Students to Classes**

### **Method 1: Add Individual Student**
1. **Go to Teacher Dashboard** → **Class Management**
2. **Select your class** → Click **"Add Students"** button
3. **Choose "Add Individual" tab**
4. **Fill in student details**:
   - Student Name (required)
   - Email Address (required)
   - Student ID (optional)
   - Grade (required)
   - Parent Email (optional)
   - Parent Phone (optional)
   - Notes (optional)
5. **Click "Add Student"**

### **Method 2: Enroll Existing Students**
1. **Go to Teacher Dashboard** → **Class Management**
2. **Select your class** → Click **"Add Students"** button
3. **Choose "Enroll Existing" tab**
4. **Search for students** by name or email
5. **Click "Enroll"** next to the student you want to add

### **Method 3: Bulk Upload (CSV)**
1. **Go to Teacher Dashboard** → **Class Management**
2. **Select your class** → Click **"Add Students"** button
3. **Choose "Bulk Upload" tab**
4. **Download CSV template** (includes sample format)
5. **Fill in your student data** in the CSV file
6. **Upload the CSV file**
7. **Review results** (successful/failed additions)

**CSV Format:**
```csv
name,email,student_id,grade,parent_email,parent_phone,notes
John Doe,john@example.com,STU001,9,parent@example.com,+1234567890,Good student
Jane Smith,jane@example.com,STU002,9,jane.parent@example.com,+1234567891,Needs extra help
```

---

## 👨‍👩‍👧‍👦 **For Parents: Adding Children to Dashboard**

### **Method 1: Invite by Email (Recommended)**
1. **Go to Parent Dashboard** → Click **"Add Child"** button
2. **Choose "Invite by Email" tab**
3. **Fill in details**:
   - Child's Email Address (required)
   - Child's Name (optional)
   - Relationship (Guardian, Mother, Father, etc.)
4. **Click "Send Invitation"**
5. **Your child will receive an email** with invitation link
6. **Child must accept invitation** to complete linking

### **Method 2: Search & Link Directly**
1. **Go to Parent Dashboard** → Click **"Add Child"** button
2. **Choose "Search & Link" tab**
3. **Enter child's email** in search box
4. **Click "Search"** to find matching students
5. **Click "Link Child"** next to your child's name
6. **Relationship will be established immediately**

---

## 📧 **For Students: Accepting Parent Invitations**

When a parent sends you an invitation:

1. **Check your email** for invitation from ShikkhaSathi
2. **Click the invitation link** in the email
3. **Log in to your ShikkhaSathi account**
4. **Review the parent's information**
5. **Click "Accept Invitation"** to link accounts
6. **Confirmation will be sent** to both you and your parent

---

## 🔧 **API Endpoints (For Developers)**

### **Teacher Endpoints:**
```
POST /api/v1/classroom/classes/{class_id}/students
POST /api/v1/classroom/classes/{class_id}/enroll
POST /api/v1/classroom/classes/{class_id}/bulk-upload
GET  /api/v1/users/search?q={query}&role=student
```

### **Parent Endpoints:**
```
POST /api/v1/parent-child/invite-child
POST /api/v1/parent-child/link-child
GET  /api/v1/parent-child/my-children
GET  /api/v1/parent-child/pending-invitations
GET  /api/v1/parent-child/search-students?email={email}
DELETE /api/v1/parent-child/children/{child_id}
```

### **Student Endpoints:**
```
POST /api/v1/parent-child/accept-invitation
```

---

## 🛡️ **Security & Privacy**

### **For Teachers:**
- ✅ Can only add students to their own classes
- ✅ Can view student progress within their classes
- ❌ Cannot access students from other teachers' classes

### **For Parents:**
- ✅ Can only view their own children's progress
- ✅ Email verification required for invitations
- ✅ Children must accept invitations (consent required)
- ❌ Cannot access other parents' children

### **For Students:**
- ✅ Must accept parent invitations (cannot be forced)
- ✅ Can see which parents are linked to their account
- ✅ Can view their own progress and achievements
- ❌ Cannot see other students' detailed progress

---

## 🚨 **Troubleshooting**

### **Common Issues:**

**"Student already enrolled in class"**
- The student is already in your class
- Check your class roster to confirm

**"Child is already linked to this parent"**
- The parent-child relationship already exists
- Check your children list in the dashboard

**"Invalid or expired invitation"**
- Invitation links expire after 7 days
- Send a new invitation if needed

**"Student not found"**
- The student may not have an account yet
- Use "Add Individual" to create a new student account

**"Email not found"**
- Check the email address for typos
- The student may be using a different email

### **Need Help?**
- Contact your school administrator
- Check the user manual for detailed instructions
- Email support for technical issues

---

## 📊 **Current Implementation Status**

### ✅ **Fully Implemented:**
- Teacher: Add individual students ✅
- Teacher: Bulk upload via CSV ✅
- Parent: Invite children by email ✅
- Parent: Search and link children ✅
- Student: Accept parent invitations ✅

### 🚧 **Partially Implemented:**
- Teacher: Enroll existing students (needs user search API)
- Email notifications (currently mock/console output)

### 📋 **Database Requirements:**
- Parent-child relationship table ✅ Created
- Student-class enrollment table ✅ Exists
- Invitation tracking table ✅ Created

---

## 🎯 **Next Steps**

1. **Run database migrations** to create new tables
2. **Test the functionality** with sample data
3. **Configure email service** for real invitations
4. **Add user search API** for teacher enrollment
5. **Implement notification system** for real-time updates

The system is now ready for teachers and parents to add students/children to their dashboards! 🎉