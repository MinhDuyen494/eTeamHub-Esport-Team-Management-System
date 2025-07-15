import React, { createContext, useContext, useReducer } from 'react';
import type { ReactNode } from 'react';

// Types
export interface Event {
  id: number;
  title: string;
  description: string;
  location: string;
  startTime: string;
  endTime: string;
  type: string;
  note?: string;
  team: {
    id: number;
    name: string;
  };
  createdAt: string;
}

interface EventState {
  events: Event[];
  loading: boolean;
  error: string | null;
}

type EventAction =
  | { type: 'FETCH_EVENTS_REQUEST' }
  | { type: 'FETCH_EVENTS_SUCCESS'; payload: Event[] }
  | { type: 'FETCH_EVENTS_FAILURE'; payload: string }
  | { type: 'SET_LOADING'; payload: boolean };

// Initial state
const initialState: EventState = {
  events: [],
  loading: false,
  error: null,
};

// Reducer
const eventReducer = (state: EventState, action: EventAction): EventState => {
  switch (action.type) {
    case 'FETCH_EVENTS_REQUEST':
      return {
        ...state,
        loading: true,
        error: null,
      };
    case 'FETCH_EVENTS_SUCCESS':
      return {
        ...state,
        events: action.payload,
        loading: false,
        error: null,
      };
    case 'FETCH_EVENTS_FAILURE':
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload,
      };
    default:
      return state;
  }
};

// Context
interface EventContextType {
  state: EventState;
  fetchEvents: () => Promise<void>;
  getEventStatus: (event: Event) => 'upcoming' | 'ongoing' | 'ended';
  getUpcomingEvents: () => Event[];
  getOngoingEvents: () => Event[];
  getEndedEvents: () => Event[];
  getSoonestEvent: () => Event | null;
}

const EventContext = createContext<EventContextType | undefined>(undefined);

// Provider
interface EventProviderProps {
  children: ReactNode;
}

export const EventProvider: React.FC<EventProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(eventReducer, initialState);

  // Helper function to get event status based on current time
  const getEventStatus = (event: Event): 'upcoming' | 'ongoing' | 'ended' => {
    const now = new Date();
    const startTime = new Date(event.startTime);
    const endTime = new Date(event.endTime);

    if (now < startTime) return 'upcoming';
    if (now >= startTime && now <= endTime) return 'ongoing';
    return 'ended';
  };

  // Get upcoming events
  const getUpcomingEvents = (): Event[] => {
    return state.events.filter(event => getEventStatus(event) === 'upcoming');
  };

  // Get ongoing events
  const getOngoingEvents = (): Event[] => {
    return state.events.filter(event => getEventStatus(event) === 'ongoing');
  };

  // Get ended events
  const getEndedEvents = (): Event[] => {
    return state.events.filter(event => getEventStatus(event) === 'ended');
  };

  // Get the soonest upcoming event
  const getSoonestEvent = (): Event | null => {
    const upcoming = getUpcomingEvents();
    if (upcoming.length === 0) return null;
    
    return upcoming.sort((a, b) => 
      new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
    )[0];
  };

  // Fetch all events
  const fetchEvents = async () => {
    try {
      dispatch({ type: 'FETCH_EVENTS_REQUEST' });
      
      const { getEvents } = await import('../api/events.api');
      const response = await getEvents();
      
      dispatch({ type: 'FETCH_EVENTS_SUCCESS', payload: response });
    } catch (error) {
      console.error('Error fetching events:', error);
      dispatch({ 
        type: 'FETCH_EVENTS_FAILURE', 
        payload: 'Failed to fetch events' 
      });
    }
  };

  const value: EventContextType = {
    state,
    fetchEvents,
    getEventStatus,
    getUpcomingEvents,
    getOngoingEvents,
    getEndedEvents,
    getSoonestEvent,
  };

  return (
    <EventContext.Provider value={value}>
      {children}
    </EventContext.Provider>
  );
};

// Hook
export const useEvent = (): EventContextType => {
  const context = useContext(EventContext);
  if (context === undefined) {
    throw new Error('useEvent must be used within an EventProvider');
  }
  return context;
}; 