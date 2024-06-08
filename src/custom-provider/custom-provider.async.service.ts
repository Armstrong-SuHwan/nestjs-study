import { Injectable } from '@nestjs/common';

interface ApiResponse {
  id: number;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
  userId: number;
}

@Injectable()
export class CustomProviderAsyncService {
  async asyncTest(): Promise<ApiResponse> {
    const response = await fetch('https://koreanjson.com/posts/1');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json();
  }
}
