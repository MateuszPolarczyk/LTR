export interface LoginResponse {
    success: boolean;
    data: {
      token: string;
    };
    error?: {
      message: string;
    };
  }
  
  export interface AnnouncementPayload {
    message: string;
    numbers: number[];
  }
  