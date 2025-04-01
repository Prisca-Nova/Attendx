import {
    BadRequestException,
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    NotFoundException,
    Param,
    Post,
    Put,
    Query,
    UseGuards,
  } from '@nestjs/common';
  import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
  import { UUID } from 'crypto';
  import { Request } from '@nestjs/common';
  import { AuthGuard } from 'src/auth/auth.guard';
  import { HttpResponse } from 'src/common/dto/http-response';
  import { LunchAttendanceService } from '../service/attendance.service';
  import { CreateAttendanceDto, RecordLunchAttendanceDto,UpdateAttendanceDto } from '../dto/attendance.dto';
  import { Attendance } from '../entities/attendance.entity';
  import { EmployeeService } from '../service/employee.service';

  
  @ApiTags('Attendance')
  @UseGuards(AuthGuard)
  @Controller('attendance')
  @UseGuards(AuthGuard)
  export class AttendanceController {
    constructor(
        private readonly attendanceService: LunchAttendanceService,
        private readonly employeeService: EmployeeService
    ) {}
  
    @Get()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Get all attendances' })
    @ApiResponse({ status: 200, description: 'List of attendances' })
    async getAllAttendances(
        @Request() req: any,  
      @Query('startDate') startDate?: Date,
      @Query('endDate') endDate?: Date,
      @Query('employeeId') employeeId?: UUID,
    ): Promise<HttpResponse<Attendance[]>> {
    const currentUser = req.user
      const attendances = await this.attendanceService.getAllAttendances(currentUser, startDate, endDate, employeeId);
      return HttpResponse.success(attendances, 'Attendances retrieved successfully');
    }
  
    @Get(':id')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Get attendance by ID' })
    @ApiResponse({ status: 200, description: 'Attendance retrieved' })
    async getAttendanceById(@Param('id') id: UUID): Promise<HttpResponse<Attendance>> {
      const attendance = await this.attendanceService.getLunchAttendanceById(id);
      return HttpResponse.success(attendance, 'Attendance retrieved successfully');
    }
  
    @Post()
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: 'Create attendance' })
    @ApiResponse({ status: 201, description: 'Attendance created' })
    async createAttendance(
        @Request() req: any,
        @Body() createAttendanceDto: CreateAttendanceDto
    ): Promise<HttpResponse<Attendance>> {
        const currentUser = req.user
      const attendance = await this.attendanceService.createLunchAttendance(createAttendanceDto, currentUser);
      return HttpResponse.success(attendance, 'Attendance created successfully');
    }
  
    @Put(':id')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Update attendance' })
    @ApiResponse({ status: 200, description: 'Attendance updated' })
    async updateAttendance(
      @Param('id') id: UUID,
      @Body() updateAttendanceDto: UpdateAttendanceDto,
      @Request() req:any
    ): Promise<HttpResponse<Attendance>> {
        const currentUser = req.user
      const attendance = await this.attendanceService.updateAttendance(id, updateAttendanceDto, currentUser);
      return HttpResponse.success(attendance, 'Attendance updated successfully');
    }
  
    @Post('lunch')
@HttpCode(HttpStatus.CREATED)
@ApiOperation({ summary: 'Record lunch attendance' })
@ApiResponse({ status: 201, description: 'Lunch attendance recorded' })
async recordLunchAttendance(
  @Body() recordLunchAttendanceDto: RecordLunchAttendanceDto, 
  @Request() req: any
): Promise<HttpResponse<Attendance>> {
  const currentUser = req.user;

  if (!recordLunchAttendanceDto.employeeId) {
    throw new BadRequestException('Employee ID is required');
  }

  // Fetch the employee to get the associated company
  const employee = await this.employeeService.getEmployeeById(recordLunchAttendanceDto.employeeId);
  if (!employee) {
    throw new NotFoundException('Employee not found');
  }

  // Construct CreateAttendanceDto including companyId
  const createAttendanceDto: CreateAttendanceDto = {
    ...recordLunchAttendanceDto,
    companyId: employee.company.id,  // Ensure companyId is set correctly
    timeOut: recordLunchAttendanceDto.timeOut || new Date().toISOString(),  // Default to current time if missing
  };

  const attendance = await this.attendanceService.createLunchAttendance(createAttendanceDto, currentUser);
  return HttpResponse.success(attendance, 'Lunch attendance recorded successfully');
}
  }