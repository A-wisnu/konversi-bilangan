document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded and parsed');
    
    // Debug elemen yang mungkin null
    console.log('Memeriksa elemen DOM:');
    console.log('inputNumber:', document.getElementById('inputNumber'));
    console.log('convertBtn:', document.getElementById('convertBtn'));
    console.log('resetBtn:', document.getElementById('resetBtn'));
    console.log('baseInputs:', document.querySelectorAll('input[name="base"]').length);
    console.log('tutorialModal:', document.getElementById('tutorialModal'));
    console.log('helpBtn:', document.getElementById('helpBtn'));
    console.log('settingsBtn:', document.getElementById('settingsBtn'));
    console.log('settingsPanel:', document.getElementById('settingsPanel'));
    
    // Cache elemen DOM untuk performa yang lebih baik
    const inputNumber = document.getElementById('inputNumber');
    const convertBtn = document.getElementById('convertBtn');
    const resetBtn = document.getElementById('resetBtn');
    const baseInputs = document.querySelectorAll('input[name="base"]');
    const resultElements = {
        biner: document.getElementById('binerResult'),
        desimal: document.getElementById('desimalResult'),
        oktal: document.getElementById('oktalResult'),
        heksa: document.getElementById('heksaResult')
    };

    // Tutorial Modal Elements
    const tutorialModal = document.getElementById('tutorialModal');
    const helpBtn = document.getElementById('helpBtn');
    const closeModal = document.getElementById('closeModal');
    const closeTutorial = document.getElementById('closeTutorial');

    // Alert Elements
    const customAlert = document.getElementById('customAlert');
    const alertMessage = document.getElementById('alertMessage');
    const closeAlert = document.getElementById('closeAlert');

    // Efek Air Elements
    const rainContainer = document.getElementById('rainContainer');
    const bubbleContainer = document.getElementById('bubbleContainer');
    const waterLevel = document.getElementById('waterLevel');

    // Deklarasikan elemen-elemen pengaturan
    const settingsBtn = document.getElementById('settingsBtn');
    const settingsPanel = document.getElementById('settingsPanel');
    const closeSettings = document.getElementById('closeSettings');
    const toggleRain = document.getElementById('toggleRain');
    const toggleBubbles = document.getElementById('toggleBubbles');
    const toggleHover = document.getElementById('toggleHover');
    const toggleWater = document.getElementById('toggleWater');

    // Loading indicator
    const loadingIndicator = document.getElementById('loadingIndicator');

    // Konfigurasi aplikasi
    const config = {
        raindrops: {
            count: 150,         // Jumlah tetesan hujan
            heightMin: 15,      // Tinggi minimum (px)
            heightMax: 30,      // Tinggi maksimum (px)
            durationMin: 0.5,   // Durasi minimum animasi jatuh (seconds)
            durationMax: 1.2,   // Durasi maksimum animasi jatuh (seconds)
            delayMax: 5         // Delay maksimum sebelum mulai animasi (seconds)
        },
        bubbles: {
            count: 25,          // Jumlah maksimum gelembung
            sizeMin: 10,        // Ukuran minimum (px)
            sizeMax: 50,        // Ukuran maksimum (px)
            durationMin: 6,     // Durasi minimum animasi naik (seconds)
            durationMax: 15,    // Durasi maksimum animasi naik (seconds)
            interval: 1000,     // Interval pembuatan gelembung (ms)
            enabled: true       // Apakah gelembung diaktifkan
        },
        alerts: {
            duration: 4000,     // Durasi tampil alert (ms)
            types: {
                success: '#2ecc71',
                warning: '#f39c12',
                error: '#e74c3c',
                info: '#3498db'
            }
        },
        animations: {
            stepDelay: 100,     // Delay antara langkah tutorial (ms)
            fadeInTime: 300     // Durasi animasi fade (ms)
        },
        conversionHistory: [],  // Riwayat konversi
        historyMaxSize: 10,     // Jumlah maksimum riwayat disimpan
        isDarkMode: false       // Mode gelap
    };

    // Simpan basis saat ini
    let currentBase = 'biner';
    let bubbleInterval;
    
    // Variabel untuk menyimpan preferensi visual
    let visualConfig = {
        rainEnabled: true,
        bubblesEnabled: true,
        hoverEnabled: true,
        waterEnabled: true
    };

    // Memuat preferensi visual dari localStorage
    function loadVisualPreferences() {
        try {
            const savedPrefs = localStorage.getItem('visualPreferences');
            if (savedPrefs) {
                visualConfig = JSON.parse(savedPrefs);
                
                // Update checkbox values
                if (toggleRain) toggleRain.checked = visualConfig.rainEnabled;
                if (toggleBubbles) toggleBubbles.checked = visualConfig.bubblesEnabled;
                if (toggleHover) toggleHover.checked = visualConfig.hoverEnabled;
                if (toggleWater) toggleWater.checked = visualConfig.waterEnabled;
                
                // Terapkan preferensi visual
                if (!visualConfig.waterEnabled && waterLevel) {
                    waterLevel.style.display = 'none';
                }
                
                if (!visualConfig.rainEnabled && rainContainer) {
                    rainContainer.innerHTML = '';
                }
            }
        } catch (e) {
            console.error('Gagal memuat preferensi visual:', e);
        }
    }
    
    // Simpan preferensi visual ke localStorage
    function saveVisualPreferences() {
        try {
            localStorage.setItem('visualPreferences', JSON.stringify(visualConfig));
        } catch (e) {
            console.error('Gagal menyimpan preferensi visual:', e);
        }
    }
    
    // Siapkan efek hover pada elemen UI
    function setupHoverEffects() {
        const buttons = document.querySelectorAll('button:not(.modal-close):not(.alert-close)');
        buttons.forEach(button => {
            button.classList.add('hover-enabled');
        });
        
        const cards = document.querySelectorAll('.result-card');
        cards.forEach(card => {
            card.classList.add('hover-enabled');
        });
    }
    
    // Buat efek gelembung air
    function createBubble() {
        if (!config.bubbles.enabled) return;
        
        // Dapatkan lebar layar
        const screenWidth = window.innerWidth;
        
        // Tentukan ukuran dan posisi acak
        const size = Math.random() * (config.bubbles.sizeMax - config.bubbles.sizeMin) + config.bubbles.sizeMin;
        const posX = Math.random() * (screenWidth - size);
        
        // Hitung properti animasi
        const duration = Math.random() * (config.bubbles.durationMax - config.bubbles.durationMin) + config.bubbles.durationMin;
        const translateX = Math.random() * 100 - 50; // -50px ~ +50px
        
        // Buat elemen gelembung
        const bubble = document.createElement('div');
        bubble.classList.add('bubble');
        
        // Set ukuran dan posisi
        bubble.style.width = `${size}px`;
        bubble.style.height = `${size}px`;
        bubble.style.left = `${posX}px`;
        bubble.style.setProperty('--tx', `${translateX}px`);
        
        // Set durasi animasi
        bubble.style.animationDuration = `${duration}s`;
        
        // Tambahkan ke kontainer
        bubbleContainer.appendChild(bubble);
        
        // Hapus gelembung setelah animasi selesai
        setTimeout(() => {
            if (bubble.parentElement === bubbleContainer) {
                bubbleContainer.removeChild(bubble);
            }
        }, duration * 1000);
        
        // Batasi jumlah gelembung
        if (bubbleContainer.childElementCount > config.bubbles.count) {
            bubbleContainer.removeChild(bubbleContainer.firstChild);
        }
    }

    // Buat efek hujan yang lebih optimal
    function createRaindrops() {
        const { count, heightMin, heightMax, durationMin, durationMax, delayMax } = config.raindrops;
        const screenWidth = window.innerWidth;
        
        // Gunakan fragment untuk performa yang lebih baik
        const fragment = document.createDocumentFragment();
        
        for(let i = 0; i < count; i++) {
            const raindrop = document.createElement('div');
            raindrop.classList.add('raindrop');
            
            // Posisi acak di layar
            const posX = Math.random() * screenWidth;
            const delay = Math.random() * delayMax;
            const duration = Math.random() * (durationMax - durationMin) + durationMin;
            const height = Math.random() * (heightMax - heightMin) + heightMin;
            
            // Set style langsung untuk mengurangi reflow
            raindrop.style.cssText = `
                left: ${posX}px;
                animation-delay: ${delay}s;
                animation-duration: ${duration}s;
                height: ${height}px;
                opacity: ${Math.random() * 0.4 + 0.6}; /* Transparansi acak */
            `;
            
            fragment.appendChild(raindrop);
        }
        
        // Append semua tetesan hujan sekaligus untuk mengurangi reflow
        rainContainer.appendChild(fragment);
    }

    // Tampilkan pesan alert kustom yang lebih informatif
    function showAlert(message, type = 'warning', duration = config.alerts.duration) {
        const alertColors = config.alerts.types;
        
        alertMessage.textContent = message;
        
        // Set judul berdasarkan tipe alert
        const titleMap = {
            'success': 'Sukses',
            'warning': 'Peringatan',
            'error': 'Kesalahan',
            'info': 'Informasi'
        };
        
        document.querySelector('.alert-title').textContent = titleMap[type] || 'Peringatan';
        
        // Set warna border berdasarkan tipe
        customAlert.style.borderLeftColor = alertColors[type] || alertColors.warning;
        
        // Tambahkan class untuk animasi masuk
        customAlert.classList.add('show');
        
        // Bersihkan timeout sebelumnya jika ada
        if (customAlert.timeoutId) {
            clearTimeout(customAlert.timeoutId);
        }
        
        // Otomatis hilangkan setelah waktu tertentu
        customAlert.timeoutId = setTimeout(() => {
            hideAlert();
        }, duration);
    }

    // Sembunyikan alert dengan animasi
    function hideAlert() {
        customAlert.classList.remove('show');
        
        if (customAlert.timeoutId) {
            clearTimeout(customAlert.timeoutId);
            customAlert.timeoutId = null;
        }
    }

    // Tampilkan modal tutorial dengan animasi yang lebih halus
    function showTutorial() {
        tutorialModal.classList.add('active');
        
        // Reset dan animasikan langkah-langkah
        const steps = document.querySelectorAll('.step');
        steps.forEach((step, index) => {
            step.style.opacity = '0';
            step.style.transform = 'translateX(-20px)';
            
            // Force reflow
            void step.offsetWidth;
            
            // Animasi dengan delay berurutan untuk efek cascade
            setTimeout(() => {
                step.style.animation = `fadeStep 0.5s ease forwards`;
            }, config.animations.stepDelay * index);
        });
    }

    // Sembunyikan modal tutorial
    function hideTutorial() {
        tutorialModal.classList.remove('active');
    }

    // Validasi input dengan feedback lebih detail
    function validateInput(number, base) {
        if (!number || number.trim() === '') {
            return { valid: false, message: 'Bilangan tidak boleh kosong!' };
        }
        
        const validators = {
            biner: /^[01]+$/,
            desimal: /^\d+$/,
            oktal: /^[0-7]+$/,
            heksa: /^[0-9A-Fa-f]+$/
        };
        
        const errorMessages = {
            biner: 'Bilangan biner hanya boleh berisi 0 dan 1',
            desimal: 'Bilangan desimal hanya boleh berisi angka 0-9',
            oktal: 'Bilangan oktal hanya boleh berisi angka 0-7',
            heksa: 'Bilangan heksadesimal hanya boleh berisi angka 0-9 dan huruf A-F'
        };
        
        const valid = validators[base].test(number);
        
        return {
            valid,
            message: valid ? '' : errorMessages[base]
        };
    }

    // Konversi bilangan ke desimal dengan validasi tambahan
    function toDecimal(number, base) {
        const bases = {
            biner: 2,
            oktal: 8,
            heksa: 16,
            desimal: 10
        };
        
        try {
            const result = parseInt(number, bases[base]);
            
            // Periksa apakah hasil valid
            if (isNaN(result) || !isFinite(result)) {
                throw new Error(`Bilangan ${number} tidak valid untuk basis ${base}`);
            }
            
            return result;
        } catch (error) {
            console.error(`Error converting ${number} from base ${base} to decimal:`, error);
            throw new Error(`Gagal mengkonversi dari basis ${base}`);
        }
    }

    // Konversi dari desimal ke basis lain dengan format
    function fromDecimal(decimal) {
        try {
            return {
                biner: decimal.toString(2),
                desimal: decimal.toString(10),
                oktal: decimal.toString(8),
                heksa: decimal.toString(16).toUpperCase()
            };
        } catch (error) {
            console.error('Error converting from decimal:', error);
            throw new Error('Gagal mengkonversi ke basis lain');
        }
    }

    // Format hasil untuk kemudahan pembacaan
    function formatResult(value, base) {
        // Untuk biner, tambahkan spasi setiap 4 digit
        if (base === 'biner' && value.length > 4) {
            return value.match(/.{1,4}/g).join(' ');
        }
        
        // Untuk heksadesimal, tambahkan spasi setiap 2 digit
        if (base === 'heksa' && value.length > 2) {
            return value.match(/.{1,2}/g).join(' ');
        }
        
        // Untuk oktal, tambahkan spasi setiap 3 digit
        if (base === 'oktal' && value.length > 3) {
            return value.match(/.{1,3}/g).join(' ');
        }
        
        // Untuk desimal, tambahkan pemisah ribuan
        if (base === 'desimal' && value.length > 3) {
            return value.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
        }
        
        return value;
    }

    // Tampilkan hasil konversi dengan animasi dan format
    function displayResults(results) {
        Object.keys(resultElements).forEach(base => {
            const formattedResult = formatResult(results[base], base);
            resultElements[base].textContent = formattedResult;
            
            // Tambahkan tooltip dengan nilai tanpa format
            resultElements[base].setAttribute('title', results[base]);
            
            // Tambahkan data attribute untuk keperluan copy
            resultElements[base].setAttribute('data-raw', results[base]);
        });
    }

    // Tambahkan animasi pada hasil
    function animateResults() {
        const resultCards = document.querySelectorAll('.result-card');
        
        resultCards.forEach((card, index) => {
            // Reset animasi
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.classList.remove('animated');
            
            // Force reflow
            void card.offsetWidth;
            
            // Animasi dengan delay berurutan
            setTimeout(() => {
                card.style.transition = 'all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
                
                // Tambahkan kelas untuk efek glow
                setTimeout(() => {
                    card.classList.add('animated');
                }, 500);
            }, 50 * index); // 50ms delay antar card
            
            // Tambahkan animasi gelembung
            setTimeout(() => {
                createBubble();
            }, 100 * index);
        });
    }

    // Simpan riwayat konversi
    function saveToHistory(input, base, results) {
        const historyItem = {
            input,
            base,
            results,
            timestamp: new Date().toISOString()
        };
        
        // Tambahkan ke awal array
        config.conversionHistory.unshift(historyItem);
        
        // Batasi ukuran riwayat
        if (config.conversionHistory.length > config.historyMaxSize) {
            config.conversionHistory.pop();
        }
        
        // Simpan ke localStorage
        try {
            localStorage.setItem('conversionHistory', JSON.stringify(config.conversionHistory));
        } catch (e) {
            console.error('Gagal menyimpan riwayat ke localStorage:', e);
        }
    }

    // Muat riwayat konversi dari localStorage
    function loadHistory() {
        try {
            const savedHistory = localStorage.getItem('conversionHistory');
            if (savedHistory) {
                config.conversionHistory = JSON.parse(savedHistory);
            }
        } catch (e) {
            console.error('Gagal memuat riwayat dari localStorage:', e);
        }
    }

    // Fungsi untuk menampilkan/menyembunyikan loading indicator
    function toggleLoading(show) {
        if (show) {
            loadingIndicator.classList.add('active');
        } else {
            loadingIndicator.classList.remove('active');
        }
    }

    // Fungsi untuk melakukan konversi
    function performConversion() {
        const selectedBase = document.querySelector('input[name="base"]:checked').value;
        const number = inputNumber.value.trim();
        
        console.log('Selected Base:', selectedBase);
        console.log('Input Number:', number);
        
        // Validasi input
        const validation = validateInput(number, selectedBase);
        if (!validation.valid) {
            showAlert(validation.message, 'error');
            inputNumber.focus();
            inputNumber.classList.add('error');
            
            // Hapus highlight error setelah beberapa detik
            setTimeout(() => {
                inputNumber.classList.remove('error');
            }, 1500);
            
            return;
        }
        
        // Tampilkan loading indicator
        toggleLoading(true);
        
        // Simulasi proses yang memakan waktu dengan setTimeout
        setTimeout(() => {
            try {
                // Konversi ke desimal
                const decimal = toDecimal(number, selectedBase);
                console.log('Decimal Result:', decimal);
                
                // Konversi ke basis lain
                const results = fromDecimal(decimal);
                console.log('Conversion Results:', results);
                
                // Tampilkan hasil
                displayResults(results);
                animateResults();
                
                // Simpan ke riwayat
                saveToHistory(number, selectedBase, results);
                
                // Tampilkan pesan sukses
                showAlert('Konversi berhasil!', 'success');
                
                // Highlight input
                inputNumber.classList.add('success');
                setTimeout(() => {
                    inputNumber.classList.remove('success');
                }, 1500);
                
                // Buat beberapa gelembung untuk efek
                for (let i = 0; i < 5; i++) {
                    setTimeout(() => {
                        createBubble();
                    }, i * 200);
                }
                
            } catch (error) {
                console.error('Conversion Error:', error);
                showAlert(error.message || 'Terjadi kesalahan saat melakukan konversi!', 'error');
            } finally {
                // Sembunyikan loading indicator
                toggleLoading(false);
            }
        }, 800); // Simulasi delay 800ms untuk menampilkan loading indicator
    }

    // Reset aplikasi
    function resetApp() {
        inputNumber.value = '';
        
        Object.values(resultElements).forEach(element => {
            element.textContent = '-';
            element.removeAttribute('title');
            element.removeAttribute('data-raw');
        });
        
        const defaultBaseInput = document.getElementById('biner');
        if (defaultBaseInput) {
            defaultBaseInput.checked = true;
            currentBase = 'biner';
        }
        
        showAlert('Aplikasi telah direset', 'info');
        
        // Reset highlight pada input
        inputNumber.classList.remove('error', 'success');
        
        // Focus ke input
        inputNumber.focus();
        
        // Tambah efek gelembung saat reset
        for (let i = 0; i < 15; i++) {
            setTimeout(() => {
                createBubble();
            }, i * 100);
        }
        
        // Tambah efek rotasi pada ikon reset
        const resetIcon = resetBtn.querySelector('i');
        if (resetIcon) {
            resetIcon.classList.add('fa-spin');
            setTimeout(() => {
                resetIcon.classList.remove('fa-spin');
            }, 1000);
        }
        
        // Efek getaran pada kontainer konverter
        const converterContainer = document.querySelector('.converter-container');
        if (converterContainer) {
            converterContainer.classList.add('shake-effect');
            setTimeout(() => {
                converterContainer.classList.remove('shake-effect');
            }, 500);
        }
    }

    // Salin hasil ke clipboard
    function copyToClipboard(text, type) {
        navigator.clipboard.writeText(text)
            .then(() => {
                const formatNames = {
                    biner: 'Biner',
                    desimal: 'Desimal',
                    oktal: 'Oktal',
                    heksa: 'Heksadesimal'
                };
                
                const formatName = formatNames[type] || 'Hasil';
                
                showAlert(`${formatName} (${text}) telah disalin ke clipboard!`, 'success', 2000);
            })
            .catch(err => {
                console.error('Gagal menyalin:', err);
                showAlert('Gagal menyalin ke clipboard', 'error');
            });
    }

    // Start/stop efek gelembung
    function manageBubbles(enable) {
        config.bubbles.enabled = enable !== undefined ? enable : !config.bubbles.enabled;
        
        if (config.bubbles.enabled) {
            // Start interval untuk membuat gelembung
            if (!bubbleInterval) {
                bubbleInterval = setInterval(createBubble, config.bubbles.interval);
                
                // Buat beberapa gelembung di awal
                for (let i = 0; i < 5; i++) {
                    setTimeout(createBubble, i * 200);
                }
            }
        } else {
            // Bersihkan interval
            if (bubbleInterval) {
                clearInterval(bubbleInterval);
                bubbleInterval = null;
            }
            
            // Bersihkan gelembung yang ada
            bubbleContainer.innerHTML = '';
        }
    }

    // Tambahkan fungsi untuk memeriksa ukuran layar dan menyesuaikan tampilan
    function checkScreenSize() {
        const screenWidth = window.innerWidth;
        const converterContainer = document.querySelector('.converter-container');
        
        if (screenWidth <= 768) {
            // Untuk layar mobile, tambahkan kelas khusus
            document.body.classList.add('mobile-view');
            if (converterContainer) {
                converterContainer.classList.add('mobile-container');
            }
        } else {
            document.body.classList.remove('mobile-view');
            if (converterContainer) {
                converterContainer.classList.remove('mobile-container');
            }
        }
    }

    // Sesuaikan fungsi initializeApp untuk menambahkan fungsi baru
    function initializeApp() {
        console.log('Initializing application...');
        
        // Reset posisi panel pengaturan
        if (settingsPanel) {
            settingsPanel.style.opacity = '0';
            settingsPanel.style.visibility = 'hidden';
            settingsPanel.style.transform = 'translateY(20px) scale(0.95)';
            console.log('Panel pengaturan direset ke posisi tersembunyi');
        }
        
        // Load history
        try {
            loadHistory();
        } catch (e) {
            console.error('Error loading history:', e);
        }
        
        // Memuat preferensi visual
        try {
            loadVisualPreferences();
        } catch (e) {
            console.error('Error loading visual preferences:', e);
        }
        
        // Buat efek hujan jika diaktifkan
        if (visualConfig.rainEnabled && rainContainer) {
            try {
                createRaindrops();
            } catch (e) {
                console.error('Error creating raindrops:', e);
            }
        }
        
        // Start efek gelembung jika diaktifkan
        if (visualConfig.bubblesEnabled) {
            try {
                manageBubbles(true);
            } catch (e) {
                console.error('Error managing bubbles:', e);
            }
        }
        
        // Tampilkan tutorial saat pertama kali dibuka
        try {
            const hasSeenTutorial = localStorage.getItem('hasSeenTutorial');
            if (!hasSeenTutorial && tutorialModal) {
                setTimeout(() => {
                    showTutorial();
                    localStorage.setItem('hasSeenTutorial', 'true');
                }, 500);
            }
        } catch (e) {
            console.error('Error showing tutorial:', e);
        }
        
        // Set tema default dan perbarui informasi input
        try {
            const checkedBaseInput = document.querySelector('input[name="base"]:checked');
            if (checkedBaseInput) {
                currentBase = checkedBaseInput.value;
            } else {
                currentBase = 'biner';
            }
            
            // Perbarui informasi input sesuai basis default
            const baseInfoMap = {
                biner: 'Masukkan bilangan biner (hanya 0 dan 1)',
                desimal: 'Masukkan bilangan desimal (angka 0-9)',
                oktal: 'Masukkan bilangan oktal (angka 0-7)',
                heksa: 'Masukkan bilangan heksadesimal (0-9 dan A-F)'
            };
            
            const inputInfoText = document.getElementById('inputInfoText');
            if (inputInfoText) {
                inputInfoText.textContent = baseInfoMap[currentBase];
            }
        } catch (e) {
            console.error('Error setting default theme:', e);
        }
        
        // Setup efek hover jika diaktifkan
        if (visualConfig.hoverEnabled) {
            try {
                setupHoverEffects();
            } catch (e) {
                console.error('Error setting up hover effects:', e);
            }
        }
        
        // Cek ukuran layar untuk responsifitas
        try {
            checkScreenSize();
        } catch (e) {
            console.error('Error checking screen size:', e);
        }
        
        // Tambahkan kelas error dan success untuk input
        try {
            const style = document.createElement('style');
            style.textContent = `
                input.error {
                    border-color: ${config.alerts.types.error} !important;
                    box-shadow: 0 0 0 3px ${config.alerts.types.error}33 !important;
                    animation: shake 0.5s ease;
                }
                
                input.success {
                    border-color: ${config.alerts.types.success} !important;
                    box-shadow: 0 0 0 3px ${config.alerts.types.success}33 !important;
                }
                
                .mobile-view .input-info {
                    display: none !important;
                }
                
                .mobile-view .input-info i {
                    display: none !important;
                }

                .mobile-view .input-wrapper i {
                    display: none !important;
                }
                
                .mobile-container {
                    padding: 1.2rem !important;
                }
                
                .mobile-view .radio-group {
                    grid-template-columns: 1fr 1fr;
                }
                
                @media (max-width: 480px) {
                    .mobile-view .radio-group {
                        grid-template-columns: 1fr;
                    }
                }
                
                .shake-effect {
                    animation: shake 0.5s ease;
                }
                
                /* Animasi air tumpah */
                @keyframes waterSplash {
                    0% { transform: translateY(0) scale(1); opacity: 0.7; }
                    50% { transform: translateY(-20px) scale(1.2); opacity: 0.5; }
                    100% { transform: translateY(50px) scale(0.5); opacity: 0; }
                }
                
                .water-splash {
                    position: absolute;
                    background: radial-gradient(circle at 50% 50%, rgba(52, 152, 219, 0.8), rgba(52, 152, 219, 0));
                    border-radius: 50%;
                    pointer-events: none;
                    z-index: 5;
                    animation: waterSplash 1s ease-out forwards;
                }
            `;
            document.head.appendChild(style);
        } catch (e) {
            console.error('Error adding styles:', e);
        }
        
        // Tampilkan efek gelembung jika diaktifkan
        if (visualConfig.bubblesEnabled && typeof createBubble === 'function') {
            try {
                for (let i = 0; i < 10; i++) {
                    setTimeout(createBubble, i * 300);
                }
            } catch (e) {
                console.error('Error creating initial bubbles:', e);
            }
        }
        
        console.log('Application initialized successfully');
    }

    // Event listener untuk tombol konversi
    if (convertBtn) {
        convertBtn.addEventListener('click', performConversion);
    } else {
        console.error('Tombol konversi tidak ditemukan!');
    }
    
    // Event listener untuk tombol reset
    if (resetBtn) {
        resetBtn.addEventListener('click', resetApp);
    } else {
        console.error('Tombol reset tidak ditemukan!');
    }

    // Event listener untuk input number
    if (inputNumber) {
        inputNumber.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                performConversion();
            }
        });

        // Live validation saat input
        inputNumber.addEventListener('input', () => {
            const selectedBase = document.querySelector('input[name="base"]:checked')?.value || 'biner';
            const number = inputNumber.value.trim();
            
            if (number === '') {
                inputNumber.classList.remove('error');
                return;
            }
            
            const validation = validateInput(number, selectedBase);
            if (!validation.valid) {
                inputNumber.classList.add('error');
            } else {
                inputNumber.classList.remove('error');
            }
        });
    } else {
        console.error('Input number tidak ditemukan!');
    }

    // Event listener untuk perubahan basis dengan informasi yang lebih detail
    if (baseInputs && baseInputs.length > 0) {
        baseInputs.forEach(input => {
            input.addEventListener('change', () => {
                if (!inputNumber) return;
                
                inputNumber.value = '';
                Object.values(resultElements).forEach(element => {
                    if (element) {
                        element.textContent = '-';
                        element.removeAttribute('title');
                        element.removeAttribute('data-raw');
                    }
                });
                
                currentBase = input.value;
                
                // Perbarui teks info input sesuai basis yang dipilih
                const baseInfoMap = {
                    biner: 'Masukkan bilangan biner (hanya 0 dan 1)',
                    desimal: 'Masukkan bilangan desimal (angka 0-9)',
                    oktal: 'Masukkan bilangan oktal (angka 0-7)',
                    heksa: 'Masukkan bilangan heksadesimal (0-9 dan A-F)'
                };
                
                const inputInfoText = document.getElementById('inputInfoText');
                if (inputInfoText) {
                    inputInfoText.textContent = baseInfoMap[input.value];
                }
                
                // Tampilkan alert tentang basis yang dipilih
                const baseNames = {
                    biner: 'biner (0-1)',
                    desimal: 'desimal (0-9)',
                    oktal: 'oktal (0-7)',
                    heksa: 'heksadesimal (0-9, A-F)'
                };
                
                showAlert(`Silakan masukkan bilangan ${baseNames[input.value]}`, 'info');
                
                // Focus ke input
                inputNumber.focus();
            });
        });
    } else {
        console.error('Radio button basis tidak ditemukan!');
    }

    // Event listener untuk klik pada hasil (copy to clipboard)
    const resultCards = document.querySelectorAll('.result-card');
    if (resultCards && resultCards.length > 0) {
        resultCards.forEach(card => {
            card.addEventListener('click', () => {
                const resultElement = card.querySelector('p');
                if (!resultElement) return;
                
                const resultText = resultElement.textContent;
                
                if (resultText !== '-') {
                    const rawText = resultElement.getAttribute('data-raw') || resultText;
                    const type = card.getAttribute('data-type');
                    copyToClipboard(rawText, type);
                }
            });
        });
    } else {
        console.error('Kartu hasil tidak ditemukan!');
    }

    // Event listener untuk tombol tutorial
    if (helpBtn) {
        helpBtn.addEventListener('click', showTutorial);
    } else {
        console.error('Tombol bantuan tidak ditemukan!');
    }
    
    if (closeModal) {
        closeModal.addEventListener('click', hideTutorial);
    } else {
        console.error('Tombol tutup modal tidak ditemukan!');
    }
    
    if (closeTutorial) {
        closeTutorial.addEventListener('click', hideTutorial);
    } else {
        console.error('Tombol tutup tutorial tidak ditemukan!');
    }
    
    if (closeAlert) {
        closeAlert.addEventListener('click', hideAlert);
    } else {
        console.error('Tombol tutup alert tidak ditemukan!');
    }

    // Event listener untuk tombol pengaturan
    if (settingsBtn && settingsPanel) {
        // Tampilkan panel pengaturan ketika tombol diklik
        settingsBtn.addEventListener('click', () => {
            console.log('Tombol pengaturan diklik');
            settingsPanel.style.opacity = '1';
            settingsPanel.style.visibility = 'visible';
            settingsPanel.style.transform = 'translateY(0) scale(1)';
            
            // Tambahkan log untuk debugging
            console.log('Panel pengaturan:', {
                opacity: settingsPanel.style.opacity,
                visibility: settingsPanel.style.visibility,
                transform: settingsPanel.style.transform
            });
        });
    } else {
        console.error('Tombol pengaturan atau panel pengaturan tidak ditemukan!');
    }
    
    if (closeSettings && settingsPanel) {
        // Sembunyikan panel pengaturan ketika tombol tutup diklik
        closeSettings.addEventListener('click', () => {
            console.log('Tombol tutup pengaturan diklik');
            settingsPanel.style.opacity = '0';
            settingsPanel.style.visibility = 'hidden';
            settingsPanel.style.transform = 'translateY(20px) scale(0.95)';
        });
    } else {
        console.error('Tombol tutup pengaturan atau panel pengaturan tidak ditemukan!');
    }
    
    // Event listener untuk toggle rain
    if (toggleRain) {
        toggleRain.addEventListener('change', () => {
            visualConfig.rainEnabled = toggleRain.checked;
            
            if (visualConfig.rainEnabled && rainContainer) {
                rainContainer.innerHTML = '';
                createRaindrops();
            } else if (rainContainer) {
                rainContainer.innerHTML = '';
            }
            
            saveVisualPreferences();
        });
    } else {
        console.error('Toggle hujan tidak ditemukan!');
    }
    
    // Event listener untuk toggle bubbles
    if (toggleBubbles) {
        toggleBubbles.addEventListener('change', () => {
            visualConfig.bubblesEnabled = toggleBubbles.checked;
            manageBubbles(visualConfig.bubblesEnabled);
            saveVisualPreferences();
        });
    } else {
        console.error('Toggle gelembung tidak ditemukan!');
    }
    
    // Event listener untuk toggle hover effects
    if (toggleHover) {
        toggleHover.addEventListener('change', () => {
            visualConfig.hoverEnabled = toggleHover.checked;
            
            const buttons = document.querySelectorAll('button:not(.modal-close):not(.alert-close)');
            const cards = document.querySelectorAll('.result-card');
            
            if (visualConfig.hoverEnabled) {
                buttons.forEach(button => button.classList.add('hover-enabled'));
                cards.forEach(card => card.classList.add('hover-enabled'));
            } else {
                buttons.forEach(button => button.classList.remove('hover-enabled'));
                cards.forEach(card => card.classList.remove('hover-enabled'));
            }
            
            saveVisualPreferences();
        });
    } else {
        console.error('Toggle hover tidak ditemukan!');
    }
    
    // Event listener untuk toggle water effect
    if (toggleWater && waterLevel) {
        toggleWater.addEventListener('change', () => {
            visualConfig.waterEnabled = toggleWater.checked;
            
            if (visualConfig.waterEnabled) {
                waterLevel.style.display = 'block';
            } else {
                waterLevel.style.display = 'none';
            }
            
            saveVisualPreferences();
        });
    } else {
        console.error('Toggle air atau elemen level air tidak ditemukan!');
    }

    // Resize handler untuk hujan
    let resizeTimeout;
    window.addEventListener('resize', () => {
        // Debounce untuk performa
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            // Reset dan buat ulang hujan
            if (visualConfig.rainEnabled) {
                rainContainer.innerHTML = '';
                createRaindrops();
            }
            
            // Cek ukuran layar untuk responsifitas
            checkScreenSize();
        }, 200);
    });

    // Tambahkan fungsi reset dengan shortcut
    document.addEventListener('keydown', (e) => {
        // Reset app dengan Escape
        if (e.key === 'Escape') {
            resetApp();
        }
    });

    // Inisialisasi aplikasi
    initializeApp();
}); 