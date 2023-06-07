import { ApiPagination } from "./api";

export type NoteData = {
  id: string;
  title: string;
  description: string;
  created_at: string;
};

export type CreatedRawNoteData = {
  raw: NoteData[];
};

export type NoteResponse = {
  data: NoteData[];
  pagination: ApiPagination;
};
