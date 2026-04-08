import mongoose, { Document, Model, Schema, Types } from 'mongoose';

// Event attributes interface (strictly typed)
export interface IEvent {
  title: string;
  slug: string;
  description: string;
  overview: string;
  image: string;
  venue: string;
  location: string;
  date: string; // ISO date string
  time: string; // normalized to HH:mm (24-hour)
  mode: string;
  audience: string;
  agenda: string[];
  organizer: string;
  tags: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

// Mongoose Document for Event
export interface IEventDocument extends IEvent, Document {}

// Simple slugify helper: lower-case, replace non-alphanum with -, trim duplicates
function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Normalize time into HH:mm (24-hour). Accepts formats like '9:30 AM', '09:30', '9 AM'.
function normalizeTime(input: string): string {
  const trimmed = input.trim();

  // Match HH:MM with optional AM/PM
  const timeRegex = /^(\d{1,2})(?::(\d{2}))?\s*(AM|PM|am|pm)?$/;
  const m = trimmed.match(timeRegex);
  if (!m) {
    // If we can't parse, return trimmed input to avoid data loss; validation will catch format issues.
    return trimmed;
  }

  let hours = parseInt(m[1], 10);
  const minutes = m[2] ? parseInt(m[2], 10) : 0;
  const ampm = m[3];

  if (ampm) {
    const up = ampm.toUpperCase();
    if (up === 'PM' && hours < 12) hours += 12;
    if (up === 'AM' && hours === 12) hours = 0;
  }

  const hh = hours.toString().padStart(2, '0');
  const mm = minutes.toString().padStart(2, '0');
  return `${hh}:${mm}`;
}

const eventSchema = new Schema<IEventDocument>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true },
    description: { type: String, required: true, trim: true },
    overview: { type: String, required: true, trim: true },
    image: { type: String, required: true, trim: true },
    venue: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    date: { type: String, required: true, trim: true },
    time: { type: String, required: true, trim: true },
    mode: { type: String, required: true, trim: true },
    audience: { type: String, required: true, trim: true },
    agenda: { type: [String], required: true, validate: [(v: string[]) => Array.isArray(v) && v.length > 0, 'Agenda must have at least one item'] },
    organizer: { type: String, required: true, trim: true },
    tags: { type: [String], required: true, validate: [(v: string[]) => Array.isArray(v) && v.length > 0, 'Tags must have at least one item'] },
  },
  {
    timestamps: true,
    strict: true,
  }
);

// Ensure unique index on slug for fast lookups
eventSchema.index({ slug: 1 }, { unique: true });

// Pre-save hook: generate/normalize slug, normalize date to ISO and time to HH:mm.
eventSchema.pre<IEventDocument>('save', function (this: IEventDocument) {
  // Generate slug only when title is new or modified
  if (this.isModified('title')) {
    this.slug = slugify(this.title);
  }

  // Normalize and validate date: convert to ISO string
  if (this.isModified('date')) {
    const parsed = new Date(this.date);
    if (Number.isNaN(parsed.getTime())) {
      throw new Error('Invalid date format. Provide a valid date string.');
    }
    this.date = parsed.toISOString();
  }

  // Normalize time to HH:mm
  if (this.isModified('time')) {
    const normalized = normalizeTime(this.time);
    if (!/^\d{2}:\d{2}$/.test(normalized)) {
      throw new Error('Invalid time format. Expected formats like "09:30" or "9:30 AM".');
    }
    this.time = normalized;
  }

  // Additional field presence checks (trimmed non-empty)
  const requiredStringFields: Array<keyof IEvent> = [
    'title',
    'description',
    'overview',
    'image',
    'venue',
    'location',
    'date',
    'time',
    'mode',
    'audience',
    'organizer',
  ];

  for (const field of requiredStringFields) {
    const val = (this as any)[field];
    if (typeof val !== 'string' || val.trim().length === 0) {
      throw new Error(`${String(field)} is required and must be a non-empty string`);
    }
  }
});

// Avoid model overwrite issues in development
const Event: Model<IEventDocument> = (mongoose.models.Event as Model<IEventDocument>) || mongoose.model<IEventDocument>('Event', eventSchema);

export default Event;
