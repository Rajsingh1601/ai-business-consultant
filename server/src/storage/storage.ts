import fs from 'fs';
import path from 'path';
import { Conversation, BusinessContext, ConsultationPlan, FinalBusinessReport, AgentStatusDashboardState, Message } from '../interfaces/types.js';

export interface IStorage {
  getAllConversations(): Promise<Conversation[]>;
  getConversation(id: string): Promise<Conversation | null>;
  saveConversation(conv: Conversation): Promise<Conversation>;
  deleteConversation(id: string): Promise<boolean>;
  renameConversation(id: string, newTitle: string): Promise<Conversation | null>;
}

export class FileStorage implements IStorage {
  private filePath: string;
  private memoryCache: Map<string, Conversation> = new Map();
  private initialized = false;

  constructor(filePath?: string) {
    const dataDir = path.join(process.cwd(), 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    this.filePath = filePath || path.join(dataDir, 'consultations.json');
    this.loadFromFile();
  }

  private loadFromFile() {
    try {
      if (fs.existsSync(this.filePath)) {
        const raw = fs.readFileSync(this.filePath, 'utf-8');
        const parsed: Conversation[] = JSON.parse(raw);
        this.memoryCache.clear();
        for (const c of parsed) {
          this.memoryCache.set(c.id, c);
        }
      }
      this.initialized = true;
    } catch (err) {
      console.error('[FileStorage] Error loading data from file, initializing empty cache:', err);
      this.memoryCache.clear();
      this.initialized = true;
    }
  }

  private syncToFile() {
    try {
      const all = Array.from(this.memoryCache.values());
      const tempPath = `${this.filePath}.tmp.${Date.now()}`;
      fs.writeFileSync(tempPath, JSON.stringify(all, null, 2), 'utf-8');
      fs.renameSync(tempPath, this.filePath);
    } catch (err) {
      console.error('[FileStorage] Error syncing to file:', err);
    }
  }

  async getAllConversations(): Promise<Conversation[]> {
    if (!this.initialized) this.loadFromFile();
    return Array.from(this.memoryCache.values()).sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  }

  async getConversation(id: string): Promise<Conversation | null> {
    if (!this.initialized) this.loadFromFile();
    return this.memoryCache.get(id) || null;
  }

  async saveConversation(conv: Conversation): Promise<Conversation> {
    conv.updatedAt = new Date().toISOString();
    this.memoryCache.set(conv.id, conv);
    this.syncToFile();
    return conv;
  }

  async deleteConversation(id: string): Promise<boolean> {
    const existed = this.memoryCache.delete(id);
    if (existed) {
      this.syncToFile();
    }
    return existed;
  }

  async renameConversation(id: string, newTitle: string): Promise<Conversation | null> {
    const conv = this.memoryCache.get(id);
    if (!conv) return null;
    conv.title = newTitle.trim();
    conv.updatedAt = new Date().toISOString();
    this.memoryCache.set(id, conv);
    this.syncToFile();
    return conv;
  }
}

// Global storage instance
export const storage: IStorage = new FileStorage();
