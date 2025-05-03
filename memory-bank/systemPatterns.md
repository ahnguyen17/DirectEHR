# System Patterns

**Architecture:**
- Component-based architecture using React.
- Routing handled by React Router.
- State management likely handled by React Context (based on `PatientContext.jsx`).

**Key Technical Decisions:**
- Use of Vite for the development server and build process.
- Tailwind CSS for styling.

**Design Patterns:**
- Component composition.
- Context API for state sharing.

**Component Relationships:**
- `App.jsx` defines the main routes and uses `MainLayout`.
- `MainLayout` likely contains the sidebar and renders the content of the current route.
- Pages like `Dashboard`, `PatientList`, etc., are rendered within `MainLayout`.

**Critical Implementation Paths:**
- Patient data flow from input to storage and display.
- Navigation between different sections of the application.
