@AGENTS.md

Frontend Architecture Guidelines
Tech Stack
Next.js App Router
TypeScript
React Query (TanStack Query)
Axios
Tailwind CSS
Folder Structure

src/
├── app/
├── features/
├── components/
│ ├── ui/
│ ├── forms/
│ └── layout/
├── services/
├── hooks/
├── types/
├── lib/
└── providers/

Architecture Rules
Use feature-based architecture.
Keep business logic inside feature folders.
Keep pages and components as thin as possible.
Extract reusable logic into hooks, utilities, or services.
Prefer composition over prop drilling.
Components
Create reusable UI components when used in multiple places.
Keep components focused on presentation.
Avoid large components (>200 lines when possible).
Use named exports.
Define prop interfaces/types close to the component.
Data Fetching
Use React Query for all server state.
Do not fetch data directly inside components when a custom hook can be created.
Keep API calls inside service files.
Use consistent query keys.
API Layer
Use a shared Axios instance.
Never call axios directly from UI components.
Create feature-specific API files.

Example:
features/auctions/api/auction.api.ts

Next.js
Prefer Server Components by default.
Use Client Components only when interactivity is required.
Keep route pages lightweight.
Move business logic out of page files.
State Management
React Query for server state.
Local component state for simple UI state.
Avoid global state unless truly necessary.
Code Quality
Use strict TypeScript.
Avoid any.
Prefer early returns.
Handle loading and error states.
Keep code readable and maintainable over clever abstractions.
When Generating Code

Always:

Follow the folder structure above.
Reuse existing components when possible.
Extract duplicated logic.
Generate production-ready TypeScript code.
Follow Next.js App Router best practices.
