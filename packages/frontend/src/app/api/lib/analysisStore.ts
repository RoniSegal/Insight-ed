/**
 * In-Memory Analysis Results Store for 3-Day MVP Demo
 *
 * IMPORTANT: This is a temporary implementation for demo purposes.
 * Data is stored in memory and will be lost on server restart.
 *
 * Production version should use a proper database.
 */

export interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface AnalysisResult {
  id: string;
  studentId: string;
  analysis: string; // Hebrew markdown analysis from OpenAI
  conversationHistory?: Message[]; // Optional chat history
  createdAt: string;
  createdBy: string; // teacher user ID
}

class AnalysisStore {
  private analyses: Map<string, AnalysisResult> = new Map();
  private nextId: number = 1;
  // Index for faster lookup by studentId
  private byStudent: Map<string, string[]> = new Map();

  /**
   * Create a new analysis result
   */
  create(data: Omit<AnalysisResult, 'id' | 'createdAt'>): AnalysisResult {
    const id = String(this.nextId++);
    const analysis: AnalysisResult = {
      id,
      ...data,
      createdAt: new Date().toISOString(),
    };

    this.analyses.set(id, analysis);

    // Update student index
    const studentAnalyses = this.byStudent.get(data.studentId) || [];
    studentAnalyses.push(id);
    this.byStudent.set(data.studentId, studentAnalyses);

    return analysis;
  }

  /**
   * Get all analyses (optionally filtered by studentId)
   */
  getAll(studentId?: string): AnalysisResult[] {
    if (studentId) {
      const analysisIds = this.byStudent.get(studentId) || [];
      return analysisIds
        .map((id) => this.analyses.get(id))
        .filter((a): a is AnalysisResult => a !== undefined)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    return Array.from(this.analyses.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  /**
   * Get analysis by ID
   */
  getById(id: string): AnalysisResult | undefined {
    return this.analyses.get(id);
  }

  /**
   * Get all analyses for a specific student
   */
  getByStudentId(studentId: string): AnalysisResult[] {
    return this.getAll(studentId);
  }

  /**
   * Get the latest analysis for a specific student
   */
  getLatestByStudentId(studentId: string): AnalysisResult | undefined {
    const studentAnalyses = this.getByStudentId(studentId);
    return studentAnalyses[0]; // Already sorted by date descending
  }

  /**
   * Delete analysis by ID
   */
  delete(id: string): boolean {
    const analysis = this.analyses.get(id);
    if (!analysis) {
      return false;
    }

    // Remove from main store
    this.analyses.delete(id);

    // Remove from student index
    const studentAnalyses = this.byStudent.get(analysis.studentId) || [];
    const updatedAnalyses = studentAnalyses.filter((aid) => aid !== id);
    if (updatedAnalyses.length > 0) {
      this.byStudent.set(analysis.studentId, updatedAnalyses);
    } else {
      this.byStudent.delete(analysis.studentId);
    }

    return true;
  }

  /**
   * Seed store with demo data
   * Only runs if store is empty
   */
  seed() {
    if (this.analyses.size === 0) {
      // Demo analysis for student '1' (Sarah Cohen)
      this.create({
        studentId: '1',
        analysis: `# ניתוח תלמידה: שרה כהן

## נקודות חוזק

- **כישורים חברתיים מצוינים**: שרה מפגינה יכולת יוצאת דופן ליצור קשרים עם חבריה לכיתה
- **מוטיבציה גבוהה**: מגלה עניין רב בלמידה ושואפת להצטיין
- **יצירתיות**: מביאה רעיונות מקוריים ופתרונות יצירתיים לבעיות

## תחומים לשיפור

- **קושי בריכוז**: מתקשה להישאר ממוקדת במשימות ארוכות טווח
- **ארגון**: צריכה סיוע בארגון החומרים והמטלות
- **מתמטיקה**: זקוקה לתמיכה נוספת בפתרון בעיות מילוליות

## המלצות להתערבות

1. **ליווי אישי בשיעורי מתמטיקה**: מפגשי העשרה קצרים פעמיים בשבוע
2. **כלי ארגון**: הכנסת מחברת מעקב ומערכת צבעים לסימון משימות
3. **הפסקות מתוזמנות**: אפשרות להפסקות קצרות במהלך משימות ארוכות
4. **חיזוק חיובי**: הכרה והערכה של ההתקדמות והמאמץ

## צעדים הבאים

- [ ] פגישה עם ההורים לתיאום תכנית התערבות
- [ ] תיאום מפגשי העשרה במתמטיקה
- [ ] מעקב שבועי אחר התקדמות
- [ ] הערכה מחדש בעוד חודש`,
        createdBy: '1',
        conversationHistory: [
          { role: 'assistant', content: 'שלום! בוא נדבר על שרה. מה אתה יכול לספר לי עליה?' },
          { role: 'user', content: 'שרה היא תלמידה מקסימה עם כישורים חברתיים מעולים' },
          { role: 'assistant', content: 'נהדר! מה לגבי הלמידה? באילו תחומים היא מצטיינת?' },
          { role: 'user', content: 'היא מאוד יצירתית ומוטיבציה, אבל יש לה קושי בריכוז ובמתמטיקה' },
        ],
      });

      // Demo analysis for student '2' (Michael David)
      this.create({
        studentId: '2',
        analysis: `# ניתוח תלמיד: מיכאל דוד

## נקודות חוזק

- **מתמטיקה מצוינת**: מפגין הבנה מעמיקה של מושגים מתמטיים
- **עצמאות**: מסוגל לעבוד באופן עצמאי ולפתור בעיות לבד
- **אחריות**: אחראי ומסודר, מגיש מטלות בזמן

## תחומים לשיפור

- **ביטחון עצמי**: נוטה להטיל ספק ביכולותיו למרות הצלחותיו
- **עבודה בצוות**: מתקשה לפעמים לעבוד עם אחרים
- **ביטוי בכתב**: צריך חיזוק בכתיבה יצירתית והבעה עצמית

## המלצות להתערבות

1. **תגבור חיובי**: הדגשת הצלחות והישגים לחיזוק הביטחון
2. **פעילויות קבוצתיות**: שילוב מתוכנן בעבודות צוות קטנות
3. **סדנאות כתיבה**: השתתפות בחוג כתיבה יצירתית
4. **תפקידי מנהיגות**: הזדמנויות להוביל פרויקטים קטנים

## צעדים הבאים

- [ ] שיחה אישית לחיזוק הביטחון העצמי
- [ ] שיבוץ בקבוצת לימוד מתאימה
- [ ] רישום לחוג כתיבה
- [ ] מעקב חודשי אחר התקדמות`,
        createdBy: '1',
      });
    }
  }
}

// Declare global type for Next.js to ensure singleton across route segments
declare global {
  var __analysisStore: AnalysisStore | undefined;
}

// Use globalThis to ensure a true singleton across all Next.js routes
// This prevents the issue where different route segments get different instances
const analysisStore = globalThis.__analysisStore ?? new AnalysisStore();
globalThis.__analysisStore = analysisStore;

// Export singleton instance
export { analysisStore };

// Seed with demo data on first import
analysisStore.seed();
