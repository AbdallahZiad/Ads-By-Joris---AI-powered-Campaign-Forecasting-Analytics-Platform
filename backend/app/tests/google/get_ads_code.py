import urllib.parse

# --- CONFIGURATION ---
# Use the same Client ID/Secret as your backend .env
client_id = "507845882812-avft4url75cfrvuiipsusc8bg8a8b3q2.apps.googleusercontent.com"
redirect_uri = "http://localhost:8080" # Must match exactly what you send to the backend

# 1. Scopes for Google Ads (Manager Access)
scopes = ["https://www.googleapis.com/auth/adwords"]

# 2. GENERATE AUTH URL
auth_params = {
    "client_id": client_id,
    "redirect_uri": redirect_uri,
    "response_type": "code",
    "scope": " ".join(scopes),
    "access_type": "offline",  # CRITICAL: Asks for Refresh Token
    "prompt": "consent"        # CRITICAL: Forces a new Refresh Token every time
}

auth_url = f"https://accounts.google.com/o/oauth2/v2/auth?{urllib.parse.urlencode(auth_params)}"

print("=====================================================")
print("CLICK TO GENERATE CODE FOR /me/link-google-ads:")
print(auth_url)
print("=====================================================")
print("\nInstructions:")
print("1. Click the link.")
print("2. 'Allow' access (you should see the consent screen again).")
print("3. Copy the 'code=' value from the browser URL bar.")
print("4. Paste it into the Swagger UI /me/link-google-ads endpoint.")