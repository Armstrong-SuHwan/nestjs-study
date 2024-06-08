import { Injectable } from '@nestjs/common';

@Injectable()
export class CustomProviderService {
  findAll(): void {
    console.log('CustomProviderService is done');
  }
}
