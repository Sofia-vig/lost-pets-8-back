import { Report } from "../models";

export class ReportController {
  async reportPet(data) {
    const { reporter_name, phone_number, message, petId } = data;
    const newReport = await Report.create({
      reporter_name,
      phone_number,
      message,
      petId,
    });
    return newReport;
  }
}
