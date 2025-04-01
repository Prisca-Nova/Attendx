import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { LunchAttendanceRepository } from '../repositories/attendance.repository';
import { CompanyRepository } from '../repositories/company.repository';
import { EmployeeRepository } from '../repositories/employee.repository';
import { Attendance} from '../entities/attendance.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AttendanceCronService {
  private readonly logger = new Logger(AttendanceCronService.name);

  constructor(
    private readonly attendanceRepository: LunchAttendanceRepository,
    private readonly companyRepository: CompanyRepository,
    private readonly employeeRepository: EmployeeRepository,
  ) {}

  
  // Run every weekday at 11:30 AM to prepare lunch attendance records
  @Cron('0 30 11 * * 1-5')
  async createLunchAttendanceRecords() {
    this.logger.log('Creating lunch attendance records for today');
    
    const today = new Date();
    
    try {
      // Get all companies
      const companies = await this.companyRepository.find();
      
      for (const company of companies) {
        // Get all employees for each company
        const employees = await this.employeeRepository.findEmployees(company);
        
        // Check if lunch records already exist for today
        const existingRecords = await this.attendanceRepository.find({
          where: {
            company: { id: company.id },
            date: today,
          }
        });
        
        // Get list of employees who already have lunch records
        const employeesWithRecords = new Set(
          existingRecords.map(record => record.employee?.id?.toString())
        );
        
        // Create records for employees who don't have them yet
        const newRecords: Attendance[] = [];
        
        for (const employee of employees) {
          if (!employeesWithRecords.has(employee.id.toString())) {
            const attendance = new Attendance();
            attendance.employee = employee;
            attendance.company = company;
            attendance.date = today;
            attendance.timeIn = '00:00'; // Default value, will be updated when employee goes to lunch
            attendance.timeOut = '00:00'; // Default value, will be updated when employee returns from lunch
            attendance.signature = ''; // Will be updated when signed
            
            newRecords.push(attendance);
          }
        }
        
        if (newRecords.length > 0) {
          await this.attendanceRepository.save(newRecords);
          this.logger.log(`Created ${newRecords.length} lunch attendance records for company ${company.name}`);
        }
      }
      
      this.logger.log('Lunch attendance record creation completed');
    } catch (error) {
      this.logger.error('Error creating lunch attendance records:', error.stack);
    }
  }
  
  // Run every weekday at 11:30 PM to check for missing attendance records
  @Cron('0 30 23 * * 1-5')
  async checkMissingAttendanceRecords() {
    this.logger.log('Checking for missing attendance entries');
    
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];
    
    try {
      // Find all attendance records with default values still set
      const incompleteAttendances = await this.attendanceRepository.find({
        where: [
          { date: today, timeIn: '00:00' },
          { date: today, timeOut: '00:00' }
        ],
        relations: ['employee', 'company']
      });
      
      if (incompleteAttendances.length > 0) {
        this.logger.warn(`Found ${incompleteAttendances.length} incomplete attendance records for today`);
        
        // Here you could implement notification logic to alert managers or HR
        // about employees who didn't record their attendance
        
        // For example:
        // await this.notificationService.sendAlertToManagers(incompleteAttendances);
      }
    } catch (error) {
      this.logger.error('Error checking missing attendance records:', error.stack);
    }
  }
}