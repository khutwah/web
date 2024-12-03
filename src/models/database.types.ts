export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      activities: {
        Row: {
          achieve_target: boolean | null
          created_at: string | null
          created_by: number | null
          end_surah: number | null
          end_verse: number | null
          id: number
          notes: string | null
          page_count: number | null
          shift_id: number | null
          start_surah: number | null
          start_verse: number | null
          status: string
          student_attendance: string
          student_id: number | null
          tags: Json | null
          target_page_count: number
          type: number | null
          updated_at: string | null
        }
        Insert: {
          achieve_target?: boolean | null
          created_at?: string | null
          created_by?: number | null
          end_surah?: number | null
          end_verse?: number | null
          id?: never
          notes?: string | null
          page_count?: number | null
          shift_id?: number | null
          start_surah?: number | null
          start_verse?: number | null
          status?: string
          student_attendance?: string
          student_id?: number | null
          tags?: Json | null
          target_page_count?: number
          type?: number | null
          updated_at?: string | null
        }
        Update: {
          achieve_target?: boolean | null
          created_at?: string | null
          created_by?: number | null
          end_surah?: number | null
          end_verse?: number | null
          id?: never
          notes?: string | null
          page_count?: number | null
          shift_id?: number | null
          start_surah?: number | null
          start_verse?: number | null
          status?: string
          student_attendance?: string
          student_id?: number | null
          tags?: Json | null
          target_page_count?: number
          type?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'activities_created_by_fk'
            columns: ['created_by']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'activities_shift_id_fkey'
            columns: ['shift_id']
            isOneToOne: false
            referencedRelation: 'shifts'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'activities_student_id_fkey'
            columns: ['student_id']
            isOneToOne: false
            referencedRelation: 'students'
            referencedColumns: ['id']
          }
        ]
      }
      halaqah: {
        Row: {
          academic_year: number | null
          class: string | null
          created_at: string | null
          id: number
          label: string | null
          name: string | null
          updated_at: string | null
        }
        Insert: {
          academic_year?: number | null
          class?: string | null
          created_at?: string | null
          id?: never
          label?: string | null
          name?: string | null
          updated_at?: string | null
        }
        Update: {
          academic_year?: number | null
          class?: string | null
          created_at?: string | null
          id?: never
          label?: string | null
          name?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      shifts: {
        Row: {
          created_at: string | null
          end_date: string | null
          halaqah_id: number | null
          id: number
          location: string | null
          start_date: string
          updated_at: string | null
          ustadz_id: number | null
        }
        Insert: {
          created_at?: string | null
          end_date?: string | null
          halaqah_id?: number | null
          id?: never
          location?: string | null
          start_date: string
          updated_at?: string | null
          ustadz_id?: number | null
        }
        Update: {
          created_at?: string | null
          end_date?: string | null
          halaqah_id?: number | null
          id?: never
          location?: string | null
          start_date?: string
          updated_at?: string | null
          ustadz_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: 'shifts_halaqah_id_fkey'
            columns: ['halaqah_id']
            isOneToOne: false
            referencedRelation: 'halaqah'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'shifts_ustadz_id_fk'
            columns: ['ustadz_id']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          }
        ]
      }
      students: {
        Row: {
          created_at: string | null
          halaqah_id: number | null
          id: number
          name: string | null
          nis: string | null
          nisn: string | null
          parent_id: number | null
          pin: string | null
          updated_at: string | null
          virtual_account: string | null
        }
        Insert: {
          created_at?: string | null
          halaqah_id?: number | null
          id?: never
          name?: string | null
          nis?: string | null
          nisn?: string | null
          parent_id?: number | null
          pin?: string | null
          updated_at?: string | null
          virtual_account?: string | null
        }
        Update: {
          created_at?: string | null
          halaqah_id?: number | null
          id?: never
          name?: string | null
          nis?: string | null
          nisn?: string | null
          parent_id?: number | null
          pin?: string | null
          updated_at?: string | null
          virtual_account?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'students_halaqah_id_fkey'
            columns: ['halaqah_id']
            isOneToOne: false
            referencedRelation: 'halaqah'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'students_parent_id_fk'
            columns: ['parent_id']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          }
        ]
      }
      tags: {
        Row: {
          created_at: string | null
          id: number
          name: string | null
          type: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: never
          name?: string | null
          type?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: never
          name?: string | null
          type?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      users: {
        Row: {
          created_at: string | null
          email: string
          id: number
          name: string | null
          role: number | null
          sb_user_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: never
          name?: string | null
          role?: number | null
          sb_user_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: never
          name?: string | null
          role?: number | null
          sb_user_id?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, 'public'>]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema['Tables'] & PublicSchema['Views'])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions['schema']]['Tables'] &
        Database[PublicTableNameOrOptions['schema']]['Views'])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions['schema']]['Tables'] &
      Database[PublicTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema['Tables'] &
        PublicSchema['Views'])
    ? (PublicSchema['Tables'] &
        PublicSchema['Views'])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema['Tables']
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
    ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema['Tables']
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
    ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema['Enums']
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions['schema']]['Enums']
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions['schema']]['Enums'][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema['Enums']
    ? PublicSchema['Enums'][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema['CompositeTypes']
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema['CompositeTypes']
    ? PublicSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never
