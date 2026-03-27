export interface PROFILE_TYPE {
  email: string;
  username: string;
  profile_image: string | null;
  phone_number: string | null;
  gender: string | null;
  birth_date: string | null;
  country: string | null;
  city: string | null;
  created_at: string;
  subscription_status: string | null;
  trials_left: number;
}


export interface UPDATE_PROFILE_TYPE {
    username: string
    phone_number: string
    gender: string
    birth_date: string
    country: string        // ✅ ADD
    city: string           // ✅ ADD
    profile_image?: File | string
}




export interface HISTORY_TYPE {
    id: number
    file_name: string
    model_type: string
    created_at: string
    file_format: any
}

