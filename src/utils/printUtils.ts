import type { Provider } from "../types/provider";
import type { ProviderSchedule, Appointment } from "../types/appointment";

// Print provider schedule
export const printSchedule = (
  provider: Provider,
  schedule: ProviderSchedule,
  date: string
) => {
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  const html = generateScheduleHTML(provider, schedule, date);
  
  printWindow.document.write(html);
  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
  printWindow.close();
};

// Export schedule to PDF
export const exportScheduleToPDF = async (
  provider: Provider,
  schedule: ProviderSchedule,
  date: string
) => {
  try {
    // Create a temporary iframe for PDF generation
    const iframe = document.createElement('iframe');
    iframe.style.position = 'absolute';
    iframe.style.left = '-9999px';
    iframe.style.width = '210mm';
    iframe.style.height = '297mm';
    document.body.appendChild(iframe);

    const html = generateScheduleHTML(provider, schedule, date, true);
    
    if (iframe.contentDocument) {
      iframe.contentDocument.write(html);
      iframe.contentDocument.close();
      
      // Wait for content to load
      setTimeout(() => {
        if (iframe.contentWindow) {
          iframe.contentWindow.print();
        }
        document.body.removeChild(iframe);
      }, 1000);
    }
  } catch (error) {
    console.error('Failed to export PDF:', error);
  }
};

// Generate HTML for schedule printing
const generateScheduleHTML = (
  provider: Provider,
  schedule: ProviderSchedule,
  date: string,
  isPDF: boolean = false
): string => {
  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Provider Schedule - ${provider.firstName} ${provider.lastName}</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 20px;
          color: #333;
        }
        .header {
          text-align: center;
          border-bottom: 2px solid #4f46e5;
          padding-bottom: 20px;
          margin-bottom: 30px;
        }
        .provider-info {
          background-color: #f8fafc;
          padding: 20px;
          border-radius: 8px;
          margin-bottom: 30px;
        }
        .schedule-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 15px;
          margin-bottom: 30px;
        }
        .time-slot {
          padding: 12px;
          border: 2px solid #e5e7eb;
          border-radius: 6px;
          text-align: center;
        }
        .available {
          background-color: #dcfce7;
          border-color: #16a34a;
        }
        .booked {
          background-color: #f3f4f6;
          border-color: #6b7280;
        }
        .blocked {
          background-color: #fee2e2;
          border-color: #dc2626;
        }
        .working-hours {
          background-color: #dbeafe;
          padding: 15px;
          border-radius: 6px;
          margin-bottom: 20px;
        }
        .legend {
          display: flex;
          gap: 20px;
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #e5e7eb;
        }
        .legend-item {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .legend-color {
          width: 20px;
          height: 20px;
          border-radius: 4px;
          border: 2px solid;
        }
        @media print {
          body { margin: 0; }
          .no-print { display: none; }
        }
        ${isPDF ? `
          @page {
            size: A4;
            margin: 20mm;
          }
        ` : ''}
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Provider Schedule</h1>
        <h2>${provider.title} ${provider.firstName} ${provider.lastName}</h2>
        <p>${formattedDate}</p>
      </div>

      <div class="provider-info">
        <h3>Provider Information</h3>
        <p><strong>Specialization:</strong> ${provider.specialization}</p>
        <p><strong>Department:</strong> ${provider.department}</p>
        <p><strong>License Number:</strong> ${provider.licenseNumber}</p>
        <p><strong>Experience:</strong> ${provider.experience} years</p>
      </div>

      ${schedule.isWorkingDay ? `
        <div class="working-hours">
          <h3>Working Hours</h3>
          <p><strong>Time:</strong> ${schedule.workingHours.startTime} - ${schedule.workingHours.endTime}</p>
          ${schedule.specialNotes ? `<p><strong>Notes:</strong> ${schedule.specialNotes}</p>` : ''}
        </div>

        <h3>Time Slots</h3>
        <div class="schedule-grid">
          ${schedule.timeSlots.map(slot => `
            <div class="time-slot ${
              slot.isBlocked ? 'blocked' : 
              !slot.isAvailable ? 'booked' : 
              'available'
            }">
              <div><strong>${slot.startTime} - ${slot.endTime}</strong></div>
              <div>${
                slot.isBlocked ? `Blocked: ${slot.blockReason || 'Unavailable'}` :
                !slot.isAvailable ? 'Booked' :
                'Available'
              }</div>
            </div>
          `).join('')}
        </div>

        <div class="legend">
          <div class="legend-item">
            <div class="legend-color available" style="background-color: #dcfce7; border-color: #16a34a;"></div>
            <span>Available</span>
          </div>
          <div class="legend-item">
            <div class="legend-color booked" style="background-color: #f3f4f6; border-color: #6b7280;"></div>
            <span>Booked</span>
          </div>
          <div class="legend-item">
            <div class="legend-color blocked" style="background-color: #fee2e2; border-color: #dc2626;"></div>
            <span>Blocked</span>
          </div>
        </div>
      ` : `
        <div style="text-align: center; padding: 60px 0;">
          <h3>Non-Working Day</h3>
          <p>${provider.firstName} ${provider.lastName} is not available on this date.</p>
        </div>
      `}

      <div style="margin-top: 40px; text-align: center; font-size: 12px; color: #6b7280;">
        <p>Generated on ${new Date().toLocaleString()}</p>
      </div>
    </body>
    </html>
  `;
};

// Print appointment details
export const printAppointment = (appointment: Appointment) => {
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  const html = generateAppointmentHTML(appointment);
  
  printWindow.document.write(html);
  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
  printWindow.close();
};

// Generate HTML for appointment printing
const generateAppointmentHTML = (appointment: Appointment): string => {
  const formattedDate = new Date(appointment.appointmentDate).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Appointment Details</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 20px;
          color: #333;
        }
        .header {
          text-align: center;
          border-bottom: 2px solid #4f46e5;
          padding-bottom: 20px;
          margin-bottom: 30px;
        }
        .appointment-info {
          background-color: #f8fafc;
          padding: 20px;
          border-radius: 8px;
          margin-bottom: 20px;
        }
        .info-row {
          display: flex;
          margin-bottom: 10px;
        }
        .info-label {
          font-weight: bold;
          width: 150px;
        }
        .status-badge {
          display: inline-block;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: bold;
        }
        @media print {
          body { margin: 0; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Appointment Details</h1>
        <p>Appointment ID: ${appointment.appointmentId}</p>
      </div>

      <div class="appointment-info">
        <h3>Patient Information</h3>
        <div class="info-row">
          <span class="info-label">Name:</span>
          <span>${appointment.patient?.firstName} ${appointment.patient?.lastName}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Contact:</span>
          <span>${appointment.patient?.mobileNumber || 'N/A'}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Email:</span>
          <span>${appointment.patient?.email || 'N/A'}</span>
        </div>
      </div>

      <div class="appointment-info">
        <h3>Provider Information</h3>
        <div class="info-row">
          <span class="info-label">Name:</span>
          <span>${appointment.provider?.title} ${appointment.provider?.firstName} ${appointment.provider?.lastName}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Specialization:</span>
          <span>${appointment.provider?.specialization}</span>
        </div>
      </div>

      <div class="appointment-info">
        <h3>Appointment Details</h3>
        <div class="info-row">
          <span class="info-label">Date:</span>
          <span>${formattedDate}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Time:</span>
          <span>${appointment.startTime} - ${appointment.endTime}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Type:</span>
          <span>${appointment.type}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Priority:</span>
          <span>${appointment.priority}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Status:</span>
          <span class="status-badge">${appointment.status}</span>
        </div>
        ${appointment.reason ? `
        <div class="info-row">
          <span class="info-label">Reason:</span>
          <span>${appointment.reason}</span>
        </div>
        ` : ''}
        ${appointment.notes ? `
        <div class="info-row">
          <span class="info-label">Notes:</span>
          <span>${appointment.notes}</span>
        </div>
        ` : ''}
      </div>

      <div style="margin-top: 40px; text-align: center; font-size: 12px; color: #6b7280;">
        <p>Generated on ${new Date().toLocaleString()}</p>
      </div>
    </body>
    </html>
  `;
};
