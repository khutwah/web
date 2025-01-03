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
          created_at: string | null
          created_by: number | null
          end_surah: number | null
          end_verse: number | null
          id: number
          is_target_achieved: boolean | null
          notes: string | null
          page_count: number | null
          shift_id: number | null
          start_surah: number | null
          start_verse: number | null
          status: string
          student_attendance: string
          student_id: number | null
          tags: Json | null
          target_page_count: number | null
          type: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: number | null
          end_surah?: number | null
          end_verse?: number | null
          id?: never
          is_target_achieved?: boolean | null
          notes?: string | null
          page_count?: number | null
          shift_id?: number | null
          start_surah?: number | null
          start_verse?: number | null
          status?: string
          student_attendance?: string
          student_id?: number | null
          tags?: Json | null
          target_page_count?: number | null
          type?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: number | null
          end_surah?: number | null
          end_verse?: number | null
          id?: never
          is_target_achieved?: boolean | null
          notes?: string | null
          page_count?: number | null
          shift_id?: number | null
          start_surah?: number | null
          start_verse?: number | null
          status?: string
          student_attendance?: string
          student_id?: number | null
          tags?: Json | null
          target_page_count?: number | null
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
      assessments: {
        Row: {
          created_at: string | null
          end_date: string | null
          final_mark: string | null
          high_mistake_count: number
          id: number
          low_mistake_count: number
          medium_mistake_count: number
          notes: string | null
          parent_assessment_id: number | null
          session_name: string | null
          session_range_id: number | null
          session_type: string | null
          start_date: string
          student_id: number
          surah_range: Json | null
          updated_at: string | null
          ustadz_id: number
        }
        Insert: {
          created_at?: string | null
          end_date?: string | null
          final_mark?: string | null
          high_mistake_count?: number
          id?: never
          low_mistake_count?: number
          medium_mistake_count?: number
          notes?: string | null
          parent_assessment_id?: number | null
          session_name?: string | null
          session_range_id?: number | null
          session_type?: string | null
          start_date: string
          student_id: number
          surah_range?: Json | null
          updated_at?: string | null
          ustadz_id: number
        }
        Update: {
          created_at?: string | null
          end_date?: string | null
          final_mark?: string | null
          high_mistake_count?: number
          id?: never
          low_mistake_count?: number
          medium_mistake_count?: number
          notes?: string | null
          parent_assessment_id?: number | null
          session_name?: string | null
          session_range_id?: number | null
          session_type?: string | null
          start_date?: string
          student_id?: number
          surah_range?: Json | null
          updated_at?: string | null
          ustadz_id?: number
        }
        Relationships: [
          {
            foreignKeyName: 'assessments_parent_assessment_id_fkey'
            columns: ['parent_assessment_id']
            isOneToOne: false
            referencedRelation: 'assessments'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'assessments_student_id_fkey'
            columns: ['student_id']
            isOneToOne: false
            referencedRelation: 'students'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'assessments_ustadz_id_fkey'
            columns: ['ustadz_id']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          }
        ]
      }
      checkpoints: {
        Row: {
          created_at: string | null
          end_date: string | null
          id: number
          last_activity_id: number | null
          notes: string | null
          page_count_accumulation: number | null
          part_count: number | null
          start_date: string
          status: string
          student_id: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          end_date?: string | null
          id?: never
          last_activity_id?: number | null
          notes?: string | null
          page_count_accumulation?: number | null
          part_count?: number | null
          start_date: string
          status: string
          student_id: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          end_date?: string | null
          id?: never
          last_activity_id?: number | null
          notes?: string | null
          page_count_accumulation?: number | null
          part_count?: number | null
          start_date?: string
          status?: string
          student_id?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'checkpoint_last_activity_id_fkey'
            columns: ['last_activity_id']
            isOneToOne: false
            referencedRelation: 'activities'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'checkpoint_student_id_fkey'
            columns: ['student_id']
            isOneToOne: false
            referencedRelation: 'students'
            referencedColumns: ['id']
          }
        ]
      }
      circles: {
        Row: {
          academic_year: string
          created_at: string | null
          grade: number
          id: number
          label: string | null
          name: string | null
          target_page_count: number | null
          updated_at: string | null
        }
        Insert: {
          academic_year: string
          created_at?: string | null
          grade?: number
          id?: never
          label?: string | null
          name?: string | null
          target_page_count?: number | null
          updated_at?: string | null
        }
        Update: {
          academic_year?: string
          created_at?: string | null
          grade?: number
          id?: never
          label?: string | null
          name?: string | null
          target_page_count?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      shifts: {
        Row: {
          circle_id: number | null
          created_at: string | null
          end_date: string | null
          id: number
          location: string | null
          start_date: string
          updated_at: string | null
          ustadz_id: number | null
        }
        Insert: {
          circle_id?: number | null
          created_at?: string | null
          end_date?: string | null
          id?: never
          location?: string | null
          start_date: string
          updated_at?: string | null
          ustadz_id?: number | null
        }
        Update: {
          circle_id?: number | null
          created_at?: string | null
          end_date?: string | null
          id?: never
          location?: string | null
          start_date?: string
          updated_at?: string | null
          ustadz_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: 'shifts_circle_id_fkey'
            columns: ['circle_id']
            isOneToOne: false
            referencedRelation: 'circles'
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
          circle_id: number | null
          created_at: string | null
          id: number
          name: string | null
          nis: string | null
          nisn: string | null
          parent_id: number | null
          pin: string | null
          target_page_count: number | null
          updated_at: string | null
          virtual_account: string | null
        }
        Insert: {
          circle_id?: number | null
          created_at?: string | null
          id?: never
          name?: string | null
          nis?: string | null
          nisn?: string | null
          parent_id?: number | null
          pin?: string | null
          target_page_count?: number | null
          updated_at?: string | null
          virtual_account?: string | null
        }
        Update: {
          circle_id?: number | null
          created_at?: string | null
          id?: never
          name?: string | null
          nis?: string | null
          nisn?: string | null
          parent_id?: number | null
          pin?: string | null
          target_page_count?: number | null
          updated_at?: string | null
          virtual_account?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'students_circle_id_fkey'
            columns: ['circle_id']
            isOneToOne: false
            referencedRelation: 'circles'
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
          category: string | null
          created_at: string | null
          id: number
          name: string | null
          updated_at: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          id?: never
          name?: string | null
          updated_at?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          id?: never
          name?: string | null
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
