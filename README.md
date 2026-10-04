# Boxput AI Website Builder

Production-ready AI Website Builder SaaS. Describe any website in natural language and generate complete, responsive, multi-page web applications with live preview, conversational AI editing, version history, and one-click publishing.

## Tech Stack
- **Frontend**: React 19, TypeScript, Tailwind CSS, Lucide Icons
- **Backend API**: Node.js & Express (`server.ts`)
- **AI Engine**: Gemini API (`@google/genai`, model `gemini-3.8-flash`) executed strictly server-side
- **Database & Auth**: Supabase PostgreSQL with Row Level Security (RLS) + dual-mode fallback
- **Hosting Target**: Hostinger Node.js hosting (or any Node.js environment)

---

## 20+ Reusable Components
1. `Navbar`
2. `Hero`
3. `About`
4. `Services`
5. `Features`
6. `Pricing`
7. `Product cards`
8. `Restaurant menu`
9. `Gallery`
10. `Testimonials`
11. `Team`
12. `FAQ`
13. `Contact`
14. `CTA`
15. `Footer`
16. `Blog`
17. `Portfolio`
18. `Property listings`
19. `Property search`
20. `Booking form`

---

## Environment Variables (.env)
Create a `.env` file in the root folder with:

```env
# Gemini API Key for server-side generation
GEMINI_API_KEY="AIzaSyYourGeminiApiKeyHere"

# Supabase Configuration
SUPABASE_URL="https://your-project.supabase.co"
SUPABASE_ANON_KEY="your-anon-key"

# Port (defaults to 3000)
PORT=3000
NODE_ENV=production
```

---

## Supabase Database Setup
1. Create a project at [supabase.com](https://supabase.com).
2. Open the **SQL Editor**.
3. Run the SQL script located in `supabase/schema.sql`.
4. Copy your project URL and Anon key into your environment variables.

---

## Hostinger Node.js Deployment
1. Log in to your **Hostinger hPanel**.
2. Go to **Websites** > **Manage** > **Advanced** > **Node.js**.
3. Create a Node.js Application:
   - **Node.js version**: 20.x or 22.x LTS
   - **Application mode**: Production
   - **Application startup file**: `server.ts` (or `dist/server.js`)
4. Set the Environment Variables (`GEMINI_API_KEY`, `SUPABASE_URL`, `SUPABASE_ANON_KEY`).
5. Upload or clone the repository into `public_html`.
6. Run:
   ```bash
   npm install
   npm run build
   ```
7. Start or restart the Node.js application in hPanel.
