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
    fetch(`${API_URL}/api/leads/submit-with-status`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    }).then(async (response) => {
      if (!response.ok) {
        let message = 'Unable to start workflow';

        try {
          const errorPayload = await response.json();
          message = errorPayload?.message || message;
        } catch {
          const text = await response.text();
          if (text) {
            message = text;
          }
        }

        reject(new Error(message));
        return;
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        reject(new Error('No response body'));
        return;
      }

      let buffer = '';

      const flushBuffer = () => {
        const events = buffer.split('\n\n');
        buffer = events.pop() || '';

        for (const event of events) {
          const line = event
            .split('\n')
            .find((entry) => entry.startsWith('data: '));

          if (!line) {
            continue;
          }

          try {
            const parsed = JSON.parse(line.slice(6));
            onStatus(parsed);

            if (parsed.step === 'completed' || parsed.step === 'error') {
              resolve();
              return true;
            }
          } catch (error) {
            console.error('Failed to parse SSE data', error);
          }
        }

        return false;
      };

      while (true) {
        const { done, value } = await reader.read();
        
        if (done) {
          if (buffer.trim()) {
            const line = buffer
              .split('\n')
              .find((entry) => entry.startsWith('data: '));

            if (line) {
              try {
                const parsed = JSON.parse(line.slice(6));
                onStatus(parsed);
              } catch (error) {
                console.error('Failed to parse SSE data', error);
              }
            }
          }

          resolve();
          break;
        }

        buffer += decoder.decode(value, { stream: true });

        if (flushBuffer()) {
          return;
        }
      }
    }).catch(reject);
  });
};

export const checkHealth = async () => {
  const response = await axios.get(`${API_URL}/health`);
  return response.data;
};
