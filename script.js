
const GITHUB_TOKEN = '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';
const REPO_OWNER = 'xujiananroy';
const REPO_NAME = 'test';
const FILE_PATH = 'test/db.json';
const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`;

// Fetch initial JSON data from GitHub
async function fetchInitialData() {
    const response = await fetch(url, {
        headers: {
            Authorization: `token ${GITHUB_TOKEN}`,
            Accept: 'application/vnd.github.v3+json'
        }
    });

    if (response.ok) {
        const fileData = await response.json();
        const content = atob(fileData.content); // Decode the base64 content
        document.getElementById('jsonData').value = content; // Populate textarea
    } else {
        console.error('Error fetching initial data:', response.statusText);
    }
}

// Event listener for the save button
document.getElementById('saveButton').addEventListener('click', async () => {
    const updatedData = document.getElementById('jsonData').value;
    await saveToGitHub(updatedData);
});

async function saveToGitHub(data) {
    // Step 1: Get the file content and SHA
    const response = await fetch(url, {
        headers: {
            Authorization: `token ${GITHUB_TOKEN}`,
            Accept: 'application/vnd.github.v3+json'
        }
    });

    if (!response.ok) {
        console.error('Error fetching file:', response.statusText);
        return;
    }

    const fileData = await response.json();
    const content = atob(fileData.content); // Decode the base64 content
    const jsonData = JSON.parse(content);

    // Step 2: Modify the JSON data
    const updatedJsonData = JSON.parse(data); // Parse the updated data

    // Step 3: Encode the updated data back to base64
    const updatedContent = btoa(JSON.stringify(updatedJsonData, null, 2));

    // Step 4: Send an update request with the modified content
    const updateResponse = await fetch(url, {
        method: 'PUT',
        headers: {
            Authorization: `token ${GITHUB_TOKEN}`,
            Accept: 'application/vnd.github.v3+json'
        },
        body: JSON.stringify({
            message: 'Update JSON data',
            content: updatedContent,
            sha: fileData.sha // Required to update the file
        })
    });

    if (updateResponse.ok) {
        console.log('File updated successfully!');
    } else {
        console.error('Error updating file:', await updateResponse.text());
    }
}

// Fetch initial data when the page loads
fetchInitialData();