# Marks System - Architecture & Data Flow

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                     SCHOOL MANAGEMENT SYSTEM                     │
│                      Marks Management Module                      │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│                        FRONTEND LAYER                             │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌─────────────────┐  ┌──────────────────┐  ┌──────────────────┐ │
│  │  Teacher Portal │  │  Student Portal  │  │  Parent Portal   │ │
│  │                 │  │                  │  │                  │ │
│  │ • Add Marks     │  │ • View Own Marks │  │ • View Children  │ │
│  │ • Edit Marks    │  │ • See Grades     │  │ • View Marks     │ │
│  │ • Delete Marks  │  │ • Export PDF     │  │ • Statistics     │ │
│  │ • View Results  │  │ • Track Progress │  │ • Export PDF     │ │
│  └────────┬────────┘  └────────┬─────────┘  └────────┬─────────┘ │
│           │                    │                     │            │
│           └────────────────────┼─────────────────────┘            │
│                                │                                  │
│                    ┌───────────▼──────────┐                       │
│                    │   React Components   │                       │
│                    │                      │                       │
│                    │ • ResultForm.jsx 