'use client';

import type { Student } from '@growth-engine/shared';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

import { LogoutButton } from '@/components/auth/LogoutButton';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { LoadingContent } from '@/components/ui/Spinner';
import { ApiClient } from '@/lib/api-client';
import { useAuthStore } from '@/lib/auth/auth-store';


export default function StudentsPage() {
  return (
    <ProtectedRoute>
      <StudentsPageContent />
    </ProtectedRoute>
  );
}

function StudentsPageContent() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const studentsPerPage = 9;

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    // Filter students based on search query
    if (searchQuery.trim() === '') {
      setFilteredStudents(students);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = students.filter(
        (student) =>
          student.name.toLowerCase().includes(query) ||
          student.grade.toLowerCase().includes(query) ||
          (student.class && student.class.toLowerCase().includes(query))
      );
      setFilteredStudents(filtered);
      setCurrentPage(1); // Reset to first page when searching
    }
  }, [searchQuery, students]);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      setError(null);
      const response: any = await ApiClient.get('/students');

      // Handle both data structure possibilities
      const studentData = response.data || response.students || response || [];
      setStudents(studentData);
      setFilteredStudents(studentData);
    } catch (err: any) {
      setError(err.message || 'Failed to load students');
    } finally {
      setLoading(false);
    }
  };

  const handleStudentAdded = () => {
    setShowAddForm(false);
    fetchStudents();
  };

  const handleDelete = async (id: string, studentName: string) => {
    if (!confirm(`האם למחוק את ${studentName}?`)) return;

    try {
      await ApiClient.delete(`/students/${id}`);
      fetchStudents();
    } catch (err: any) {
      alert(`שגיאה במחיקת תלמיד: ${err.message}`);
    }
  };

  // Pagination calculations
  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const currentStudents = filteredStudents.slice(indexOfFirstStudent, indexOfLastStudent);
  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="min-h-screen bg-neutral-50" dir="rtl">
      {/* Header */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-primary-700">
                מנוע צמיחה
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-neutral-700">
                {user?.firstName} {user?.lastName}
              </span>
              <LogoutButton />
            </div>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page title and actions */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h2 className="text-3xl font-bold text-neutral-900">התלמידים שלי</h2>
              <p className="text-neutral-600 mt-1">
                נהל את התלמידים שלך והתחל ניתוח למידה
              </p>
            </div>
            <Button
              variant="primary"
              size="lg"
              onClick={() => setShowAddForm(!showAddForm)}
            >
              {showAddForm ? 'ביטול' : '+ הוסף תלמיד'}
            </Button>
          </div>

          {/* Search bar */}
          <div className="max-w-md">
            <Input
              type="text"
              placeholder="חפש לפי שם, כיתה או כיתה..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={
                <svg
                  className="h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
                    clipRule="evenodd"
                  />
                </svg>
              }
            />
          </div>
        </div>

        {/* Add student form */}
        {showAddForm && (
          <div className="mb-8">
            <AddStudentForm onSuccess={handleStudentAdded} />
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="mb-6 animate-fadeIn">
            <Alert
              variant="error"
              dismissible
              onDismiss={() => setError(null)}
              title="שגיאה בטעינת נתונים"
            >
              {error}
            </Alert>
          </div>
        )}

        {/* Loading state */}
        {loading && <LoadingContent message="טוען תלמידים..." />}

        {/* Empty state - no students */}
        {!loading && !error && students.length === 0 && (
          <Card variant="bordered" padding="spacious">
            <div className="text-center py-12">
              <svg
                className="mx-auto h-12 w-12 text-neutral-400"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
              <h3 className="mt-4 text-lg font-medium text-neutral-900">
                אין תלמידים עדיין
              </h3>
              <p className="mt-2 text-neutral-500">
                התחל על ידי הוספת התלמיד הראשון שלך
              </p>
              <div className="mt-6">
                <Button variant="primary" onClick={() => setShowAddForm(true)}>
                  הוסף תלמיד ראשון
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Empty state - no search results */}
        {!loading && !error && students.length > 0 && filteredStudents.length === 0 && (
          <Card variant="bordered" padding="spacious">
            <div className="text-center py-12">
              <p className="text-neutral-600">
                לא נמצאו תלמידים התואמים את החיפוש "{searchQuery}"
              </p>
              <Button
                variant="ghost"
                onClick={() => setSearchQuery('')}
                className="mt-4"
              >
                נקה חיפוש
              </Button>
            </div>
          </Card>
        )}

        {/* Students grid */}
        {!loading && !error && currentStudents.length > 0 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentStudents.map((student) => (
                <StudentCard
                  key={student.id}
                  student={student}
                  onDelete={handleDelete}
                  onAnalyze={(id) => router.push(`/students/${id}/chat`)}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex justify-center items-center gap-3">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  הקודם
                </Button>

                <div className="flex gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`min-w-[40px] px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
                        currentPage === pageNum
                          ? 'bg-primary-600 text-white shadow-sm hover:bg-primary-700'
                          : 'bg-white text-neutral-700 hover:bg-neutral-100 hover:shadow-sm border-2 border-neutral-300'
                      }`}
                      aria-label={`עמוד ${pageNum}`}
                      aria-current={currentPage === pageNum ? 'page' : undefined}
                    >
                      {pageNum}
                    </button>
                  ))}
                </div>

                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  הבא
                </Button>
              </div>
            )}

            {/* Results summary */}
            <div className="mt-4 text-center text-sm text-neutral-600">
              מציג {indexOfFirstStudent + 1}-{Math.min(indexOfLastStudent, filteredStudents.length)} מתוך{' '}
              {filteredStudents.length} תלמידים
            </div>
          </>
        )}
      </main>
    </div>
  );
}

interface StudentCardProps {
  student: Student;
  onDelete: (id: string, name: string) => void;
  onAnalyze: (id: string) => void;
}

function StudentCard({ student, onDelete, onAnalyze }: StudentCardProps) {
  return (
    <Card variant="insight" padding="default" className="transition-all duration-200 hover:shadow-lg hover:scale-[1.02]">
      <CardHeader>
        <div className="flex items-start justify-between w-full gap-4">
          <div className="flex-1 min-w-0">
            <h3 className="text-xl font-semibold text-neutral-900 truncate">{student.name}</h3>
            <div className="mt-3 space-y-2">
              <p className="text-sm text-neutral-600">
                <span className="font-medium">כיתה:</span> {student.grade}
              </p>
              {student.class && (
                <p className="text-sm text-neutral-600">
                  <span className="font-medium">כיתה:</span> {student.class}
                </p>
              )}
            </div>
          </div>

          {/* Delete button */}
          <button
            onClick={() => onDelete(student.id, student.name)}
            className="flex-shrink-0 text-neutral-400 hover:text-error-600 hover:bg-error-50 transition-all p-2 rounded-lg"
            aria-label="מחק תלמיד"
          >
            <svg
              className="h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </CardHeader>

      <CardContent>
        <div className="mt-6">
          <Button
            variant="primary"
            fullWidth
            onClick={() => onAnalyze(student.id)}
            leftIcon={
              <svg
                className="h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M10 12.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" />
                <path
                  fillRule="evenodd"
                  d="M.664 10.59a1.651 1.651 0 010-1.186A10.004 10.004 0 0110 3c4.257 0 7.893 2.66 9.336 6.41.147.381.146.804 0 1.186A10.004 10.004 0 0110 17c-4.257 0-7.893-2.66-9.336-6.41zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                  clipRule="evenodd"
                />
              </svg>
            }
          >
            התחל ניתוח
          </Button>
        </div>

        {/* Additional metadata */}
        <div className="mt-4 pt-4 border-t border-neutral-200">
          <p className="text-xs text-neutral-500">
            נוצר ב-{new Date(student.createdAt).toLocaleDateString('he-IL')}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

interface AddStudentFormProps {
  onSuccess: () => void;
}

function AddStudentForm({ onSuccess }: AddStudentFormProps) {
  const [name, setName] = useState('');
  const [grade, setGrade] = useState('');
  const [className, setClassName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await ApiClient.post('/students', {
        name: name.trim(),
        grade: grade.trim(),
        class: className.trim() || undefined,
      });

      // Reset form
      setName('');
      setGrade('');
      setClassName('');
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'שגיאה ביצירת תלמיד');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card variant="elevated" padding="default">
      <form onSubmit={handleSubmit}>
        <CardHeader title="הוסף תלמיד חדש" description="מלא את הפרטים הבאים כדי להוסיף תלמיד" />

        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="שם מלא"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="למשל: שרה כהן"
              disabled={loading}
            />

            <Input
              label="שנתון"
              type="text"
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              required
              placeholder="למשל: כיתה ג׳"
              disabled={loading}
            />

            <Input
              label="כיתה (אופציונלי)"
              type="text"
              value={className}
              onChange={(e) => setClassName(e.target.value)}
              placeholder="למשל: גב׳ לוי"
              disabled={loading}
            />
          </div>

          {error && (
            <div className="mt-6 animate-fadeIn">
              <Alert
                variant="error"
                dismissible
                onDismiss={() => setError(null)}
                title="שגיאה בהוספת תלמיד"
              >
                {error}
              </Alert>
            </div>
          )}

          <div className="mt-8 flex gap-3">
            <Button
              type="submit"
              variant="primary"
              loading={loading}
              disabled={loading}
              fullWidth
            >
              {loading ? 'מוסיף...' : 'הוסף תלמיד'}
            </Button>
          </div>
        </CardContent>
      </form>
    </Card>
  );
}
