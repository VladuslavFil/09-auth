import { nextServer } from "./api";
import type { AxiosResponse } from "axios";
import type { Note, NoteTag } from "@/types/note";
import type { User } from "@/types/user";

export type RegisterRequest = {
  email: string;
  password: string;
  username: string; 
};

export const register = async (data: RegisterRequest) => {
  const res = await nextServer.post<User>("/auth/register", data);
  return res.data;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export const login = async (data: LoginRequest) => {
  const res = await nextServer.post<User>("/auth/login", data);
  return res.data;
};

export const logout = async (): Promise<void> => {
  await nextServer.post("/auth/logout");
};

type CheckSessionResponse = {
  success: boolean;
};

export const checkSession = async () => {
  const res = await nextServer.get<CheckSessionResponse>("/auth/session");
  return res.data.success;
};

export const getMe = async () => {
  const { data } = await nextServer.get<User>("/users/me");
  return data;
};


export interface UpdateUserRequest {
  username: string;
}

export const updateUser = async (data: UpdateUserRequest): Promise<User> => {
  const { data: updatedUser } = await nextServer.patch<User>("/users/me", {
    username: data.username,
  });
  return updatedUser;
};

export interface FetchNotesParams {
  page?: number;
  perPage?: number;
  search?: string;
  tag?: string;
}


export interface FetchNotesResponse {
  page: number;
  perPage?: number;
  totalPages?: number;
  notes: Note[];
}

export interface CreateNoteParams {
  title: string;
  content: string;
  tag: NoteTag;
}

export const fetchNotes = async (
  params: FetchNotesParams
): Promise<FetchNotesResponse> => {
  const { data }: AxiosResponse<FetchNotesResponse> = await nextServer.get(
    "/notes",
    { params }
  );
  return data;
};

export const createNote = async (
  noteData: CreateNoteParams
): Promise<Note> => {
  const { data }: AxiosResponse<Note> = await nextServer.post(
    "/notes",
    noteData
  );
  return data;
};

export const deleteNote = async (id: string): Promise<Note> => {
  const { data }: AxiosResponse<Note> = await nextServer.delete(`/notes/${id}`);
  return data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const { data }: AxiosResponse<Note> = await nextServer.get(`/notes/${id}`);
  return data;
};
