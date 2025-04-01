import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { CompanyService } from '../service/company.service';
import { CreateCompanyDto } from '../dto/create-company.dto';
import { UpdateCompanyDto } from '../dto/update-company.dto';
import { HttpResponse } from '../../common/dto/http-response';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CompanyPojo } from '../pojo/company.pojo';
import { CreateEmployeeDto } from '../dto/create-employee.dto';
import { UUID } from 'crypto';
import { EmployeePojo } from '../pojo/employee.pojo';
import { AuthGuard } from 'src/auth/auth.guard';
import { RoleGuard } from 'src/auth/role/role.guard';
import { Roles } from 'src/common/decorator/role.decorator';
import { UserRole } from 'src/user/entities/user.entity';

@Controller('company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Post()
  @UseGuards(AuthGuard)
  @UseGuards(AuthGuard,RoleGuard)
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new company' })
  @ApiResponse({ type: CreateCompanyDto })
  async create(
    @Body() createCompanyDto: CreateCompanyDto,
  ): Promise<HttpResponse<CreateCompanyDto>> {
    return HttpResponse.success<CreateCompanyDto>(
      await this.companyService.create(createCompanyDto),
      'Company created successfully',
    );
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all companies' })
  @ApiResponse({ type: [CompanyPojo] })
  findAll() {
    return this.companyService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a company by id' })
  @ApiResponse({ type: CompanyPojo })
  findOne(@Param('id') id: UUID) {
    return this.companyService.findOne(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id') id: UUID,
    @Body() updateCompanyDto: UpdateCompanyDto,
  ): Promise<HttpResponse<UpdateCompanyDto>> {
    return HttpResponse.success<UpdateCompanyDto>(
      await this.companyService.update(id, updateCompanyDto),
      'Company updated successfully',
    );
  }
}
@Controller('company/:companyId/employee')
export class EmployeeController {
  constructor(private readonly companyService: CompanyService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Create a new employee' })
  @ApiResponse({ type: CreateEmployeeDto })
  async createEmployee(
    @Param('companyId') companyId: UUID,
    @Body() createEmployeeDto: CreateEmployeeDto,
  ): Promise<HttpResponse<any>> {
    const company = await this.companyService.findOne(companyId);
    await this.companyService.createEmployee(company, createEmployeeDto);
    return HttpResponse.success<any>();
  }
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all employees' })
  @ApiResponse({ type: [CompanyPojo] })
  async findAll(
    @Param('companyId') companyId: UUID,
  ): Promise<HttpResponse<EmployeePojo[]>> {
    const company = await this.companyService.findOne(companyId);
    return HttpResponse.success<EmployeePojo[]>(
      await this.companyService.findAllEmployees(company),
      'Employees retrieved successfully',
    );
  }
}
