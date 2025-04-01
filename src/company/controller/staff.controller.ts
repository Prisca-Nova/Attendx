import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
    UseGuards,
    Request,
  } from '@nestjs/common';
  import { ApiOperation, ApiResponse, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
  import { StaffService } from '../service/staff.service';
  import { CreateStaffDto } from '../dto/create-staff.dto';
  import { UpdateStaffDto } from '../dto/update-staff.dto';
  import { HttpResponse } from 'src/common/dto/http-response';
  import { AuthGuard } from 'src/auth/auth.guard';
  import { Staff } from '../entities/staff.entity';
  import { UUID } from 'crypto';
  import { AuthenticatedRequest } from 'src/common/types/express';
  
  @ApiTags('Staff')
  @UseGuards(AuthGuard)
  @Controller('company/:companyId/staff')
  @ApiBearerAuth()
  export class StaffController {
    constructor(private readonly staffService: StaffService) {}
  
    @Post()
    @ApiOperation({ summary: 'Create a new staff member' })
    @ApiResponse({ status: 201, description: 'Staff created successfully' })
    async createStaff(
      @Body() createStaffDto: CreateStaffDto,
      @Request() req: AuthenticatedRequest,
    ): Promise<HttpResponse<Staff>> {
      const staff = await this.staffService.createStaff(createStaffDto, req.user);
      return HttpResponse.success(staff, 'Staff created successfully');
    }
  
    @Get(':id')
    @ApiOperation({ summary: 'Get staff by ID' })
    @ApiResponse({ status: 200, description: 'Staff retrieved successfully' })
    async getStaffById(@Param('id') id: UUID): Promise<HttpResponse<Staff>> {
      const staff = await this.staffService.getStaffById(id);
      return HttpResponse.success(staff, 'Staff retrieved successfully');
    }
  
    @Get('company/:companyId')
    @ApiOperation({ summary: 'Get all staff by company ID' })
    @ApiResponse({ status: 200, description: 'Staff retrieved successfully' })
    async getStaffByCompany(@Param('companyId') companyId: UUID): Promise<HttpResponse<Staff[]>> {
      const staff = await this.staffService.getStaffByCompany(companyId);
      return HttpResponse.success(staff, 'Staff retrieved successfully');
    }
  
    @Get('user/:userId')
    @ApiOperation({ summary: 'Get all staff roles for a user' })
    @ApiResponse({ status: 200, description: 'Staff retrieved successfully' })
    async getStaffByUser(@Param('userId') userId: UUID): Promise<HttpResponse<Staff[]>> {
      const staff = await this.staffService.getStaffByUser(userId);
      return HttpResponse.success(staff, 'Staff retrieved successfully');
    }
  
    @Put(':id')
    @ApiOperation({ summary: 'Update staff' })
    @ApiResponse({ status: 200, description: 'Staff updated successfully' })
    async updateStaff(
      @Param('id') id: UUID,
      @Body() updateStaffDto: UpdateStaffDto,
      @Request() req: AuthenticatedRequest,
    ): Promise<HttpResponse<Staff>> {
      const staff = await this.staffService.updateStaff(id, updateStaffDto, req.user);
      return HttpResponse.success(staff, 'Staff updated successfully');
    }
  
    @Delete(':id')
    @ApiOperation({ summary: 'Delete staff' })
    @ApiResponse({ status: 200, description: 'Staff deleted successfully' })
    async deleteStaff(
      @Param('id') id: UUID,
      @Request() req: AuthenticatedRequest,
    ): Promise<HttpResponse<null>> {
      await this.staffService.deleteStaff(id, req.user);
      return HttpResponse.success(null, 'Staff deleted successfully');
    }
  }