const STORAGE_KEY = 'journey_trips';

export function loadTrips() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

export function saveTrips(trips) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(trips));
}

export function getTripById(id) {
  const trips = loadTrips();
  return trips.find(t => t.id === id) || null;
}

export function updateTrip(trip) {
  const trips = loadTrips();
  const idx = trips.findIndex(t => t.id === trip.id);
  if (idx >= 0) {
    trips[idx] = { ...trips[idx], ...trip, updatedAt: new Date().toISOString() };
    saveTrips(trips);
  }
  return trips;
}

export function addTrip(trip) {
  const trips = loadTrips();
  const newTrip = {
    ...trip,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: 'planning',
    days: trip.days || [],
    expenses: [],
    photos: [],
    readiness: 0,
  };
  trips.unshift(newTrip);
  saveTrips(trips);
  return newTrip;
}

export function deleteTrip(id) {
  const trips = loadTrips().filter(t => t.id !== id);
  saveTrips(trips);
  return trips;
}

export function generateId() {
  return crypto.randomUUID();
}
