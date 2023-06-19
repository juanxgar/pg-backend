import { Controller, Get } from '@nestjs/common';
import { QuestionsService } from './questions.service';
import {
  ApiAcceptedResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiOperation,
  ApiTags,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { DescriptionExamItem } from 'src/types/entitiesTypes';

@ApiBearerAuth()
@ApiTags('Questions')
@Controller('questions')
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  @Get()
  @ApiAcceptedResponse({ description: 'OK response' })
  @ApiUnprocessableEntityResponse({ description: 'Bad Request for entity' })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @ApiOperation({
    summary: 'Questions consultation',
    description: 'Consultation of registered questions',
  })
  findAll(): Promise<Array<DescriptionExamItem>> {
    return this.questionsService.findAll();
  }
}
