(() => {
  // Add CSS to the document
  const addStyles = () => {
    const style = document.createElement('style');
    style.textContent = `
      .tartle-datavault-connect-button {
        margin: 0 auto;
        display: flex;
        width: fit-content;
        align-items: center;
        justify-content: center;
        background-color: hsl(170, 72%, 47%);
        color: hsl(180, 100%, 12%);
        white-space: nowrap;
        font-family: 'Inter', sans-serif;
        font-weight: bold;
        padding: 0.5rem 1rem 0.5rem 0.5rem;
        border-radius: 0.5rem;
        font-size: 0.875rem;
        transition:
          background-color 0.2s ease-in-out,
          scale 0.15s ease-in-out;
      }

      .tartle-datavault-connect-button:hover {
        text-decoration: none;
        background-color: hsla(170, 72%, 42%);
      }

      .tartle-datavault-connect-button span {
        margin-left: 0.5rem;
      }

      .tartle-datavault-connect-button .logo-container {
        display: grid;
        grid-template-columns: 1fr;
      }

      .tartle-datavault-connect-button .logo-container svg {
        width: 1.5rem;
        height: 1.5rem;
        color: hsl(180, 100%, 12%);
        grid-row-start: 1;
        grid-column-start: 1;
      }

      .tartle-datavault-connect-button:hover .tartle-logo {
        opacity: 0;
        rotate: 180deg;
        animation: pulse 0.3s ease-in-out;
      }

      .tartle-datavault-connect-button:hover .logo-cube {
        opacity: 1;
        rotate: 360deg;
        animation: pulse 0.3s ease-in-out;
      }

      .tartle-logo,
      .logo-cube {
        transition:
          opacity 0.3s ease-in-out,
          rotate 0.3s cubic-bezier(0.785, 0.135, 0.15, 0.86),
          scale 0.3s ease-in-out;
      }
      .tartle-logo {
        opacity: 1;
        rotate: 0deg;
      }
      .logo-cube {
        opacity: 0;
        rotate: 180deg;
      }

      .tartle-datavault-connect-button:active {
        scale: 0.95;
      }

      .tartle-datavault-connect-button:active .logo-cube {
        scale: 0.35;
      }

      @keyframes pulse {
        0% {
          transform: scale(1);
        }
        50% {
          transform: scale(0.7);
        }
        100% {
          transform: scale(1);
        }
      }
    `;
    document.head.appendChild(style);
  };

  // Equivalent of buffer.toString('base64') for browser environments
  const bufferToBase64 = buffer => {
    // Create a byte array from the buffer
    const bytes = new Uint8Array(buffer);

    // Base64 encoding implementation
    const base64Chars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    let result = '';

    // Process the bytes in groups of 3
    for (let i = 0; i < bytes.length; i += 3) {
      // Get the values of this group of 3 bytes
      const byte1 = bytes[i];
      const byte2 = i + 1 < bytes.length ? bytes[i + 1] : 0;
      const byte3 = i + 2 < bytes.length ? bytes[i + 2] : 0;

      // Convert to 4 base64 characters
      const char1 = base64Chars[byte1 >> 2];
      const char2 = base64Chars[((byte1 & 3) << 4) | (byte2 >> 4)];
      const char3 =
        i + 1 < bytes.length ? base64Chars[((byte2 & 15) << 2) | (byte3 >> 6)] : '=';
      const char4 = i + 2 < bytes.length ? base64Chars[byte3 & 63] : '=';

      result += char1 + char2 + char3 + char4;
    }

    return result;
  };

  // Simple Base64URL encode function using our bufferToBase64 helper
  const base64URLEncode = buffer => {
    // Get standard base64
    const base64 = bufferToBase64(buffer);

    // Convert to base64url format
    return base64
      .replace(/\+/g, '-') // Replace + with -
      .replace(/\//g, '_') // Replace / with _
      .replace(/=+$/, ''); // Remove trailing =
  };

  // Generate a PKCE code verifier (43-128 chars per RFC 7636, using 64 for good security)
  const generateCodeVerifier = () => {
    // Generate random bytes
    const buffer = new Uint8Array(48); // Will produce ~64 characters when base64 encoded
    crypto.getRandomValues(buffer);

    // Convert to base64url format
    const encoded = base64URLEncode(buffer);
    return encoded.slice(0, 64); // Ensure proper length
  };

  // Generate a PKCE code challenge from the verifier using SHA-256
  const generateCodeChallenge = async codeVerifier => {
    const encoder = new TextEncoder();
    const data = encoder.encode(codeVerifier);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    return base64URLEncode(hashBuffer);
  };

  // Cookie helper functions - write cookies readable after redirect
  const setCookie = (name, value, hours = 1) => {
    const date = new Date();
    date.setTime(date.getTime() + hours * 60 * 60 * 1000);
    const expires = `expires=${date.toUTCString()}`;
    const secure = window.location.protocol === 'https:' ? ';Secure' : '';

    // Set SameSite=Lax to allow the cookie to be sent when redirecting from OAuth
    // These settings ensure the cookie will be readable server-side
    document.cookie = `${name}=${value};${expires};path=/;SameSite=Lax${secure}`;
  };

  // Initialize when DOM is ready
  const initialize = () => {
    addStyles();

    // Find and process tartle button containers
    const containers = document.querySelectorAll('#tartle-datavault-button');

    containers.forEach(async container => {
      const clientId = container.getAttribute('data-client-id');
      const redirectUri = container.getAttribute('data-redirect-uri');
      const envFlag = container.getAttribute('data-env');

      if (!clientId) {
        console.error('Tartle DataVault Button: Missing data-client-id attribute');
        return;
      }

      if (!redirectUri) {
        console.error('Tartle DataVault Button: Missing data-redirect-uri attribute');
        return;
      }

      try {
        // Generate PKCE pair
        const codeVerifier = generateCodeVerifier();
        const codeChallenge = await generateCodeChallenge(codeVerifier);

        // Store code verifier in cookie for later exchange
        // Using a cookie name that clearly indicates its purpose
        setCookie('tartle_code_verifier', codeVerifier);

        // Also store the state parameter to prevent CSRF attacks
        const state = generateCodeVerifier().slice(0, 32);
        setCookie('tartle_oauth_state', state, 7);

        // Determine API URI - defaulting to production if not provided
        const apiUri =
          envFlag === 'demo'
            ? 'https://demo.tartle.co/'
            : 'local'
              ? 'http://localhost:3000'
              : 'https://source.tartle.co/';

        // Create URL for OAuth flow
        const authUrl = new URL('/oauth/authorize', apiUri);
        authUrl.search = new URLSearchParams({
          client_id: clientId,
          response_type: 'code',
          redirect_uri: redirectUri,
          code_challenge: codeChallenge,
          code_challenge_method: 'S256',
          scope: 'write',
          state: state // Add state parameter for CSRF protection
        }).toString();

        // Set container HTML directly
        container.innerHTML = `
          <a href="${authUrl.toString()}" class="tartle-datavault-connect-button">
            <div class="logo-container">
              <svg
                viewBox="0 0 35 40"
                fill="none"
                class="logo-cube"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs id="defs1" />
                <path
                  d="M 17.162176,39.288721 34.3247,29.6706 34.2922,9.87187 17.1292,0 0,9.9281 0.032495,29.7268 17.162176,39.288721 17.204142,35.299053 3.77803,27.556 3.75303,12.0864 17.1367,4.33042 l 13.41,7.71228 0.025,15.4695 -13.367558,7.786853 z"
                  fill="currentColor"
                  id="path1"
                />
                <g id="layer1">
                  <path
                    d="M 30.5467,12.0427 17.1367,4.33042 3.75303,12.0864 17.16235,19.64436 Z"
                    fill="currentColor"
                    id="path1-8"
                    style="fill: #7c7c7c; fillOpacity: 1;"
                  />
                </g>
                <g id="layer2">
                  <path
                    d="M 17.204142,35.299053 17.16235,19.64436 3.75303,12.0864 3.77803,27.556 Z"
                    fill="currentColor"
                    id="path1-8-5"
                    style="fill: #c8c8c8; fillOpacity: 1;"
                  />
                </g>
                <g id="layer3">
                  <path
                    d="M 17.204142,35.299053 17.149865,19.62251 30.5467,12.0427 l 0.025,15.4695 z"
                    fill="currentColor"
                    id="path1-8-5-9"
                    style="fill: #ffffff; fillOpacity: 1;"
                  />
                </g>
              </svg>

              <svg
                class="tartle-logo"
                viewBox="0 0 35 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M17.9966 39.1338L34.3247 29.6706L34.2922 9.87187L17.1292 0L0 9.9281L0.032495 29.7268L13.0075 37.1904L16.8555 39.4037V20.5498H25.8913V16.4419H4.58537V20.5498H13.0075V32.865L3.77803 27.556L3.75303 12.0864L17.1367 4.33042L30.5467 12.0427L30.5717 27.5122L17.9966 34.8008V39.1338Z"
                  fill="currentColor"
                />
              </svg>
            </div>
            <span>DataVault Connect</span>
          </a>
        `;
      } catch (error) {
        console.error('Tartle DataVault Button: Error rendering button', error);
      }
    });
  };

  // Run initialization either on DOMContentLoaded or immediately if DOM is already loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  } else {
    initialize();
  }
})();
