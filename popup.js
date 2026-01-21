// popup.js - GitHub OAuth and Repo Management

// 🟢 NEW - Track repos
let currentToken = null;
let userRepos = [];

// ⚪ ORIGINAL
document.addEventListener('DOMContentLoaded', async () => {
  await displayExtensionInfo();
  await checkAuthStatus();
  setupEventListeners();
});

// ⚪ ORIGINAL
async function displayExtensionInfo() {
  chrome.runtime.sendMessage({ action: 'getExtensionId' }, (response) => {
    const extensionId = response.extensionId;
    const redirectUri = `https://${extensionId}.chromiumapp.org/`;

    document.getElementById('extensionId').textContent = extensionId;
    document.getElementById('redirectUri').textContent = redirectUri;
  });
}

// MODIFIED - was original, now has repo loading
async function checkAuthStatus() {
  const { githubToken, selectedRepo } = await chrome.storage.local.get(['githubToken', 'selectedRepo']); // 🟢 Added selectedRepo

  // ⚪ ORIGINAL PART
  if (githubToken) {
    const isValid = await verifyToken(githubToken);

    if (isValid) {
      currentToken = githubToken; // 🟢 NEW - store token
      await showMainScreen(githubToken);

      // 🟢 NEW - Load repos
      await loadUserRepos();
      if (selectedRepo) {
        displaySelectedRepo(selectedRepo);
      }
    } else {
      await chrome.storage.local.remove(['githubToken', 'selectedRepo']); // 🟢 Also remove selectedRepo
      showAuthScreen();
    }
  } else {
    showAuthScreen();
  }
}

// ⚪ ORIGINAL
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
    console.error('Error verifying token:', error);
    return false;
  }
}

// ⚪ ORIGINAL
function showAuthScreen() {
  document.getElementById('authScreen').style.display = 'block';
  document.getElementById('mainScreen').style.display = 'none';
}

// ⚪ ORIGINAL
async function showMainScreen(token) {
  document.getElementById('authScreen').style.display = 'none';
  document.getElementById('mainScreen').style.display = 'block';

  // Force repo-section to display (optional, ensures it shows)
  const repoSection = document.querySelector('.repo-section');
  if (repoSection) repoSection.style.display = 'block';

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
    document.getElementById('userInfo').textContent = 'Connected to GitHub';
  }
}


// 🟢 🟢 🟢 EVERYTHING BELOW IS NEW FOR PHASE 2 🟢 🟢 🟢

// Load user's repositories
async function loadUserRepos() {
  if (!currentToken) return;

  showStatus('Loading repositories...', 'info');

  try {
    const response = await fetch('https://api.github.com/user/repos?per_page=100&sort=updated', {
      headers: {
        'Authorization': `token ${currentToken}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch repositories');
    }

    userRepos = await response.json();
    populateRepoDropdown(userRepos);
    hideStatus();

  } catch (error) {
    console.error('Error loading repos:', error);
    showStatus('Failed to load repositories', 'error');
  }
}

// Populate the repository dropdown
function populateRepoDropdown(repos) {
  const select = document.getElementById('repoSelect');
  const selectBtn = document.getElementById('selectRepoBtn');

  select.innerHTML = '';

  if (repos.length === 0) {
    select.innerHTML = '<option value="">No repositories found</option>';
    selectBtn.disabled = true;
    return;
  }

  select.innerHTML = '<option value="">-- Select a repository --</option>';

  repos.forEach(repo => {
    const option = document.createElement('option');
    option.value = repo.full_name;
    option.textContent = `${repo.full_name} ${repo.private ? '🔒' : ''}`;
    select.appendChild(option);
  });

  selectBtn.disabled = false;
}

// Display the currently selected repo
function displaySelectedRepo(repoFullName) {
  const repoDisplay = document.getElementById('currentRepo');

  if (repoFullName) {
    repoDisplay.textContent = repoFullName;
    repoDisplay.classList.add('active');
  } else {
    repoDisplay.textContent = 'No repository selected';
    repoDisplay.classList.remove('active');
  }
}

// Show status message
function showStatus(message, type = 'info') {
  const statusDiv = document.getElementById('statusMessage');
  statusDiv.textContent = message;
  statusDiv.className = `status-message ${type}`;
}

// Hide status message
function hideStatus() {
  const statusDiv = document.getElementById('statusMessage');
  statusDiv.style.display = 'none';
}

// Setup event listeners - MODIFIED
function setupEventListeners() {
  // ⚪ ORIGINAL - Connect button
  document.getElementById('connectBtn').addEventListener('click', async () => {
    const errorDiv = document.getElementById('authError');
    const btn = document.getElementById('connectBtn');

    btn.disabled = true;
    btn.textContent = 'Connecting...';
    errorDiv.classList.remove('show');

    chrome.runtime.sendMessage({ action: 'authenticate' }, async (response) => {
      btn.disabled = false;
      btn.textContent = 'Connect to GitHub';

      if (response.success) {
        currentToken = response.token; // 🟢 NEW - store token
        await showMainScreen(response.token);
        await loadUserRepos(); // 🟢 NEW - load repos after auth
      } else {
        errorDiv.textContent = `Authentication failed: ${response.error}`;
        errorDiv.classList.add('show');
      }
    });
  });

  // 🟢 NEW - Select repo button
  document.getElementById('selectRepoBtn').addEventListener('click', async () => {
    const select = document.getElementById('repoSelect');
    const selectedRepo = select.value;

    if (!selectedRepo) {
      showStatus('Please select a repository', 'error');
      return;
    }

    await chrome.storage.local.set({ selectedRepo: selectedRepo });
    displaySelectedRepo(selectedRepo);
    showStatus(`Repository set to: ${selectedRepo}`, 'success');

    setTimeout(hideStatus, 3000);
  });

  // 🟢 NEW - Create repo button
  document.getElementById('createRepoBtn').addEventListener('click', async () => {
    const repoName = document.getElementById('newRepoName').value.trim();
    const description = document.getElementById('newRepoDescription').value.trim();
    const isPrivate = document.getElementById('isPrivate').checked;

    if (!repoName) {
      showStatus('Please enter a repository name', 'error');
      return;
    }

    if (!/^[a-zA-Z0-9_.-]+$/.test(repoName)) {
      showStatus('Repository name can only contain letters, numbers, hyphens, underscores, and periods', 'error');
      return;
    }

    const btn = document.getElementById('createRepoBtn');
    btn.disabled = true;
    btn.textContent = 'Creating...';
    showStatus('Creating repository...', 'info');

    try {
      const response = await fetch('https://api.github.com/user/repos', {
        method: 'POST',
        headers: {
          'Authorization': `token ${currentToken}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: repoName,
          description: description || undefined,
          private: isPrivate
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create repository');
      }

      const newRepo = await response.json();
      showStatus(`Repository created: ${newRepo.full_name}`, 'success');

      document.getElementById('newRepoName').value = '';
      document.getElementById('newRepoDescription').value = '';
      document.getElementById('isPrivate').checked = false;

      await loadUserRepos();
      await chrome.storage.local.set({ selectedRepo: newRepo.full_name });
      displaySelectedRepo(newRepo.full_name);

      setTimeout(hideStatus, 5000);

    } catch (error) {
      console.error('Error creating repo:', error);
      showStatus(`Error: ${error.message}`, 'error');
    } finally {
      btn.disabled = false;
      btn.textContent = 'Create Repository';
    }
  });

  // ⚪ ORIGINAL - Disconnect button (with 🟢 NEW repo clearing)
  document.getElementById('disconnectBtn').addEventListener('click', async () => {
    await chrome.storage.local.remove(['githubToken', 'selectedRepo']); // 🟢 Also remove selectedRepo
    currentToken = null; // 🟢 NEW
    userRepos = []; // 🟢 NEW
    showAuthScreen();
  });
}