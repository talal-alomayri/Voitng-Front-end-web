const API_URL = import.meta.env.VITE_API_URL || "https://px9092uxr2.execute-api.us-east-1.amazonaws.com/dev";

// --- الواجهات (Interfaces) ---

export interface PollOption {
  id: string;
  text: string;
  votesCount: number;
}

export interface Poll {
  id: string;
  question: string;
  options: PollOption[];
  totalVotes: number;
  createdAt: string;
}

export interface CreatePollDto {
  question: string;
  options: string[]; // نرسل نصوص الخيارات فقط عند الإنشاء
}

// --- دوال الاتصال بالخادم (API Functions) ---

// 1. جلب قائمة الاستطلاعات (لصفحة المضيف)
export const listPolls = async (): Promise<Poll[]> => {
  const response = await fetch(`${API_URL}/poll`);

  if (!response.ok) {
    throw new Error(`Failed to fetch polls: ${response.statusText}`);
  }

  return response.json();
};

// 2. جلب تفاصيل استطلاع واحد (لصفحة التصويت / النتائج)
export const getPoll = async (id: string): Promise<Poll> => {
  const response = await fetch(`${API_URL}/poll/${id}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch poll: ${response.statusText}`);
  }

  return response.json();
};

// 3. إنشاء استطلاع جديد
export const createPoll = async (data: CreatePollDto): Promise<Poll> => {
  const response = await fetch(`${API_URL}/poll`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`Failed to create poll: ${response.statusText}`);
  }

  return response.json();
};

// 4. إرسال تصويت على خيار معين
export const submitVote = async (pollId: string, optionId: string): Promise<Poll> => {
  const response = await fetch(`${API_URL}/poll/${pollId}/vote`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ optionId }), // نرسل الـ ID الخاص بالخيار الذي تم اختياره
  });

  if (!response.ok) {
    throw new Error(`Failed to submit vote: ${response.statusText}`);
  }

  // نفترض أن الـ Backend سيعيد الاستطلاع محدثاً بالنتائج الجديدة
  return response.json();
};

// 5. إرسال النتائج (Integration - Email أو ClickUp)
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
  
  // لا نحتاج لإرجاع بيانات هنا، فقط التأكد من نجاح العملية (Status 200)
};