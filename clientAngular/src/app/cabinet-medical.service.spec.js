"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@angular/core/testing");
const cabinet_medical_service_1 = require("./cabinet-medical.service");
describe('CabinetMedicalService', () => {
    beforeEach(() => testing_1.TestBed.configureTestingModule({}));
    it('should be created', () => {
        const service = testing_1.TestBed.get(cabinet_medical_service_1.CabinetMedicalService);
        expect(service).toBeTruthy();
    });
});
//# sourceMappingURL=cabinet-medical.service.spec.js.map