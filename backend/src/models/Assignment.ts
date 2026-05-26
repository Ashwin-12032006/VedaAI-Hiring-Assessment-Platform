import mongoose, { Schema, Document } from 'mongoose';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

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
  fileContent?: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  error?: string;
  sections?: ISection[];
  createdAt: string;
}

// Mongoose Schemas
const QuestionSchema = new Schema({
  id: { type: String, required: true },
  text: { type: String, required: true },
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'], required: true },
  marks: { type: Number, required: true },
  options: { type: [String], required: false }
});

const SectionSchema = new Schema({
  id: { type: String, required: true },
  title: { type: String, required: true },
  instruction: { type: String, required: true },
  questions: { type: [QuestionSchema], required: true }
});

const AssignmentSchema = new Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  dueDate: { type: String, required: true },
  questionTypes: { type: [String], required: true },
  numQuestions: { type: Number, required: true },
  totalMarks: { type: Number, required: true },
  instructions: { type: String, required: false },
  fileAttached: { type: String, required: false },
  fileContent: { type: String, required: false },
  status: { type: String, enum: ['pending', 'processing', 'completed', 'failed'], default: 'pending' },
  error: { type: String, required: false },
  sections: { type: [SectionSchema], required: false },
  createdAt: { type: String, required: true }
});

const MongoAssignment = mongoose.models.Assignment || mongoose.model<IAssignment & Document>('Assignment', AssignmentSchema);

// Fallback JSON DB Implementation
const LOCAL_DB_PATH = path.join(__dirname, '../../database.json');

const readLocalDB = (): IAssignment[] => {
  try {
    if (!fs.existsSync(LOCAL_DB_PATH)) {
      fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify([]));
      return [];
    }
    const data = fs.readFileSync(LOCAL_DB_PATH, 'utf-8');
    return JSON.parse(data || '[]');
  } catch (err) {
    console.error('Error reading local JSON database:', err);
    return [];
  }
};

const writeLocalDB = (data: IAssignment[]): void => {
  try {
    fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Error writing local JSON database:', err);
  }
};

// Unified DB Handler
export class AssignmentDB {
  private static useMongo = false;

  public static setMongoActive(active: boolean) {
    this.useMongo = active;
    console.log(`[DB] Database adapter set to: ${active ? 'MongoDB/Mongoose' : 'Local JSON Fallback'}`);
  }

  public static async create(assignmentData: Omit<IAssignment, 'id' | 'createdAt' | 'status'>): Promise<IAssignment> {
    const newAssignment: IAssignment = {
      ...assignmentData,
      id: uuidv4(),
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    if (this.useMongo) {
      try {
        const doc = new MongoAssignment(newAssignment);
        await doc.save();
        return doc.toObject() as IAssignment;
      } catch (err) {
        console.error('MongoDB write failed, writing to fallback JSON:', err);
      }
    }

    const items = readLocalDB();
    items.unshift(newAssignment);
    writeLocalDB(items);
    return newAssignment;
  }

  public static async getAll(): Promise<IAssignment[]> {
    if (this.useMongo) {
      try {
        const docs = await MongoAssignment.find().sort({ createdAt: -1 });
        return docs.map(doc => doc.toObject() as IAssignment);
      } catch (err) {
        console.error('MongoDB read failed, using fallback JSON:', err);
      }
    }

    return readLocalDB();
  }

  public static async getById(id: string): Promise<IAssignment | null> {
    if (this.useMongo) {
      try {
        const doc = await MongoAssignment.findOne({ id });
        if (doc) return doc.toObject() as IAssignment;
      } catch (err) {
        console.error('MongoDB findOne failed, using fallback JSON:', err);
      }
    }

    const items = readLocalDB();
    return items.find(item => item.id === id) || null;
  }

  public static async update(id: string, updates: Partial<IAssignment>): Promise<IAssignment | null> {
    if (this.useMongo) {
      try {
        const doc = await MongoAssignment.findOneAndUpdate({ id }, { $set: updates }, { new: true });
        if (doc) return doc.toObject() as IAssignment;
      } catch (err) {
        console.error('MongoDB update failed, using fallback JSON:', err);
      }
    }

    const items = readLocalDB();
    const index = items.findIndex(item => item.id === id);
    if (index === -1) return null;

    items[index] = { ...items[index], ...updates };
    writeLocalDB(items);
    return items[index];
  }

  public static async delete(id: string): Promise<boolean> {
    if (this.useMongo) {
      try {
        const result = await MongoAssignment.deleteOne({ id });
        if (result.deletedCount > 0) return true;
      } catch (err) {
        console.error('MongoDB delete failed, using fallback JSON:', err);
      }
    }

    const items = readLocalDB();
    const filtered = items.filter(item => item.id !== id);
    if (filtered.length === items.length) return false;

    writeLocalDB(filtered);
    return true;
  }
}
