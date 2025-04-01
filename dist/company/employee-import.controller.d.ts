import { EmployeeImportService } from './employee-import.service';
import { HttpResponse } from '../common/dto/http-response';
import { UUID } from 'crypto';
export declare class EmployeeImportController {
    private readonly employeeImportService;
    constructor(employeeImportService: EmployeeImportService);
    importEmployeesFromCsv(file: Express.Multer.File, companyId: UUID): Promise<HttpResponse<{
        importedCount: number;
    }>>;
}
