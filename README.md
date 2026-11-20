# FoodAI Merchant — Restaurant Partner SaaS Dashboard

Standalone Next.js 15/16 web application for restaurant owners and staff.

## Features
- Merchant marketing landing page (pricing plans, features, Stripe onboard CTA)
- Real-time order dispatch dashboard (Accept/Reject, estimated prep times)
- Menu Category and Item manager
- Delivery Integrations setting (Uber Direct, Stuart, Deliveroo Express, Gophr, Shipday)
- AI Voice Agent phone assignment and persona configuration
- QR Code Menu generator for dining tables

## Deploying

### Option 1: Vercel (1-Click)
1. Push this folder to a GitHub repository: `foodai-merchant`.
2. Connect to Vercel: Import Repository.
3. Framework Preset: **Next.js**.
4. Set Environment Variables:
   - `NEXT_PUBLIC_API_URL` = `https://api.yourdomain.co.uk`
   - `NEXT_PUBLIC_SOCKET_URL` = `https://api.yourdomain.co.uk`
5. Click **Deploy**.

### Option 2: Netlify
1. Connect GitHub repository to Netlify.
2. Build command: `npm run build`
3. Publish directory: `.next`

### Option 3: Docker
```bash
docker build -t foodai-merchant .
docker run -p 3002:3002 -e NEXT_PUBLIC_API_URL=http://your-api:3001 foodai-merchant
```
