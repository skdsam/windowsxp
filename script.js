// State management
let zIndexCounter = 100;
const GRID_SIZE_X = 85;
const GRID_SIZE_Y = 100;

const config = {
    notepad: JSON.parse(localStorage.getItem('xp_notepad_config')) || { width: '600px', height: '400px', left: '100px', top: '100px' },
    iconPositions: JSON.parse(localStorage.getItem('xp_icon_positions')) || {},
    recycleBin: 恢复RecycleBinState(),
    autoArrange: JSON.parse(localStorage.getItem('xp_auto_arrange')) || false,
    alignToGrid: JSON.parse(localStorage.getItem('xp_align_to_grid')) || true
};

function 恢复RecycleBinState() {
    const saved = localStorage.getItem('xp_recycle_bin');
    return saved ? JSON.parse(saved) : [];
}

function saveRecycleBin() {
    localStorage.setItem('xp_recycle_bin', JSON.stringify(config.recycleBin));
    const win = document.getElementById('win-recycle');
    if (win) {
        win.querySelector('.window-content').innerHTML = createFolderContent(config.recycleBin, 'file', 'win-recycle');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    initSystemFiles();
    initClock();
    initStartMenu();
    initContextMenu();
    initDesktopIcons();
    playSound('startup');
});

function initSystemFiles() {
    const resume = `================================================================================
JOE SMITH - SOFTWARE ENGINEER
================================================================================
EXPERIENCE:
- Lead Web Developer at RetroTech (2002-Present)
- Junior C++ Programmer at LegacySystems (1998-2002)

SKILLS:
- HTML 4.01, CSS 2.1, JavaScript (ES3)
- PHP 4, Macromedia Flash
- Troubleshooting Windows 98/2000/XP

EDUCATION:
- B.S in Computer Science, Tech University (1998)
================================================================================`;

    const ideas = `================================================================================
PROJECT IDEAS & TODO LIST
================================================================================
1. ADD PINBALL GAME (Classic XP Style)
2. IMPLEMENT CONTROL PANEL TABS
3. ADD INTERNET EXPLORER 6.0 SIMULATOR
4. IMPLEMENT CALCULATOR (Basic & Scientific)
5. ADD CUSTOM THEME SUPPORT (Zune, Royale)
6. FIX START MENU HOVER BLANCHING ISSUE
7. ADD SOUND EFFECTS (Startup, Shutdown, Errors)
================================================================================`;

    if (!localStorage.getItem('xp_file_Resume')) {
        localStorage.setItem('xp_file_Resume', resume);
    }
    if (!localStorage.getItem('xp_file_Ideas')) {
        localStorage.setItem('xp_file_Ideas', ideas);
    }
}

// Tray Actions
function trayAction(type) {
    if (type === 'net') {
        showBubble('Local Area Connection', 'Connected - Speed: 100.0 Mbps. Quality: Excellent.');
    } else if (type === 'sec') {
        const existing = document.getElementById('win-security');
        if (existing) {
            focusWindow('win-security');
            return;
        }
        createWindow('Windows Security Center', '🛡️', `
            <div style="padding: 20px; font-family: Tahoma; font-size: 11px;">
                <h2 style="color: #003399; margin-bottom: 15px;">Resources for staying secure</h2>
                <div style="background: #fff; border: 1px solid #aca899; padding: 15px; margin-bottom: 10px;">
                    <b style="color: #cc0000;">Firewall: OFF</b><br>
                    Windows Firewall is currently turned off. Click to turn it on.
                </div>
                <div style="background: #fff; border: 1px solid #aca899; padding: 15px; margin-bottom: 10px;">
                    <b style="color: #008800;">Automatic Updates: ON</b><br>
                    Windows will automatically keep your computer up to date.
                </div>
                <div style="background: #fff; border: 1px solid #aca899; padding: 15px;">
                    <b style="color: #cc0000;">Virus Protection: NOT FOUND</b><br>
                    Antivirus software was not detected on this computer.
                </div>
            </div>
        `, 'win-security', { width: '500px', height: '400px', left: '100px', top: '100px' });
    } else if (type === 'vol') {
        // Toggle a simple volume slider
        const existing = document.getElementById('tray-volume-popup');
        if (existing) {
            existing.remove();
            return;
        }
        const popup = document.createElement('div');
        popup.id = 'tray-volume-popup';
        popup.className = 'tray-menu';
        popup.style.bottom = '30px';
        popup.style.right = '50px';
        popup.style.width = '60px';
        popup.style.height = '150px';
        popup.style.padding = '10px';
        popup.style.textAlign = 'center';
        popup.style.display = 'flex';
        popup.style.flexDirection = 'column';
        popup.style.alignItems = 'center';
        popup.innerHTML = `
            <div style="font-size: 10px; margin-bottom: 5px;">Volume</div>
            <input type="range" orient="vertical" style="writing-mode: bt-lr; -webkit-appearance: slider-vertical; width: 20px; height: 100px;">
            <div style="margin-top: 5px; font-size: 10px;"><input type="checkbox"> Mute</div>
        `;
        document.body.appendChild(popup);
        
        // Close when clicking elsewhere
        const closer = (e) => {
            if (!popup.contains(e.target) && e.target.id !== 'tray-vol') {
                popup.remove();
                document.removeEventListener('mousedown', closer);
            }
        };
        setTimeout(() => document.addEventListener('mousedown', closer), 10);
    } else if (type === 'clock') {
        const existing = document.getElementById('win-datetime');
        if (existing) {
            focusWindow('win-datetime');
            return;
        }
        const now = new Date();
        const dateStr = now.toLocaleDateString([], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
        createWindow('Date and Time Properties', '📅', `
            <div style="padding: 15px; font-family: Tahoma; font-size: 11px;">
                <div style="display: flex; gap: 20px; background: #fff; border: 1px solid #aca899; padding: 15px; margin-bottom: 15px;">
                    <div style="flex: 1; text-align: center;">
                        <div style="font-weight: bold; margin-bottom: 10px;">Date</div>
                        <div style="border: 1px solid #aca899; padding: 5px;">
                            ${dateStr}
                        </div>
                    </div>
                    <div style="flex: 1; text-align: center;">
                        <div style="font-weight: bold; margin-bottom: 10px;">Time</div>
                        <div id="popup-time-display" style="font-size: 24px; font-family: 'Courier New', monospace; padding: 10px; border: 1px solid #aca899;">
                            ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                        </div>
                    </div>
                </div>
                <div style="color: #666; font-style: italic;">
                    To change the date or time, type the new values and click Apply.
                </div>
            </div>
        `, 'win-datetime', { width: '450px', height: '300px', left: '150px', top: '150px' });

        // Real-time tracking for the popup
        const updatePopupTime = () => {
            const timeDisplay = document.getElementById('popup-time-display');
            if (timeDisplay) {
                timeDisplay.textContent = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
                setTimeout(updatePopupTime, 1000);
            }
        };
        setTimeout(updatePopupTime, 1000);
    }
}

function showBubble(title, text) {
    const existing = document.querySelector('.xp-bubble');
    if (existing) existing.remove();

    const bubble = document.createElement('div');
    bubble.className = 'xp-bubble';
    bubble.innerHTML = `<b>${title}</b>${text}`;
    document.body.appendChild(bubble);

    setTimeout(() => {
        bubble.style.opacity = '1';
        setTimeout(() => {
            bubble.style.transition = 'opacity 1s';
            bubble.style.opacity = '0';
            setTimeout(() => bubble.remove(), 1000);
        }, 5000);
    }, 10);
}

// Shutdown Dialog Logic
function showShutdownDialog(type) {
    const overlay = document.getElementById('shutdown-overlay');
    const dialog = document.getElementById('shutdown-dialog');
    const startMenu = document.getElementById('start-menu');
    
    if (startMenu) startMenu.classList.add('hidden');
    
    if (overlay && dialog) {
        overlay.style.display = 'block';
        dialog.style.display = 'block';
        
        // Update header text if logoff
        const header = dialog.querySelector('.shutdown-header span');
        if (type === 'logoff' && header) {
            header.textContent = 'Log Off Windows';
        } else if (header) {
            header.textContent = 'Turn off computer';
        }
    }
}

function hideShutdownDialog() {
    const overlay = document.getElementById('shutdown-overlay');
    const dialog = document.getElementById('shutdown-dialog');
    if (overlay && dialog) {
        overlay.style.display = 'none';
        dialog.style.display = 'none';
    }
}

function shutdownNow() {
    playSound('shutdown');
    document.body.innerHTML = `
        <div style="background: black; width: 100vw; height: 100vh; display: flex; align-items: center; justify-content: center; color: white; font-family: Tahoma; flex-direction: column;">
            <div style="font-size: 24px; margin-bottom: 20px;">It is now safe to turn off your computer.</div>
            <button onclick="location.reload()" style="background: #ece9d8; border: 1px solid #7f9db9; padding: 5px 20px; cursor: pointer;">Power On</button>
        </div>
    `;
}

function playSound(type) {
    const audio = new Audio(`assets/sounds/${type}.mp3`);
    audio.play().catch(e => console.log('Sound play blocked:', e));
}

// Clock
function initClock() {
    const clock = document.getElementById('taskbar-clock');
    if (!clock) return;
    const updateTime = () => {
        const now = new Date();
        clock.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };
    updateTime();
    setInterval(updateTime, 1000);
}

// Start Menu
function initStartMenu() {
    const startBtn = document.getElementById('start-button');
    const startMenu = document.getElementById('start-menu');
    if (!startBtn || !startMenu) return;

    startBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        startMenu.classList.toggle('hidden');
    });

    document.addEventListener('click', () => {
        startMenu.classList.add('hidden');
    });
}

// Context Menu
function initContextMenu() {
    const desktop = document.getElementById('desktop');
    const menu = document.getElementById('context-menu');
    if (!desktop || !menu) return;

    desktop.addEventListener('contextmenu', (e) => {
        if (e.target.id === 'desktop' || e.target.classList.contains('desktop-icons')) {
            e.preventDefault();
            resetContextMenu();
            menu.style.display = 'block';
            
            // Prevent menu from going off screen
            let left = e.clientX;
            let top = e.clientY;
            
            menu.style.left = `${left}px`;
            menu.style.top = `${top}px`;
            
            const rect = menu.getBoundingClientRect();
            if (left + rect.width > window.innerWidth) {
                left = window.innerWidth - rect.width - 5;
            }
            if (top + rect.height > window.innerHeight - 30) {
                top = window.innerHeight - rect.height - 35;
            }
            
            menu.style.left = `${left}px`;
            menu.style.top = `${top}px`;
            menu.style.zIndex = 3000;
        }
    });

    document.addEventListener('click', () => {
        menu.style.display = 'none';
    });
}

function resetContextMenu() {
    const menu = document.getElementById('context-menu');
    menu.innerHTML = `
        <ul>
            <li class="has-submenu">Arrange Icons By <span class="arrow">▶</span>
                <ul>
                    <li onclick="sortIcons('name')">Name</li>
                    <li onclick="sortIcons('size')">Size</li>
                    <li onclick="sortIcons('type')">Type</li>
                    <li onclick="sortIcons('modified')">Modified</li>
                    <hr>
                    <li onclick="toggleAutoArrange()">${config.autoArrange ? '<span class="check">✓</span>' : ''} Auto Arrange</li>
                    <li onclick="toggleAlignToGrid()">${config.alignToGrid ? '<span class="check">✓</span>' : ''} Align to Grid</li>
                    <hr>
                    <li onclick="alignIconsNow()">Align Icons</li>
                </ul>
            </li>
            <li onclick="refreshDesktop()">Refresh</li>
            <hr>
            <li class="disabled">Paste</li>
            <li class="disabled">Paste Shortcut</li>
            <hr>
            <li class="has-submenu">New <span class="arrow">▶</span>
                <ul>
                    <li onclick="createDesktopFolder()">Folder</li>
                    <li onclick="createDesktopFile('New Text Document', 'text')">Text Document</li>
                </ul>
            </li>
            <hr>
            <li onclick="showProperties()">Properties</li>
        </ul>
    `;
}

function refreshDesktop() {
    if (config.autoArrange) {
        alignIconsNow();
    } else {
        // Just a little flicker effect to show it refreshed
        const desktop = document.getElementById('desktop');
        desktop.style.opacity = '0.99';
        setTimeout(() => desktop.style.opacity = '1', 50);
    }
}

function showProperties() {
    const content = `
        <div style="padding: 20px; font-size: 11px;">
            <div style="display: flex; align-items: center; margin-bottom: 20px;">
                <div style="font-size: 48px; margin-right: 20px;">🧩</div>
                <div>
                    <strong style="font-size: 14px;">Microsoft Windows XP</strong><br>
                    Professional<br>
                    Version 2002<br>
                    Service Pack 3
                </div>
            </div>
            <hr style="margin-bottom: 20px;">
            <div style="margin-bottom: 10px;">
                <strong>Registered to:</strong><br>
                User<br>
                Antigravity AI
            </div>
            <div>
                <strong>Computer:</strong><br>
                AMD Ryzen 9 5950X<br>
                3.41 GHz, 64.0 GB of RAM
            </div>
        </div>
    `;
    createWindow('System Properties', '⚙️', content, 'win-properties', { width: '400px', height: '450px', left: '200px', top: '100px' });
}

function toggleAutoArrange() {
    config.autoArrange = !config.autoArrange;
    localStorage.setItem('xp_auto_arrange', JSON.stringify(config.autoArrange));
    if (config.autoArrange) {
        alignIconsNow();
    }
}

function toggleAlignToGrid() {
    config.alignToGrid = !config.alignToGrid;
    localStorage.setItem('xp_align_to_grid', JSON.stringify(config.alignToGrid));
    if (config.alignToGrid) {
        alignIconsNow();
    }
}

function alignIconsNow() {
    const icons = Array.from(document.querySelectorAll('.icon')).filter(el => el.style.display !== 'none');
    
    if (config.autoArrange) {
        // Simple sort and place
        let col = 0;
        let row = 0;
        const maxRows = Math.floor((window.innerHeight - 100) / GRID_SIZE_Y);
        
        icons.forEach(icon => {
            const left = (20 + col * GRID_SIZE_X) + 'px';
            const top = (20 + row * GRID_SIZE_Y) + 'px';
            icon.style.left = left;
            icon.style.top = top;
            config.iconPositions[icon.id] = { left, top };
            
            row++;
            if (row >= maxRows) {
                row = 0;
                col++;
            }
        });
    } else {
        // Just snap current positions
        icons.forEach(icon => {
            const currentLeft = parseInt(icon.style.left);
            const currentTop = parseInt(icon.style.top);
            const left = (Math.round((currentLeft - 20) / GRID_SIZE_X) * GRID_SIZE_X + 20) + 'px';
            const top = (Math.round((currentTop - 20) / GRID_SIZE_Y) * GRID_SIZE_Y + 20) + 'px';
            icon.style.left = left;
            icon.style.top = top;
            config.iconPositions[icon.id] = { left, top };
        });
    }
    localStorage.setItem('xp_icon_positions', JSON.stringify(config.iconPositions));
}

function sortIcons(criterion) {
    const icons = Array.from(document.querySelectorAll('.icon')).filter(el => el.style.display !== 'none');
    
    // For now we just do a basic name sort as we don't have metadata for most
    icons.sort((a, b) => {
        const nameA = a.querySelector('span').textContent.toLowerCase();
        const nameB = b.querySelector('span').textContent.toLowerCase();
        return nameA.localeCompare(nameB);
    });

    let col = 0;
    let row = 0;
    const maxRows = Math.floor((window.innerHeight - 100) / GRID_SIZE_Y);
    
    icons.forEach(icon => {
        const left = (20 + col * GRID_SIZE_X) + 'px';
        const top = (20 + row * GRID_SIZE_Y) + 'px';
        icon.style.left = left;
        icon.style.top = top;
        config.iconPositions[icon.id] = { left, top };
        
        row++;
        if (row >= maxRows) {
            row = 0;
            col++;
        }
    });

    localStorage.setItem('xp_icon_positions', JSON.stringify(config.iconPositions));
}

// Desktop Icons
function initDesktopIcons() {
    const icons = document.querySelectorAll('.icon');
    let col = 0;
    let row = 0;
    const maxRows = Math.floor((window.innerHeight - 100) / GRID_SIZE_Y);

    icons.forEach(icon => {
        // Check if file is in recycle bin
        if (icon.id.startsWith('icon-file-')) {
            const fileName = icon.id.replace('icon-file-', '');
            if (config.recycleBin.includes(fileName)) {
                icon.style.display = 'none';
                return;
            }
        }

        const savedPos = config.iconPositions[icon.id];
        if (savedPos && savedPos.left && savedPos.top) {
            icon.style.left = savedPos.left;
            icon.style.top = savedPos.top;
        } else {
            // Find a unique spot if not saved
            const pos = findNextAvailableSpot();
            icon.style.left = pos.left;
            icon.style.top = pos.top;
            config.iconPositions[icon.id] = { left: pos.left, top: pos.top };
        }
        makeDraggable(icon, true);
    });
    localStorage.setItem('xp_icon_positions', JSON.stringify(config.iconPositions));
}

function findNextAvailableSpot() {
    let col = 0;
    let row = 0;
    const maxRows = Math.floor((window.innerHeight - 100) / GRID_SIZE_Y);
    
    while (true) {
        const left = (20 + col * GRID_SIZE_X) + 'px';
        const top = (20 + row * GRID_SIZE_Y) + 'px';
        
        let occupied = false;
        for (let id in config.iconPositions) {
            if (config.iconPositions[id].left === left && config.iconPositions[id].top === top) {
                // Double check if the element actually exists and is visible
                const el = document.getElementById(id);
                if (el && el.style.display !== 'none') {
                    occupied = true;
                    break;
                }
            }
        }
        
        if (!occupied) return { left, top };
        
        row++;
        if (row >= maxRows) {
            row = 0;
            col++;
        }
        if (col > 50) return { left: '20px', top: '20px' }; // Safety break
    }
}

// Window Management
function openApp(appId) {
    if (appId === 'notepad') {
        const existing = document.getElementById('win-notepad');
        if (existing) {
            focusWindow('win-notepad');
            return;
        }
        createWindow('Untitled', '<img src="assets/Notepad_WinXP.webp" style="width:16px;height:16px;vertical-align:middle;">', createNotepadContent(), 'win-notepad', config.notepad);
    } else if (appId === 'my-computer') {
        const existing = document.getElementById('win-computer');
        if (existing) {
            focusWindow('win-computer');
            return;
        }
        createWindow('My Computer', '<img src="assets/mycomputer.webp" style="width:16px;height:16px;vertical-align:middle;">', wrapInExplorer('My Computer', createFolderContent(['Local Disk (C:)', 'Shared Documents', 'User\'s Documents'], 'disk', 'win-computer'), 'My Computer'), 'win-computer', { width: '700px', height: '500px', left: '150px', top: '150px' });
    } else if (appId === 'recycle-bin') {
        const existing = document.getElementById('win-recycle');
        if (existing) {
            focusWindow('win-recycle');
            return;
        }
        createWindow('Recycle Bin', '🗑️', wrapInExplorer('Recycle Bin', createFolderContent(config.recycleBin, 'file', 'win-recycle'), 'Recycle Bin'), 'win-recycle', { width: '700px', height: '500px', left: '250px', top: '250px' });
    } else if (appId === 'my-documents') {
        const existing = document.getElementById('win-docs');
        if (existing) {
            focusWindow('win-docs');
            return;
        }
        createWindow('My Documents', '📂', wrapInExplorer('My Documents', createFolderContent(['Resume.txt', 'Ideas.txt'], 'file', 'win-docs'), 'C:\\Documents and Settings\\User\\My Documents'), 'win-docs', { width: '700px', height: '500px', left: '120px', top: '120px' });
    } else if (appId === 'my-music') {
        const existing = document.getElementById('win-music');
        if (existing) {
            focusWindow('win-music');
            return;
        }
        createWindow('My Music', '🎵', wrapInExplorer('My Music', createFolderContent(['SoundHelix-Song-1.mp3', 'SoundHelix-Song-2.mp3'], 'music', 'win-music'), 'C:\\Documents and Settings\\User\\My Documents\\My Music'), 'win-music', { width: '700px', height: '500px', left: '180px', top: '180px' });
    } else if (appId === 'my-pictures') {
        const existing = document.getElementById('win-pics');
        if (existing) {
            focusWindow('win-pics');
            return;
        }
        createWindow('My Pictures', '🌅', wrapInExplorer('My Pictures', createFolderContent(['Lighthouse.jpg', 'Waterfall.jpg', 'Field.jpg'], 'image', 'win-pics'), 'C:\\Documents and Settings\\User\\My Documents\\My Pictures'), 'win-pics', { width: '700px', height: '500px', left: '200px', top: '200px' });
    } else if (appId === 'control-panel') {
        const existing = document.getElementById('win-settings');
        if (existing) {
            focusWindow('win-settings');
            return;
        }
        createWindow('Control Panel', '⚙️', wrapInExplorer('Control Panel', createFolderContent(['Display', 'User Accounts', 'Network Connections', 'Sounds & Audio'], 'settings', 'win-settings'), 'Control Panel'), 'win-settings', { width: '700px', height: '500px', left: '150px', top: '150px' });
    } else if (appId === 'run') {
        const existing = document.getElementById('win-run');
        if (existing) {
            focusWindow('win-run');
            return;
        }
        createWindow('Run', '🏃', `
            <div style="padding: 15px; font-family: Tahoma; font-size: 11px;">
                <div style="display: flex; gap: 15px; margin-bottom: 15px;">
                    <div style="font-size: 32px;">🏃</div>
                    <div>
                        Type the name of a program, folder, document, or Internet resource, and Windows will open it for you.
                    </div>
                </div>
                <div style="display: flex; align-items: center; gap: 10px;">
                    <span>Open:</span>
                    <input type="text" id="run-input" style="flex: 1; height: 22px; border: 1px solid #7f9db9; padding: 0 5px;">
                </div>
                <div style="display: flex; justify-content: flex-end; gap: 5px; margin-top: 20px;">
                    <button onclick="handleRun()" style="width: 75px; height: 23px;">OK</button>
                    <button onclick="closeWindow('win-run')" style="width: 75px; height: 23px;">Cancel</button>
                    <button style="width: 75px; height: 23px;">Browse...</button>
                </div>
            </div>
        `, 'win-run', { width: '400px', height: '180px', left: '50px', top: 'calc(100vh - 250px)' });
        
        // Handle Enter key in Run input
        setTimeout(() => {
            const input = document.getElementById('run-input');
            if (input) {
                input.focus();
                input.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') handleRun();
                });
            }
        }, 100);
    } else if (appId === 'search') {
        const existing = document.getElementById('win-search');
        if (existing) {
            focusWindow('win-search');
            return;
        }
        createWindow('Search Results', '🔍', `
            <div style="display: flex; height: 100%; font-family: Tahoma; font-size: 11px;">
                <div style="width: 200px; background: #d3e5fa; border-right: 1px solid #91b0df; padding: 15px;">
                    <b style="display: block; margin-bottom: 10px;">Search by any or all of the criteria below.</b>
                    <div style="margin-bottom: 10px;">
                        All or part of the file name:<br>
                        <input type="text" style="width: 100%; border: 1px solid #7f9db9;">
                    </div>
                    <div style="margin-bottom: 15px;">
                        A word or phrase in the file:<br>
                        <input type="text" style="width: 100%; border: 1px solid #7f9db9;">
                    </div>
                    <button style="width: 100%; height: 23px;">Search</button>
                </div>
                <div style="flex: 1; background: #fff; padding: 20px; color: #666;">
                    Please enter your search criteria and click Search.
                </div>
            </div>
        `, 'win-search', { width: '600px', height: '400px', left: '100px', top: '100px' });
    } else if (appId === 'help') {
        const existing = document.getElementById('win-help');
        if (existing) {
            focusWindow('win-help');
            return;
        }
        createWindow('Help and Support Center', '❓', `
            <div style="font-family: Tahoma; font-size: 11px; height: 100%;">
                <div style="background: #4a8eff; color: white; padding: 10px; font-weight: bold; font-size: 14px;">
                    Pick a Help topic
                </div>
                <div style="padding: 20px; display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                    <div class="help-item">
                        <b style="color: #003399;">• Networking and the Web</b><br>
                        <span style="color: #666;">Connecting to the Internet...</span>
                    </div>
                    <div class="help-item">
                        <b style="color: #003399;">• Working remotely</b><br>
                        <span style="color: #666;">Connecting to your office...</span>
                    </div>
                    <div class="help-item">
                        <b style="color: #003399;">• Customizing your computer</b><br>
                        <span style="color: #666;">Changing your desktop settings...</span>
                    </div>
                    <div class="help-item">
                        <b style="color: #003399;">• Accessibility</b><br>
                        <span style="color: #666;">Adjusting for sight or hearing...</span>
                    </div>
                </div>
            </div>
        `, 'win-help', { width: '700px', height: '500px', left: '50px', top: '50px' });
    } else if (appId === 'ie') {
        const existing = document.getElementById('win-ie');
        if (existing) {
            focusWindow('win-ie');
            return;
        }
        createWindow('msn.com - Microsoft Internet Explorer', '<img src="assets/internetexplorer.png" style="width:16px;height:16px;vertical-align:middle;">', createIEContent(), 'win-ie', { width: '800px', height: '600px', left: '50px', top: '50px' });
    } else if (appId === 'calc') {
        const existing = document.getElementById('win-calc');
        if (existing) {
            focusWindow('win-calc');
            return;
        }
        createWindow('Calculator', '🧮', createCalcContent(), 'win-calc', { width: '250px', height: '320px', left: '200px', top: '200px' });
    } else if (appId === 'minesweeper') {
        const existing = document.getElementById('win-minesweeper');
        if (existing) {
            focusWindow('win-minesweeper');
            return;
        }
        createWindow('Minesweeper', '<img src="assets/minesweep.webp" style="width:16px;height:16px;vertical-align:middle;">', createMinesweeperContent(), 'win-minesweeper', { width: '200px', height: '300px', left: '300px', top: '150px' });
    }
}

function handleRun() {
    const input = document.getElementById('run-input');
    if (!input) return;
    const cmd = input.value.toLowerCase().trim();
    if (cmd === 'notepad') openApp('notepad');
    else if (cmd === 'control') openApp('control-panel');
    else if (cmd === 'calc') alert('Calculator coming soon!');
    else if (cmd) alert('Windows cannot find "' + cmd + '".');
    closeWindow('win-run');
}

function createFolderContent(items, type, folderId) {
    let icon = '📁';
    if (type === 'disk') icon = '💽';
    if (type === 'music') icon = '🎧';
    if (type === 'image') icon = '🖼️';
    if (type === 'settings') icon = '🛠️';
    if (type === 'file') icon = '📄';

    let html = '<div style="padding: 20px; display: flex; flex-wrap: wrap; gap: 30px; background: white; height: 100%; align-content: flex-start; overflow-y: auto;">';
    if (!items || items.length === 0) {
        html += '<p style="color: #666; font-size: 11px; padding: 20px;">This folder is empty.</p>';
    } else {
        items.forEach(item => {
            const isRecycle = folderId === 'win-recycle';
            html += `
                <div class="folder-item" 
                     onclick="${type === 'music' ? `playMusic('${item}')` : (type === 'image' ? `openImage('${item}')` : (type === 'file' ? `openTextFile('${item}', true)` : ''))}"
                     onmousedown="${isRecycle ? `startRestoreDrag(event, '${item}')` : ''}"
                     oncontextmenu="${(type === 'file' && isRecycle) ? `showRecycleMenu(event, '${item}')` : ''}" 
                     style="display: flex; flex-direction: column; align-items: center; width: 90px; text-align: center; cursor: pointer;">
                    <div style="font-size: 36px; margin-bottom: 5px;">${icon}</div>
                    <span style="font-size: 11px; color: black; font-family: Tahoma;">${item}${type === 'file' && !item.includes('.') ? '.txt' : ''}</span>
                </div>
            `;
        });
    }
    html += '</div>';
    return html;
}

function wrapInExplorer(title, contentHtml, address) {
    return `
        <div class="explorer-container">
            <div class="explorer-menu-bar">
                <span>File</span><span>Edit</span><span>View</span><span>Favorites</span><span>Tools</span><span>Help</span>
            </div>
            <div class="explorer-toolbar">
                <div class="explorer-tool-btn"><span>⬅️</span> Back</div>
                <div class="explorer-tool-btn"><span>➡️</span></div>
                <div class="explorer-tool-btn"><span>📂</span> Up</div>
                <div style="width: 1px; height: 20px; background: #aca899; margin: 0 5px;"></div>
                <div class="explorer-tool-btn"><span>🔍</span> Search</div>
                <div class="explorer-tool-btn"><span>📁</span> Folders</div>
                <div style="width: 1px; height: 20px; background: #aca899; margin: 0 5px;"></div>
                <div class="explorer-tool-btn"><span>📑</span> Views</div>
            </div>
            <div class="explorer-address-bar">
                <span style="font-size: 11px; margin: 0 5px;">Address</span>
                <input type="text" value="${address}" readonly>
                <div class="explorer-tool-btn" style="padding: 0 10px; height: 22px;"><span>➔</span> Go</div>
            </div>
            <div class="explorer-main">
                <div class="explorer-sidebar">
                    <div class="sidebar-group">
                        <div class="sidebar-header">
                            <span>File and Folder Tasks</span>
                            <span>📖</span>
                        </div>
                        <div class="sidebar-content">
                            <div>Make a new folder</div>
                            <div>Publish this folder to the Web</div>
                            <div>Share this folder</div>
                        </div>
                    </div>
                    <div class="sidebar-group">
                        <div class="sidebar-header">
                            <span>Other Places</span>
                            <span>📖</span>
                        </div>
                        <div class="sidebar-content">
                            <div onclick="openApp('my-computer')">My Computer</div>
                            <div onclick="openApp('my-documents')">My Documents</div>
                            <div onclick="openApp('recycle-bin')">Shared Documents</div>
                            <div onclick="openApp('control-panel')">Control Panel</div>
                        </div>
                    </div>
                    <div class="sidebar-group">
                        <div class="sidebar-header">
                            <span>Details</span>
                            <span>📖</span>
                        </div>
                        <div class="sidebar-content" style="color: black;">
                            <b>${title}</b><br>
                            System Folder
                        </div>
                    </div>
                </div>
                <div class="explorer-content">
                    ${contentHtml}
                </div>
            </div>
        </div>
    `;
}

function startRestoreDrag(e, name) {
    if (e.button !== 0) return; // Only left click
    const icon = document.getElementById(`icon-file-${name}`);
    if (!icon) return;

    // Remove from bin state first
    config.recycleBin = config.recycleBin.filter(i => i !== name);
    saveRecycleBin();

    // Prepare desktop icon
    icon.style.display = 'flex';
    icon.style.zIndex = ++zIndexCounter;
    
    // Position exactly at mouse
    icon.style.left = (e.clientX - 40) + 'px';
    icon.style.top = (e.clientY - 40) + 'px';

    // IMPORTANT: Wait for the next tick to ensure the DOM has updated
    // then dispatch the mousedown to start the standard drag process
    setTimeout(() => {
        const mouseDownEvent = new MouseEvent('mousedown', {
            bubbles: true,
            cancelable: true,
            clientX: e.clientX,
            clientY: e.clientY,
            view: window
        });
        icon.dispatchEvent(mouseDownEvent);
    }, 10);
}

function showRecycleMenu(e, name) {
    e.preventDefault();
    const menu = document.getElementById('context-menu');
    menu.innerHTML = `
        <ul>
            <li onclick="restoreItem('${name}')">Restore</li>
            <hr>
            <li onclick="deleteItemPermanently('${name}')">Delete</li>
        </ul>
    `;
    menu.style.display = 'block';
    menu.style.left = `${e.clientX}px`;
    menu.style.top = `${e.clientY}px`;
}

function restoreItem(name) {
    config.recycleBin = config.recycleBin.filter(i => i !== name);
    saveRecycleBin();
    const icon = document.getElementById(`icon-file-${name}`);
    if (icon) {
        icon.style.display = 'flex';
        // Reposition to desk if needed
        const pos = findNextAvailableSpot();
        icon.style.left = pos.left;
        icon.style.top = pos.top;
        config.iconPositions[icon.id] = pos;
        localStorage.setItem('xp_icon_positions', JSON.stringify(config.iconPositions));
    }
}

function deleteItemPermanently(name) {
    if (confirm(`Are you sure you want to permanently delete '${name}'?`)) {
        config.recycleBin = config.recycleBin.filter(i => i !== name);
        saveRecycleBin();
        const icon = document.getElementById(`icon-file-${name}`);
        if (icon) icon.remove();
        localStorage.removeItem(`xp_file_${name}`);
    }
}

function createWindow(title, icon, contentHtml, windowId, initialPos) {
    const container = document.getElementById('window-container');
    const win = document.createElement('div');
    win.id = windowId;
    win.className = 'xp-window';
    win.style.width = initialPos.width;
    win.style.height = initialPos.height;
    win.style.left = initialPos.left;
    win.style.top = initialPos.top;
    win.style.zIndex = ++zIndexCounter;

    win.innerHTML = `
        <div class="window-header">
            <span class="window-title-icon">${icon}</span>
            <span>${title}${windowId.includes('notepad') ? ' - Notepad' : ''}</span>
            <div class="window-controls">
                <div class="control-btn minimize" onclick="minimizeWindow('${windowId}')">_</div>
                <div class="control-btn maximize" onclick="maximizeWindow('${windowId}')">□</div>
                <div class="control-btn close" onclick="closeWindow('${windowId}')">×</div>
            </div>
        </div>
        <div class="window-content" style="height: calc(100% - 28px);">
            ${contentHtml}
        </div>
    `;

    container.appendChild(win);
    makeDraggable(win, false, (pos) => {
        if (windowId === 'win-notepad') {
            config.notepad.left = pos.left;
            config.notepad.top = pos.top;
            localStorage.setItem('xp_notepad_config', JSON.stringify(config.notepad));
        }
    });
    
    addTaskbarTab(windowId, title, icon);
    win.addEventListener('mousedown', () => focusWindow(windowId));

    if (windowId === 'win-notepad') {
        const savedText = localStorage.getItem('xp_notepad_content');
        if (savedText) win.querySelector('textarea').value = savedText;
        win.querySelector('textarea').addEventListener('input', (e) => {
            localStorage.setItem('xp_notepad_content', e.target.value);
        });
    }

    return windowId;
}

function focusWindow(id) {
    const win = document.getElementById(id);
    if (win) {
        win.classList.remove('minimized');
        win.style.zIndex = ++zIndexCounter;
        document.querySelectorAll('.taskbar-tab').forEach(t => t.classList.remove('active'));
        const tab = document.querySelector(`.taskbar-tab[data-window-id="${id}"]`);
        if (tab) tab.classList.add('active');
    }
}

function minimizeWindow(id) {
    const win = document.getElementById(id);
    if (win) win.classList.add('minimized');
    const tab = document.querySelector(`.taskbar-tab[data-window-id="${id}"]`);
    if (tab) tab.classList.remove('active');
}

function maximizeWindow(id) {
    const win = document.getElementById(id);
    if (!win) return;
    win.classList.toggle('maximized');
}

function closeWindow(id) {
    const win = document.getElementById(id);
    if (win) {
        if (id === 'win-notepad' && !win.classList.contains('maximized')) {
            config.notepad.width = win.style.width;
            config.notepad.height = win.style.height;
            localStorage.setItem('xp_notepad_config', JSON.stringify(config.notepad));
        }
        win.remove();
    }
    const tab = document.querySelector(`.taskbar-tab[data-window-id="${id}"]`);
    if (tab) tab.remove();
}

function addTaskbarTab(id, title, icon) {
    const taskbarApps = document.getElementById('taskbar-apps');
    const tab = document.createElement('div');
    tab.className = 'taskbar-tab active';
    tab.setAttribute('data-window-id', id);
    tab.innerHTML = `<span>${icon} ${title}</span>`;
    
    tab.addEventListener('click', () => {
        const win = document.getElementById(id);
        if (win.classList.contains('minimized') || !tab.classList.contains('active')) {
            focusWindow(id);
        } else {
            minimizeWindow(id);
        }
    });
    taskbarApps.appendChild(tab);
}

function createNotepadContent() {
    return `
        <div class="notepad-content">
            <div class="notepad-menu">
                <div class="menu-item">File
                    <div class="dropdown-content">
                        <div class="dropdown-item" onclick="notepadAction('new')">New</div>
                        <div class="dropdown-item" onclick="notepadAction('open')">Open...</div>
                        <div class="dropdown-item" onclick="notepadAction('save')">Save</div>
                        <div class="dropdown-item" onclick="notepadAction('save-as')">Save As...</div>
                        <hr><div class="dropdown-item" onclick="closeWindow('win-notepad')">Exit</div>
                    </div>
                </div>
                <div class="menu-item">Edit
                    <div class="dropdown-content">
                        <div class="dropdown-item" onclick="document.execCommand('undo')">Undo</div>
                        <hr><div class="dropdown-item" onclick="document.execCommand('cut')">Cut</div>
                        <div class="dropdown-item" onclick="document.execCommand('copy')">Copy</div>
                        <div class="dropdown-item" onclick="document.execCommand('paste')">Paste</div>
                    </div>
                </div>
                <div class="menu-item">Format
                    <div class="dropdown-content">
                        <div class="dropdown-item" onclick="notepadAction('toggle-bold')">Font... (Bold)</div>
                    </div>
                </div>
            </div>
            <textarea class="notepad-textarea" id="notepad-text"></textarea>
        </div>
    `;
}

let notepadState = { fileName: 'Untitled', isBold: false };

function notepadAction(type) {
    const textarea = document.getElementById('notepad-text');
    const win = document.getElementById('win-notepad');
    if (!textarea || !win) return;
    const titleSpan = win.querySelector('.window-header span:nth-child(2)');

    if (type === 'new') {
        textarea.value = '';
        notepadState.fileName = 'Untitled';
        titleSpan.textContent = 'Untitled - Notepad';
    } else if (type === 'save' || type === 'save-as') {
        const name = prompt('File name:', notepadState.fileName);
        if (name) {
            notepadState.fileName = name;
            titleSpan.textContent = `${name} - Notepad`;
            localStorage.setItem(`xp_file_${name}`, textarea.value);
            createDesktopFileIcon(name);
        }
    } else if (type === 'toggle-bold') {
        notepadState.isBold = !notepadState.isBold;
        textarea.classList.toggle('bold-text', notepadState.isBold);
    }
}

function createDesktopFileIcon(name) {
    const container = document.querySelector('.desktop-icons');
    if (document.getElementById(`icon-file-${name}`)) return;
    
    const icon = document.createElement('div');
    icon.className = 'icon';
    icon.id = `icon-file-${name}`;
    const pos = findNextAvailableSpot();
    icon.style.left = pos.left;
    icon.style.top = pos.top;
    icon.innerHTML = `<div style="font-size: 32px;">📄</div><span>${name}.txt</span>`;
    icon.ondblclick = () => {
        openApp('notepad');
        setTimeout(() => {
            const textarea = document.getElementById('notepad-text');
            if (textarea) {
                textarea.value = localStorage.getItem(`xp_file_${name}`);
                notepadState.fileName = name;
                const win = document.getElementById('win-notepad');
                if (win) win.querySelector('.window-header span:nth-child(2)').textContent = `${name} - Notepad`;
            }
        }, 100);
    };
    container.appendChild(icon);
    makeDraggable(icon, true);
    config.iconPositions[icon.id] = pos;
    localStorage.setItem('xp_icon_positions', JSON.stringify(config.iconPositions));
}

// Universal Draggable
function makeDraggable(el, isIcon, onStop) {
    const handle = isIcon ? el : el.querySelector('.window-header');
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    let originalLeft = el.style.left;
    let originalTop = el.style.top;

    handle.addEventListener('mousedown', dragMouseDown);

    function dragMouseDown(e) {
        if (el.classList.contains('maximized')) return;
        // e.preventDefault(); // Removed to allow event dispatching to work better

        originalLeft = el.style.left;
        originalTop = el.style.top;
        
        pos3 = e.clientX;
        pos4 = e.clientY;
        
        document.addEventListener('mouseup', closeDragElement);
        document.addEventListener('mousemove', elementDrag);
        
        if (!isIcon) focusWindow(el.id);
        else {
            el.style.zIndex = ++zIndexCounter;
        }
    }

    function elementDrag(e) {
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        
        el.style.top = (el.offsetTop - pos2) + "px";
        el.style.left = (el.offsetLeft - pos1) + "px";

        if (isIcon && el.id.startsWith('icon-file-')) {
            const bin = document.getElementById('icon-recycle');
            if (bin) {
                const binRect = bin.getBoundingClientRect();
                const iconRect = el.getBoundingClientRect();
                const isOver = !(iconRect.right < binRect.left || 
                                iconRect.left > binRect.right || 
                                iconRect.bottom < binRect.top || 
                                iconRect.top > binRect.bottom);
                bin.style.filter = isOver ? 'brightness(1.5) drop-shadow(0 0 5px yellow)' : '';
            }
        }
    }

    function closeDragElement() {
        document.removeEventListener('mouseup', closeDragElement);
        document.removeEventListener('mousemove', elementDrag);
        
        if (isIcon) {
            if (config.autoArrange) {
                alignIconsNow();
                return;
            }

            const currentLeft = parseInt(el.style.left);
            const currentTop = parseInt(el.style.top);
            
            let finalLeft = el.style.left;
            let finalTop = el.style.top;

            if (config.alignToGrid) {
                finalLeft = (Math.round((currentLeft - 20) / GRID_SIZE_X) * GRID_SIZE_X + 20) + 'px';
                finalTop = (Math.round((currentTop - 20) / GRID_SIZE_Y) * GRID_SIZE_Y + 20) + 'px';
            }

            if (el.id.startsWith('icon-file-')) {
                const bin = document.getElementById('icon-recycle');
                const binRect = bin.getBoundingClientRect();
                const iconRect = el.getBoundingClientRect();
                const isOver = !(iconRect.right < binRect.left || 
                                iconRect.left > binRect.right || 
                                iconRect.bottom < binRect.top || 
                                iconRect.top > binRect.bottom);
                
                bin.style.filter = '';
                if (isOver) {
                    const fileName = el.id.replace('icon-file-', '');
                    if (!config.recycleBin.includes(fileName)) {
                        config.recycleBin.push(fileName);
                        saveRecycleBin();
                        el.style.display = 'none';
                        delete config.iconPositions[el.id];
                        localStorage.setItem('xp_icon_positions', JSON.stringify(config.iconPositions));
                    }
                    return;
                }
            }

            let collision = false;
            for (let id in config.iconPositions) {
                if (id !== el.id && config.iconPositions[id].left === finalLeft && config.iconPositions[id].top === finalTop) {
                    const otherEl = document.getElementById(id);
                    if (otherEl && otherEl.style.display !== 'none') {
                        collision = true;
                        break;
                    }
                }
            }

            if (collision && config.alignToGrid) {
                el.style.left = originalLeft;
                el.style.top = originalTop;
            } else {
                el.style.left = finalLeft;
                el.style.top = finalTop;
                config.iconPositions[el.id] = { left: finalLeft, top: finalTop };
                localStorage.setItem('xp_icon_positions', JSON.stringify(config.iconPositions));
            }
        }
 else if (onStop) {
            onStop({ left: el.style.left, top: el.style.top });
        }
    }
}

function createDesktopFile(baseName, type) {
    let name = baseName;
    let counter = 1;
    while (localStorage.getItem(`xp_file_${name}`) !== null || document.getElementById(`icon-file-${name}`)) {
        name = `${baseName} (${counter++})`;
    }
    
    if (type === 'text') {
        localStorage.setItem(`xp_file_${name}`, '');
        createDesktopFileIcon(name);
    }
    if (config.autoArrange) alignIconsNow();
}

function createDesktopFolder() {
    const container = document.querySelector('.desktop-icons');
    const id = `icon-folder-${Date.now()}`;
    const icon = document.createElement('div');
    icon.className = 'icon';
    icon.id = id;
    const pos = findNextAvailableSpot();
    icon.style.left = pos.left;
    icon.style.top = pos.top;
    icon.innerHTML = `<div style="font-size: 32px;">📁</div><span>New Folder</span>`;
    container.appendChild(icon);
    makeDraggable(icon, true);
    config.iconPositions[id] = pos;
    localStorage.setItem('xp_icon_positions', JSON.stringify(config.iconPositions));
    
    if (config.autoArrange) alignIconsNow();
}

function playMusic(fileName) {
    const existing = document.getElementById('win-mplayer');
    if (existing) {
        const audio = existing.querySelector('audio');
        audio.src = `assets/music/${fileName}`;
        audio.play();
        existing.querySelector('.player-info').textContent = fileName;
        focusWindow('win-mplayer');
        return;
    }
    
    createWindow('Windows Media Player', '▶️', createMediaPlayerContent(fileName), 'win-mplayer', { width: '400px', height: '300px', left: '300px', top: '200px' });
}

function createMediaPlayerContent(fileName) {
    return `
        <div class="media-player">
            <div class="player-viz" id="player-viz">
                ${Array(20).fill('<div class="viz-bar" style="height: 10px;"></div>').join('')}
            </div>
            <div class="player-controls">
                <audio id="mplayer-audio" src="assets/music/${fileName}" autoplay></audio>
                <div class="player-btn" onclick="document.getElementById('mplayer-audio').play()">▶</div>
                <div class="player-btn" onclick="document.getElementById('mplayer-audio').pause()">⏸</div>
                <div class="player-info">${fileName}</div>
            </div>
        </div>
    `;
}

// Start viz animation loop
setInterval(() => {
    const bars = document.querySelectorAll('.viz-bar');
    const audio = document.getElementById('mplayer-audio');
    if (bars.length && audio && !audio.paused) {
        bars.forEach(bar => {
            bar.style.height = (Math.random() * 80 + 10) + '%';
        });
    } else if (bars.length) {
        bars.forEach(bar => bar.style.height = '10px');
    }
}, 150);

function openImage(fileName) {
    createWindow(fileName + ' - Windows Picture and Fax Viewer', '🖼️', `
        <div style="background: #eee; height: 100%; display: flex; flex-direction: column;">
            <div style="flex: 1; display: flex; align-items: center; justify-content: center; overflow: auto; padding: 20px;">
                <img src="assets/pictures/${fileName}" style="max-width: 100%; max-height: 100%; box-shadow: 2px 2px 10px rgba(0,0,0,0.2);">
            </div>
            <div style="background: #ece9d8; height: 40px; border-top: 1px solid #aca899; display: flex; align-items: center; justify-content: center; gap: 10px;">
                <button title="Previous" style="padding: 2px 10px;">◀</button>
                <button title="Next" style="padding: 2px 10px;">▶</button>
                <button title="Zoom In" style="padding: 2px 10px;">⊕</button>
                <button title="Zoom Out" style="padding: 2px 10px;">⊖</button>
                <button title="Delete" style="padding: 2px 10px;">🗑️</button>
            </div>
        </div>
    `, 'win-viewer-' + fileName.replace('.', '-'), { width: '600px', height: '500px', left: '100px', top: '100px' });
}

async function openTextFile(fileName, isAssetList = false) {
    openApp('notepad');
    const loadContent = async () => {
        const textarea = document.getElementById('notepad-text');
        if (!textarea) {
            setTimeout(loadContent, 50);
            return;
        }

        let content = '';
        if (isAssetList) {
            try {
                const response = await fetch(`assets/docs/${fileName}`);
                if (response.ok) {
                    content = await response.text();
                } else {
                    throw new Error('Fetch failed');
                }
            } catch (e) {
                console.warn('Could not fetch asset, falling back to local storage');
                const key = `xp_file_${fileName.replace('.txt', '')}`;
                content = localStorage.getItem(key) || 'File content not available in offline mode.';
            }
        } else {
            content = localStorage.getItem(`xp_file_${fileName}`) || '';
        }

        textarea.value = content;
        const win = document.getElementById('win-notepad');
        if (win) {
            const name = fileName.includes('.') ? fileName.split('.')[0] : fileName;
            win.querySelector('.window-header span:nth-child(2)').textContent = `${name} - Notepad`;
            notepadState.fileName = name;
        }
    };
    loadContent();
}

function createIEContent() {
    return `
        <div class="ie-container">
            <div class="ie-toolbar">
                <div class="ie-btn" onclick="navigateIE('back')"><span>⬅️</span><span>Back</span></div>
                <div class="ie-btn" onclick="navigateIE('forward')"><span>➡️</span><span>Forward</span></div>
                <div class="ie-btn" onclick="navigateIE('stop')"><span>✖️</span><span>Stop</span></div>
                <div class="ie-btn" onclick="navigateIE('refresh')"><span>🔄</span><span>Refresh</span></div>
                <div class="ie-btn" onclick="navigateIE('home')"><span>🏠</span><span>Home</span></div>
                <div style="width: 1px; height: 30px; background: #aca899; margin: 0 5px;"></div>
                <div class="ie-btn"><span>🔍</span><span>Search</span></div>
                <div class="ie-btn"><span>⭐</span><span>Favorites</span></div>
                <div class="ie-btn"><span>📜</span><span>History</span></div>
            </div>
            <div class="ie-address-bar">
                <span style="font-size: 11px;">Address</span>
                <input type="text" id="ie-address" value="http://www.msn.com" onkeypress="if(event.key==='Enter') navigateIE('go')">
                <div class="ie-btn" onclick="navigateIE('go')" style="flex-direction: row; height: 22px; padding: 0 10px;">
                    <span style="font-size: 14px; margin-right: 5px;">➔</span><span>Go</span>
                </div>
            </div>
            <div class="ie-content" id="ie-frame">
                ${getMockSite('msn')}
            </div>
        </div>
    `;
}

function navigateIE(action) {
    const addressInput = document.getElementById('ie-address');
    const frame = document.getElementById('ie-frame');
    if (!addressInput || !frame) return;

    if (action === 'go' || action === 'refresh' || action === 'home') {
        let url = addressInput.value.toLowerCase();
        if (action === 'home') {
            url = 'http://www.msn.com';
            addressInput.value = url;
        }
        
        frame.innerHTML = '<div style="padding: 20px;">Loading...</div>';
        
        setTimeout(() => {
            if (url.includes('google')) {
                frame.innerHTML = getMockSite('google');
            } else if (url.includes('spacejam')) {
                frame.innerHTML = getMockSite('spacejam');
            } else if (url.includes('msn')) {
                frame.innerHTML = getMockSite('msn');
            } else {
                frame.innerHTML = getMockSite('404');
            }
        }, 500);
    }
}

function getMockSite(site) {
    if (site === 'google') {
        return `
            <div class="ie-mock-page" style="text-align: center;">
                <h1 style="font-size: 60px; margin-top: 50px;">
                    <span style="color: #4285F4">G</span><span style="color: #EA4335">o</span><span style="color: #FBBC05">o</span><span style="color: #4285F4">g</span><span style="color: #34A853">l</span><span style="color: #EA4335">e</span>
                </h1>
                <input type="text" style="width: 400px; height: 30px; border: 1px solid #ccc; padding: 5px; margin-top: 20px;"><br>
                <div style="margin-top: 20px;">
                    <button style="padding: 5px 15px; margin-right: 10px;">Google Search</button>
                    <button style="padding: 5px 15px;">I'm Feeling Lucky</button>
                </div>
                <p style="margin-top: 30px; font-size: 13px;">Google.com offered in: <a href="#">English</a></p>
            </div>
        `;
    } else if (site === 'msn') {
        return `
            <div class="ie-mock-page">
                <div style="background: #003399; color: white; padding: 10px; margin-bottom: 20px; font-weight: bold;">MSN Welcome to the 2000s</div>
                <h1>Welcome to MSN.com</h1>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                    <div style="border: 1px solid #ccc; padding: 10px;">
                        <h3 style="color: #cc0000;">Breaking News</h3>
                        <p>Windows XP is the best operating system ever released, experts say.</p>
                        <a href="#">Read more...</a>
                    </div>
                    <div style="border: 1px solid #ccc; padding: 10px;">
                        <h3 style="color: #008800;">Entertainment</h3>
                        <p>Spider-Man is sweeping the box office this summer!</p>
                        <a href="#">View trailers...</a>
                    </div>
                </div>
            </div>
        `;
    } else if (site === 'spacejam') {
        return `
            <div class="ie-mock-page" style="background: black; color: white; height: 100%; min-height: 500px;">
                <div style="text-align: center;">
                    <h1 style="color: yellow; font-style: italic;">SPACE JAM</h1>
                    <p style="color: #00ff00;">The original 1996 website is still here!</p>
                    <div style="margin-top: 50px; display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px;">
                        <div style="border: 1px solid white; padding: 10px;">Planet B-Ball</div>
                        <div style="border: 1px solid white; padding: 10px;">Lunar Tunes</div>
                        <div style="border: 1px solid white; padding: 10px;">Jump Station</div>
                    </div>
                    <p style="margin-top: 50px; color: cyan;">Warning: This site requires a 14.4 modem.</p>
                </div>
            </div>
        `;
    }
    return `
        <div class="ie-mock-page">
            <h1>The page cannot be displayed</h1>
            <p>The page you are looking for is currently unavailable. The Web site might be experiencing technical difficulties, or you may need to adjust your browser settings.</p>
            <hr>
            <p>Please try the following:</p>
            <ul>
                <li>Click the <a href="#" onclick="navigateIE('refresh')">Refresh</a> button, or try again later.</li>
                <li>If you typed the page address in the Address bar, make sure that it is spelled correctly.</li>
            </ul>
        </div>
    `;
}

function createCalcContent() {
    return `
        <div style="padding: 10px; font-family: Tahoma; font-size: 11px; background: #ece9d8; height: 100%;">
            <input type="text" id="calc-display" value="0" readonly style="width: 100%; height: 35px; background: white; border: 1px inset #fff; text-align: right; font-size: 18px; padding: 5px; margin-bottom: 10px;">
            <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 5px;">
                <button class="calc-btn" onclick="calcInput('C')" style="color: red;">C</button>
                <button class="calc-btn" onclick="calcInput('CE')" style="color: red;">CE</button>
                <button class="calc-btn" onclick="calcInput('back')">←</button>
                <button class="calc-btn" onclick="calcInput('/')">/</button>
                
                <button class="calc-btn blue" onclick="calcInput('7')">7</button>
                <button class="calc-btn blue" onclick="calcInput('8')">8</button>
                <button class="calc-btn blue" onclick="calcInput('9')">9</button>
                <button class="calc-btn red" onclick="calcInput('*')">*</button>
                
                <button class="calc-btn blue" onclick="calcInput('4')">4</button>
                <button class="calc-btn blue" onclick="calcInput('5')">5</button>
                <button class="calc-btn blue" onclick="calcInput('6')">6</button>
                <button class="calc-btn red" onclick="calcInput('-')">-</button>
                
                <button class="calc-btn blue" onclick="calcInput('1')">1</button>
                <button class="calc-btn blue" onclick="calcInput('2')">2</button>
                <button class="calc-btn blue" onclick="calcInput('3')">3</button>
                <button class="calc-btn red" onclick="calcInput('+')">+</button>
                
                <button class="calc-btn blue" onclick="calcInput('0')">0</button>
                <button class="calc-btn blue" onclick="calcInput('.')">.</button>
                <button class="calc-btn blue" onclick="calcInput('sqrt')">√</button>
                <button class="calc-btn red" onclick="calcInput('=')">=</button>
            </div>
            <style>
                .calc-btn { width: 100%; height: 35px; font-weight: bold; cursor: pointer; background: #ece9d8; border: 1px solid #aca899; box-shadow: 1px 1px 1px #fff inset; }
                .calc-btn.blue { color: blue; }
                .calc-btn.red { color: red; }
                .calc-btn:active { box-shadow: 1px 1px 1px rgba(0,0,0,0.3) inset; }
            </style>
        </div>
    `;
}

let calcState = { display: '0', formula: '', resetNext: false };

function calcInput(val) {
    const disp = document.getElementById('calc-display');
    if (!disp) return;

    if (val === 'C' || val === 'CE') {
        calcState.display = '0';
        calcState.formula = '';
        calcState.resetNext = false;
    } else if (val === '=') {
        try {
            // Basic math evaluation
            let result = eval(calcState.formula + calcState.display);
            calcState.display = result.toString();
            calcState.formula = '';
            calcState.resetNext = true;
        } catch(e) { calcState.display = 'Error'; }
    } else if (['+', '-', '*', '/'].includes(val)) {
        calcState.formula = calcState.display + ' ' + val + ' ';
        calcState.resetNext = true;
    } else if (val === 'sqrt') {
        calcState.display = Math.sqrt(parseFloat(calcState.display)).toString();
        calcState.resetNext = true;
    } else if (val === 'back') {
        calcState.display = calcState.display.length > 1 ? calcState.display.slice(0, -1) : '0';
    } else {
        if (calcState.resetNext || calcState.display === '0') {
            calcState.display = val;
            calcState.resetNext = false;
        } else {
            calcState.display += val;
        }
    }
    disp.value = calcState.display;
}

function createMinesweeperContent() {
    return `
        <div style="padding: 10px; background: #bdbdbd; border: 3px inset #fff; height: 100%; display: flex; flex-direction: column; align-items: center;">
            <div style="background: #bdbdbd; border: 2px inset #fff; padding: 5px; margin-bottom: 10px; display: flex; justify-content: space-between; width: 100%;">
                <div style="background: black; color: red; font-family: 'Courier New'; font-size: 20px; padding: 0 5px;">010</div>
                <div style="cursor: pointer; font-size: 20px;" onclick="openApp('minesweeper')">😊</div>
                <div style="background: black; color: red; font-family: 'Courier New'; font-size: 20px; padding: 0 5px;">000</div>
            </div>
            <div id="mines-grid" style="display: grid; grid-template-columns: repeat(9, 20px); grid-template-rows: repeat(9, 20px); border: 2px inset #fff;">
                ${Array(81).fill(0).map((_, i) => `<div class="mine-cell" onclick="revealMine(this, ${i})" style="width: 20px; height: 20px; background: #bdbdbd; border: 2px outset #fff; cursor: pointer;"></div>`).join('')}
            </div>
            <style>
                .mine-cell.revealed { border: 1px solid #7b7b7b !important; background: #bdbdbd !important; cursor: default; }
            </style>
        </div>
    `;
}

function revealMine(cell, idx) {
    if (cell.classList.contains('revealed')) return;
    cell.classList.add('revealed');
    cell.style.border = '1px solid #7b7b7b';
    
    // Simple mock logic: cell 10 is a mine
    if (idx === 10 || idx === 25 || idx === 50) {
        cell.innerHTML = '💣';
        cell.style.background = 'red';
        alert('Game Over! You hit a mine.');
    } else {
        const neighboringMines = [10, 25, 50];
        // Just show a '1' for simplicity in mock
        cell.innerHTML = '<span style="color: blue; font-weight: bold; font-family: sans-serif; font-size: 14px;">1</span>';
    }
}
