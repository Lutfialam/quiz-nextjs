interface CategoryType {
  id?: number;
  name?: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CategoryErrorType {
  name?: string;
  description?: string;
}

export default CategoryType;
