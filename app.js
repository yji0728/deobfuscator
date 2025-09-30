/**
 * Main Application Logic
 * Handles UI interactions and coordinates deobfuscation
 */

document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const inputCode = document.getElementById('inputCode');
    const outputCode = document.getElementById('outputCode');
    const deobfuscateBtn = document.getElementById('deobfuscateBtn');
    const clearInput = document.getElementById('clearInput');
    const loadSample = document.getElementById('loadSample');
    const copyOutput = document.getElementById('copyOutput');
    const downloadOutput = document.getElementById('downloadOutput');
    const beautifyCheckbox = document.getElementById('beautify');
    const unpackEvalCheckbox = document.getElementById('unpackEval');
    const unpackPackerCheckbox = document.getElementById('unpackPacker');

    // Sample obfuscated code
    const sampleCode = `eval(function(p,a,c,k,e,d){e=function(c){return c.toString(36)};if(!''.replace(/^/,String)){while(c--){d[c.toString(a)]=k[c]||c.toString(a)}k=[function(e){return d[e]}];e=function(){return'\\\\w+'};c=1};while(c--){if(k[c]){p=p.replace(new RegExp('\\\\b'+e(c)+'\\\\b','g'),k[c])}}return p}('0.1("2 3!");',4,4,'console|log|Hello|World'.split('|'),0,{}))`;

    // Deobfuscate button click handler
    deobfuscateBtn.addEventListener('click', function() {
        const code = inputCode.value.trim();
        
        if (!code) {
            alert('입력 코드를 입력해주세요!');
            return;
        }

        try {
            // Show loading state
            deobfuscateBtn.disabled = true;
            deobfuscateBtn.textContent = '처리 중...';
            outputCode.value = '';

            // Small delay to show loading state
            setTimeout(() => {
                try {
                    // Get options
                    const options = {
                        beautify: beautifyCheckbox.checked,
                        unpackEval: unpackEvalCheckbox.checked,
                        unpackPacker: unpackPackerCheckbox.checked
                    };

                    // Deobfuscate the code
                    const result = Deobfuscator.deobfuscate(code, options);
                    
                    // Display result
                    outputCode.value = result;
                    
                    // Show success message
                    showNotification('디옵스케이트 완료!', 'success');
                } catch (error) {
                    outputCode.value = '오류: ' + error.message + '\n\n원본 코드:\n' + code;
                    showNotification('디옵스케이트 중 오류가 발생했습니다.', 'error');
                } finally {
                    // Restore button state
                    deobfuscateBtn.disabled = false;
                    deobfuscateBtn.textContent = '🔓 디옵스케이트';
                }
            }, 100);
        } catch (error) {
            alert('오류: ' + error.message);
            deobfuscateBtn.disabled = false;
            deobfuscateBtn.textContent = '🔓 디옵스케이트';
        }
    });

    // Clear input button handler
    clearInput.addEventListener('click', function() {
        inputCode.value = '';
        inputCode.focus();
    });

    // Load sample button handler
    loadSample.addEventListener('click', function() {
        inputCode.value = sampleCode;
        showNotification('샘플 코드가 로드되었습니다!', 'info');
    });

    // Copy output button handler
    copyOutput.addEventListener('click', function() {
        const text = outputCode.value;
        
        if (!text) {
            showNotification('복사할 내용이 없습니다.', 'warning');
            return;
        }

        // Copy to clipboard
        outputCode.select();
        document.execCommand('copy');
        
        // Also use modern clipboard API if available
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text).then(() => {
                showNotification('클립보드에 복사되었습니다!', 'success');
            }).catch(() => {
                showNotification('클립보드에 복사되었습니다!', 'success');
            });
        } else {
            showNotification('클립보드에 복사되었습니다!', 'success');
        }

        // Deselect
        window.getSelection().removeAllRanges();
    });

    // Download output button handler
    downloadOutput.addEventListener('click', function() {
        const text = outputCode.value;
        
        if (!text) {
            showNotification('다운로드할 내용이 없습니다.', 'warning');
            return;
        }

        try {
            // Create blob and download
            const blob = new Blob([text], { type: 'text/javascript' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'deobfuscated-' + Date.now() + '.js';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            showNotification('파일이 다운로드되었습니다!', 'success');
        } catch (error) {
            showNotification('다운로드 중 오류가 발생했습니다.', 'error');
        }
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Ctrl/Cmd + Enter to deobfuscate
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            e.preventDefault();
            deobfuscateBtn.click();
        }
        
        // Ctrl/Cmd + K to clear
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            clearInput.click();
        }
    });

    /**
     * Show notification message
     */
    function showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Style the notification
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 25px;
            background: ${type === 'success' ? '#4caf50' : type === 'error' ? '#f44336' : type === 'warning' ? '#ff9800' : '#2196f3'};
            color: white;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
            z-index: 10000;
            animation: slideIn 0.3s ease-out;
            font-weight: 500;
        `;

        // Add animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from {
                    transform: translateX(400px);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            @keyframes slideOut {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(400px);
                    opacity: 0;
                }
            }
        `;
        
        if (!document.querySelector('style[data-notification]')) {
            style.setAttribute('data-notification', 'true');
            document.head.appendChild(style);
        }

        // Add to page
        document.body.appendChild(notification);

        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    // Show welcome message
    showNotification('JavaScript 디옵스케이터에 오신 것을 환영합니다!', 'info');
});
