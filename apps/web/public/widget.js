(function() {
  // Prevent loading multiple times
  if (window.ChidiWidgetLoaded) return;
  window.ChidiWidgetLoaded = true;

  // Find the script tag that loaded this script to get the widget ID
  const scripts = document.getElementsByTagName('script');
  let currentScript = null;
  let widgetId = null;
  
  for (let i = 0; i < scripts.length; i++) {
    if (scripts[i].getAttribute('data-widget-id')) {
      currentScript = scripts[i];
      widgetId = currentScript.getAttribute('data-widget-id');
      break;
    }
  }

  if (!widgetId) {
    console.error("Chidi AI: data-widget-id is missing from the script tag.");
    return;
  }

  // Determine the host URL from the script src
  const src = currentScript.src;
  const hostUrl = src.substring(0, src.lastIndexOf('/'));

  // Create the iframe container
  const iframe = document.createElement('iframe');
  iframe.src = `${hostUrl}/embed/${widgetId}`;
  iframe.title = "Chidi AI Chat Widget";
  
  // Style the iframe to float in the bottom right corner
  iframe.style.position = 'fixed';
  iframe.style.bottom = '0';
  iframe.style.right = '0';
  iframe.style.border = 'none';
  iframe.style.backgroundColor = 'transparent';
  iframe.style.zIndex = '2147483647'; // Max z-index to stay on top
  iframe.style.colorScheme = 'normal';
  
  // Initial sizes (just enough for the closed bubble)
  const CLOSED_WIDTH = '100px';
  const CLOSED_HEIGHT = '100px';
  const OPEN_WIDTH = '400px';
  const OPEN_HEIGHT = '700px';
  
  // Responsive handling for mobile
  const isMobile = window.innerWidth <= 480;
  
  iframe.style.width = CLOSED_WIDTH;
  iframe.style.height = CLOSED_HEIGHT;
  
  // Add iframe to the page
  document.body.appendChild(iframe);

  // Listen for messages from the iframe to handle resizing (open/close)
  window.addEventListener('message', function(event) {
    // Basic security check (can be tightened)
    if (!event.origin.includes(hostUrl.replace(/^https?:\/\//, ''))) return;

    try {
      const data = JSON.parse(event.data);
      if (data.type === 'CHIDI_WIDGET_RESIZE') {
        if (data.isOpen) {
          iframe.style.width = isMobile ? '100vw' : OPEN_WIDTH;
          iframe.style.height = isMobile ? '100vh' : OPEN_HEIGHT;
          if (isMobile) {
             iframe.style.bottom = '0';
             iframe.style.right = '0';
          }
        } else {
          iframe.style.width = CLOSED_WIDTH;
          iframe.style.height = CLOSED_HEIGHT;
        }
      }
    } catch (e) {
      // Ignore non-JSON messages
    }
  });

})();
