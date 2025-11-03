# Quick Setup: Using Mock Data

## One-Line Setup

Create a `.env` file in the project root with:

```
VITE_USE_MOCK_DATA=true
```

That's it! No API key needed.

## Verify It's Working

1. Run `npm run dev`
2. Open the browser console
3. You should see: `🧪 Mock Data Mode Enabled - Using mock data instead of API calls`
4. Upload any files (or use sample data)
5. You should see mock data emoji logs: 📋 🌳 💰 🔧 ⚔️ 🎯

## What You Get

- **6 complete branches** from the E Ink case study
- **Full risk analyses** (financial, technical, competitive)
- **Risk levels** with mitigation strategies
- **Fast development** without API costs
- **Realistic testing** data

## Switch to Production

Just change `.env` to:

```
VITE_USE_MOCK_DATA=false
VITE_PERPLEXITY_API_KEY=your_actual_key_here
```

And restart the dev server.

See `MOCK_DATA_README.md` for more details.

