# Security Guidelines

## ⚠️ CRITICAL: API Key Security

Your OpenAI API key is **highly sensitive** and must be protected. Unauthorized use can result in unexpected charges to your OpenAI account.

### DO NOT:
- ❌ Commit `.env` files to Git or GitHub
- ❌ Share your API key in chat messages, emails, or screenshots
- ❌ Hardcode API keys directly in source code
- ❌ Upload projects with API keys to public repositories
- ❌ Share your `.env` file with others

### DO:
- ✅ Keep API keys in `.env` files (which are gitignored)
- ✅ Use environment variables via `import.meta.env.VITE_*`
- ✅ Rotate API keys if they're accidentally exposed
- ✅ Monitor your OpenAI usage dashboard regularly
- ✅ Set usage limits in your OpenAI account
- ✅ Share `.env.example` instead of `.env`

## What's Already Protected

This project includes:

1. **`.gitignore`** - Prevents `.env` from being committed
2. **`.env.example`** - Template for others to create their own `.env`
3. **Environment variable usage** - No hardcoded keys in source code

## If Your API Key is Exposed

1. **Immediately** go to https://platform.openai.com/api-keys
2. Delete the compromised API key
3. Generate a new API key
4. Update your `.env` file with the new key
5. Review your OpenAI usage dashboard for unauthorized activity
6. Consider enabling spending limits

## Setting Up Safely

### For First-Time Setup:
```bash
# 1. Copy the example file
cp .env.example .env

# 2. Edit .env and add your API key
# Use a text editor, don't share this file!

# 3. Verify .gitignore includes .env
cat .gitignore | grep .env
```

### For Team Projects:
- Each team member should have their own OpenAI account and API key
- Never share API keys between team members
- Use `.env.example` to show what environment variables are needed
- Each developer creates their own `.env` locally

## Additional Security Measures

### Rate Limiting
Consider implementing rate limiting in production:
```javascript
// Example: Limit API calls per user
const MAX_CALLS_PER_HOUR = 50;
```

### API Key Rotation
Rotate your API keys periodically (e.g., every 90 days) as a security best practice.

### Monitoring
Regularly check:
- OpenAI usage dashboard: https://platform.openai.com/usage
- Set up billing alerts
- Monitor for unusual activity patterns

## Production Deployment

When deploying to production:

1. **Use Platform Environment Variables**
   - Vercel: Add env vars in project settings
   - Netlify: Use environment variables section
   - AWS/Heroku: Use platform-specific env var systems

2. **Never deploy with `.env` files**
   - Environment variables should be set on the hosting platform
   - `.env` files are for local development only

3. **Use Different Keys**
   - Development API key (local testing)
   - Production API key (live app)

## Questions?

If you're unsure about any security aspect:
1. Assume it's sensitive and protect it
2. Consult OpenAI's security best practices
3. When in doubt, regenerate your API key

---

**Remember**: Protecting your API key is protecting your money. Treat it like a credit card number!
