// Mock data for testing appointment features

// Provider data
export const mockProviders = [
  {
    id: "p1",
    name: "Dr. Sarah Johnson",
    specialty: "Cardiology",
    availability: true,
    email: "sarah.johnson@example.com",
    phone: "555-123-4567",
    image: "https://randomuser.me/api/portraits/women/68.jpg"
  },
  {
    id: "p2",
    name: "Dr. Michael Chen",
    specialty: "Pediatrics",
    availability: true,
    email: "michael.chen@example.com",
    phone: "555-234-5678",
    image: "https://randomuser.me/api/portraits/men/32.jpg"
  },
  {
    id: "p3",
    name: "Dr. Emily Rodriguez",
    specialty: "Neurology",
    availability: false,
    email: "emily.rodriguez@example.com",
    phone: "555-345-6789",
    image: "https://randomuser.me/api/portraits/women/45.jpg"
  },
  {
    id: "p4",
    name: "Dr. James Wilson",
    specialty: "Orthopedics",
    availability: true,
    email: "james.wilson@example.com",
    phone: "555-456-7890",
    image: "https://randomuser.me/api/portraits/men/22.jpg"
  }
];

// Patient data
export const mockPatients = [
  {
    patientId: "pat1",
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phone: "555-111-2222",
    dateOfBirth: "1985-06-15"
  },
  {
    patientId: "pat2",
    firstName: "Jane",
    lastName: "Smith",
    email: "jane.smith@example.com",
    phone: "555-222-3333",
    dateOfBirth: "1990-03-22"
  },
  {
    patientId: "pat3",
    firstName: "Robert",
    lastName: "Johnson",
    email: "robert.johnson@example.com",
    phone: "555-333-4444",
    dateOfBirth: "1978-11-30"
  },
  {
    patientId: "pat4",
    firstName: "Maria",
    lastName: "Garcia",
    email: "maria.garcia@example.com",
    phone: "555-444-5555",
    dateOfBirth: "1995-08-10"
  }
];

// Generate appointments for the next 7 days
const generateAppointments = () => {
  const appointments = [];
  const today = new Date();
  
  for (let i = 0; i < 20; i++) {
    const providerId = mockProviders[Math.floor(Math.random() * mockProviders.length)].id;
    const patient = mockPatients[Math.floor(Math.random() * mockPatients.length)];
    
    // Random day within next 7 days
    const appointmentDate = new Date(today);
    appointmentDate.setDate(today.getDate() + Math.floor(Math.random() * 7));
    
    // Random hour between 9 AM and 5 PM
    appointmentDate.setHours(9 + Math.floor(Math.random() * 8), 0, 0, 0);
    
    const endTime = new Date(appointmentDate);
    endTime.setMinutes(endTime.getMinutes() + 30);
    
    appointments.push({
      id: `apt${i + 1}`,
      providerId,
      patientId: patient.patientId,
      patientName: `${patient.firstName} ${patient.lastName}`,
      startTime: appointmentDate,
      endTime: endTime,
      appointmentType: ["Initial Consultation", "Follow-up", "Procedure", "Emergency", "Routine Checkup"][Math.floor(Math.random() * 5)],
      status: ["Scheduled", "Confirmed", "Completed"][Math.floor(Math.random() * 3)],
      notes: "Patient notes go here",
      audit: [
        {
          timestamp: new Date(appointmentDate.getTime() - 86400000),
          action: "CREATE_APPOINTMENT",
          performedBy: "staff-user",
          details: {
            appointmentId: `apt${i + 1}`,
            patientId: patient.patientId,
            providerId
          }
        }
      ]
    });
  }
  
  return appointments;
};

export const mockAppointments = generateAppointments();