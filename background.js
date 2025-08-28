function isRestrictedUrl(url) {
  const restrictedSchemes = [
    'chrome://',
    'chrome-extension://',
    'moz-extension://',
    'edge://',
    'about:',
    'data:',
    'javascript:',
    'file://'
  ];
  
  return restrictedSchemes.some(scheme => url.startsWith(scheme));
}

chrome.action.onClicked.addListener(async (tab) => {
  try {
    // Check if the current tab URL is restricted
    if (!tab.url || isRestrictedUrl(tab.url)) {
      console.log('Cannot run eyedropper on restricted page:', tab.url);
      // Show a notification or badge to inform user
      chrome.action.setBadgeText({ text: '✗', tabId: tab.id });
      chrome.action.setBadgeBackgroundColor({ color: '#ff0000', tabId: tab.id });
      setTimeout(() => {
        chrome.action.setBadgeText({ text: '', tabId: tab.id });
      }, 2000);
      return;
    }
    
    // Clear any previous badge
    chrome.action.setBadgeText({ text: '', tabId: tab.id });
    
    // Execute EyeDropper directly - no need to check for existing content script
    
    // Execute EyeDropper directly to preserve user gesture
    try {
      const results = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: async () => {
          // Execute EyeDropper immediately in page context with user gesture
          try {
            if (!('EyeDropper' in window)) {
              throw new Error('EyeDropper API not supported');
            }
            
            if (!window.isSecureContext) {
              throw new Error('EyeDropper requires HTTPS');
            }
            
            const eyeDropper = new EyeDropper();
            const result = await eyeDropper.open();
            
            if (result && result.sRGBHex) {
              // Try multiple clipboard methods
              let clipboardSuccess = false;
              
              try {
                // Focus the window first
                window.focus();
                
                const textArea = document.createElement('textarea');
                textArea.value = result.sRGBHex;
                textArea.style.position = 'fixed';
                textArea.style.left = '-999999px';
                textArea.style.top = '-999999px';
                document.body.appendChild(textArea);
                textArea.focus();
                textArea.select();
                
                const successful = document.execCommand('copy');
                document.body.removeChild(textArea);
                
                if (successful) {
                  clipboardSuccess = true;
                  console.log('Color copied to clipboard using execCommand:', result.sRGBHex);
                } else {
                  console.warn('execCommand copy failed');
                }
              } catch (execErr) {
                console.warn('execCommand clipboard failed:', execErr);
              }
              
              return { success: true, color: result.sRGBHex, clipboardSuccess };
            } else {
              return { success: false, error: 'No color selected' };
            }
          } catch (error) {
            console.error('EyeDropper error:', error);
            return { success: false, error: error.message };
          }
        }
      });
      
      const result = results[0]?.result;
      
      if (result && result.success) {
        console.log('Color picked successfully:', result.color);
        
        if (result.clipboardSuccess) {
          console.log('Color copied to clipboard successfully');
        } else {
          console.warn('Color picking succeeded but clipboard copy failed');
        }
        
        // Save to history
        const colorHistory = await chrome.storage.local.get('colorHistory');
        let history = colorHistory.colorHistory || [];
        
        // Remove if already exists
        history = history.filter(c => c !== result.color);
        history.unshift(result.color);
        
        // Keep only last 12 colors
        if (history.length > 12) {
          history = history.slice(0, 12);
        }
        
        await chrome.storage.local.set({ colorHistory: history });
        console.log('Color saved to history');
        
      } else {
        console.error('EyeDropper failed:', result?.error);
        // Show error badge
        chrome.action.setBadgeText({ text: '✗', tabId: tab.id });
        chrome.action.setBadgeBackgroundColor({ color: '#ff0000', tabId: tab.id });
        setTimeout(() => {
          chrome.action.setBadgeText({ text: '', tabId: tab.id });
        }, 2000);
      }
      
    } catch (injectionError) {
      console.error('Failed to execute EyeDropper script:', injectionError);
      // Show error badge
      chrome.action.setBadgeText({ text: '✗', tabId: tab.id });
      chrome.action.setBadgeBackgroundColor({ color: '#ff0000', tabId: tab.id });
      setTimeout(() => {
        chrome.action.setBadgeText({ text: '', tabId: tab.id });
      }, 2000);
    }
    
  } catch (error) {
    console.error('Failed to start eyedropper:', error);
    // Show error badge
    chrome.action.setBadgeText({ text: '✗', tabId: tab.id });
    chrome.action.setBadgeBackgroundColor({ color: '#ff0000', tabId: tab.id });
    setTimeout(() => {
      chrome.action.setBadgeText({ text: '', tabId: tab.id });
    }, 2000);
  }
});


chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'colorPicked') {
    const color = request.color;
    const clipboardSuccess = request.clipboardSuccess;
    
    // Log clipboard result
    if (clipboardSuccess) {
      console.log('Color copied to clipboard successfully:', color);
    } else {
      console.log('Clipboard copy failed, but color was picked:', color);
    }
    
    // Save to history
    (async () => {
      try {
        const result = await chrome.storage.local.get('colorHistory');
        let colorHistory = result.colorHistory || [];
        
        if (colorHistory.includes(color)) {
          colorHistory = colorHistory.filter(c => c !== color);
        }
        
        colorHistory.unshift(color);
        
        if (colorHistory.length > 12) {
          colorHistory = colorHistory.slice(0, 12);
        }
        
        await chrome.storage.local.set({ colorHistory });
        console.log('Color saved to history:', color);
      } catch (err) {
        console.error('Failed to save color history:', err);
      }
    })();
  }
});