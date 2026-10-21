# NeoPath System Diagrams

## 1. Context Flow Diagram

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│     Student     │    │   Counsellor    │    │     Admin       │
│                 │    │                 │    │                 │
│ • Take Tests    │    │ • Conduct       │    │ • Manage Users  │
│ • View Results  │    │   Sessions      │    │ • View Reports  │
│ • Get Career    │    │ • Recommend     │    │ • System Config │
│   Advice        │    │   Careers       │    │                 │
└─────────┬───────┘    └─────────┬───────┘    └─────────┬───────┘
          │                      │                      │
          │                      │                      │
          └──────────────────────┼──────────────────────┘
                                 │
                    ┌─────────────┴─────────────┐
                    │     NeoPath System        │
                    │                           │
                    │ • Assessment Engine       │
                    │ • Career Recommendation   │
                    │ • Session Management      │
                    │ • Real-time Communication │
                    │ • User Management         │
                    └─────────────┬─────────────┘
                                  │
                    ┌─────────────┴─────────────┐
                    │      Database             │
                    │                           │
                    │ • User Data               │
                    │ • Assessment Results      │
                    │ • Career Information      │
                    │ • Session Records         │
                    │ • Messages                │
                    └───────────────────────────┘
```

## 2. DFD Level 0 (Data Flow Diagram)

```
┌─────────────┐    User Registration    ┌─────────────┐
│   Student   │ ──────────────────────► │   System    │
│             │                         │             │
│             │ ◄────────────────────── │             │
│             │    Profile Data         │             │
└─────────────┘                         │             │
                                        │             │
┌─────────────┐    Session Request      │             │
│ Counsellor  │ ──────────────────────► │             │
│             │                         │             │
│             │ ◄────────────────────── │             │
│             │    Session Data         │             │
└─────────────┘                         │             │
                                        │             │
┌─────────────┐    Assessment Data      │             │
│   System    │ ──────────────────────► │             │
│             │                         │             │
│             │ ◄────────────────────── │             │
│             │    Results & Reports    │             │
└─────────────┘                         └─────────────┘
```

## 3. DFD Level 1 (Detailed Data Flow)

```
                    ┌─────────────────┐
                    │   User Mgmt     │
                    │                 │
                    │ • Registration  │
                    │ • Authentication│
                    │ • Profile Mgmt  │
                    └─────────┬───────┘
                              │
                              ▼
┌─────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Student   │    │  Assessment     │    │   Counsellor    │
│             │    │   Engine        │    │                 │
│ • Take Tests│◄──►│                 │◄──►│ • Review Results│
│ • View Scores│   │ • Question Bank │    │ • Create Tests  │
│ • Get Advice│    │ • Auto Scoring  │    │ • Manage Tests  │
└─────────────┘    │ • Progress Track│    └─────────┬───────┘
                   └─────────┬───────┘              │
                             │                      │
                             ▼                      ▼
                   ┌─────────────────┐    ┌─────────────────┐
                   │   Career        │    │   Session       │
                   │ Recommendation  │    │   Management    │
                   │                 │    │                 │
                   │ • AI Algorithm  │    │ • Scheduling    │
                   │ • Match Scoring │    │ • Real-time Chat│
                   │ • Suggestions   │    │ • Video Calls   │
                   └─────────┬───────┘    └─────────┬───────┘
                             │                      │
                             └──────────┬───────────┘
                                        │
                                        ▼
                              ┌─────────────────┐
                              │   Database      │
                              │                 │
                              │ • User Data     │
                              │ • Test Results  │
                              │ • Career Info   │
                              │ • Session Data  │
                              │ • Messages      │
                              └─────────────────┘
```

## 4. State Transition Diagram - Assessment Flow

```
                    ┌─────────────────┐
                    │   Not Started   │
                    └─────────┬───────┘
                              │
                              │ Start Assessment
                              ▼
                    ┌─────────────────┐
                    │   In Progress   │
                    │                 │
                    │ • Answer Q1     │
                    │ • Answer Q2     │
                    │ • Answer Q3     │
                    │ • ...           │
                    └─────────┬───────┘
                              │
                              │ Complete/Submit
                              ▼
                    ┌─────────────────┐
                    │   Completed     │
                    │                 │
                    │ • Calculate     │
                    │   Score         │
                    │ • Generate      │
                    │   Report        │
                    └─────────┬───────┘
                              │
                              │ Timeout/Abandon
                              ▼
                    ┌─────────────────┐
                    │   Abandoned     │
                    └─────────────────┘
```

## 5. Use Case Diagram - One-to-One Interaction

```
                    ┌─────────────────┐
                    │     Student     │
                    └─────────┬───────┘
                              │
                              │ 1. Request Session
                              │ 2. Join Session
                              │ 3. Send Messages
                              │ 4. Share Files
                              │ 5. Rate Session
                              │
                              ▼
                    ┌─────────────────┐
                    │   Counsellor    │
                    └─────────┬───────┘
                              │
                              │ 1. Accept Session
                              │ 2. Conduct Session
                              │ 3. Provide Guidance
                              │ 4. Share Resources
                              │ 5. Take Notes
                              │
                              ▼
                    ┌─────────────────┐
                    │   System        │
                    │                 │
                    │ • Manage        │
                    │   Sessions      │
                    │ • Store         │
                    │   Messages      │
                    │ • Track         │
                    │   Progress      │
                    └─────────────────┘
```

## 6. System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        Frontend (React)                        │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐            │
│  │   Student   │  │ Counsellor  │  │    Admin    │            │
│  │  Dashboard  │  │  Dashboard  │  │  Dashboard  │            │
│  └─────────────┘  └─────────────┘  └─────────────┘            │
│                                                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐            │
│  │ Assessment  │  │   Session   │  │   Profile   │            │
│  │   Module    │  │  Management │  │ Management  │            │
│  └─────────────┘  └─────────────┘  └─────────────┘            │
└─────────────────────────────────────────────────────────────────┘
                                │
                                │ HTTP/WebSocket
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                     Backend (Node.js)                          │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐            │
│  │    Auth     │  │ Assessment  │  │   Career    │            │
│  │  Service    │  │   Service   │  │  Service    │            │
│  └─────────────┘  └─────────────┘  └─────────────┘            │
│                                                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐            │
│  │   Session   │  │  Message    │  │ Notification│            │
│  │  Service    │  │  Service    │  │   Service   │            │
│  └─────────────┘  └─────────────┘  └─────────────┘            │
└─────────────────────────────────────────────────────────────────┘
                                │
                                │ SQL Queries
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Database (MySQL)                          │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐            │
│  │    Users    │  │ Assessments │  │  Careers    │            │
│  │  Students   │  │  Questions  │  │ Sessions    │            │
│  │ Counsellors │  │   Answers   │  │ Messages    │            │
│  └─────────────┘  └─────────────┘  └─────────────┘            │
└─────────────────────────────────────────────────────────────────┘
```

## 7. Data Flow - Assessment Process

```
Student Request
       │
       ▼
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Select    │───►│   Start     │───►│   Answer    │
│ Assessment  │    │ Assessment  │    │ Questions   │
└─────────────┘    └─────────────┘    └─────────────┘
                                              │
                                              ▼
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Generate  │◄───│   Submit    │◄───│   Complete  │
│  Report     │    │  Answers    │    │ Assessment  │
└─────────────┘    └─────────────┘    └─────────────┘
       │
       ▼
┌─────────────┐
│   Update    │
│  Database   │
└─────────────┘
```

## 8. Component Interaction Diagram

```
┌─────────────────┐
│   React App     │
├─────────────────┤
│  ┌─────────────┐│
│  │   Router    ││
│  └─────────────┘│
│         │       │
│         ▼       │
│  ┌─────────────┐│
│  │   Layout    ││
│  └─────────────┘│
│         │       │
│         ▼       │
│  ┌─────────────┐│
│  │  Dashboard  ││
│  └─────────────┘│
└─────────────────┘
         │
         │ API Calls
         ▼
┌─────────────────┐
│  Express API    │
├─────────────────┤
│  ┌─────────────┐│
│  │   Routes    ││
│  └─────────────┘│
│         │       │
│         ▼       │
│  ┌─────────────┐│
│  │ Controllers ││
│  └─────────────┘│
│         │       │
│         ▼       │
│  ┌─────────────┐│
│  │   Models    ││
│  └─────────────┘│
└─────────────────┘
         │
         │ SQL
         ▼
┌─────────────────┐
│   MySQL DB      │
└─────────────────┘
```

## 9. Security Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Client Side                             │
├─────────────────────────────────────────────────────────────────┤
│  • Input Validation                                            │
│  • XSS Protection                                             │
│  • CSRF Tokens                                                │
│  • Secure Storage                                             │
└─────────────────────────────────────────────────────────────────┘
                                │
                                │ HTTPS
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                        Server Side                             │
├─────────────────────────────────────────────────────────────────┤
│  • JWT Authentication                                          │
│  • Role-based Access Control                                   │
│  • Input Sanitization                                          │
│  • Rate Limiting                                               │
│  • SQL Injection Prevention                                    │
└─────────────────────────────────────────────────────────────────┘
                                │
                                │ Encrypted Connection
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                        Database                                │
├─────────────────────────────────────────────────────────────────┤
│  • Encrypted Storage                                           │
│  • Access Control                                              │
│  • Audit Logging                                               │
│  • Backup & Recovery                                           │
└─────────────────────────────────────────────────────────────────┘
```

## 10. Deployment Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Load Balancer                           │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Application Servers                         │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐            │
│  │   Node.js   │  │   Node.js   │  │   Node.js   │            │
│  │   Server    │  │   Server    │  │   Server    │            │
│  └─────────────┘  └─────────────┘  └─────────────┘            │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Database Cluster                            │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐            │
│  │   MySQL     │  │   MySQL     │  │   MySQL     │            │
│  │  Primary    │  │  Replica    │  │  Replica    │            │
│  └─────────────┘  └─────────────┘  └─────────────┘            │
└─────────────────────────────────────────────────────────────────┘
```

These diagrams provide a comprehensive view of the NeoPath system architecture, data flow, and component interactions, making it easier to understand the system's design and implementation.
