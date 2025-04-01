import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    ParseUUIDPipe,
    Post,
    Put,
    UploadedFile,
    UseGuards,
    UseInterceptors,
  } from '@nestjs/common';
  import { FileInterceptor } from '@nestjs/platform-express';
  import { ApiConsumes, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
  import { UUID } from 'crypto';
  import { AuthGuard } from 'src/auth/auth.guard';
  import { HttpResponse } from 'src/common/dto/http-response';
  import { CreateEmployeeDto } from '../dto/create-employee.dto';
  import { UpdateEmployeeDto } from '../dto/update-employee.dto';
  import { Employee } from '../entities/employee.entity';
  import { EmployeeService } from '../service/employee.service';
  
  @ApiTags('Employee')
  @UseGuards(AuthGuard)
  @Controller('employees')
  export class EmployeeController {
    constructor(private readonly employeeService: EmployeeService) {}
  
    @Get()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Get all employees' })
    @ApiResponse({ status: 200, description: 'List of employees' })
    async getAllEmployees(): Promise<HttpResponse<Employee[]>> {
      const employees = await this.employeeService.getAllEmployees();
      return HttpResponse.success(employees, 'Employees retrieved successfully');
    }
  
    @Get(':id')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Get employee by ID' })
    @ApiResponse({ status: 200, description: 'Employee retrieved' })
    async getEmployeeById(@Param('id') id: UUID): Promise<HttpResponse<Employee>> {
      const employee = await this.employeeService.getEmployeeById(id);
      return HttpResponse.success(employee, 'Employee retrieved successfully');
    }
  
    @Post()
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: 'Create employee' })
    @ApiResponse({ status: 201, description: 'Employee created' })
    async createEmployee(@Body() createEmployeeDto: CreateEmployeeDto): Promise<HttpResponse<Employee>> {
      const employee = await this.employeeService.createEmployee(createEmployeeDto);
      return HttpResponse.success(employee, 'Employee created successfully');
    }
  
    @Put(':id')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Update employee' })
    @ApiResponse({ status: 200, description: 'Employee updated' })
    async updateEmployee(
      @Param('id') id: UUID,
      @Body() updateEmployeeDto: UpdateEmployeeDto,
    ): Promise<HttpResponse<Employee>> {
      const employee = await this.employeeService.updateEmployee(id, updateEmployeeDto);
      return HttpResponse.success(employee, 'Employee updated successfully');
    }

    @Delete(':id')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Delete employee' })
    @ApiResponse({ status: 200, description: 'Employee deleted' })
    async deleteEmployee(
    @Param('id', ParseUUIDPipe) id: UUID
    ): Promise<HttpResponse<null>> {
    await this.employeeService.deleteEmployee(id);
    return HttpResponse.success(null, 'Employee deleted successfully');
    }

  
    @Post('import')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Import employees from file' })
    @ApiResponse({ status: 200, description: 'Employees imported' })
    @UseInterceptors(FileInterceptor('file'))

    async importEmployees(@UploadedFile() file: Express.Multer.File): Promise<HttpResponse<{ imported: number }>> {
      const result = await this.employeeService.importEmployeesFromFile(file);
      return HttpResponse.success(result, 'Employees imported successfully');
    }
  
    @Post('csv/:companyId')
    @ApiOperation({ summary: 'Import employees from CSV file' })
    @ApiConsumes('multipart/form-data')
    @ApiParam({ name: 'companyId', required: true, type: String })
    @ApiResponse({
      status: 200,
      description: 'Employees imported successfully',
      type: HttpResponse,
    })
    @UseInterceptors(
      FileInterceptor('file', {
        limits: {
          fileSize: 5 * 1024 * 1024, // 5MB limit
        },
        fileFilter: (req, file, callback) => {
          if (!file.originalname.match(/\.(csv)$/)) {
            return callback(new BadRequestException('Only CSV files are allowed'), false);
          }
          callback(null, true);
        },
      }),
    )
    async importEmployeesFromCsv(
      @UploadedFile() file: Express.Multer.File,
      @Param('companyId', ParseUUIDPipe) companyId: UUID,
    ): Promise<HttpResponse<{ importedCount: number }>> {
      if (!file) {
        throw new BadRequestException('No file uploaded');
      }
  
      const importedCount = await this.employeeService.importEmployeesFromCsv(
        file.buffer,
        companyId,
      );
  
      return HttpResponse.success(
        { importedCount },
        `Successfully imported ${importedCount} employees`,
      );
    }
  }