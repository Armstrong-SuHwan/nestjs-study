import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  HttpCode,
  Put,
  BadRequestException,
  Header,
  Redirect,
  ParseIntPipe,
  Query,
  Res,
} from '@nestjs/common';
import { SamplesService } from './samples.service';
import { CreateSampleDto } from './dto/create-sample.dto';
import { UpdateSampleDto } from './dto/update-sample.dto';
import { Response } from 'express';

@Controller('samples')
export class SamplesController {
  constructor(private readonly samplesService: SamplesService) {}

  // Http Status Code 지정
  // http://localhost:3000/samples
  @HttpCode(202)
  @Header('Custom', 'Test Header2')
  @Get('/test1')
  findAll() {
    return this.samplesService.findAll();
  }

  // TODO: 위와 동일한 결과를 생성
  // @HttpCode(202)
  // @Header('Custom', 'Test Header')
  @Get()
  findAll(@Res({}) res: Response) {
    console.log('test!!!!');
    const users = this.samplesService.findAll();
    return users;
  }

  @HttpCode(202)
  @Header('Custom', 'Test Header2')
  @Get('/test2')
  findAll() {
    return this.samplesService.findAll();
  }

  // Redirect 적용
  // QueryString Params
  // 서브 라우트의 정의 순서가 컨트롤러 동작에 영향
  // http://localhost:3000/samples/redirect/docs
  // http://localhost:3000/samples/redirect/docs?version=5
  @Get('redirect/docs')
  @Redirect('https://docs.nestjs.com', 301)
  getDocs(@Query('version') version) {
    console.log('redirect controller!!!!');
    if (version && version === '5') {
      return { url: 'https://docs.nestjs.com/v5/ ' };
    }
    return this.samplesService.findAll();
  }

  // Custom Header 적용
  // Nan이 Validation이 제대로 안됨
  // http://localhost:3000/samples/1
  // @Header('Custom', 'Test Header')
  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   console.log('id is string type:::', id);
  //   if (+id < 1) {
  //     throw new BadRequestException('id는 0보다 큰 값이어야 합니다.');
  //   } else {
  //     console.log('id boolean', +id < 1);
  //     console.log('id:::', +id);
  //   }
  //   return this.samplesService.findOne(+id);
  // }

  // TODO: Parameter Validation 적용
  // @Get(':id')
  // findOneWithHeader(@Param('id', ParseIntPipe) id: number) {
  //   console.log('id is number type:::', id);
  //   return this.samplesService.findOne(+id);
  // }

  // Body 사용법
  // http://localhost:3000/samples
  @Post()
  create(@Body() createSampleDto: CreateSampleDto) {
    return this.samplesService.create(createSampleDto);
  }

  // http://localhost:3000/samples/1
  @Put(':id')
  update(@Param('id') id: string, @Body() updateSampleDto: UpdateSampleDto) {
    return this.samplesService.update(+id, updateSampleDto);
  }

  // http://localhost:3000/samples/1
  @Patch(':id')
  updateName(
    @Param('id') id: string,
    @Body() updateSampleDto: UpdateSampleDto,
  ) {
    return this.samplesService.update(+id, updateSampleDto);
  }

  // http://localhost:3000/samples/1
  // @Delete(':sampleId/memo/:memoId')
  // removeSampleMemo(@Param() params: { [key: string]: string }) {
  //   console.log(`sampleId: ${params.sampleId}, memoId: ${params.memoId}`);
  //   return `sampleId: ${params.sampleId}, memoId: ${params.memoId}`;
  // }

  // http://localhost:3000/samples/1
  @Delete(':sampleId/memo/:memoId')
  removeSampleCart(
    @Param('sampleId') sampleId: string,
    @Param('memoId') memoId: string,
  ) {
    console.log(`sampleId: ${sampleId}, memoId: ${memoId}`);
    return `userId: ${sampleId}, memoId: ${memoId}`;
  }
}
