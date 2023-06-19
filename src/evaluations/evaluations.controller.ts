import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Put,
} from '@nestjs/common';
import { EvaluationsService } from './evaluations.service';
import { CreateEvaluationDto } from './dto/create-evaluation.dto';
import { UpdateEvaluationDto } from './dto/update-evaluation.dto';
import {
  ApiAcceptedResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOperation,
  ApiTags,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { EvaluationCreatedResult, MessageResult } from 'src/types/resultTypes';

@ApiBearerAuth()
@ApiTags('Evaluations')
@Controller('evaluations')
export class EvaluationsController {
  constructor(private readonly evaluationsService: EvaluationsService) {}

  @Post()
  @ApiCreatedResponse({ description: 'Created Successfully' })
  @ApiUnprocessableEntityResponse({ description: 'Bad Request for entity' })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @ApiOperation({
    summary: 'Evaluation creation',
    description: 'Creation of students evaluation in the database',
  })
  create(
    @Body() createEvaluationDto: CreateEvaluationDto,
  ): Promise<MessageResult> {
    return this.evaluationsService.create(createEvaluationDto);
  }

  @Get('/is-created')
  @ApiAcceptedResponse({ description: 'OK response' })
  @ApiUnprocessableEntityResponse({ description: 'Bad Request for entity' })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @ApiOperation({
    summary: 'Evaluation consultation if a evaluation is registered',
    description:
      'Consultation of registered evaluation from speciality and date',
  })
  findBySpecialityAndDate(
    @Query('rotation_speciality_id') rotation_speciality_id: string,
    @Query('rotation_date_id') rotation_date_id: string,
  ): Promise<EvaluationCreatedResult | MessageResult> {
    return this.evaluationsService.findBySpecialityAndDate(
      +rotation_speciality_id,
      +rotation_date_id,
    );
  }

  @Put(':id')
  @ApiAcceptedResponse({ description: 'OK response' })
  @ApiUnprocessableEntityResponse({ description: 'Bad Request for entity' })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @ApiOperation({
    summary: 'Specific evaluation update',
    description:
      'Update of a specific evaluation and its student grades in the database',
  })
  update(
    @Param('id') id: string,
    @Body() updateEvaluationDto: UpdateEvaluationDto,
  ): Promise<MessageResult> {
    return this.evaluationsService.update(+id, updateEvaluationDto);
  }
}
