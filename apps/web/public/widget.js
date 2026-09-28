(function() {
    // Prevent multiple initializations
    if (window.ChidiWidgetInitialized) return;
    window.ChidiWidgetInitialized = true;

    // Find the script tag that loaded this script to extract the public ID
    const scripts = document.getElementsByTagName('script');
    let currentScript = null;
    let widgetId = null;

    for (let i = 0; i < scripts.length; i++) {
        const id = scripts[i].getAttribute('data-chidi-id');
        if (id) {
            currentScript = scripts[i];
            widgetId = id;
            break;
        }
    }

    if (!widgetId) {
        console.error("Chidi Widget: Missing data-chidi-id attribute on the script tag.");
        return;
    }

    // Determine the base URL of the Chidi backend/frontend
    // If running locally, you can change this or dynamically determine it.
    // In production, this would be https://chidi.ai
    const scriptSrc = currentScript.getAttribute('src');
    const baseUrl = scriptSrc ? new URL(scriptSrc).origin : "http://localhost:3000";

    // Create the container for the iframe to ensure complete CSS isolation
    const container = document.createElement('div');
    container.id = 'chidi-widget-container';
    container.style.position = 'fixed';
    container.style.bottom = '20px';
    container.style.right = '20px';
    container.style.width = '400px';
    container.style.height = '600px';
    container.style.maxWidth = '90vw';
    container.style.maxHeight = '90vh';
    container.style.zIndex = '999999';
    container.style.pointerEvents = 'none'; // Allow clicking through the container by default
    container.style.transition = 'all 0.3s ease';

    // Create the iframe
    const iframe = document.createElement('iframe');
    iframe.src = `${baseUrl}/embed/${widgetId}`;
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.style.border = 'none';
    iframe.style.backgroundColor = 'transparent';
    iframe.style.pointerEvents = 'auto'; // Re-enable pointer events for the iframe itself
    iframe.style.borderRadius = '16px';
    iframe.style.boxShadow = '0 10px 40px rgba(0, 0, 0, 0.15)';
    // Allow iframe to be invisible/collapsed initially, managed by messages
    iframe.style.display = 'block'; 
    iframe.allow = "clipboard-write";

    // Handle messages from the iframe (e.g., resizing, opening, closing)
    window.addEventListener('message', function(event) {
        if (event.origin !== baseUrl) return;

        try {
            const data = JSON.parse(event.data);
            if (data.type === 'CHIDI_WIDGET_RESIZE') {
                if (data.isOpen) {
                    container.style.width = '400px';
                    container.style.height = '600px';
                } else {
                    // Closed state - just the launcher button
                    container.style.width = '80px';
                    container.style.height = '80px';
                }
            }
        } catch (_) {
            // Ignore parse errors
        }
    });

    container.appendChild(iframe);
    document.body.appendChild(container);
})();
