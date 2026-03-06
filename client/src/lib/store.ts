/**
 * Store local com localStorage para simular backend.
 * Cada entidade tem CRUD completo com IDs auto-incrementais.
 */

// ─── Tipos ───────────────────────────────────────────────
export interface Employee {
  id: number;
  name: string;
  email: string;
  phone: string;
  color: string;
  specialties: string[];
  commissionPercent: number;
  workingHours: Record<string, { start: string; end: string; active: boolean }>;
  active: boolean;
  createdAt: string;
}

export interface Service {
  id: number;
  name: string;
  description: string | null;
  durationMinutes: number;
  price: number;
  color: string;
  active: boolean;
  createdAt: string;
}

export interface Client {
  id: number;
  name: string;
  email: string | null;
  phone: string | null;
  birthDate: string | null;
  cpf: string | null;
  address: string | null;
  notes: string | null;
  createdAt: string;
}

export interface AppointmentService {
  serviceId: number;
  name: string;
  price: number;
  durationMinutes: number;
  color: string;
}

export interface Appointment {
  id: number;
  clientName: string | null;
  clientId: number | null;
  employeeId: number;
  startTime: string;
  endTime: string;
  status: "scheduled" | "confirmed" | "in_progress" | "completed" | "cancelled" | "no_show";
  totalPrice: number | null;
  notes: string | null;
  paymentStatus: string | null;
  groupId: string | null;
  services: AppointmentService[];
  createdAt: string;
}

export interface CashSession {
  id: number;
  openedAt: string;
  closedAt: string | null;
  openingBalance: number;
  totalRevenue: number | null;
  totalCommissions: number | null;
  closingNotes: string | null;
  status: "open" | "closed";
}

export interface CashEntry {
  id: number;
  sessionId: number;
  appointmentId: number | null;
  clientName: string;
  employeeId: number;
  description: string;
  amount: number;
  paymentMethod: "dinheiro" | "cartao_credito" | "cartao_debito" | "pix" | "outro";
  commissionPercent: number;
  commissionValue: number;
  isAutoLaunch: boolean;
  createdAt: string;
}

export interface AuditLog {
  id: number;
  entityType: string;
  entityId: number;
  action: string;
  description: string;
  userName: string | null;
  createdAt: string;
}

// ─── Helpers ─────────────────────────────────────────────
function getStore<T>(key: string): T[] {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function setStore<T>(key: string, data: T[]) {
  localStorage.setItem(key, JSON.stringify(data));
}

function nextId(key: string): number {
  const counterKey = `${key}_counter`;
  const current = parseInt(localStorage.getItem(counterKey) ?? "0", 10);
  const next = current + 1;
  localStorage.setItem(counterKey, String(next));
  return next;
}

function addAuditLog(entityType: string, entityId: number, action: string, description: string) {
  const logs = getStore<AuditLog>("audit_logs");
  logs.push({
    id: nextId("audit_logs"),
    entityType,
    entityId,
    action,
    description,
    userName: "Admin",
    createdAt: new Date().toISOString(),
  });
  setStore("audit_logs", logs);
}

// ─── Employees ───────────────────────────────────────────
export const employeesStore = {
  list(activeOnly = false): Employee[] {
    const all = getStore<Employee>("employees");
    return activeOnly ? all.filter(e => e.active) : all;
  },
  create(data: Omit<Employee, "id" | "createdAt">): Employee {
    const employees = getStore<Employee>("employees");
    const emp: Employee = { ...data, id: nextId("employees"), createdAt: new Date().toISOString() };
    employees.push(emp);
    setStore("employees", employees);
    addAuditLog("employee", emp.id, "create", `Funcionário "${emp.name}" criado`);
    return emp;
  },
  update(id: number, data: Partial<Employee>): Employee | null {
    const employees = getStore<Employee>("employees");
    const idx = employees.findIndex(e => e.id === id);
    if (idx === -1) return null;
    employees[idx] = { ...employees[idx], ...data };
    setStore("employees", employees);
    addAuditLog("employee", id, "update", `Funcionário "${employees[idx].name}" atualizado`);
    return employees[idx];
  },
  delete(id: number) {
    const employees = getStore<Employee>("employees");
    const emp = employees.find(e => e.id === id);
    setStore("employees", employees.filter(e => e.id !== id));
    if (emp) addAuditLog("employee", id, "delete", `Funcionário "${emp.name}" removido`);
  },
};

// ─── Services ────────────────────────────────────────────
export const servicesStore = {
  list(activeOnly = false): Service[] {
    const all = getStore<Service>("services");
    return activeOnly ? all.filter(s => s.active) : all;
  },
  create(data: Omit<Service, "id" | "createdAt">): Service {
    const services = getStore<Service>("services");
    const svc: Service = { ...data, id: nextId("services"), createdAt: new Date().toISOString() };
    services.push(svc);
    setStore("services", services);
    addAuditLog("service", svc.id, "create", `Serviço "${svc.name}" criado`);
    return svc;
  },
  update(id: number, data: Partial<Service>): Service | null {
    const services = getStore<Service>("services");
    const idx = services.findIndex(s => s.id === id);
    if (idx === -1) return null;
    services[idx] = { ...services[idx], ...data };
    setStore("services", services);
    addAuditLog("service", id, "update", `Serviço "${services[idx].name}" atualizado`);
    return services[idx];
  },
};

// ─── Clients ─────────────────────────────────────────────
export const clientsStore = {
  list(): Client[] {
    return getStore<Client>("clients");
  },
  create(data: Omit<Client, "id" | "createdAt">): Client {
    const clients = getStore<Client>("clients");
    const client: Client = { ...data, id: nextId("clients"), createdAt: new Date().toISOString() };
    clients.push(client);
    setStore("clients", clients);
    addAuditLog("client", client.id, "create", `Cliente "${client.name}" criado`);
    return client;
  },
  update(id: number, data: Partial<Client>): Client | null {
    const clients = getStore<Client>("clients");
    const idx = clients.findIndex(c => c.id === id);
    if (idx === -1) return null;
    clients[idx] = { ...clients[idx], ...data };
    setStore("clients", clients);
    addAuditLog("client", id, "update", `Cliente "${clients[idx].name}" atualizado`);
    return clients[idx];
  },
  delete(id: number) {
    const clients = getStore<Client>("clients");
    const client = clients.find(c => c.id === id);
    setStore("clients", clients.filter(c => c.id !== id));
    if (client) addAuditLog("client", id, "delete", `Cliente "${client.name}" removido`);
  },
  clearAll() {
    setStore("clients", []);
    localStorage.setItem("clients_counter", "0");
  },
};

// ─── Appointments ────────────────────────────────────────
export const appointmentsStore = {
  list(filters?: { date?: string; startDate?: string; endDate?: string }): Appointment[] {
    let all = getStore<Appointment>("appointments");
    if (filters?.date) {
      all = all.filter(a => a.startTime.startsWith(filters.date!));
    }
    if (filters?.startDate) {
      all = all.filter(a => a.startTime >= filters.startDate!);
    }
    if (filters?.endDate) {
      all = all.filter(a => a.startTime <= filters.endDate! + "T23:59:59");
    }
    return all.sort((a, b) => a.startTime.localeCompare(b.startTime));
  },
  create(data: Omit<Appointment, "id" | "createdAt">): Appointment {
    const appointments = getStore<Appointment>("appointments");
    const appt: Appointment = { ...data, id: nextId("appointments"), createdAt: new Date().toISOString() };
    appointments.push(appt);
    setStore("appointments", appointments);
    addAuditLog("appointment", appt.id, "create", `Agendamento para "${appt.clientName}" criado`);
    return appt;
  },
  update(id: number, data: Partial<Appointment>): Appointment | null {
    const appointments = getStore<Appointment>("appointments");
    const idx = appointments.findIndex(a => a.id === id);
    if (idx === -1) return null;
    appointments[idx] = { ...appointments[idx], ...data };
    setStore("appointments", appointments);
    addAuditLog("appointment", id, "update", `Agendamento #${id} atualizado`);
    return appointments[idx];
  },
  delete(id: number) {
    const appointments = getStore<Appointment>("appointments");
    setStore("appointments", appointments.filter(a => a.id !== id));
    addAuditLog("appointment", id, "delete", `Agendamento #${id} excluído`);
  },
  move(id: number, employeeId: number, startTime: string, endTime: string) {
    return this.update(id, { employeeId, startTime, endTime });
  },
};

// ─── Cash Sessions ───────────────────────────────────────
export const cashSessionsStore = {
  list(): CashSession[] {
    return getStore<CashSession>("cash_sessions");
  },
  getCurrent(): CashSession | null {
    const sessions = getStore<CashSession>("cash_sessions");
    return sessions.find(s => s.status === "open") ?? null;
  },
  open(openingBalance: number, customDate?: string): CashSession {
    const sessions = getStore<CashSession>("cash_sessions");
    let openedAt = new Date().toISOString();
    if (customDate) {
      const [y, m, d] = customDate.split("-").map(Number);
      const now = new Date();
      openedAt = new Date(y, m - 1, d, now.getHours(), now.getMinutes(), now.getSeconds()).toISOString();
    }
    const session: CashSession = {
      id: nextId("cash_sessions"),
      openedAt,
      closedAt: null,
      openingBalance,
      totalRevenue: null,
      totalCommissions: null,
      closingNotes: null,
      status: "open",
    };
    sessions.push(session);
    setStore("cash_sessions", sessions);
    addAuditLog("cash_session", session.id, "create", `Caixa aberto com saldo R$ ${openingBalance.toFixed(2)}${customDate ? \` (data: \${customDate})\` : ""}`);
    return session;
  },
  close(id: number, data: { totalRevenue: number; totalCommissions: number; closingNotes: string }) {
    const sessions = getStore<CashSession>("cash_sessions");
    const idx = sessions.findIndex(s => s.id === id);
    if (idx === -1) return null;
    sessions[idx] = {
      ...sessions[idx],
      ...data,
      closedAt: new Date().toISOString(),
      status: "closed",
    };
    setStore("cash_sessions", sessions);
    addAuditLog("cash_session", id, "update", `Caixa fechado — Faturamento: R$ ${data.totalRevenue.toFixed(2)}`);
    return sessions[idx];
  },
};

// ─── Cash Entries ────────────────────────────────────────
export const cashEntriesStore = {
  list(sessionId?: number): CashEntry[] {
    const all = getStore<CashEntry>("cash_entries");
    return sessionId != null ? all.filter(e => e.sessionId === sessionId) : all;
  },
  create(data: Omit<CashEntry, "id" | "createdAt">): CashEntry {
    const entries = getStore<CashEntry>("cash_entries");
    const entry: CashEntry = { ...data, id: nextId("cash_entries"), createdAt: new Date().toISOString() };
    entries.push(entry);
    setStore("cash_entries", entries);
    addAuditLog("cash_entry", entry.id, "create", `Lançamento: ${entry.clientName} — R$ ${entry.amount.toFixed(2)}`);
    return entry;
  },
  update(id: number, data: Partial<CashEntry>): CashEntry | null {
    const entries = getStore<CashEntry>("cash_entries");
    const idx = entries.findIndex(e => e.id === id);
    if (idx === -1) return null;
    entries[idx] = { ...entries[idx], ...data };
    setStore("cash_entries", entries);
    return entries[idx];
  },
  delete(id: number) {
    const entries = getStore<CashEntry>("cash_entries");
    setStore("cash_entries", entries.filter(e => e.id !== id));
    addAuditLog("cash_entry", id, "delete", `Lançamento #${id} removido`);
  },
  deleteBySession(sessionId: number) {
    const entries = getStore<CashEntry>("cash_entries");
    setStore("cash_entries", entries.filter(e => e.sessionId !== sessionId));
  },
  deleteByAppointment(appointmentId: number) {
    const entries = getStore<CashEntry>("cash_entries");
    setStore("cash_entries", entries.filter(e => e.appointmentId !== appointmentId));
  },
};

// ─── Audit Log ───────────────────────────────────────────
export const auditStore = {
  log(entityType?: string): AuditLog[] {
    const all = getStore<AuditLog>("audit_logs");
    const filtered = entityType ? all.filter(l => l.entityType === entityType) : all;
    return filtered.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  },
};

// ─── Seed Data ───────────────────────────────────────────
export function seedDemoData() {
  if (localStorage.getItem("salao_bella_seeded") === "true") return;

  const defaultWH = Object.fromEntries(
    ["seg", "ter", "qua", "qui", "sex", "sab", "dom"].map(d => [
      d,
      { start: "08:00", end: "18:00", active: !["sab", "dom"].includes(d) },
    ])
  );

  // Employees
  const emps = [
    { name: "Ana Silva", email: "ana@salao.com", phone: "(11) 99999-1111", color: "#ec4899", specialties: ["Corte", "Coloração"], commissionPercent: 30, workingHours: { ...defaultWH, sab: { start: "09:00", end: "14:00", active: true } }, active: true },
    { name: "Carlos Souza", email: "carlos@salao.com", phone: "(11) 99999-2222", color: "#8b5cf6", specialties: ["Barba", "Corte Masculino"], commissionPercent: 25, workingHours: defaultWH, active: true },
    { name: "Beatriz Lima", email: "bia@salao.com", phone: "(11) 99999-3333", color: "#06b6d4", specialties: ["Manicure", "Pedicure"], commissionPercent: 35, workingHours: defaultWH, active: true },
  ];
  emps.forEach(e => employeesStore.create(e));

  // Services
  const svcs = [
    { name: "Corte Feminino", description: "Corte com lavagem e finalização", durationMinutes: 60, price: 80, color: "#ec4899", active: true },
    { name: "Corte Masculino", description: "Corte social ou moderno", durationMinutes: 30, price: 45, color: "#8b5cf6", active: true },
    { name: "Coloração", description: "Tintura completa", durationMinutes: 120, price: 150, color: "#f59e0b", active: true },
    { name: "Manicure", description: "Esmaltação em gel ou tradicional", durationMinutes: 45, price: 35, color: "#06b6d4", active: true },
    { name: "Pedicure", description: "Pedicure completa", durationMinutes: 50, price: 40, color: "#10b981", active: true },
    { name: "Escova", description: "Escova modeladora", durationMinutes: 40, price: 55, color: "#3b82f6", active: true },
    { name: "Hidratação", description: "Tratamento capilar profundo", durationMinutes: 45, price: 70, color: "#84cc16", active: true },
  ];
  svcs.forEach(s => servicesStore.create(s));

  // Clients
  const clients = [
    { name: "Maria Oliveira", email: "maria@email.com", phone: "(11) 98888-1111", birthDate: "1990-05-15", notes: "Prefere produtos sem sulfato" },
    { name: "Juliana Santos", email: "ju@email.com", phone: "(11) 98888-2222", birthDate: "1985-11-20", notes: null },
    { name: "Fernanda Costa", email: "fer@email.com", phone: "(11) 98888-3333", birthDate: "1992-03-08", notes: "Alergia a amônia" },
    { name: "Patrícia Almeida", email: "pat@email.com", phone: "(11) 98888-4444", birthDate: "1988-07-25", notes: null },
    { name: "Camila Rodrigues", email: "camila@email.com", phone: "(11) 98888-5555", birthDate: null, notes: "Cliente VIP" },
  ];
  clients.forEach(c => clientsStore.create(c));

  // Appointments (today and recent days)
  const today = new Date();
  const fmt = (d: Date) => d.toISOString().split("T")[0];

  const createAppt = (dayOffset: number, hour: number, empId: number, clientName: string, svcIds: number[], status: Appointment["status"]) => {
    const date = new Date(today);
    date.setDate(date.getDate() + dayOffset);
    const dateStr = fmt(date);
    const allSvcs = servicesStore.list();
    const selectedSvcs = svcIds.map(id => {
      const s = allSvcs.find(sv => sv.id === id)!;
      return { serviceId: s.id, name: s.name, price: s.price, durationMinutes: s.durationMinutes, color: s.color };
    });
    const totalDuration = selectedSvcs.reduce((sum, s) => sum + s.durationMinutes, 0);
    const totalPrice = selectedSvcs.reduce((sum, s) => sum + s.price, 0);
    const startTime = `${dateStr}T${String(hour).padStart(2, "0")}:00:00`;
    const endDate = new Date(startTime);
    endDate.setMinutes(endDate.getMinutes() + totalDuration);
    const endTime = endDate.toISOString();

    appointmentsStore.create({
      clientName,
      clientId: null,
      employeeId: empId,
      startTime,
      endTime,
      status,
      totalPrice,
      notes: null,
      paymentStatus: status === "completed" ? "paid" : null,
      groupId: null,
      services: selectedSvcs,
    });
  };

  // Today's appointments
  createAppt(0, 9, 1, "Maria Oliveira", [1], "completed");
  createAppt(0, 10, 1, "Juliana Santos", [3], "in_progress");
  createAppt(0, 11, 2, "Roberto Mendes", [2], "scheduled");
  createAppt(0, 14, 1, "Fernanda Costa", [1, 6], "scheduled");
  createAppt(0, 9, 3, "Patrícia Almeida", [4, 5], "completed");
  createAppt(0, 13, 2, "Lucas Pereira", [2], "confirmed");
  createAppt(0, 15, 3, "Camila Rodrigues", [4], "scheduled");

  // Yesterday
  createAppt(-1, 9, 1, "Maria Oliveira", [7], "completed");
  createAppt(-1, 10, 2, "André Silva", [2], "completed");
  createAppt(-1, 14, 1, "Juliana Santos", [1], "completed");
  createAppt(-1, 11, 3, "Fernanda Costa", [4, 5], "completed");
  createAppt(-1, 15, 1, "Camila Rodrigues", [6], "cancelled");

  // 2 days ago
  createAppt(-2, 9, 1, "Patrícia Almeida", [1, 3], "completed");
  createAppt(-2, 10, 2, "Lucas Pereira", [2], "completed");
  createAppt(-2, 14, 3, "Maria Oliveira", [4], "completed");

  // 3-6 days ago
  createAppt(-3, 10, 1, "Juliana Santos", [1], "completed");
  createAppt(-3, 14, 2, "Roberto Mendes", [2], "completed");
  createAppt(-4, 9, 1, "Fernanda Costa", [3], "completed");
  createAppt(-4, 11, 3, "Camila Rodrigues", [4, 5], "completed");
  createAppt(-5, 10, 1, "Maria Oliveira", [1, 7], "completed");
  createAppt(-5, 14, 2, "André Silva", [2], "no_show");
  createAppt(-6, 9, 1, "Patrícia Almeida", [6], "completed");
  createAppt(-6, 11, 3, "Juliana Santos", [4], "completed");

  localStorage.setItem("salao_bella_seeded", "true");
}
