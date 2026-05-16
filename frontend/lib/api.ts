import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export interface LeadFormData {
  name: string;
  email: string;
  companyName: string;
  websiteUrl: string;
  industry: string;
  additionalNotes?: string;
  aiProvider: 'gemini' | 'groq';
}

export interface WorkflowStatus {
  step: string;
  status: 'pending' | 'in-progress' | 'completed' | 'failed';
  message: string;
  timestamp: string;
}

export const submitLead = async (data: LeadFormData) => {
  const response = await axios.post(`${API_URL}/api/leads/submit`, data);
  return response.data;
};

export const submitLeadWithStatus = async (
  data: LeadFormData,
  onStatus: (status: WorkflowStatus) => void
): Promise<void> => {
  return new Promise((resolve, reject) => {
    const eventSource = new EventSource(
      `${API_URL}/api/leads/submit-with-status?${new URLSearchParams(data as any)}`
    );

    // For POST with SSE, we need to use fetch with EventSource polyfill
    // or handle it differently. Let's use a simpler approach:
    
    fetch(`${API_URL}/api/leads/submit-with-status`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    }).then(async (response) => {
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        reject(new Error('No response body'));
        return;
      }

      while (true) {
        const { done, value } = await reader.read();
        
        if (done) {
          resolve();
          break;
        }

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              onStatus(data);
              
              if (data.step === 'completed' || data.step === 'error') {
                resolve();
                return;
              }
            } catch (e) {
              console.error('Failed to parse SSE data', e);
            }
          }
        }
      }
    }).catch(reject);
  });
};

export const checkHealth = async () => {
  const response = await axios.get(`${API_URL}/health`);
  return response.data;
};
