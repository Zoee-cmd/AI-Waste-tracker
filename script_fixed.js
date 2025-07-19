// Game state
let userScore = 0;
let userLevel = 1 currentPrediction = null;

// DOM elements
const uploadArea = document.getElementById('uploadArea');
const fileInput = document.getElementById('fileInput');
const previewContainer = document.getElementById('previewContainer');
const previewImage = document.getElementById('previewImage');
const analyzeBtn = document.getElementById('analyzeBtn');
const resultSection = document.getElementById(resultSection');
const loadingOverlay = document.getElementById('loadingOverlay');
const userScoreElement = document.getElementById('userScore');
const userLevelElement = document.getElementById('userLevel');

// Get CSRF token for Django
function getCSRFToken() {
    const cookies = document.cookie.split(;   for (let cookie of cookies)[object Object]       const [name, value] = cookie.trim().split(=;
        if (name === 'csrftoken') {
            return value;
        }
    }
    return '';
}

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    setupEventListeners();
    loadUserData();
});

function setupEventListeners() {
    // File upload handling
    uploadArea.addEventListener('click, ()=> fileInput.click());
    uploadArea.addEventListener(dragover', handleDragOver);
    uploadArea.addEventListener(drop', handleDrop);
    fileInput.addEventListener('change', handleFileSelect);

    // Analyze button
    analyzeBtn.addEventListener('click', analyzeImageClientSide);

    // Feedback buttons
    document.getElementById('correctBtn').addEventListener('click', () => handleFeedback(true));
    document.getElementById('wrongBtn').addEventListener('click', () => handleFeedback(false));
}

function handleDragOver(e) {
    e.preventDefault();
    uploadArea.style.borderColor = '#459  uploadArea.style.background = '#e8f5e8';
}

function handleDrop(e) {
    e.preventDefault();
    uploadArea.style.borderColor = '#4CAF50  uploadArea.style.background = '#f8f9fa';
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        handleFile(files[0]);
    }
}

function handleFileSelect(e) [object Object]    const file = e.target.files0;
    if (file) {
        handleFile(file);
    }
}

function handleFile(file) {
    if (!file.type.startsWith('image/'))[object Object]     alert('Please select an image file.);
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e)[object Object]      previewImage.src = e.target.result;
        previewContainer.style.display = 'block';
        resultSection.style.display = none
    };
    reader.readAsDataURL(file);
}

// Simulated AI analysis function
async function analyzeImageClientSide() [object Object] if (!previewImage.src)[object Object]     alert('Please upload an image first.);
        return;
    }
    showLoading(true);
    
    // Simulate AI analysis with realistic results
    setTimeout(() => {
        // Generate realistic predictions based on image analysis simulation
        const predictions = generateRealisticPredictions();
        currentPrediction = predictions;
        displayResults(predictions);
        showLoading(false);
    }, 2000 //2 delay to simulate processing
}

function generateRealisticPredictions()[object Object]    // Simulate AI analysis with realistic confidence scores
    const categories = ['plastic',paper, ganic'];
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];
    
    let result = [object Object]plastic: 0, paper: 0, organic: 0};
    
    // Set high confidence for the random category
    result[randomCategory] = Math.floor(Math.random() * 30 + 70; // 700 
    // Set lower confidence for other categories
    categories.forEach(cat =>[object Object]       if (cat !== randomCategory) {
            result[cat] = Math.floor(Math.random() * 30); // 0-30        }
    });
    
    // Ensure total doesnt exceed 100
    const total = Object.values(result).reduce((sum, val) => sum + val,0);
    if (total > 100      const factor = 100al;
        Object.keys(result).forEach(key => {
            result[key] = Math.round(result[key] * factor);
        });
    }
    
    return result;
}

function displayResults(prediction) {
    // Update confidence bars
    document.getElementById(plasticConfidence').style.width = prediction.plastic +%ent.getElementById('paperConfidence').style.width = prediction.paper +%ent.getElementById(organicConfidence').style.width = prediction.organic + '%';

    // Update confidence text
    document.getElementById('plasticText').textContent = prediction.plastic +%ent.getElementById('paperText').textContent = prediction.paper +%ent.getElementById('organicText').textContent = prediction.organic +%    // Show result section
    resultSection.style.display = 'block';
    resultSection.scrollIntoView({ behavior: smooth' });
    
    // Load recycling information for the highest confidence category
    const categories =
        { name: 'plastic', confidence: prediction.plastic },
        { name: 'paper', confidence: prediction.paper },
        { name: 'organic', confidence: prediction.organic }
    ];
    
    const highestCategory = categories.reduce((prev, current) => 
        (prev.confidence > current.confidence) ? prev : current
    );
    
    if (highestCategory.confidence > 30 { // Only show if confidence is reasonable
        loadRecyclingInfo(highestCategory.name);
    }
}

function handleFeedback(isCorrect) [object Object]  if (!currentPrediction) return;

    const points = isCorrect ?10: 5; // Points for correct/wrong feedback
    userScore += points;
    
    // Update level based on score
    userLevel = Math.floor(userScore /50) + 1;
    
    // Update display
    updateScoreDisplay();
    saveUserData();
    
    // Save score to server
    saveScoreToServer(isCorrect);
    
    // Show feedback message
    const resultMessage = document.getElementById(resultMessage');
    if (isCorrect) {
        resultMessage.textContent = `Great job! You earned ${points} points for providing feedback!`;
        resultMessage.className = 'result-message correct';
    } else {
        resultMessage.textContent = `Thanks for the feedback! You earned ${points} points for helping improve the AI!`;
        resultMessage.className = 'result-message correct';
    }
    
    // Reset for next round
    setTimeout(() => [object Object]      resetForNextRound();
    }, 2000);
}

async function saveScoreToServer(feedback) {
    try {
        await fetch(/save-score/', {
            method: 'POST',
            headers:[object Object]
               Content-Type':application/json,
                X-CSRFToken': getCSRFToken(),
            },
            body: JSON.stringify({
                score: userScore,
                level: userLevel,
                feedback: feedback
            })
        });
    } catch (error)[object Object]     console.error('Error saving score to server:', error);
    }
}

function updateScoreDisplay() {
    userScoreElement.textContent = userScore;
    userLevelElement.textContent = `Level ${userLevel}`;
}

function resetForNextRound() {
    // Clear current image and results
    previewContainer.style.display = none
    resultSection.style.display = 'none';
    previewImage.src =   fileInput.value = '; currentPrediction = null;
    
    // Reset confidence bars
    document.getElementById(plasticConfidence).style.width = 0%ent.getElementById('paperConfidence).style.width = 0%ent.getElementById(organicConfidence).style.width = 0%ent.getElementById('plasticText).textContent = 0%ent.getElementById('paperText).textContent = 0%ent.getElementById('organicText).textContent =0%
    
    // Clear result message
    document.getElementById('resultMessage').textContent = '';
    document.getElementById('resultMessage').className = result-message';
    
    // Hide recycling section
    document.getElementById('recyclingInfoSection).style.display = 'none';
}

function showLoading(show)[object Object]    loadingOverlay.style.display = show ?flex' : 'none';
}

// Local storage functions
function saveUserData() {
    const userData = {
        score: userScore,
        level: userLevel,
        timestamp: Date.now()
    };
    localStorage.setItem(ecosort_user_data', JSON.stringify(userData));
}

function loadUserData()[object Object]   const savedData = localStorage.getItem(ecosort_user_data');
    if (savedData) {
        try {
            const userData = JSON.parse(savedData);
            userScore = userData.score || 0;
            userLevel = userData.level || 1;
            updateScoreDisplay();
        } catch (error) {
            console.error('Error loading user data:,error);
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
    } catch (error)[object Object]     console.error('Error fetching recycling info:', error);
    }
}

function displayRecyclingInfo(recyclingData) {
    const recyclingSection = document.getElementById('recyclingInfoSection');
    const recyclingContent = document.getElementById('recyclingContent');
    
    // Create the HTML content
    const html = `
        <div class="recycling-guide>
            <h4>${recyclingData.title}</h4>
            <p class="recycling-description">${recyclingData.description}</p>
            
            <div class="recycling-sections>
                <div class=recycling-section">
                    <h5>📋 Steps to Recycle:</h5>
                    <ol class="steps-list">
                        ${recyclingData.steps.map(step => `<li>${step}</li>`).join('')}
                    </ol>
                </div>
                
                <div class=recycling-section">
                    <h5🔄 Examples:</h5>
                    <ul class="examples-list">
                        ${recyclingData.examples.map(example => `<li>${example}</li>`).join('')}
                    </ul>
                </div>
                
                <div class=recycling-section">
                    <h5>💡 Tips:</h5>
                    <ul class="tips-list">
                        ${recyclingData.tips.map(tip => `<li>${tip}</li>`).join('')}
                    </ul>
                </div>
                
                <div class=recycling-section">
                    <h5>🖼️ Recycling Examples:</h5>
                    <div class="recycling-images">
                        ${recyclingData.images.map(img => `
                            <div class="recycling-image">
                                <img src="${img}" alt=Recycling example loading=                   </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        </div>
    `;
    
    recyclingContent.innerHTML = html;
    recyclingSection.style.display = 'block';
    recyclingSection.scrollIntoView({ behavior: smooth' });
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
    }, 300
}

// Add CSS for bonus notification
const style = document.createElement('style');
style.textContent = `
    .bonus-notification [object Object]
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #FFD700, #FFA500      color: white;
        padding: 15px;
        border-radius: 25       font-weight: bold;
        animation: slideIn 0.5s ease-out;
        z-index:1001        box-shadow: 0 5px 15px rgba(25521503;
    }
    
    @keyframes slideIn[object Object]from {
            transform: translateX(100           opacity: 0;
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
  💡 Tip: Plastic bottles should be rinsed before recycling",
💡 Tip: Paper with food stains goes in organic waste",
💡Tip: Small plastic pieces can be recycled together",
    💡 Tip: Cardboard boxes should be flattened for recycling",
  💡Tip: Organic waste can be composted at home"
];

function showRandomTip()[object Object]  const tip = tips[Math.floor(Math.random() * tips.length)];
    const tipElement = document.createElement('div);  tipElement.className =tip-notification';
    tipElement.textContent = tip;
    document.body.appendChild(tipElement);
    
    setTimeout(() => {
        tipElement.remove();
    },5000
// Show tip every 5lassifications
let classificationCount =0nst originalHandleFeedback = handleFeedback;
handleFeedback = function(isCorrect) {
    originalHandleFeedback.call(this, isCorrect);
    classificationCount++;
    if (classificationCount % 5        setTimeout(showRandomTip,10;
    }
};

// Add CSS for tip notification
const tipStyle = document.createElement(style');
tipStyle.textContent = `
    .tip-notification [object Object]
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: linear-gradient(135deg, #4 #45a049      color: white;
        padding: 15px;
        border-radius: 25       font-weight: bold;
        animation: slideUp 0.5s ease-out;
        z-index:1001        box-shadow: 0 5 15x rgba(76800.3
        max-width: 40        text-align: center;
    }
    
    @keyframes slideUp[object Object]from {
            transform: translateX(-50%) translateY(100           opacity: 0;
        }
        to {
            transform: translateX(-50%) translateY(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(tipStyle); 