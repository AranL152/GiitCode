document.addEventListener('DOMContentLoaded', async () => {
    await displayExtensionInfo();
    await checkAuthStatus();
    setupEventListeners();
});

async function displayExtensionInfo() {
    chrome.runtime.sendMessage({action: 'getExtensionId'}, (response) => {
        const extensionId = response.extensionId;
        const redurectUri = `https://${extensionId}.chromiumapp.org/`;

        document.getElementById('extensionId').textContent = extensionId;
        document.getElementById('redirectUri').textContent = redirectUri;
    }); 
}

async function checkAuthStatus() {
    const {githubToken} = await chrome.storage.local.get(['githubToken']);

    if (githubToken) {
        const isValid = await verifyToken(githubToken);
        
        if (isValid) {
            showMainScreen(githubToken);
        } else {
            await chrome.storage.local.remove(['githubToken']);
            showAuthScreen();
        }
    } else {
        showAuthScreen();
    }
}

async function verifyToken(token) {
    try {
        const response = await fetch('https://api.github.com/user', {
            headers: {
                'Authorization': `token ${token}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        });

        return response.ok;

    } catch (error) {
        console.error('Error verifying token', error);
        return false;
    }
}

function showAuthScreen() {
    document.getElementById('authScreen').style.display = 'block';
    document.getElementById('mainScreen').style.display = 'none';
}

async function showMainScreen(token) {
    document.getElementById('authScreen').style.display = 'none';
    document.getElementById('mainScreen').style.display = 'block';

    try {
       const response = await fetch('https://api.github.com/user', {
      headers: {
        'Authorization': `token ${token}`,
        'Accept': 'application/vnd.github.v3+json'
         }
        });
        if (response.ok) {
            const user = await response.json();
            document.getElementById('userInfo').textContent = `Logged in as @${user.login}`; 

        }
    } catch (error) {
        console.error('Error fetching user info:', error);
        document.getElementById('userInfo').textContent = 'Connected to Github';
    }
}

function setupEventListeners() {
    document.getElementById('connectBtn').addEventListener('click', async () => {
        const errorDiv = document.getElementById('authError');
        const btn = document.getElementById('connectBtn');

        btn.disabled = true;
        btn.textContent = 'Connecting...';
        errorDiv.classList.remove('show');

        chrome.runtime.sendMessage({action: 'authenticate'}, async (response) => {
            btn.disabled = false;
            btn.textContent = 'Connect to Github';

            if (response.success) {
                await showMainScreen(response.token);
            } else {
                errorDiv.textContent = `Authentication failed: ${response.error}`;
                errorDiv.classList.add('show');
            }
        });
    });

    document.getElementById('disconnectBtn').addEventListener('click', async () => {
        await chrome.storage.local.remove(['githubToken']);
        showAuthScreen();
    });
}