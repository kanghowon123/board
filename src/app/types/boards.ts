export interface Board {
  id: number;
  created_at: string;
  title: string;
  content: string;
  thumbnail_url: string | null;
  board_url: string | null;
}
