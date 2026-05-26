import { create } from 'zustand';

export interface IQuestion {
  id: string;
  text: string;
  difficulty: 'easy' | 'medium' | 'hard';
  marks: number;
  options?: string[];
}

export interface ISection {
  id: string;
  title: string;
  instruction: string;
  questions: IQuestion[];
}

export interface IAssignment {
  id: string;
  title: string;
  dueDate: string;
  questionTypes: string[];
  numQuestions: number;
  totalMarks: number;
  instructions: string;
  fileAttached?: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  error?: string;
  sections?: ISection[];
  createdAt: string;
}

interface AssignmentState {
  assignments: IAssignment[];
  loading: boolean;
  error: string | null;
  activeAssignment: IAssignment | null;
  socketConnected: boolean;
  socket: WebSocket | null;

  // Actions
  fetchAssignments: () => Promise<void>;
  fetchAssignmentById: (id: string) => Promise<IAssignment | null>;
  createAssignment: (data: {
    title: string;
    dueDate: string;
    questionTypes: string[];
    numQuestions: number;
    totalMarks: number;
    instructions: string;
    fileAttached?: string;
    fileContent?: string;
  }) => Promise<IAssignment | null>;
  deleteAssignment: (id: string) => Promise<boolean>;
  regenerateAssignment: (id: string) => Promise<void>;
  
  // Real-time Updates
  connectWebSocket: (assignmentId?: string) => void;
  disconnectWebSocket: () => void;
  updateLocalAssignment: (id: string, updates: Partial<IAssignment>) => void;
}

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:5000';

export const useAssignmentStore = create<AssignmentState>((set, get) => ({
  assignments: [],
  loading: false,
  error: null,
  activeAssignment: null,
  socketConnected: false,
  socket: null,

  fetchAssignments: async () => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(`${BACKEND_URL}/api/assignments`);
      if (!res.ok) throw new Error('Failed to fetch assignments');
      const data = await res.json();
      set({ assignments: data, loading: false });
    } catch (err: any) {
      console.error(err);
      set({ error: err.message || 'Server connection error', loading: false });
    }
  },

  fetchAssignmentById: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(`${BACKEND_URL}/api/assignments/${id}`);
      if (!res.ok) throw new Error('Assignment not found');
      const data = await res.json();
      set({ activeAssignment: data, loading: false });
      return data;
    } catch (err: any) {
      console.error(err);
      set({ error: err.message || 'Failed to fetch assignment detail', loading: false });
      return null;
    }
  },

  createAssignment: async (formData) => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(`${BACKEND_URL}/api/assignments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to create assignment');
      }
      const newAssignment = await res.json();
      set((state) => ({
        assignments: [newAssignment, ...state.assignments],
        loading: false
      }));
      
      // Auto-connect to WS for updates on the new assignment
      get().connectWebSocket(newAssignment.id);
      return newAssignment;
    } catch (err: any) {
      console.error(err);
      set({ error: err.message || 'Failed to create assignment', loading: false });
      return null;
    }
  },

  deleteAssignment: async (id: string) => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/assignments/${id}`, {
        method: 'DELETE'
      });
      if (!res.ok) throw new Error('Failed to delete assignment');
      
      set((state) => ({
        assignments: state.assignments.filter((item) => item.id !== id),
        activeAssignment: state.activeAssignment?.id === id ? null : state.activeAssignment
      }));
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  },

  regenerateAssignment: async (id: string) => {
    try {
      set((state) => ({
        activeAssignment: state.activeAssignment?.id === id 
          ? { ...state.activeAssignment, status: 'processing', error: undefined, sections: undefined } 
          : state.activeAssignment
      }));
      
      const res = await fetch(`${BACKEND_URL}/api/assignments/${id}/regenerate`, {
        method: 'POST'
      });
      if (!res.ok) throw new Error('Failed to regenerate assessment');
      
      // Ensure we are connected to WebSocket to listen for updates
      get().connectWebSocket(id);
    } catch (err: any) {
      console.error(err);
      set({ error: err.message || 'Failed to trigger regeneration' });
    }
  },

  updateLocalAssignment: (id, updates) => {
    set((state) => {
      const updatedAssignments = state.assignments.map((item) =>
        item.id === id ? { ...item, ...updates } : item
      );
      
      const activeUpdate = state.activeAssignment?.id === id 
        ? { ...state.activeAssignment, ...updates } 
        : state.activeAssignment;

      return {
        assignments: updatedAssignments,
        activeAssignment: activeUpdate
      };
    });
  },

  connectWebSocket: (assignmentId) => {
    let ws = get().socket;
    
    if (ws && ws.readyState === WebSocket.OPEN) {
      if (assignmentId) {
        ws.send(JSON.stringify({ type: 'subscribe', assignmentId }));
      }
      return;
    }

    // Close existing if dead
    if (ws) {
      ws.close();
    }

    try {
      ws = new WebSocket(WS_URL);

      ws.onopen = () => {
        console.log('[WS-Client] Connected to server');
        set({ socketConnected: true, socket: ws });
        
        if (assignmentId) {
          ws?.send(JSON.stringify({ type: 'subscribe', assignmentId }));
        }
      };

      ws.onmessage = (event) => {
        try {
          const { event: wsEvent, data } = JSON.parse(event.data);
          
          if (wsEvent === 'job_update') {
            console.log('[WS-Client] Received job update:', data);
            const { assignmentId: id, status, sections, error } = data;
            
            get().updateLocalAssignment(id, {
              status,
              sections,
              error
            });
          }
        } catch (err) {
          console.error('[WS-Client] Error parsing message:', err);
        }
      };

      ws.onclose = () => {
        console.log('[WS-Client] Disconnected from server');
        set({ socketConnected: false, socket: null });
      };

      ws.onerror = (err) => {
        console.error('[WS-Client] Socket error:', err);
      };

    } catch (err) {
      console.error('[WS-Client] Connection setup failed:', err);
    }
  },

  disconnectWebSocket: () => {
    const ws = get().socket;
    if (ws) {
      ws.close();
      set({ socketConnected: false, socket: null });
    }
  }
}));
