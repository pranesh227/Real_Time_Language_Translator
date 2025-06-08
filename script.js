// Language Data - Added more comprehensive Tamil support
const languages = {
    "auto": "Detect Language",
    "am-ET": "Amharic",
    "ar-SA": "Arabic",
    "be-BY": "Bielarus",
    "bem-ZM": "Bemba",
    "bi-VU": "Bislama",
    "bjs-BB": "Bajan",
    "bn-IN": "Bengali",
    "bo-CN": "Tibetan",
    "br-FR": "Breton",
    "bs-BA": "Bosnian",
    "ca-ES": "Catalan",
    "cop-EG": "Coptic",
    "cs-CZ": "Czech",
    "cy-GB": "Welsh",
    "da-DK": "Danish",
    "dz-BT": "Dzongkha",
    "de-DE": "German",
    "dv-MV": "Maldivian",
    "el-GR": "Greek",
    "en-GB": "English",
    "es-ES": "Spanish",
    "et-EE": "Estonian",
    "eu-ES": "Basque",
    "fa-IR": "Persian",
    "fi-FI": "Finnish",
    "fn-FNG": "Fanagalo",
    "fo-FO": "Faroese",
    "fr-FR": "French",
    "gl-ES": "Galician",
    "gu-IN": "Gujarati",
    "ha-NE": "Hausa",
    "he-IL": "Hebrew",
    "hi-IN": "Hindi",
    "hr-HR": "Croatian",
    "hu-HU": "Hungarian",
    "id-ID": "Indonesian",
    "is-IS": "Icelandic",
    "it-IT": "Italian",
    "ja-JP": "Japanese",
    "kk-KZ": "Kazakh",
    "km-KM": "Khmer",
    "kn-IN": "Kannada",
    "ko-KR": "Korean",
    "ku-TR": "Kurdish",
    "ky-KG": "Kyrgyz",
    "la-VA": "Latin",
    "lo-LA": "Lao",
    "lv-LV": "Latvian",
    "men-SL": "Mende",
    "mg-MG": "Malagasy",
    "mi-NZ": "Maori",
    "ms-MY": "Malay",
    "mt-MT": "Maltese",
    "my-MM": "Burmese",
    "ne-NP": "Nepali",
    "niu-NU": "Niuean",
    "nl-NL": "Dutch",
    "no-NO": "Norwegian",
    "ny-MW": "Nyanja",
    "ur-PK": "Pakistani",
    "pau-PW": "Palauan",
    "pa-IN": "Panjabi",
    "ps-PK": "Pashto",
    "pis-SB": "Pijin",
    "pl-PL": "Polish",
    "pt-PT": "Portuguese",
    "rn-BI": "Kirundi",
    "ro-RO": "Romanian",
    "ru-RU": "Russian",
    "sg-CF": "Sango",
    "si-LK": "Sinhala",
    "sk-SK": "Slovak",
    "sm-WS": "Samoan",
    "sn-ZW": "Shona",
    "so-SO": "Somali",
    "sq-AL": "Albanian",
    "sr-RS": "Serbian",
    "sv-SE": "Swedish",
    "sw-SZ": "Swahili",
    "ta-IN": "Tamil",  // Changed from ta-LK to ta-IN for better support
    "te-IN": "Telugu",
    "tet-TL": "Tetum",
    "tg-TJ": "Tajik",
    "th-TH": "Thai",
    "ti-TI": "Tigrinya",
    "tk-TM": "Turkmen",
    "tl-PH": "Tagalog",
    "tn-BW": "Tswana",
    "to-TO": "Tongan",
    "tr-TR": "Turkish",
    "uk-UA": "Ukrainian",
    "uz-UZ": "Uzbek",
    "vi-VN": "Vietnamese",
    "wo-SN": "Wolof",
    "xh-ZA": "Xhosa",
    "yi-YD": "Yiddish",
    "zu-ZA": "Zulu"
};

// DOM Elements
const fromText = document.querySelector('.from-text');
const toText = document.querySelector('.to-text');
const fromLangSelect = document.querySelector('.from-lang');
const toLangSelect = document.querySelector('.to-lang');
const btnSwap = document.querySelector('.btn-swap');
const btnTranslate = document.querySelector('.btn-translate');
const btnVoice = document.querySelector('.btn-voice');
const voiceIndicator = document.querySelector('.voice-indicator');
const btnCancelVoice = document.querySelector('.btn-cancel-voice');
const charCount = document.querySelector('.character-count');
const translationTime = document.querySelector('.translation-time');
const inputActions = document.querySelectorAll('.input-actions .btn-action');
const outputActions = document.querySelectorAll('.output-actions .btn-action');
const navBtns = document.querySelectorAll('.nav-btn');
const contentSections = document.querySelectorAll('.content-section');
const historyList = document.querySelector('.history-list');
const savedList = document.querySelector('.saved-list');
const btnClearHistory = document.querySelector('.btn-clear-history');
const searchBox = document.querySelector('.search-box input');
const themeOptions = document.querySelectorAll('.theme-option');
const autoTranslateCheckbox = document.getElementById('auto-translate');
const detectLanguageCheckbox = document.getElementById('detect-language');
const voiceInputCheckbox = document.getElementById('voice-input');
const voiceOutputCheckbox = document.getElementById('voice-output');

// Speech Recognition Setup
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition;
if (SpeechRecognition) {
    recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-GB';

    recognition.onstart = () => {
        voiceIndicator.classList.add('show');
    };

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        fromText.value = transcript;
        updateCharCount();
        if (autoTranslateCheckbox.checked) {
            translateText();
        }
    };

    recognition.onerror = (event) => {
        showToast('Voice input error: ' + event.error, 'error');
    };

    recognition.onend = () => {
        voiceIndicator.classList.remove('show');
    };
} else {
    btnVoice.style.display = 'none';
    voiceInputCheckbox.disabled = true;
    showToast('Voice input not supported in your browser', 'warning');
}

// Initialize Language Dropdowns
function initLanguageDropdowns() {
    // Clear existing options
    fromLangSelect.innerHTML = '';
    toLangSelect.innerHTML = '';
    
    for (let langCode in languages) {
        let fromOption = document.createElement('option');
        fromOption.value = langCode;
        fromOption.textContent = languages[langCode];
        if (langCode === 'auto') fromOption.selected = true;
        fromLangSelect.appendChild(fromOption);

        // Don't add 'auto' to target languages
        if (langCode !== 'auto') {
            let toOption = document.createElement('option');
            toOption.value = langCode;
            toOption.textContent = languages[langCode];
            if (langCode === 'ta-IN') toOption.selected = true; // Default to Tamil as target
            toLangSelect.appendChild(toOption);
        }
    }
}

// Update Character Count
function updateCharCount() {
    const count = fromText.value.length;
    charCount.textContent = `${count}/5000`;
    if (count > 5000) {
        charCount.style.color = 'var(--error-color)';
    } else {
        charCount.style.color = 'var(--text-secondary)';
    }
}

// Enhanced Translate Text function with better error handling
function translateText() {
    const text = fromText.value.trim();
    let fromLang = fromLangSelect.value;
    const toLang = toLangSelect.value;

    if (!text) {
        showToast('Please enter text to translate', 'warning');
        return;
    }

    // If auto-detect is on, try to detect language
    if (fromLang === 'auto' && detectLanguageCheckbox.checked) {
        fromLang = detectLanguage(text);
        fromLangSelect.value = fromLang;
    }

    toText.placeholder = 'Translating...';
    const startTime = performance.now();

    // Use MyMemory API for translation
    const apiUrl = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${fromLang}|${toLang}`;

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (data.responseData) {
                let translatedText = data.responseData.translatedText;
                
                // Clean up the translation (MyMemory sometimes adds extra text)
                translatedText = cleanTranslation(translatedText, toLang);
                
                toText.value = translatedText;

                // Find the best match
                if (data.matches && data.matches.length) {
                    const exactMatch = data.matches.find(match => match.match && match.match === 1);
                    if (exactMatch) {
                        toText.value = cleanTranslation(exactMatch.translation, toLang);
                    }
                }

                const endTime = performance.now();
                const timeTaken = ((endTime - startTime) / 1000).toFixed(2);
                translationTime.textContent = `Translation time: ${timeTaken}s`;

                addToHistory(text, toText.value, fromLang, toLang);
                showToast('Translation complete', 'success');
            } else {
                throw new Error('No translation found');
            }
        })
        .catch(error => {
            console.error('Translation error:', error);
            toText.value = 'Error occurred while translating';
            showToast('Translation failed. Please try again.', 'error');
            
            // Fallback to mock translation for demo purposes
            if (toLang === 'ta-IN') {
                toText.value = mockTamilTranslation(text);
            }
        })
        .finally(() => {
            toText.placeholder = 'Translation';
        });
}

// Clean translation text from API artifacts
function cleanTranslation(text, langCode) {
    if (!text) return '';
    
    // Remove HTML tags if present
    text = text.replace(/<\/?[^>]+(>|$)/g, "");
    
    // Language-specific cleaning
    if (langCode === 'ta-IN') {
        // Remove unwanted prefixes that might appear in Tamil translations
        text = text.replace(/^\(Translated\)\s*/, '');
        text = text.replace(/^\(Translated from .*?\)\s*/, '');
    }
    
    return text.trim();
}

// Simple mock Tamil translation for demo purposes
function mockTamilTranslation(text) {
    const mockTranslations = {
        "hello": "வணக்கம்",
        "thank you": "நன்றி",
        "how are you": "நீங்கள் எப்படி இருக்கிறீர்கள்",
        "good morning": "காலை வணக்கம்",
        "good night": "இரவு வணக்கம்",
        "what is your name": "உங்கள் பெயர் என்ன",
        "my name is": "என் பெயர்",
        "i love you": "நான் உன்னை காதலிக்கிறேன்",
        "welcome": "வரவேற்கிறோம்",
        "please": "தயவு செய்து",
        "sorry": "மன்னிக்கவும்"
    };
    
    const lowerText = text.toLowerCase();
    return mockTranslations[lowerText] || `[Tamil translation of: ${text}]`;
}

// Simple language detection
function detectLanguage(text) {
    // Check for Tamil characters
    if (/[\u0B80-\u0BFF]/.test(text)) {
        return 'ta-IN';
    }
    
    // Check for common English words
    if (/\b(the|and|you|that|have)\b/i.test(text)) {
        return 'en-GB';
    }
    
    // Default to English if we can't detect
    return 'en-GB';
}

// Add to History
function addToHistory(originalText, translatedText, fromLang, toLang) {
    if (!originalText || !translatedText) return;

    const historyItem = document.createElement('div');
    historyItem.className = 'history-item';
    
    const fromLangName = languages[fromLang] || fromLang;
    const toLangName = languages[toLang] || toLang;
    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const dateString = now.toLocaleDateString();

    historyItem.innerHTML = `
        <div class="history-item-header">
            <span class="history-item-lang">${fromLangName} → ${toLangName}</span>
            <div class="history-item-actions">
                <button class="btn-action" title="Use this translation">
                    <ion-icon name="arrow-redo-outline"></ion-icon>
                </button>
                <button class="btn-action" title="Save this translation">
                    <ion-icon name="bookmark-outline"></ion-icon>
                </button>
            </div>
        </div>
        <div class="history-item-text">${originalText}</div>
        <div class="history-item-translation">${translatedText}</div>
        <div class="history-item-date">${timeString} · ${dateString}</div>
    `;

    // Add event listeners to action buttons
    const useBtn = historyItem.querySelector('.history-item-actions button:first-child');
    const saveBtn = historyItem.querySelector('.history-item-actions button:last-child');

    useBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        fromText.value = originalText;
        fromLangSelect.value = fromLang;
        toLangSelect.value = toLang;
        if (autoTranslateCheckbox.checked) {
            translateText();
        }
    });

    saveBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        saveTranslation(originalText, translatedText, fromLang, toLang);
    });

    historyItem.addEventListener('click', () => {
        fromText.value = originalText;
        fromLangSelect.value = fromLang;
        toLangSelect.value = toLang;
        toText.value = translatedText;
        document.querySelector('#translator').click();
    });

    historyList.insertBefore(historyItem, historyList.firstChild);

    // Limit history to 50 items
    if (historyList.children.length > 50) {
        historyList.removeChild(historyList.lastChild);
    }
}

// Save Translation
function saveTranslation(originalText, translatedText, fromLang, toLang) {
    const savedItem = document.createElement('div');
    savedItem.className = 'saved-item';
    
    const fromLangName = languages[fromLang] || fromLang;
    const toLangName = languages[toLang] || toLang;
    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const dateString = now.toLocaleDateString();

    savedItem.innerHTML = `
        <div class="saved-item-header">
            <span class="saved-item-lang">${fromLangName} → ${toLangName}</span>
            <div class="saved-item-actions">
                <button class="btn-action" title="Use this translation">
                    <ion-icon name="arrow-redo-outline"></ion-icon>
                </button>
                <button class="btn-action" title="Delete this translation">
                    <ion-icon name="trash-outline"></ion-icon>
                </button>
            </div>
        </div>
        <div class="saved-item-text">${originalText}</div>
        <div class="saved-item-translation">${translatedText}</div>
        <div class="saved-item-date">${timeString} · ${dateString}</div>
    `;

    // Add event listeners to action buttons
    const useBtn = savedItem.querySelector('.saved-item-actions button:first-child');
    const deleteBtn = savedItem.querySelector('.saved-item-actions button:last-child');

    useBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        fromText.value = originalText;
        fromLangSelect.value = fromLang;
        toLangSelect.value = toLang;
        if (autoTranslateCheckbox.checked) {
            translateText();
        }
    });

    deleteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        savedItem.remove();
        showToast('Translation removed', 'success');
    });

    savedItem.addEventListener('click', () => {
        fromText.value = originalText;
        fromLangSelect.value = fromLang;
        toLangSelect.value = toLang;
        toText.value = translatedText;
        document.querySelector('#translator').click();
    });

    savedList.insertBefore(savedItem, savedList.firstChild);
    showToast('Translation saved', 'success');
}

// Show Toast Notification
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    let icon;
    switch (type) {
        case 'success':
            icon = 'checkmark-circle-outline';
            break;
        case 'error':
            icon = 'close-circle-outline';
            break;
        case 'warning':
            icon = 'warning-outline';
            break;
        default:
            icon = 'information-circle-outline';
    }
    
    toast.innerHTML = `
        <ion-icon name="${icon}"></ion-icon>
        <span>${message}</span>
    `;
    
    document.querySelector('.toast-container').appendChild(toast);
    
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3000);
}

// Initialize App
function initApp() {
    initLanguageDropdowns();
    
    // Load theme preference
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    // Set active theme option
    document.querySelector(`.theme-option[data-theme="${savedTheme}"]`).classList.add('active');
    
    // Add some demo history and saved items
    addToHistory('Hello', 'வணக்கம்', 'en-GB', 'ta-IN');
    addToHistory('Thank you', 'நன்றி', 'en-GB', 'ta-IN');
    addToHistory('How are you?', 'நீங்கள் எப்படி இருக்கிறீர்கள்?', 'en-GB', 'ta-IN');
    
    saveTranslation('Welcome', 'வரவேற்கிறோம்', 'en-GB', 'ta-IN');
    saveTranslation('Good morning', 'காலை வணக்கம்', 'en-GB', 'ta-IN');
    saveTranslation('My name is', 'என் பெயர்', 'en-GB', 'ta-IN');
}

// Event Listeners
fromText.addEventListener('input', updateCharCount);

fromText.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
        translateText();
    }
});

btnTranslate.addEventListener('click', translateText);

btnSwap.addEventListener('click', () => {
    const tempText = fromText.value;
    const tempLang = fromLangSelect.value;
    
    fromText.value = toText.value;
    toText.value = tempText;
    
    fromLangSelect.value = toLangSelect.value;
    toLangSelect.value = tempLang;
    
    if (fromText.value && autoTranslateCheckbox.checked) {
        translateText();
    }
});

btnVoice.addEventListener('click', startVoiceInput);

btnCancelVoice.addEventListener('click', () => {
    if (recognition) {
        recognition.stop();
    }
    voiceIndicator.classList.remove('show');
});

inputActions.forEach(btn => {
    btn.addEventListener('click', (e) => {
        const icon = btn.querySelector('ion-icon');
        
        if (icon.getAttribute('name') === 'trash-outline') {
            fromText.value = '';
            updateCharCount();
            showToast('Input cleared', 'success');
        } else if (icon.getAttribute('name') === 'copy-outline') {
            if (!fromText.value) {
                showToast('No text to copy', 'warning');
                return;
            }
            navigator.clipboard.writeText(fromText.value);
            showToast('Copied to clipboard', 'success');
        } else if (icon.getAttribute('name') === 'volume-high-outline') {
            if (!fromText.value) {
                showToast('No text to speak', 'warning');
                return;
            }
            speakText(fromText.value, fromLangSelect.value);
        }
    });
});

outputActions.forEach(btn => {
    btn.addEventListener('click', (e) => {
        const icon = btn.querySelector('ion-icon');
        
        if (icon.getAttribute('name') === 'copy-outline') {
            if (!toText.value) {
                showToast('No translation to copy', 'warning');
                return;
            }
            navigator.clipboard.writeText(toText.value);
            showToast('Copied to clipboard', 'success');
        } else if (icon.getAttribute('name') === 'volume-high-outline') {
            if (!toText.value) {
                showToast('No translation to speak', 'warning');
                return;
            }
            speakText(toText.value, toLangSelect.value);
        } else if (icon.getAttribute('name') === 'bookmark-outline') {
            if (!fromText.value || !toText.value) {
                showToast('No translation to save', 'warning');
                return;
            }
            saveTranslation(fromText.value, toText.value, fromLangSelect.value, toLangSelect.value);
        }
    });
});

navBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Update active nav button
        navBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        // Show corresponding section
        const sectionId = btn.getAttribute('data-section');
        contentSections.forEach(section => {
            section.classList.remove('active');
            if (section.id === sectionId) {
                section.classList.add('active');
            }
        });
    });
});

btnClearHistory.addEventListener('click', () => {
    historyList.innerHTML = '';
    showToast('History cleared', 'success');
});

searchBox.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const items = savedList.querySelectorAll('.saved-item');
    
    items.forEach(item => {
        const text = item.querySelector('.saved-item-text').textContent.toLowerCase();
        const translation = item.querySelector('.saved-item-translation').textContent.toLowerCase();
        
        if (text.includes(searchTerm) || translation.includes(searchTerm)) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
});

themeOptions.forEach(option => {
    option.addEventListener('click', () => {
        themeOptions.forEach(opt => opt.classList.remove('active'));
        option.classList.add('active');
        
        const theme = option.getAttribute('data-theme');
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    });
});

autoTranslateCheckbox.addEventListener('change', () => {
    localStorage.setItem('autoTranslate', autoTranslateCheckbox.checked);
});

detectLanguageCheckbox.addEventListener('change', () => {
    localStorage.setItem('detectLanguage', detectLanguageCheckbox.checked);
});

voiceInputCheckbox.addEventListener('change', () => {
    localStorage.setItem('voiceInput', voiceInputCheckbox.checked);
    btnVoice.style.display = voiceInputCheckbox.checked ? 'flex' : 'none';
});

voiceOutputCheckbox.addEventListener('change', () => {
    localStorage.setItem('voiceOutput', voiceOutputCheckbox.checked);
});

// Start Voice Input
function startVoiceInput() {
    if (!recognition) {
        showToast('Voice input not supported in your browser', 'warning');
        return;
    }
    
    if (!voiceInputCheckbox.checked) {
        showToast('Voice input is disabled in settings', 'warning');
        return;
    }
    
    try {
        recognition.lang = fromLangSelect.value;
        recognition.start();
    } catch (e) {
        showToast('Error starting voice input: ' + e.message, 'error');
    }
}

// Speak Text with better language support
function speakText(text, langCode) {
    if (!text) return;
    
    if (!voiceOutputCheckbox.checked) {
        showToast('Voice output is disabled in settings', 'warning');
        return;
    }
    
    if (!window.speechSynthesis) {
        showToast('Text-to-speech not supported in your browser', 'warning');
        return;
    }
    
    try {
        const utterance = new SpeechSynthesisUtterance(text);
        
        // Set language based on target
        utterance.lang = langCode;
        
        // For Tamil, we need to ensure the voice is available
        if (langCode === 'ta-IN') {
            const tamilVoices = window.speechSynthesis.getVoices().filter(v => v.lang === 'ta-IN');
            if (tamilVoices.length > 0) {
                utterance.voice = tamilVoices[0];
            } else {
                // Fallback to English voice if Tamil not available
                utterance.lang = 'en-GB';
                showToast('Tamil voice not available, using English', 'warning');
            }
        }
        
        speechSynthesis.speak(utterance);
    } catch (e) {
        console.error('Speech synthesis error:', e);
        showToast('Error speaking text', 'error');
    }
}

// Load saved settings
function loadSettings() {
    if (localStorage.getItem('autoTranslate') !== null) {
        autoTranslateCheckbox.checked = localStorage.getItem('autoTranslate') === 'true';
    }
    
    if (localStorage.getItem('detectLanguage') !== null) {
        detectLanguageCheckbox.checked = localStorage.getItem('detectLanguage') === 'true';
    }
    
    if (localStorage.getItem('voiceInput') !== null) {
        voiceInputCheckbox.checked = localStorage.getItem('voiceInput') === 'true';
        btnVoice.style.display = voiceInputCheckbox.checked ? 'flex' : 'none';
    }
    
    if (localStorage.getItem('voiceOutput') !== null) {
        voiceOutputCheckbox.checked = localStorage.getItem('voiceOutput') === 'true';
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initApp();
    loadSettings();
    
    // Load voices when they become available
    speechSynthesis.onvoiceschanged = function() {
        console.log('Voices loaded:', speechSynthesis.getVoices());
    };
    
    // For Chrome which doesn't always fire the voiceschanged event
    setTimeout(() => {
        if (speechSynthesis.getVoices().length === 0) {
            speechSynthesis.getVoices();
        }
    }, 1000);
});