# Entity-Relationship (ER) Diagram

This diagram visualizes the core relationships between the primary aggregates in the Workora database schema. 
*(Note: Audit columns and some lookup tables are omitted for clarity)*

```mermaid
erDiagram
    COMPANIES ||--o{ EMPLOYEES : "has"
    COMPANIES ||--o{ DEPARTMENTS : "has"
    COMPANIES ||--o{ ROLES : "defines"
    COMPANIES ||--o{ PAYROLL_RUNS : "executes"

    COMPANIES {
        uuid id PK
        string name
        string subdomain
        uuid subscription_plan_id FK
        string status
    }
    
    DEPARTMENTS {
        uuid id PK
        uuid tenant_id FK
        string name
        uuid parent_department_id FK
    }

    EMPLOYEES {
        uuid id PK
        uuid tenant_id FK
        uuid user_id FK
        string employee_code
        uuid department_id FK
        uuid designation_id FK
        uuid reporting_manager_id FK
        string employment_status
    }
    
    EMPLOYEES ||--o{ LEAVE_REQUESTS : "submits"
    EMPLOYEES ||--o{ ATTENDANCE_PUNCHES : "logs"
    EMPLOYEES ||--o{ PAYSLIPS : "receives"

    PAYROLL_RUNS ||--o{ PAYSLIPS : "generates"
    
    PAYROLL_RUNS {
        uuid id PK
        uuid tenant_id FK
        int cycle_month
        int cycle_year
        string status
    }
    
    PAYSLIPS {
        uuid id PK
        uuid payroll_run_id FK
        uuid employee_id FK
        numeric gross_pay
        numeric net_pay
    }
    
    LEAVE_REQUESTS {
        uuid id PK
        uuid employee_id FK
        uuid leave_type_id FK
        date start_date
        date end_date
        string status
    }
```
