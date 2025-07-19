// Game state
let userScore = 0;
let userLevel = 1;
let currentPrediction = null;

// DOM elements
const uploadArea = document.getElementById('uploadArea');
const fileInput = document.getElementById('fileInput');
const previewContainer = document.getElementById('previewContainer');
const previewImage = document.getElementById('previewImage');
const analyzeBtn = document.getElementById('analyzeBtn');
const resultSection = document.getElementById('resultSection');
const loadingOverlay = document.getElementById('loadingOverlay');
const userScoreElement = document.getElementById('userScore');
const userLevelElement = document.getElementById('userLevel');

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    console.log('App initialized');
    setupEventListeners();
    loadUserData();
});

function setupEventListeners() {
    console.log('Setting up event listeners');
    
    // File upload handling
    if (uploadArea) {
        uploadArea.addEventListener('click', () => {
            console.log('Upload area clicked');
            fileInput.click();
        });
        
        uploadArea.addEventListener('dragover', handleDragOver);
        uploadArea.addEventListener('drop', handleDrop);
    }
    
    if (fileInput) {
        fileInput.addEventListener('change', handleFileSelect);
    }
    
    if (analyzeBtn) {
        analyzeBtn.addEventListener('click', analyzeImageClientSide);
    }
    
    // Feedback buttons
    const correctBtn = document.getElementById('correctBtn');
    const wrongBtn = document.getElementById('wrongBtn');
    
    if (correctBtn) {
        correctBtn.addEventListener('click', () => handleFeedback(true));
    }
    
    if (wrongBtn) {
        wrongBtn.addEventListener('click', () => handleFeedback(false));
    }
}

function handleDragOver(e) {
    e.preventDefault();
    if (uploadArea) {
        uploadArea.style.borderColor = '#45a049';
        uploadArea.style.background = '#e8f5e8';
    }
}

function handleDrop(e) {
    e.preventDefault();
    if (uploadArea) {
        uploadArea.style.borderColor = '#4CAF50';
        uploadArea.style.background = '#f8f9fa';
    }
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        handleFile(files[0]);
    }
}

function handleFileSelect(e) {
    console.log('File selected');
    const file = e.target.files[0];
    if (file) {
        handleFile(file);
    }
}

function handleFile(file) {
    console.log('Handling file:', file.name);
    
    if (!file.type.startsWith('image/')) {
        alert('Please select an image file.');
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        console.log('File loaded');
        previewImage.src = e.target.result;
        previewContainer.style.display = 'block';
        resultSection.style.display = 'none';
    };
    reader.readAsDataURL(file);
}

// Simulated AI analysis function
async function analyzeImageClientSide() {
    console.log('Starting analysis');
    
    if (!previewImage.src) {
        alert('Please upload an image first.');
        return;
    }
    
    showLoading(true);
    
    // Simulate AI analysis with realistic results
    setTimeout(() => {
        console.log('Analysis complete');
        const predictions = generateRealisticPredictions();
        currentPrediction = predictions;
        displayResults(predictions);
        showLoading(false);
    }, 2000);
}

function generateRealisticPredictions() {
    // Simulate AI analysis with realistic confidence scores
    const categories = ['plastic', 'paper', 'organic'];
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];
    
    let result = {plastic: 0, paper: 0, organic: 0};
    
    // Set high confidence for the random category
    result[randomCategory] = Math.floor(Math.random() * 30 + 70); // 70%
    // Set lower confidence for other categories
    categories.forEach(cat => {
        if (cat !== randomCategory) {
            result[cat] = Math.floor(Math.random() * 30); // 0-30
        }
    });
    
    // Ensure total doesn't exceed 100
    const total = Object.values(result).reduce((sum, val) => sum + val, 0);
    if (total < 100) {
        const factor = 100 / total;
        Object.keys(result).forEach(key => {
            result[key] = Math.round(result[key] * factor);
        });
    }
    
    return result;
}

function displayResults(prediction) {
    console.log('Displaying results:', prediction);
    
    // Update confidence bars
    const plasticConfidence = document.getElementById('plasticConfidence');
    const paperConfidence = document.getElementById('paperConfidence');
    const organicConfidence = document.getElementById('organicConfidence');
    
    if (plasticConfidence) plasticConfidence.style.width = prediction.plastic + '%';
    if (paperConfidence) paperConfidence.style.width = prediction.paper + '%';
    if (organicConfidence) organicConfidence.style.width = prediction.organic + '%';

    // Update confidence text
    const plasticText = document.getElementById('plasticText');
    const paperText = document.getElementById('paperText');
    const organicText = document.getElementById('organicText');
    
    if (plasticText) plasticText.textContent = prediction.plastic + '%';
    if (paperText) paperText.textContent = prediction.paper + '%';
    if (organicText) organicText.textContent = prediction.organic + '%';

    // Show result section
    if (resultSection) {
        resultSection.style.display = 'block';
        resultSection.scrollIntoView({ behavior: 'smooth' });
    }
    
    // Load recycling information for the highest confidence category
    const categories = [
        { name: 'plastic', confidence: prediction.plastic },
        { name: 'paper', confidence: prediction.paper },
        { name: 'organic', confidence: prediction.organic }
    ];
    
    const highestCategory = categories.reduce((prev, current) => 
        (prev.confidence > current.confidence) ? prev : current
    );
    
    if (highestCategory.confidence > 30) { // Only show if confidence is reasonable
        loadRecyclingInfo(highestCategory.name);
    }
}

function handleFeedback(isCorrect) {
    if (!currentPrediction) return;

    const points = isCorrect ? 10 : 5; // Points for correct/wrong feedback
    userScore += points;
    
    // Update level based on score
    userLevel = Math.floor(userScore / 50) + 1;
    
    // Update display
    updateScoreDisplay();
    saveUserData();
    
    // Save score to server
    saveScoreToServer(isCorrect);
    
    // Show feedback message
    const resultMessage = document.getElementById('resultMessage');
    if (resultMessage) {
        if (isCorrect) {
            resultMessage.textContent = `Great job! You earned ${points} points for providing feedback!`;
            resultMessage.className = 'result-message correct';
            showConfetti();
        } else {
            resultMessage.textContent = `Thanks for the feedback! You earned ${points} points for helping improve the AI!`;
            resultMessage.className = 'result-message correct';
        }
    }
    
    // Reset for next round
    setTimeout(() => {
        resetForNextRound();
    }, 2000);
}

async function saveScoreToServer(feedback) {
    try {
        await fetch('/save-score/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCSRFToken(),
            },
            body: JSON.stringify({
                score: userScore,
                level: userLevel,
                feedback: feedback
            })
        });
    } catch (error) {
        console.error('Error saving score to server:', error);
    }
}

function updateScoreDisplay() {
    if (userScoreElement) userScoreElement.textContent = userScore;
    if (userLevelElement) userLevelElement.textContent = `Level ${userLevel}`;
    // Animate level progress bar
    const levelProgress = document.getElementById('levelProgress');
    if (levelProgress) {
        const percent = Math.min(100, Math.round((userScore % 50) * 2));
        levelProgress.style.width = percent + '%';
    }
}

function resetForNextRound() {
    // Clear current image and results
    if (previewContainer) previewContainer.style.display = 'none';
    if (resultSection) resultSection.style.display = 'none';
    if (previewImage) previewImage.src = '';
    if (fileInput) fileInput.value = '';
    currentPrediction = null;
    
    // Reset confidence bars
    const plasticConfidence = document.getElementById('plasticConfidence');
    const paperConfidence = document.getElementById('paperConfidence');
    const organicConfidence = document.getElementById('organicConfidence');
    
    if (plasticConfidence) plasticConfidence.style.width = '0%';
    if (paperConfidence) paperConfidence.style.width = '0%';
    if (organicConfidence) organicConfidence.style.width = '0%';
    
    const plasticText = document.getElementById('plasticText');
    const paperText = document.getElementById('paperText');
    const organicText = document.getElementById('organicText');
    
    if (plasticText) plasticText.textContent = '0%';
    if (paperText) paperText.textContent = '0%';
    if (organicText) organicText.textContent = '0%';
    
    // Clear result message
    const resultMessage = document.getElementById('resultMessage');
    if (resultMessage) {
        resultMessage.textContent = '';
        resultMessage.className = 'result-message';
    }
    
    // Hide recycling section
    const recyclingSection = document.getElementById('recyclingInfoSection');
    if (recyclingSection) recyclingSection.style.display = 'none';
}

function showLoading(show) {
    if (loadingOverlay) {
        loadingOverlay.style.display = show ? 'flex' : 'none';
    }
}

// Get CSRF token for Django
function getCSRFToken() {
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
        const [name, value] = cookie.trim().split('=');
        if (name === 'csrftoken') {
            return value;
        }
    }
    return '';
}

// Local storage functions
function saveUserData() {
    const userData = {
        score: userScore,
        level: userLevel,
        timestamp: Date.now()
    };
    localStorage.setItem('ecosort_user_data', JSON.stringify(userData));
}

function loadUserData() {
    const savedData = localStorage.getItem('ecosort_user_data');
    if (savedData) {
        try {
            const userData = JSON.parse(savedData);
            userScore = userData.score || 0;
            userLevel = userData.level || 1;
            updateScoreDisplay();
        } catch (error) {
            console.error('Error loading user data:', error);
        }
    }
}

// Recycling information functionality
async function loadRecyclingInfo(category) {
    try {
        const response = await fetch(`/recycling-info/?category=${category}`);
        const data = await response.json();
        
        if (data.success) {
            displayRecyclingInfo(data.data);
        } else {
            console.error('Error loading recycling info:', data.error);
        }
    } catch (error) {
        console.error('Error fetching recycling info:', error);
    }
}

function displayRecyclingInfo(recyclingData) {
    const recyclingSection = document.getElementById('recyclingInfoSection');
    const recyclingContent = document.getElementById('recyclingContent');
    const badgeContainer = document.getElementById('categoryBadgeContainer');
    if (!recyclingSection || !recyclingContent) return;
    // Animate fade-in
    recyclingSection.style.opacity = 0;
    recyclingSection.style.display = 'block';
    setTimeout(() => { recyclingSection.style.opacity = 1; }, 10);
    // Inject category badge
    if (badgeContainer) {
        let icon = '♻️', label = 'Waste';
        if (recyclingData.title.includes('Plastic')) { icon = '🥤'; label = 'Plastic Waste'; }
        if (recyclingData.title.includes('Paper')) { icon = '📄'; label = 'Paper Waste'; }
        if (recyclingData.title.includes('Organic')) { icon = '🍎'; label = 'Organic Waste'; }
        badgeContainer.innerHTML = `<span class="category-badge">${icon} ${label}</span>`;
    }
    // Create the HTML content with tooltips
    const html = `
        <div class="recycling-guide">
            <h4>${recyclingData.title}</h4>
            <p class="recycling-description">${recyclingData.description}</p>
            <div class="recycling-sections">
                <div class="recycling-section">
                    <h5>📋 Steps to Recycle:</h5>
                    <ol class="steps-list">
                        ${recyclingData.steps.map(step => `<li class='tooltip'>${step}<span class='tooltiptext'>${step}</span></li>`).join('')}
                    </ol>
                </div>
                <div class="recycling-section">
                    <h5>🔄 Examples:</h5>
                    <ul class="examples-list">
                        ${recyclingData.examples.map(example => `<li>${example}</li>`).join('')}
                    </ul>
                </div>
                <div class="recycling-section">
                    <h5>💡 Tips:</h5>
                    <ul class="tips-list">
                        ${recyclingData.tips.map(tip => `<li class='tooltip'>${tip}<span class='tooltiptext'>${tip}</span></li>`).join('')}
                    </ul>
                </div>
                <div class="recycling-section">
                    <h5>🖼️ Recycling Examples:</h5>
                    <div class="recycling-images">
                        ${recyclingData.images.map((img, idx) => `
                            <div class="recycling-image">
                                <img src="${img.url}" alt="Recycling example" loading="lazy" style="cursor:pointer" onclick="showRecyclingModal(${idx})">
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        </div>
        <div id="recyclingModal" class="recycling-modal" style="display:none;">
            <div class="recycling-modal-content">
                <span class="recycling-modal-close" id="recyclingModalClose">&times;</span>
                <img id="recyclingModalImg" src="" alt="Recycling Example" />
                <div id="recyclingModalText"></div>
            </div>
        </div>
    `;
    recyclingContent.innerHTML = html;
    // Modal logic
    window.showRecyclingModal = function(idx) {
        const modal = document.getElementById('recyclingModal');
        const modalImg = document.getElementById('recyclingModalImg');
        const modalText = document.getElementById('recyclingModalText');
        modal.style.display = 'flex';
        modalImg.src = recyclingData.images[idx].url;
        modalText.textContent = recyclingData.images[idx].explanation;
    };
    const closeBtn = document.getElementById('recyclingModalClose');
    if (closeBtn) {
        closeBtn.onclick = function() {
            document.getElementById('recyclingModal').style.display = 'none';
        };
    }
    // Close modal on outside click
    const modal = document.getElementById('recyclingModal');
    if (modal) {
        modal.onclick = function(e) {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        };
    }
}

// Add some gamification features
function addBonusPoints() {
    // Bonus points for consecutive correct classifications
    const bonus = Math.floor(Math.random() * 5) + 1;
    userScore += bonus;
    updateScoreDisplay();
    saveUserData();
    
    // Show bonus notification
    const notification = document.createElement('div');
    notification.className = 'bonus-notification';
    notification.textContent = `+${bonus} Bonus Points!`;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Add CSS for bonus notification
const style = document.createElement('style');
style.textContent = `
    .bonus-notification {
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #FFD700, #FFA500);
        color: white;
        padding: 15px 25px;
        border-radius: 25px;
        font-weight: bold;
        animation: slideIn 0.5s ease-out;
        z-index: 1001;
        box-shadow: 0 5px 15px rgba(255, 215, 0, 0.3);
    }
    
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);

// Add some educational tips
const tips = [
    "💡 Tip: Plastic bottles should be rinsed before recycling",
    "💡 Tip: Paper with food stains goes in organic waste",
    "💡 Tip: Small plastic pieces can be recycled together",
    "💡 Tip: Cardboard boxes should be flattened for recycling",
    "💡 Tip: Organic waste can be composted at home"
];

function showRandomTip() {
    const tip = tips[Math.floor(Math.random() * tips.length)];
    const tipElement = document.createElement('div');
    tipElement.className = 'tip-notification';
    tipElement.textContent = tip;
    document.body.appendChild(tipElement);
    
    setTimeout(() => {
        tipElement.remove();
    }, 5000);
}

// Show tip every 5 classifications
let classificationCount = 0;
const originalHandleFeedback = handleFeedback;
handleFeedback = function(isCorrect) {
    originalHandleFeedback.call(this, isCorrect);
    classificationCount++;
    if (classificationCount % 5 === 0) {
        setTimeout(showRandomTip, 1000);
    }
};

// Add CSS for tip notification
const tipStyle = document.createElement('style');
tipStyle.textContent = `
    .tip-notification {
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: linear-gradient(135deg, #4CAF50, #45a049);
        color: white;
        padding: 15px 25px;
        border-radius: 25px;
        font-weight: bold;
        animation: slideUp 0.5s ease-out;
        z-index: 1001;
        box-shadow: 0 5px 15px rgba(76, 175, 80, 0.3);
        max-width: 400px;
        text-align: center;
    }
    
    @keyframes slideUp {
        from {
            transform: translateX(-50%) translateY(100%);
            opacity: 0;
        }
        to {
            transform: translateX(-50%) translateY(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(tipStyle); 
// Confetti effect
function showConfetti() {
    const confetti = document.getElementById('confetti');
    if (!confetti) return;
    confetti.innerHTML = '';
    const colors = ['#ffd700', '#2ecc40', '#fffbe6', '#fff', '#ffecb3'];
    for (let i = 0; i < 60; i++) {
        const piece = document.createElement('div');
        piece.className = 'confetti-piece';
        piece.style.background = colors[Math.floor(Math.random() * colors.length)];
        piece.style.left = Math.random() * 100 + 'vw';
        piece.style.animation = `confetti-fall 1.5s ${Math.random()}s ease-out forwards`;
        piece.style.transform = `rotate(${Math.random()*360}deg)`;
        confetti.appendChild(piece);
    }
    setTimeout(() => { confetti.innerHTML = ''; }, 1800);
}
// Add confetti keyframes
const confettiStyle = document.createElement('style');
confettiStyle.textContent += `@keyframes confetti-fall { from { top: -20px; opacity: 1; } to { top: 100vh; opacity: 0.7; } }`;
document.head.appendChild(confettiStyle); 