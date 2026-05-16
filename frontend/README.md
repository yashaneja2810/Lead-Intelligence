# Frontend - AI Lead Enrichment Platform

Modern, responsive Next.js 15 frontend with beautiful animations and real-time status updates.

## 🎨 Design System

### Colors
- **Primary**: Purple gradient (#667eea → #764ba2)
- **Secondary**: Blue (#4facfe)
- **Accent**: Pink (#f093fb)
- **Background**: Slate/Purple gradients

### Typography
- **Font**: Inter (Google Fonts)
- **Headings**: Bold, large scale
- **Body**: Regular, readable

### Components
- Shadcn UI base
- Custom animations with Framer Motion
- Lucide icons

## 🏗️ Structure

```
app/
├── layout.tsx        # Root layout
├── page.tsx          # Home page
└── globals.css       # Global styles

components/
├── ui/               # Base UI components
│   ├── button.tsx
│   ├── input.tsx
│   ├── label.tsx
│   ├── textarea.tsx
│   └── switch.tsx
├── Hero.tsx          # Hero section
├── Features.tsx      # Features grid
└── LeadForm.tsx      # Main form with workflow

lib/
├── utils.ts          # Utility functions
└── api.ts            # API client
```

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Configure environment
cp .env.example .env.local
# Edit NEXT_PUBLIC_API_URL

# Development
npm run dev

# Production
npm run build
npm start
```

## 🎯 Key Features

### 1. Hero Section
- Animated gradient background
- Floating blob animations
- Feature highlights
- Smooth scroll to form

### 2. Features Grid
- 8 feature cards
- Hover animations
- Icon gradients
- Responsive layout

### 3. Lead Form
- **AI Provider Toggle**: Switch between Gemini and Groq
- **Real-time validation**: Instant feedback
- **Workflow visualization**: Step-by-step progress
- **Status updates**: Live SSE stream
- **Success/error states**: Clear feedback

### 4. Animations
- Framer Motion for smooth transitions
- Staggered entrance animations
- Loading spinners
- Success celebrations

## 🔌 API Integration

### Submit Lead
```typescript
import { submitLead } from '@/lib/api';

const response = await submitLead({
  name: 'John Doe',
  email: 'john@example.com',
  companyName: 'Acme Inc',
  websiteUrl: 'https://acme.com',
  industry: 'SaaS',
  aiProvider: 'gemini',
  additionalNotes: 'Optional notes'
});
```

### Real-time Status
```typescript
import { submitLeadWithStatus } from '@/lib/api';

await submitLeadWithStatus(formData, (status) => {
  console.log(status.step, status.status, status.message);
});
```

## 🎨 Styling

### Tailwind Configuration
```typescript
// tailwind.config.ts
theme: {
  extend: {
    colors: {
      primary: 'hsl(var(--primary))',
      // ... custom colors
    },
    animation: {
      'fade-in': 'fadeIn 0.5s ease-in-out',
      'slide-up': 'slideUp 0.5s ease-out',
    }
  }
}
```

### Custom CSS Classes
```css
.gradient-text {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.animated-gradient {
  background: linear-gradient(-45deg, #667eea, #764ba2, #f093fb, #4facfe);
  background-size: 400% 400%;
  animation: gradient 15s ease infinite;
}
```

## 📱 Responsive Design

- **Mobile-first**: Optimized for small screens
- **Breakpoints**: sm, md, lg, xl
- **Flexible grids**: Auto-fit layouts
- **Touch-friendly**: Large tap targets

## ♿ Accessibility

- **Semantic HTML**: Proper heading hierarchy
- **ARIA labels**: Screen reader support
- **Keyboard navigation**: Full keyboard access
- **Focus indicators**: Visible focus states
- **Color contrast**: WCAG AA compliant

## 🔧 Configuration

### Environment Variables
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### Next.js Config
```javascript
// next.config.js
module.exports = {
  reactStrictMode: true,
  swcMinify: true,
}
```

## 🚀 Deployment

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Environment Variables on Vercel
1. Go to project settings
2. Add `NEXT_PUBLIC_API_URL`
3. Redeploy

### Custom Domain
1. Add domain in Vercel dashboard
2. Update DNS records
3. SSL automatically configured

## 🎭 Component Examples

### Button Usage
```tsx
import { Button } from '@/components/ui/button';

<Button variant="default" size="lg">
  Submit
</Button>
```

### Form with Validation
```tsx
<Input
  type="email"
  required
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  placeholder="john@example.com"
/>
```

### AI Provider Toggle
```tsx
<Switch
  checked={aiProvider === 'groq'}
  onCheckedChange={(checked) =>
    setAiProvider(checked ? 'groq' : 'gemini')
  }
/>
```

## 🎬 Animations

### Framer Motion Examples
```tsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6 }}
>
  Content
</motion.div>
```

### Staggered Children
```tsx
<motion.div
  initial="hidden"
  animate="visible"
  variants={{
    visible: {
      transition: {
        staggerChildren: 0.1
      }
    }
  }}
>
  {items.map(item => (
    <motion.div variants={itemVariants}>
      {item}
    </motion.div>
  ))}
</motion.div>
```

## 📊 Performance

- **Next.js 15**: Latest optimizations
- **Image optimization**: Automatic WebP
- **Code splitting**: Automatic chunking
- **Lazy loading**: Components on demand
- **Font optimization**: Self-hosted fonts

## 🧪 Testing

```bash
# Lint
npm run lint

# Type check
npx tsc --noEmit
```

## 🎯 Best Practices

1. **Component composition**: Reusable components
2. **Type safety**: Full TypeScript
3. **Accessibility**: WCAG compliance
4. **Performance**: Optimized rendering
5. **SEO**: Meta tags and structure

## 📝 Notes

- Uses App Router (Next.js 15)
- Client components for interactivity
- Server components where possible
- Optimistic UI updates
- Error boundaries for resilience
