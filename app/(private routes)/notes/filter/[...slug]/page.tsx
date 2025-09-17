import { getNotes } from "@/lib/api/serverApi";
import {
  QueryClient,
  dehydrate,
  HydrationBoundary,
} from "@tanstack/react-query";
import NotesClient from "./Notes.client";
import type { Metadata } from "next";
import type { Note } from "@/types/note";

export async function generateMetadata({
  params,
}: {
  params: { slug: string[] };
}): Promise<Metadata> {
  const tag = params.slug[0] || "All";

  return {
    title: `Notes tagged: ${tag}`,
    description: `Browse all notes with tag "${tag}" on NoteHub`,
    openGraph: {
      title: `Notes tagged: ${tag}`,
      description: `Browse all notes with tag "${tag}" on NoteHub`,
      url: `https://notehub.com/notes/${tag}`,
      siteName: "NoteHub",
      images: [
        {
          url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
          width: 1200,
          height: 630,
          alt: `Notes tagged: ${tag}`,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `Notes tagged: ${tag}`,
      description: `Browse all notes with tag "${tag}" on NoteHub`,
      images: ["https://ac.goit.global/fullstack/react/notehub-og-meta.jpg"],
    },
  };
}

export default async function NotesPage({
  params,
}: {
  params: { slug: string[] };
}) {
  const tag = params.slug[0] || "";

  const queryClient = new QueryClient();

  const allNotesResponse = await getNotes();
  const allNotes: Note[] = allNotesResponse.notes;

  const filteredNotes =
    tag && tag !== "All"
      ? allNotes.filter((note: Note) => note.tag === tag)
      : allNotes;

  await queryClient.prefetchQuery({
    queryKey: ["notes", tag],
    queryFn: async () => ({
      notes: filteredNotes,
      page: 1,
      perPage: 12,
      totalPages: Math.ceil(filteredNotes.length / 12),
    }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient initialTag={tag} />
    </HydrationBoundary>
  );
}
