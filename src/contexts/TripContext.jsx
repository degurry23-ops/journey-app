import { createContext, useContext, useReducer } from 'react';
import { loadTrips, saveTrips, addTrip, updateTrip, deleteTrip } from '../utils/storage';

const TripContext = createContext(null);

function tripReducer(state, action) {
  let next;
  switch (action.type) {
    case 'LOAD':
      return loadTrips();
    case 'ADD':
      next = [...state, action.payload];
      saveTrips(next);
      return next;
    case 'UPDATE': {
      const idx = state.findIndex(t => t.id === action.payload.id);
      if (idx < 0) return state;
      next = [...state];
      next[idx] = { ...next[idx], ...action.payload, updatedAt: new Date().toISOString() };
      saveTrips(next);
      return next;
    }
    case 'DELETE':
      next = state.filter(t => t.id !== action.payload);
      saveTrips(next);
      return next;
    case 'ADD_PLACE': {
      const { tripId, dayId, place } = action.payload;
      next = state.map(t => {
        if (t.id !== tripId) return t;
        return {
          ...t,
          days: t.days.map(d => {
            if (d.id !== dayId) return d;
            return { ...d, places: [...d.places, { ...place, id: crypto.randomUUID() }] };
          }),
        };
      });
      saveTrips(next);
      return next;
    }
    case 'REMOVE_PLACE': {
      const { tripId: tid, dayId: did, placeId: pid } = action.payload;
      next = state.map(t => {
        if (t.id !== tid) return t;
        return {
          ...t,
          days: t.days.map(d => {
            if (d.id !== did) return d;
            return { ...d, places: d.places.filter(p => p.id !== pid) };
          }),
        };
      });
      saveTrips(next);
      return next;
    }
    case 'REORDER_PLACES': {
      const { tripId: tid2, dayId: did2, places } = action.payload;
      next = state.map(t => {
        if (t.id !== tid2) return t;
        return {
          ...t,
          days: t.days.map(d => d.id === did2 ? { ...d, places } : d),
        };
      });
      saveTrips(next);
      return next;
    }
    case 'ADD_EXPENSE': {
      const { tripId: tid3, expense } = action.payload;
      next = state.map(t => {
        if (t.id !== tid3) return t;
        return { ...t, expenses: [...(t.expenses || []), { ...expense, id: crypto.randomUUID() }] };
      });
      saveTrips(next);
      return next;
    }
    case 'REMOVE_EXPENSE': {
      const { tripId: tid4, expenseId: eid } = action.payload;
      next = state.map(t => {
        if (t.id !== tid4) return t;
        return { ...t, expenses: (t.expenses || []).filter(e => e.id !== eid) };
      });
      saveTrips(next);
      return next;
    }
    default:
      return state;
  }
}

export function TripProvider({ children }) {
  const [trips, dispatch] = useReducer(tripReducer, [], loadTrips);

  return (
    <TripContext.Provider value={{ trips, dispatch }}>
      {children}
    </TripContext.Provider>
  );
}

export function useTrips() {
  return useContext(TripContext);
}
