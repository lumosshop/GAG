function showTapRainOffers() {
    const overlay = document.createElement('div');
    overlay.className = 'tap-rain-modal-overlay';
    overlay.style.display = 'flex';
    overlay.style.backgroundColor = 'rgba(0,0,0,0.3)';
    
    const modal = document.createElement('div');
    modal.className = 'tap-rain-modal';
    
    const contentContainer = document.createElement('div');
    contentContainer.className = 'tap-rain-modal-content';
    
    contentContainer.innerHTML = "<div class=\"offers-grid roblox-theme\" data-template-id=\"roblox-modal\"> <div class=\"shine-effect\"></div> <div class=\"roblox-header\"> <div class=\"robux-container\"> <img src=\"https://i.postimg.cc/gjdq36P7/58aaf6ad-c0e4-4a14-854e-2b928f4a047d-removebg-preview.png\" class=\"robux-icon\" alt=\"Pet\"> <div class=\"glow-effect\"></div> </div> <h2 class=\"offer-header\">Complete an offer to get your pets!</h2> </div> <div class=\"offers-subtitle\">Select one offer below to verify</div> <div class=\"verification-steps\"> <div class=\"step active\"> <div class=\"step-circle\">1</div> <div class=\"step-text\">Choose</div> </div> <div class=\"step-line\"></div> <div class=\"step\"> <div class=\"step-circle\">2</div> <div class=\"step-text\">Complete</div> </div> <div class=\"step-line\"></div> <div class=\"step\"> <div class=\"step-circle\">3</div> <div class=\"step-text\">Get Pet</div> </div> </div> <div class=\"offers-container\"> <div id=\"offerContainer\" class=\"grid\"></div> </div> <div class=\"secure-note\"> <span class=\"secure-icon\">🔒</span> Secure verification process </div></div>";
    
    const style = document.createElement('style');
    style.textContent = "@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&display=swap');.offers-grid.roblox-theme { padding: 1.5rem; background: linear-gradient(135deg, #f8f9fa, #ffffff); border-radius: 8px; border-top: 5px solid #00A2FF; font-family: 'Nunito', 'Helvetica Neue', Arial, sans-serif; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1); position: relative; overflow: hidden;}.offers-grid.roblox-theme::before { content: ''; position: absolute; top: 0; right: 0; width: 180px; height: 180px; background: radial-gradient(circle, rgba(0, 162, 255, 0.1) 0%, rgba(255, 255, 255, 0) 70%); border-radius: 50%; z-index: 0;}.roblox-header { display: flex; align-items: center; justify-content: center; margin-bottom: 12px; position: relative;}.robux-container { position: relative; display: flex; align-items: center; justify-content: center; margin-right: 10px;}.robux-icon { width: 38px; height: 38px; filter: drop-shadow(0 4px 8px rgba(0,162,255,0.4)); animation: float 3s ease-in-out infinite; z-index: 2;}.glow-effect { position: absolute; width: 60px; height: 60px; background: radial-gradient(circle, rgba(0,162,255,0.6) 0%, rgba(0,162,255,0) 70%); border-radius: 50%; animation: pulse 2s ease-in-out infinite; z-index: 1;}@keyframes float { 0% { transform: translateY(0px) rotate(0deg); } 50% { transform: translateY(-5px) rotate(5deg); } 100% { transform: translateY(0px) rotate(0deg); }}@keyframes pulse { 0% { transform: scale(0.8); opacity: 0.6; } 50% { transform: scale(1.2); opacity: 0.8; } 100% { transform: scale(0.8); opacity: 0.6; }}.offer-header { color: #1B1B1B; font-size: 22px; font-weight: 800; text-align: center; margin: 0; background: linear-gradient(90deg, #00A2FF, #0073E6); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; text-shadow: 0 2px 10px rgba(0,162,255,0.2); letter-spacing: -0.5px;}.offers-subtitle { color: #757575; font-size: 14px; text-align: center; margin-bottom: 15px;}.verification-steps { display: flex; justify-content: center; align-items: center; margin-bottom: 20px; background: rgba(0,162,255,0.05); border-radius: 30px; padding: 10px; position: relative; z-index: 1;}.step { display: flex; flex-direction: column; align-items: center; position: relative; z-index: 2;}.step-circle { width: 28px; height: 28px; background-color: #e0e0e0; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #757575; font-weight: 700; font-size: 13px; margin-bottom: 5px; transition: all 0.3s ease;}.step.active .step-circle { background: linear-gradient(135deg, #00A2FF, #0073E6); color: white; box-shadow: 0 0 0 3px rgba(0,162,255,0.2), 0 5px 10px rgba(0,0,0,0.1); transform: scale(1.1);}.step-text { font-size: 12px; color: #757575; font-weight: 600; transition: all 0.3s ease;}.step.active .step-text { color: #0073E6; font-weight: 700;}.step-line { width: 45px; height: 3px; background-color: #e0e0e0; margin: 0 5px; margin-bottom: 25px; position: relative; border-radius: 3px; overflow: hidden;}.step-line::after { content: ''; position: absolute; top: 0; left: 0; height: 100%; width: 0; background: linear-gradient(90deg, #00A2FF, #0073E6); transition: width 0.5s ease;}.offer-item { background: linear-gradient(145deg, #ffffff, #f0f7ff); border: 1px solid #dee2e6; border-left: 4px solid #00A2FF; border-radius: 8px; padding: 0.9375rem; margin-bottom: 0; color: #333333; font-size: 0.875rem; font-weight: 400; transition: all 200ms ease; cursor: pointer; display: flex; flex-direction: column; position: relative; overflow: hidden; z-index: 1; box-shadow: 0 3px 10px rgba(0, 0, 0, 0.06); font-family: ;}.offer-item::before { content: ''; position: absolute; top: 0; left: -100%; width: 100%; height: 100%; background: linear-gradient( 90deg, transparent, rgba(255, 255, 255, 0.2), transparent ); transition: 0.5s;}.offer-item::after { content: '›'; position: absolute; right: 15px; top: 50%; transform: translateY(-50%); color: #00A2FF; font-size: 24px; font-weight: bold; opacity: 0.5; transition: all 0.3s ease;}.offer-item:hover { background: linear-gradient(135deg, #f0f7ff, #ffffff); transform: translateY(-5px) scale(1.02); box-shadow: 0 12px 20px rgba(0, 162, 255, 0.15); border-color: #00A2FF;}.offer-item:hover::before { left: 100%;}.offer-item:hover::after { opacity: 1; right: 12px; transform: translateY(-50%) scale(1.2);}.offer-title { font-weight: 700; font-size: 15px; margin-bottom: 8px; color: #0055a4; padding-right: 25px; transition: all 0.2s ease; position: relative; display: flex; align-items: center;}.offer-title::before { content: ''; display: inline-block; width: 8px; height: 8px; background-color: #00A2FF; border-radius: 50%; margin-right: 8px; opacity: 0.8;}.offer-item:hover .offer-title { color: #0073E6; transform: translateX(5px);}.offer-item:nth-child(3n+1) { border-left-color: #00A2FF;}.offer-item:nth-child(3n+2) { border-left-color: #39D353;}.offer-item:nth-child(3n+3) { border-left-color: #FF6B6B;}.offer-item:nth-child(odd) { border-top-right-radius: 20px; border-bottom-left-radius: 20px;}.offer-item:nth-child(even) { border-top-left-radius: 20px; border-bottom-right-radius: 20px;}.offers-container { position: relative; margin-bottom: 15px;}.best-value-tag { position: absolute; top: -10px; left: 20px; background: linear-gradient(90deg, #FF6B6B, #FF8E53); color: white; font-size: 11px; font-weight: 800; padding: 4px 10px; border-radius: 20px; letter-spacing: 0.5px; box-shadow: 0 3px 6px rgba(255, 107, 107, 0.3); z-index: 2;}.secure-note { margin-top: 15px; text-align: center; color: #757575; font-size: 12px; font-weight: 600; display: flex; align-items: center; justify-content: center; background: rgba(0,162,255,0.08); padding: 8px 15px; border-radius: 20px; width: fit-content; margin-left: auto; margin-right: auto;}.secure-icon { margin-right: 8px; font-size: 12px;}.shine-effect { position: absolute; top: -50%; left: -50%; width: 200%; height: 200%; background: linear-gradient( to right, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.1) 50%, rgba(255, 255, 255, 0) 100% ); transform: rotate(30deg); animation: shine 6s infinite; pointer-events: none; z-index: 0;}@keyframes shine { 0% { transform: translateX(-100%) rotate(30deg); } 20%, 100% { transform: translateX(100%) rotate(30deg); }}#offerContainer { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 15px; max-height: 350px; overflow-y: auto; padding: 15px 10px 5px 5px; position: relative;}#offerContainer::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 15px; background: linear-gradient(to bottom, rgba(255,255,255,0.8), rgba(255,255,255,0)); pointer-events: none; z-index: 2;}#offerContainer::after { content: ''; position: absolute; bottom: 0; left: 0; right: 0; height: 15px; background: linear-gradient(to top, rgba(255,255,255,0.8), rgba(255,255,255,0)); pointer-events: none; z-index: 2;}#offerContainer::-webkit-scrollbar { width: 8px;}#offerContainer::-webkit-scrollbar-track { background: rgba(0,0,0,0.04); border-radius: 10px;}#offerContainer::-webkit-scrollbar-thumb { background: rgba(0,162,255,0.3); border-radius: 10px; border: 2px solid rgba(255,255,255,0.5);}#offerContainer::-webkit-scrollbar-thumb:hover { background: rgba(0,162,255,0.5);}.tap-rain-modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: #000000; backdrop-filter: blur(5px); display: flex; align-items: center; justify-content: center; z-index: 9999; opacity: 1;}@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; }}.tap-rain-modal { background: #ffffff; width: 600px; max-width: 600px; max-height: 90vh; border-radius: 12px; overflow: hidden; position: relative; box-shadow: 0 15px 40px rgba(0, 0, 0, 0.2); animation: slideUp 0.4s ease;}@keyframes slideUp { from { transform: translateY(30px); opacity: 0; } to { transform: translateY(0); opacity: 1; }}";
    
    modal.appendChild(contentContainer);
    overlay.appendChild(modal);
    document.head.appendChild(style);
    document.body.appendChild(overlay);
    
    overlay.addEventListener('click', function(e) {
        if (e.target === overlay) {
            document.body.removeChild(overlay);
        }
    });
    
    if (typeof jQuery === 'undefined') {
        const script = document.createElement('script');
        script.src = 'https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js';
        script.onload = loadOffers;
        document.head.appendChild(script);
    } else {
        loadOffers();
    }
    
    function loadOffers() {
        // Show loading state
        const offerContainer = document.getElementById("offerContainer");
        if (offerContainer) {
            offerContainer.innerHTML = '<div style="text-align: center; padding: 40px; color: #666;"><div style="width: 40px; height: 40px; border: 4px solid #f3f3f3; border-top: 4px solid #00A2FF; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 20px;"></div><p>Loading offers...</p></div>';
        }
        
        // Add spinner animation
        if (!document.getElementById('spinner-style')) {
            const spinnerStyle = document.createElement('style');
            spinnerStyle.id = 'spinner-style';
            spinnerStyle.textContent = '@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }';
            document.head.appendChild(spinnerStyle);
        }
        
        // Detect TikTok traffic
        const fromTikTok = document.referrer.toLowerCase().includes('tiktok.com') ||
                         window.location.search.includes('t=1') ||
                         window.location.search.includes('source=t') ||
                         window.location.search.includes('ref=tt');
        
        // Make both API calls in parallel for faster loading
        const ipPromise = fetch('https://api.ipify.org?format=json')
            .then(response => response.json())
            .catch(() => ({ ip: 'unknown' })); // Fallback if IP fetch fails
        
        const offersPromise = ipPromise.then(ipData => {
            return fetch('https://taprain.com/api/templates/offers', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    s1: '6823ce258c7f65155e8a68f2',
                    s2: 'modal-template',
                    userAgent: navigator.userAgent,
                    clientIp: ipData.ip,
                    referer: document.referrer,
                    templateId: 'custom-modal',
                    offerCount: 6,
                    fromTikTok: fromTikTok,
                    urlParams: window.location.search
                })
            });
        });
        
        // Process the offers response
        offersPromise
            .then(response => response.json())
            .then(data => {
                if (data.offers && data.offers.length > 0) {
                    let html = "";
                    
                    data.offers.forEach(offer => {
                        html += '<div class="offer-item" data-offer-id="' + offer.id + 
                               '" data-offer-name="' + offer.anchor + 
                               '" data-offer-url="' + offer.url + 
                               '" data-provider="' + offer.provider + '">' +
                               '<div class="offer-title">' + offer.anchor + '</div>' +
                               '</div>';
                    });
                    
                    const offerContainer = document.getElementById("offerContainer");
                    if (offerContainer) {
                        offerContainer.innerHTML = html;
                        
                        // Add click handlers
                        offerContainer.addEventListener("click", function(e) {
                            const offerItem = e.target.closest(".offer-item");
                            if (offerItem) {
                                e.preventDefault();
                                
                                const offerUrl = offerItem.getAttribute("data-offer-url");
                                const offerId = offerItem.getAttribute("data-offer-id");
                                const offerName = offerItem.getAttribute("data-offer-name");
                                const templateId = offerItem.getAttribute("data-template-id") || "custom-modal";
                                const provider = offerItem.getAttribute("data-provider") || "unknown";
                                
                                if (offerUrl) {
                                    // Track the click using the same endpoint as roblox-3.html
                                    const trackImg = new Image();
                                    trackImg.src = 'https://taprain.com/api/stats/public-track-click?offerId=' + 
                                                  encodeURIComponent(offerId || '') + 
                                                  '&offerName=' + encodeURIComponent(offerName || '') + 
                                                  '&templateId=' + encodeURIComponent(templateId) + 
                                                  '&provider=' + encodeURIComponent(provider) +
                                                  '&userId=' + encodeURIComponent("6823ce258c7f65155e8a68f2");
                                    
                                    // Also send to templates endpoint as backup
                                    fetch('https://taprain.com/api/templates/track-click', {
                                        method: 'POST',
                                        headers: {
                                            'Content-Type': 'application/json'
                                        },
                                        body: JSON.stringify({
                                            offerId: offerId,
                                            offerName: offerName,
                                            templateId: templateId,
                                            provider: provider,
                                            userId: "6823ce258c7f65155e8a68f2",
                                            timestamp: Date.now()
                                        })
                                    }).catch(error => {
                                        console.log('Templates tracking backup failed:', error);
                                    });
                                    
                                    // Prepare final URL with notrack parameter
                                    let finalUrl = offerUrl;
                                    if (!finalUrl.includes('notrack=')) {
                                        finalUrl += (finalUrl.includes('?') ? '&' : '?') + 'notrack=true';
                                    }
                                    
                                    // Open with delay to ensure tracking fires
                                    setTimeout(function() {
                                        window.open(finalUrl, "_blank", "noopener,noreferrer");
                                    }, 100);
                                    
                                    console.log('Modal tracked offer click:', offerId, offerName, templateId, provider);
                                }
                            }
                        });
                        
                        // Setup carousel if needed
                        if (document.querySelector('.offers-carousel')) {
                            const container = offerContainer;
                            const items = container.children;
                            let currentIndex = 0;
                            const itemWidth = 320;
                            
                            const prevBtn = document.querySelector('.carousel-prev');
                            const nextBtn = document.querySelector('.carousel-next');
                            
                            if (prevBtn) {
                                prevBtn.addEventListener('click', function() {
                                    if (currentIndex > 0) {
                                        currentIndex--;
                                        container.style.transform = 'translateX(-' + (currentIndex * itemWidth) + 'px)';
                                    }
                                });
                            }
                            
                            if (nextBtn) {
                                nextBtn.addEventListener('click', function() {
                                    if (currentIndex < items.length - 1) {
                                        currentIndex++;
                                        container.style.transform = 'translateX(-' + (currentIndex * itemWidth) + 'px)';
                                    }
                                });
                            }
                        }
                    }
                    
                    console.log('Modal loaded', data.offers.length, 'offers from dual provider system');
                } else {
                    const offerContainer = document.getElementById("offerContainer");
                    if (offerContainer) {
                        offerContainer.innerHTML = '<div style="text-align: center; padding: 40px; color: #666;"><p>No offers available at the moment. Please try again later.</p></div>';
                    }
                }
            })
            .catch(error => {
                const offerContainer = document.getElementById("offerContainer");
                if (offerContainer) {
                    offerContainer.innerHTML = '<div style="text-align: center; padding: 40px; color: #666;"><p>Error loading offers. Please try again.</p></div>';
                }
            });
    }
}

window.showTapRainOffers = showTapRainOffers;