export type PrivacyDeclaration = {
  data_categories: string[]
  data_subjects: string[]
  data_use: string
  name: string
}

export type System = {
  description: string
  fides_key: string
  name: string
  privacy_declarations: PrivacyDeclaration[]
  system_dependencies: string[]
  system_type: string
}

export type LayoutMode = 'system_type' | 'data_use'
