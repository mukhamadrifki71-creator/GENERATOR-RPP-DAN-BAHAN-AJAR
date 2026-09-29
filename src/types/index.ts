export interface MasterAtpRecord {
  id?: string;
  fase: string;
  elemen: string;
  capaian_pembelajaran: string;
  tujuan_pembelajaran: string;
  target_kelas: string;
  no_atp: string;
  alur_tujuan_pembelajaran: string;
}

export interface GenerationOptions {
  duration: string;
  pedagogicalStrategy: string;
  digitalTool: string;
  partnerNotes?: string;
}

export interface GenerationResult {
  rawMarkdown: string;
  source: 'gemini' | 'engine_fallback';
  atpData: MasterAtpRecord;
  createdAt: string;
}

export interface RubricCriteria {
  aspect: string;
  selectedLevel: 'Sangat Berkembang' | 'Cakap' | 'Berkembang' | 'Baru Memulai';
  score: number;
  notes?: string;
}

export interface StudentGroupEvaluation {
  groupName: string;
  scores: {
    isi: number;
    kreativitas: number;
    kolaborasi: number;
    presentasi: number;
  };
  totalScore: number;
  predikat: string;
  feedback: string;
}

export interface SignatoryConfig {
  teacherName: string;
  teacherNip: string;
  principalName: string;
  principalNip: string;
  schoolName: string;
  cityAndDate: string;
}

