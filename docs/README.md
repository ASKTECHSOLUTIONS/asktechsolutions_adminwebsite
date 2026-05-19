# ASKTECHSOLUTIONS - Unified Admin Control Panel

> A modern, enterprise-grade SaaS admin dashboard with dynamic mode switching, built with React, TypeScript, and Tailwind CSS.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-18.3.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)
![Tailwind](https://img.shields.io/badge/Tailwind-4.x-blue)

## ✨ Features

### 🎯 Core Capabilities
- **Dual-Mode Dashboard**: Switch between Website and Application management modes
- **Authentication System**: Secure login with persistent sessions
- **Dark/Light Theme**: System-aware theme with manual override
- **Responsive Design**: Mobile-first, works on all device sizes
- **Real-time Updates**: Live notifications and activity feeds
- **Advanced Tables**: Searchable, sortable data tables with custom renderers
- **Analytics Dashboard**: Visual metrics with charts and trends

### 🏢 Website Management Mode
- Employee Management
- Attendance Tracking
- Leave Management
- Website Content Management
- Reports & Analytics
- Settings

### 💼 Application Management Mode
- Client Management
- Project Tracking
- Internship Management
- Payment Processing
- Meeting Scheduler
- Notifications Hub
- Analytics Dashboard
- Settings

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- pnpm 8+

### Installation

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev
```

The application will be available in the preview pane.

## 🎨 Tech Stack

| Technology | Purpose |
|------------|---------|
| **React 18.3** | UI Framework |
| **TypeScript** | Type Safety |
| **Tailwind CSS v4** | Styling |
| **Zustand** | State Management |
| **Motion** | Animations |
| **Recharts** | Data Visualization |
| **Radix UI** | Accessible Components |
| **Lucide Icons** | Icon System |
| **Vite** | Build Tool |

## 📂 Project Structure

```
src/app/
├── components/
│   ├── ui/              # Base UI components
│   ├── layout/          # Layout components (Navbar, Sidebar)
│   └── dashboard/       # Dashboard widgets
├── pages/               # Page components
├── store/               # Zustand stores
├── hooks/               # Custom React hooks
├── lib/                 # Utilities & types
└── App.tsx              # Root component
```

## 🎯 Key Features Explained

### Dynamic Mode Switching
The dashboard features two distinct modes that can be toggled without page refresh:

```typescript
// Zustand store manages mode state
const { mode, setMode } = useDashboardStore();

// Switch between modes
setMode('website');  // Shows employee, attendance modules
setMode('application');  // Shows client, project modules
```

### Authentication Flow
```typescript
// Simple authentication with persistent state
const { login, logout, isAuthenticated } = useAuthStore();

// Login (demo mode accepts any credentials)
await login(email, password);

// Logout
logout();
```

### Theme System
```typescript
// System-aware theme with manual override
const { theme, setTheme } = useTheme();

setTheme('light');   // Force light mode
setTheme('dark');    // Force dark mode
setTheme('system');  // Follow system preference
```

## 🧩 Component Highlights

### StatCard
Animated metric cards with trend indicators:
```tsx
<StatCard
  title="Total Employees"
  value="67"
  icon={Users}
  trend={{ value: 12, isPositive: true }}
  description="Active employees"
/>
```

### DataTable
Reusable table with search and custom renderers:
```tsx
<DataTable
  data={employees}
  columns={[
    { header: 'Name', accessorKey: 'name' },
    { header: 'Status', cell: (row) => <Badge>{row.status}</Badge> }
  ]}
  searchPlaceholder="Search employees..."
/>
```

### QuickActions
Context-aware action buttons that change with dashboard mode:
```tsx
<QuickActions />
// Shows "Add Employee" in website mode
// Shows "Add Client" in application mode
```

## 🎨 Customization

### Theme Colors
Edit `src/styles/theme.css` to customize colors:

```css
:root {
  --primary: #030213;
  --secondary: oklch(0.95 0.0058 264.53);
  --accent: #e9ebef;
  /* ... */
}
```

### Adding New Pages
1. Create component in `src/app/pages/`
2. Add route in `DashboardPage.tsx`
3. Update `Sidebar.tsx` navigation
4. Define types in `lib/types.ts`

## 📊 Mock Data

The application uses mock data for demonstration. To connect to a real API:

1. Create service files in `src/app/services/`
2. Replace mock data imports with API calls
3. Update store actions to handle async operations
4. Add error handling and loading states

Example:
```typescript
// Replace this:
import { mockEmployees } from '../lib/mock-data';

// With this:
import { fetchEmployees } from '../services/employeeService';
const employees = await fetchEmployees();
```

## 🔒 Security Notes

⚠️ **This is a demo application**. For production:

- Implement proper JWT authentication
- Use httpOnly cookies for tokens
- Add CSRF protection
- Validate all inputs server-side
- Implement rate limiting
- Add proper error boundaries

## 🎭 Animations

The dashboard features smooth animations using Motion:

- **Page transitions**: Fade and slide effects
- **Mode switching**: Smooth content transitions
- **Hover effects**: Card elevations and highlights
- **Loading states**: Skeleton screens
- **Micro-interactions**: Button presses, toggles

## 📱 Responsive Behavior

| Breakpoint | Sidebar | Layout | Actions |
|------------|---------|--------|---------|
| Mobile (<768px) | Drawer overlay | Single column | Compact |
| Tablet (768-1024px) | Collapsible | 2 columns | Medium |
| Desktop (>1024px) | Fixed sidebar | 3+ columns | Full |

## 🧪 Testing

### Manual Testing Checklist
- [ ] Login with any credentials
- [ ] Toggle between Website/Application modes
- [ ] Switch theme (light/dark/system)
- [ ] Navigate to Employee Management
- [ ] Navigate to Client Management
- [ ] Search in data tables
- [ ] Test responsive behavior
- [ ] Check notifications
- [ ] Test logout

## 🚧 Future Roadmap

### Phase 1 - Core Enhancements
- [ ] Real API integration
- [ ] Form validation library
- [ ] Advanced filtering
- [ ] Data export (CSV/PDF)

### Phase 2 - Advanced Features
- [ ] Real-time notifications (WebSocket)
- [ ] Role-based access control
- [ ] Advanced analytics
- [ ] Audit logs

### Phase 3 - Scale & Performance
- [ ] Unit & E2E tests
- [ ] Performance monitoring
- [ ] Offline support
- [ ] Multi-language (i18n)

## 📖 Documentation

- [Architecture Guide](./ARCHITECTURE.md) - Detailed architecture documentation
- [Component API](./docs/components.md) - Component usage guide (coming soon)
- [State Management](./docs/state.md) - Store patterns (coming soon)

## 🤝 Contributing

This is a demonstration project. For production use:

1. Fork the repository
2. Create feature branch
3. Add tests for new features
4. Ensure TypeScript strict mode compliance
5. Test across browsers and devices
6. Submit pull request

## 📄 License

MIT License - feel free to use this for your projects!

## 🙏 Acknowledgments

- [Shadcn/ui](https://ui.shadcn.com/) - Beautiful component library
- [Radix UI](https://www.radix-ui.com/) - Accessible primitives
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- [Recharts](https://recharts.org/) - Charting library
- [Lucide](https://lucide.dev/) - Icon system

---

**Built with modern web technologies for enterprise admin dashboards** 🚀

For questions or support, please open an issue.
