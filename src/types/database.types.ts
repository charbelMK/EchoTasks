export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          full_name: string | null
          email: string | null
          role: 'admin' | 'client'
          avatar_url: string | null
          phone: string | null
          created_at: string
        }
        Insert: {
          id: string
          full_name?: string | null
          email?: string | null
          role?: 'admin' | 'client'
          avatar_url?: string | null
          phone?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          full_name?: string | null
          email?: string | null
          role?: 'admin' | 'client'
          avatar_url?: string | null
          phone?: string | null
          created_at?: string
        }
      }
      projects: {
        Row: {
          id: string
          client_id: string
          title: string
          description: string | null
          status: 'pending' | 'in_progress' | 'completed' | 'on_hold' | 'cancelled'
          start_date: string | null
          end_date: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          client_id: string
          title: string
          description?: string | null
          status?: 'pending' | 'in_progress' | 'completed' | 'on_hold' | 'cancelled'
          start_date?: string | null
          end_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          client_id?: string
          title?: string
          description?: string | null
          status?: 'pending' | 'in_progress' | 'completed' | 'on_hold' | 'cancelled'
          start_date?: string | null
          end_date?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      milestones: {
        Row: {
          id: string
          project_id: string
          title: string
          description: string | null
          status: 'pending' | 'in_progress' | 'completed'
          due_date: string | null
          created_at: string
        }
        Insert: {
          id?: string
          project_id: string
          title: string
          description?: string | null
          status?: 'pending' | 'in_progress' | 'completed'
          due_date?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          title?: string
          description?: string | null
          status?: 'pending' | 'in_progress' | 'completed'
          due_date?: string | null
          created_at?: string
        }
      }
      updates: {
        Row: {
          id: string
          project_id: string
          milestone_id: string | null
          author_id: string
          content: string
          created_at: string
        }
        Insert: {
          id?: string
          project_id: string
          milestone_id?: string | null
          author_id: string
          content: string
          created_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          milestone_id?: string | null
          author_id?: string
          content?: string
          created_at?: string
        }
      }
      media: {
        Row: {
          id: string
          update_id: string
          file_path: string
          file_type: string | null
          file_name: string | null
          created_at: string
        }
        Insert: {
          id?: string
          update_id: string
          file_path: string
          file_type?: string | null
          file_name?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          update_id?: string
          file_path?: string
          file_type?: string | null
          file_name?: string | null
          created_at?: string
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          title: string
          message: string | null
          type: string
          is_read: boolean
          link: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          message?: string | null
          type?: string
          is_read?: boolean
          link?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          message?: string | null
          type?: string
          is_read?: boolean
          link?: string | null
          created_at?: string
        }
      }
    }
  }
}
