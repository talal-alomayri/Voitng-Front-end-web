// الرابط الأساسي للـ API (يتم جلب الرابط من ملف البيئة .env أو استخدام الرابط الافتراضي)
const API_URL = import.meta.env.VITE_API_URL || "https://px9092uxr2.execute-api.us-east-1.amazonaws.com/dev";

// --- الواجهات (Interfaces) لتعريف شكل البيانات المستخدمة في التطبيق ---

// تعريف خيار التصويت الواحد
export interface PollOption {
  id: string;        // معرف الخيار الفريد
  text: string;      // نص الخيار
  votesCount: number; // عدد الأصوات التي حصل عليها الخيار
}

// تعريف بيانات الاستطلاع بالكامل
export interface Poll {
  id: string;             // معرف الاستطلاع الفريد
  question: string;       // سؤال الاستطلاع
  options: PollOption[];  // قائمة الخيارات المتاحة
  totalVotes: number;     // إجمالي عدد الأصوات في الاستطلاع
  createdAt: string;      // تاريخ إنشاء الاستطلاع
}

// تعريف البيانات المطلوبة عند إنشاء استطلاع جديد (DTO)
export interface CreatePollDto {
  question: string;  // سؤال الاستطلاع الجديد
  options: string[]; // نرسل نصوص الخيارات فقط كمصفوفة نصوص
}

// --- دوال الاتصال بالخادم (API Functions) للتفاعل مع الـ Backend ---

// 1. جلب قائمة بجميع الاستطلاعات (تُستخدم في صفحة عرض الاستطلاعات)
export const listPolls = async (): Promise<Poll[]> => {
  const response = await fetch(`${API_URL}/poll`);

  if (!response.ok) {
    throw new Error(`Failed to fetch polls: ${response.statusText}`);
  }

  return response.json();
};

// 2. جلب تفاصيل استطلاع واحد محدد باستخدام المعرف (ID)
export const getPoll = async (id: string): Promise<Poll> => {
  const response = await fetch(`${API_URL}/poll/${id}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch poll: ${response.statusText}`);
  }

  return response.json();
};

// 3. دالة لإنشاء استطلاع جديد وإرساله للخادم
export const createPoll = async (data: CreatePollDto): Promise<Poll> => {
  const response = await fetch(`${API_URL}/poll`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data), // تحويل البيانات إلى نص JSON
  });

  if (!response.ok) {
    throw new Error(`Failed to create poll: ${response.statusText}`);
  }

  return response.json();
};

// 4. دالة لتسجيل تصويت المستخدم على خيار معين داخل استطلاع محدد
export const submitVote = async (pollId: string, optionId: string): Promise<Poll> => {
  const response = await fetch(`${API_URL}/poll/${pollId}/vote`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ optionId }), // إرسال معرف الخيار المختار
  });

  if (!response.ok) {
    throw new Error(`Failed to submit vote: ${response.statusText}`);
  }

  // إرجاع بيانات الاستطلاع المحدثة بعد إضافة الصوت الجديد
  return response.json();
};

// 5. دالة لإرسال نتائج الاستطلاع النهائية (عبر البريد الإلكتروني أو ClickUp)
export const sendPollResults = async (pollId: string): Promise<void> => {
  const response = await fetch(`${API_URL}/poll/${pollId}/send-results`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to send results: ${response.statusText}`);
  }
  
  // هذه الدالة لا تعيد بيانات، فقط نتأكد من نجاح الطلب
};