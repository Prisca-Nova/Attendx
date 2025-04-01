import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { UUID } from 'crypto';
import * as csv from 'csv-parser';
import * as fs from 'fs';
import * as path from 'path';
import * as mammoth from 'mammoth';
import { CompanyService } from './company.service';
import { CreateEmployeeDto } from '../dto/create-employee.dto';
import { Employee } from '../entities/employee.entity';
import { EmployeeRepository } from '../repositories/employee.repository';
import { UpdateEmployeeDto } from '../dto/update-employee.dto';
import { Company } from '../entities/company.entity';
import { Readable } from 'stream';
import { CompanyRepository } from '../repositories/company.repository';

@Injectable()
export class EmployeeService {
logger:Logger = new Logger(EmployeeService.name)
  constructor(
    private readonly employeeRepository: EmployeeRepository,
    private readonly companyService: CompanyService,
    private readonly companyRepository:CompanyRepository,
  ) {}

  async getAllEmployees(): Promise<Employee[]> {
    return await this.employeeRepository.find({
      relations: ['company'],
    });
  }

  async getEmployeeById(id: UUID): Promise<Employee> {
    const employee = await this.employeeRepository.findOneById(id);
    if (!employee) {
      throw new NotFoundException('Employee not found');
    }
    return employee;
  }

  async createEmployee(createEmployeeDto: CreateEmployeeDto): Promise<Employee> {
    const company = await this.companyService.findOne(createEmployeeDto.company.id);
    
    const employee = new Employee();
    employee.firstName = createEmployeeDto.firstName;
    employee.lastName = createEmployeeDto.lastName;
    employee.email = createEmployeeDto.email;
    employee.contact = createEmployeeDto.contact;
    employee.employeeId = createEmployeeDto.employeeId;
    employee.company = company;

    return await this.employeeRepository.save(employee);
  }

  async updateEmployee(id: UUID, updateEmployeeDto: UpdateEmployeeDto): Promise<Employee> {
    const employee = await this.getEmployeeById(id);

    if (updateEmployeeDto.firstName) {
      employee.firstName = updateEmployeeDto.firstName;
    }
    if (updateEmployeeDto.lastName) {
      employee.lastName = updateEmployeeDto.lastName;
    }
    if (updateEmployeeDto.email) {
      employee.email = updateEmployeeDto.email;
    }
    if (updateEmployeeDto.phoneNumber) {
      employee.contact = updateEmployeeDto.phoneNumber;
    }

    return await this.employeeRepository.save(employee);
  }

  async deleteEmployee(id: UUID): Promise<void> {
    const employee = await this.employeeRepository.findOne({ where: { id } });
    
    if (!employee) {
      throw new NotFoundException(`Employee with ID ${id} not found`);
    }
    
    await this.employeeRepository.remove(employee);
  }

  async importEmployeesFromFile(file: Express.Multer.File): Promise<{ imported: number }> {
    const fileExt = path.extname(file.originalname).toLowerCase();
    
    if (fileExt === '.csv') {
      return this.importFromCsv(file);
    } else if (fileExt === '.docx') {
      return this.importFromDocx(file);
    } else if (fileExt === '.pdf') {
      throw new BadRequestException('PDF parsing is not supported yet');
    } else {
      throw new BadRequestException('Unsupported file format');
    }
  }

  private async importFromCsv(file: Express.Multer.File): Promise<{ imported: number }> {
    const results = [];
    const tempFilePath = path.join(process.cwd(), 'temp', `${Date.now()}_${file.originalname}`);
    
    // Ensure temp directory exists
    if (!fs.existsSync(path.join(process.cwd(), 'temp'))) {
      fs.mkdirSync(path.join(process.cwd(), 'temp'));
    }
    
    // Write file to temp location
    fs.writeFileSync(tempFilePath, file.buffer);
    
    return new Promise((resolve, reject) => {
      fs.createReadStream(tempFilePath)
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', async () => {
          try {
            // Clean up temp file
            fs.unlinkSync(tempFilePath);
            
            let importedCount = 0;
            for (const row of results) {
              try {
                const companyId = row.companyId;
                const company = await this.companyService.findOne(companyId);
                
                const employee = new Employee();
                employee.firstName = row.firstName;
                employee.lastName = row.lastName;
                employee.email = row.email;
                employee.contact = row.contact;
                employee.employeeId = row.employeeId;
                employee.company = company;
                
                await this.employeeRepository.save(employee);
                importedCount++;
              } catch (error) {
                console.error(`Error importing row: ${JSON.stringify(row)}`, error);
                // Continue with next row
              }
            }
            
            resolve({ imported: importedCount });
          } catch (error) {
            reject(error);
          }
        })
        .on('error', (error) => {
          // Clean up temp file on error
          if (fs.existsSync(tempFilePath)) {
            fs.unlinkSync(tempFilePath);
          }
          reject(error);
        });
    });
  }

  private async importFromDocx(file: Express.Multer.File): Promise<{ imported: number }> {
    const tempFilePath = path.join(process.cwd(), 'temp', `${Date.now()}_${file.originalname}`);
    
    // Ensure temp directory exists
    if (!fs.existsSync(path.join(process.cwd(), 'temp'))) {
      fs.mkdirSync(path.join(process.cwd(), 'temp'));
    }
    
    // Write file to temp location
    fs.writeFileSync(tempFilePath, file.buffer);
    
    try {
      const result = await mammoth.extractRawText({ path: tempFilePath });
      const text = result.value;
      
      // Clean up temp file
      fs.unlinkSync(tempFilePath);
      
      // Parse the text (simple implementation, might need more robust parsing)
      const lines = text.split('\n').filter(line => line.trim() !== '');
      
      let importedCount = 0;
      // Assuming first line is header and subsequent lines are data
      // Format: firstName,lastName,email,contact,employeeId,companyId
      for (let i = 1; i < lines.length; i++) {
        try {
          const fields = lines[i].split(',').map(field => field.trim());
          if (fields.length >= 6) {
            const companyId = fields[5] as UUID;
            const company = await this.companyService.findOne(companyId);
            
            const employee = new Employee();
            employee.firstName = fields[0];
            employee.lastName = fields[1];
            employee.email = fields[2];
            employee.contact = fields[3];
            employee.employeeId = fields[4];
            employee.company = company;
            
            await this.employeeRepository.save(employee);
            importedCount++;
          }
        } catch (error) {
          console.error(`Error importing line: ${lines[i]}`, error);
          // Continue with next line
        }
      }
      
      return { imported: importedCount };
    } catch (error) {
      // Clean up temp file on error
      if (fs.existsSync(tempFilePath)) {
        fs.unlinkSync(tempFilePath);
      }
      throw error;
    }
  }

  /**
   * Import employees from a CSV file
   * @param file The CSV file buffer
   * @param companyId The company ID to associate employees with
   * @returns The number of employees imported
   */
  async importEmployeesFromCsv(file: Buffer, companyId: UUID): Promise<number> {
    const company = await this.companyRepository.findOneById(companyId);
    if (!company) {
      throw new BadRequestException('Company not found');
    }

    const results = [];
    let errorCount = 0;

    // Parse the CSV file
    await new Promise<void>((resolve, reject) => {
      const readableStream = new Readable();
      readableStream.push(file);
      readableStream.push(null);

      readableStream
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('error', (err) => {
          this.logger.error(`Error parsing CSV: ${err.message}`);
          reject(new BadRequestException('Invalid CSV format'));
        })
        .on('end', () => {
          resolve();
        });
    });

    // Process each row in the CSV
    for (const row of results) {
      try {
        await this.createEmployeeFromCsvRow(row, company);
      } catch (error) {
        this.logger.error(`Error importing employee: ${error.message}`);
        errorCount++;
      }
    }

    const importedCount = results.length - errorCount;
    this.logger.log(`Imported ${importedCount} employees (${errorCount} errors)`);
    return importedCount;
  }

  /**
   * Create an employee from a CSV row
   * @param row The CSV row data
   * @param company The company to associate the employee with
   * @returns The created employee
   */
  private async createEmployeeFromCsvRow(row: any, company: Company): Promise<Employee> {
    // Validate required fields
    if (!row.firstName || !row.lastName || !row.email) {
      throw new BadRequestException('Missing required fields in CSV row');
    }

    // Check if the employee already exists
    const existingEmployee = await this.employeeRepository.findOne({
      where: { email: row.email, company: { id: company.id } },
    });

    if (existingEmployee) {
      throw new BadRequestException(`Employee with email ${row.email} already exists`);
    }

    // Create a new employee
    const employee = new Employee();
    employee.firstName = row.firstName;
    employee.lastName = row.lastName;
    employee.email = row.email;
    employee.contact = row.contact || '';
    employee.employeeId = row.employeeId;
    employee.company = company;

    return await this.employeeRepository.save(employee);
  }
}