// State management
let zIndexCounter = 100;
const GRID_SIZE_X = 85;
const GRID_SIZE_Y = 100;

const config = {
    notepad: JSON.parse(localStorage.getItem('xp_notepad_config')) || { width: '600px', height: '400px', left: '100px', top: '100px' },
    iconPositions: JSON.parse(localStorage.getItem('xp_icon_positions')) || {},
    recycleBin: 恢复RecycleBinState(),
    autoArrange: JSON.parse(localStorage.getItem('xp_auto_arrange')) || false,
    alignToGrid: JSON.parse(localStorage.getItem('xp_align_to_grid')) || true,
    theme: localStorage.getItem('xp_theme') || 'classic',
    wallpaper: localStorage.getItem('xp_wallpaper') || 'bliss',
    wallpaperMode: localStorage.getItem('xp_wallpaper_mode') || 'stretch',
    customWallpaper: localStorage.getItem('xp_custom_wallpaper') || ''
};

function applyTheme() {
    const root = document.body;
    root.classList.remove('theme-classic', 'theme-royale', 'theme-graphite');
    root.classList.add(`theme-${config.theme}`);

    const wallpaperMap = {
        bliss: 'url("assets/bliss.jpg")',
        field: 'url("assets/pictures/Field.jpg")',
        waterfall: 'url("assets/pictures/Waterfall.jpg")',
        lighthouse: 'url("assets/pictures/Lighthouse.jpg")',
        blue: 'linear-gradient(135deg, #0c5ca4 0%, #1f77d1 35%, #73b7ff 100%)',
        dusk: 'linear-gradient(135deg, #231f42 0%, #3a3f7d 35%, #5d6ba8 100%)',
        custom: config.customWallpaper ? `url("${config.customWallpaper}")` : 'url("assets/bliss.jpg")'
    };

    const desktop = document.getElementById('desktop');
    if (desktop) {
        desktop.style.background = wallpaperMap[config.wallpaper] || wallpaperMap.bliss;
        const modes={stretch:{size:'100% 100%',repeat:'no-repeat',position:'center'},center:{size:'auto',repeat:'no-repeat',position:'center'},tile:{size:'auto',repeat:'repeat',position:'top left'},fill:{size:'cover',repeat:'no-repeat',position:'center'}};
        const mode=modes[config.wallpaperMode]||modes.stretch;
        desktop.style.backgroundSize=mode.size;desktop.style.backgroundRepeat=mode.repeat;desktop.style.backgroundPosition=mode.position;
    }

    const appTabs = document.querySelectorAll('.taskbar-tab');
    appTabs.forEach(tab => tab.style.opacity = '1');
    localStorage.setItem('xp_theme', config.theme);
    localStorage.setItem('xp_wallpaper', config.wallpaper);
    localStorage.setItem('xp_wallpaper_mode', config.wallpaperMode);
}

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
    applyTheme();
    initClock();
    initStartMenu();
    initContextMenu();
    initDesktopIcons();
    initDesktopExperience();
    playSound('startup');
    if (sessionStorage.getItem('xp_welcomed')) document.getElementById('welcome-toast')?.remove();
    else sessionStorage.setItem('xp_welcomed', '1');
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
            <li class="has-submenu">Appearance <span class="arrow">▶</span><ul>
                <li onclick="switchWallpaper('bliss')">Bliss</li><li onclick="switchWallpaper('field')">Field</li><li onclick="switchWallpaper('waterfall')">Waterfall</li><li onclick="switchWallpaper('lighthouse')">Lighthouse</li>
                <hr><li onclick="chooseDesktopPicture()">Choose Picture...</li>
                <hr><li onclick="setWallpaperMode('stretch')">Stretch</li><li onclick="setWallpaperMode('center')">Center</li><li onclick="setWallpaperMode('tile')">Tile</li><li onclick="setWallpaperMode('fill')">Fill</li>
                <hr><li onclick="switchTheme('classic')">Luna Blue</li><li onclick="switchTheme('royale')">Royale</li><li onclick="switchTheme('graphite')">Graphite</li>
            </ul></li>
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

function showSystemProperties() {
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

function showProperties() {
    const existing=document.getElementById('win-display-properties');if(existing){focusWindow('win-display-properties');return}
    const choices=[['bliss','Bliss'],['field','Field'],['waterfall','Waterfall'],['lighthouse','Lighthouse'],['blue','Windows Blue'],['dusk','Dusk']];
    const content=`<div class="display-properties"><div class="display-tabs"><span>Themes</span><span class="active">Desktop</span><span>Screen Saver</span><span>Appearance</span><span>Settings</span></div>
        <div class="display-panel"><div class="monitor-preview"><div id="wallpaper-preview"></div></div><label>Background:</label><div class="wallpaper-picker">${choices.map(([id,label])=>`<button onclick="switchWallpaper('${id}');updateDisplayPreview()" class="wallpaper-choice ${config.wallpaper===id?'active':''}" data-wallpaper="${id}">${label}</button>`).join('')}</div>
        <div class="display-row"><button onclick="chooseDesktopPicture()">Browse...</button><label>Position: <select onchange="setWallpaperMode(this.value);updateDisplayPreview()"><option value="stretch" ${config.wallpaperMode==='stretch'?'selected':''}>Stretch</option><option value="center" ${config.wallpaperMode==='center'?'selected':''}>Center</option><option value="tile" ${config.wallpaperMode==='tile'?'selected':''}>Tile</option><option value="fill" ${config.wallpaperMode==='fill'?'selected':''}>Fill</option></select></label></div>
        <fieldset><legend>Color scheme</legend><label><input type="radio" name="display-theme" onchange="switchTheme('classic')" ${config.theme==='classic'?'checked':''}> Luna Blue</label><label><input type="radio" name="display-theme" onchange="switchTheme('royale')" ${config.theme==='royale'?'checked':''}> Royale</label><label><input type="radio" name="display-theme" onchange="switchTheme('graphite')" ${config.theme==='graphite'?'checked':''}> Graphite</label></fieldset></div>
        <div class="display-buttons"><button onclick="closeWindow('win-display-properties')">OK</button><button onclick="closeWindow('win-display-properties')">Cancel</button><button onclick="applyTheme();updateDisplayPreview()">Apply</button></div><input id="desktop-picture-input" type="file" accept="image/*" hidden onchange="loadDesktopPicture(this)"></div>`;
    createWindow('Display Properties','🖥️',content,'win-display-properties',{width:'510px',height:'545px',left:'220px',top:'80px'});requestAnimationFrame(updateDisplayPreview)
}
function chooseDesktopPicture(){let input=document.getElementById('desktop-picture-input');if(!input){input=document.createElement('input');input.type='file';input.accept='image/*';input.hidden=true;input.onchange=()=>loadDesktopPicture(input);document.body.appendChild(input)}input.click()}
function loadDesktopPicture(input){const file=input.files?.[0];if(!file)return;if(!file.type.startsWith('image/')){alert('Please choose an image file.');return}const reader=new FileReader();reader.onload=()=>{config.customWallpaper=reader.result;config.wallpaper='custom';try{localStorage.setItem('xp_custom_wallpaper',config.customWallpaper)}catch{showBubble('Display Properties','The image is too large to save permanently, but it will be used for this session.')}applyTheme();updateDisplayPreview()};reader.readAsDataURL(file);input.value=''}
function setWallpaperMode(mode){config.wallpaperMode=mode;applyTheme()}
function updateDisplayPreview(){const preview=document.getElementById('wallpaper-preview'),desktop=document.getElementById('desktop');if(!preview||!desktop)return;preview.style.backgroundImage=desktop.style.backgroundImage;preview.style.backgroundSize=desktop.style.backgroundSize;preview.style.backgroundPosition=desktop.style.backgroundPosition;preview.style.backgroundRepeat=desktop.style.backgroundRepeat;document.querySelectorAll('.wallpaper-choice').forEach(b=>b.classList.toggle('active',b.dataset.wallpaper===config.wallpaper))}

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
    const appMap = {
        notepad: () => {
            const existing = document.getElementById('win-notepad');
            if (existing) { focusWindow('win-notepad'); return; }
            createWindow('Untitled', '<img src="assets/Notepad_WinXP.webp" style="width:16px;height:16px;vertical-align:middle;">', createNotepadContent(), 'win-notepad', config.notepad);
        },
        wordpad: () => {
            const existing = document.getElementById('win-wordpad');
            if (existing) { focusWindow('win-wordpad'); return; }
            createWindow('Document - WordPad', '📝', createWordPadContent(), 'win-wordpad', { width:'720px', height:'540px', left:'125px', top:'65px' });
        },
        cmd: () => {
            const existing = document.getElementById('win-cmd');
            if (existing) { focusWindow('win-cmd'); return; }
            createWindow('C:\\WINDOWS\\system32\\cmd.exe', '▣', createCommandPromptContent(), 'win-cmd', { width:'650px', height:'410px', left:'140px', top:'100px' });
            requestAnimationFrame(() => document.getElementById('cmd-input')?.focus());
        },
        'my-computer': () => {
            const existing = document.getElementById('win-computer');
            if (existing) { focusWindow('win-computer'); return; }
            createWindow('My Computer', '<img src="assets/mycomputer.webp" style="width:16px;height:16px;vertical-align:middle;">', wrapInExplorer('My Computer', createFolderContent(['Local Disk (C:)', 'Shared Documents', 'User\'s Documents'], 'disk', 'win-computer'), 'My Computer'), 'win-computer', { width: '700px', height: '500px', left: '150px', top: '150px' });
        },
        'recycle-bin': () => {
            const existing = document.getElementById('win-recycle');
            if (existing) { focusWindow('win-recycle'); return; }
            createWindow('Recycle Bin', '🗑️', wrapInExplorer('Recycle Bin', createFolderContent(config.recycleBin, 'file', 'win-recycle'), 'Recycle Bin'), 'win-recycle', { width: '700px', height: '500px', left: '250px', top: '250px' });
        },
        'my-documents': () => {
            const existing = document.getElementById('win-docs');
            if (existing) { focusWindow('win-docs'); return; }
            createWindow('My Documents', '📂', wrapInExplorer('My Documents', createFolderContent(['SkdSam-CV.txt', 'Resume.txt', 'Ideas.txt'], 'file', 'win-docs'), 'C:\\Documents and Settings\\User\\My Documents'), 'win-docs', { width: '700px', height: '500px', left: '120px', top: '120px' });
        },
        'my-music': () => {
            const existing = document.getElementById('win-music');
            if (existing) { focusWindow('win-music'); return; }
            createWindow('My Music', '🎵', wrapInExplorer('My Music', createFolderContent(['SoundHelix-Song-1.mp3', 'SoundHelix-Song-2.mp3'], 'music', 'win-music'), 'C:\\Documents and Settings\\User\\My Documents\\My Music'), 'win-music', { width: '700px', height: '500px', left: '180px', top: '180px' });
        },
        'my-pictures': () => {
            const existing = document.getElementById('win-pics');
            if (existing) { focusWindow('win-pics'); return; }
            createWindow('My Pictures', '🌅', wrapInExplorer('My Pictures', createFolderContent(['Lighthouse.jpg', 'Waterfall.jpg', 'Field.jpg'], 'image', 'win-pics'), 'C:\\Documents and Settings\\User\\My Documents\\My Pictures'), 'win-pics', { width: '700px', height: '500px', left: '200px', top: '200px' });
        },
        'control-panel': () => {
            const existing = document.getElementById('win-settings');
            if (existing) { focusWindow('win-settings'); return; }
            createWindow('Control Panel', '⚙️', createControlPanelContent(), 'win-settings', { width: '760px', height: '520px', left: '100px', top: '100px' });
        },
        'task-manager': () => {
            const existing = document.getElementById('win-task-manager');
            if (existing) { focusWindow('win-task-manager'); return; }
            createWindow('Task Manager', '📊', createTaskManagerContent(), 'win-task-manager', { width: '540px', height: '420px', left: '200px', top: '140px' });
        },
        run: () => {
            const existing = document.getElementById('win-run');
            if (existing) { focusWindow('win-run'); return; }
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
            setTimeout(() => {
                const input = document.getElementById('run-input');
                if (input) {
                    input.focus();
                    input.addEventListener('keypress', (e) => {
                        if (e.key === 'Enter') handleRun();
                    });
                }
            }, 100);
        },
        search: () => {
            const existing = document.getElementById('win-search');
            if (existing) { focusWindow('win-search'); return; }
            createWindow('Search Results', '🔍', `
                <div style="display: flex; height: 100%; font-family: Tahoma; font-size: 11px;">
                    <div style="width: 220px; background: #d3e5fa; border-right: 1px solid #91b0df; padding: 15px;">
                        <b style="display: block; margin-bottom: 10px;">Search by any or all of the criteria below.</b>
                        <div style="margin-bottom: 10px;">
                            All or part of the file name:<br>
                            <input id="search-file" type="text" style="width: 100%; border: 1px solid #7f9db9;">
                        </div>
                        <div style="margin-bottom: 15px;">
                            A word or phrase in the file:<br>
                            <input id="search-text" type="text" style="width: 100%; border: 1px solid #7f9db9;">
                        </div>
                        <button onclick="doSearch()" style="width: 100%; height: 23px;">Search</button>
                    </div>
                    <div id="search-results" style="flex: 1; background: #fff; padding: 20px; color: #666; overflow: auto;">
                        Please enter your search criteria and click Search.
                    </div>
                </div>
            `, 'win-search', { width: '600px', height: '400px', left: '100px', top: '100px' });
            requestAnimationFrame(doSearch);
        },
        help: () => {
            const existing=document.getElementById('win-help');if(existing){focusWindow('win-help');return}
            createWindow('Help and Support Center','❓',createHelpContent(),'win-help',{width:'740px',height:'540px',left:'70px',top:'55px'});
        },
        ie: () => {
            const existing = document.getElementById('win-ie');
            if (existing) { focusWindow('win-ie'); return; }
            createWindow('msn.com - Microsoft Internet Explorer', '<img src="assets/internetexplorer.png" style="width:16px;height:16px;vertical-align:middle;">', createIEContent(), 'win-ie', { width: '800px', height: '600px', left: '50px', top: '50px' });
            requestAnimationFrame(() => navigateIE('go'));
        },
        calc: () => {
            const existing = document.getElementById('win-calc');
            if (existing) { focusWindow('win-calc'); return; }
            createWindow('Calculator', '🧮', createCalcContent(), 'win-calc', { width: '250px', height: '320px', left: '200px', top: '200px' });
        },
        minesweeper: () => {
            const existing = document.getElementById('win-minesweeper');
            if (existing) { focusWindow('win-minesweeper'); return; }
            createWindow('Minesweeper', '<img src="assets/minesweep.webp" style="width:16px;height:16px;vertical-align:middle;">', createMinesweeperContent(), 'win-minesweeper', { width: '200px', height: '300px', left: '300px', top: '150px' });
        },
        paint: () => {
            const existing = document.getElementById('win-paint');
            if (existing) { focusWindow('win-paint'); return; }
            createWindow('untitled - Paint', '🎨', createPaintContent(), 'win-paint', { width:'720px', height:'520px', left:'90px', top:'55px' });
            requestAnimationFrame(initPaint);
        },
        'media-player': () => {
            const existing=document.getElementById('win-mplayer');if(existing){focusWindow('win-mplayer');return}
            createWindow('Windows Media Player','▶',createMediaPlayerContent(),'win-mplayer',{width:'680px',height:'500px',left:'160px',top:'75px'});requestAnimationFrame(initMediaPlayer);
        },
        cv: () => {
            const existing = document.getElementById('win-cv');
            if (existing) { focusWindow('win-cv'); return; }
            createWindow('SkdSam CV', '📄', createCvContent(), 'win-cv', { width:'780px', height:'620px', left:'110px', top:'45px' });
        }
    };

    if (appMap[appId]) {
        appMap[appId]();
        return;
    }

    if (appId === 'help') {
        const existing = document.getElementById('win-help');
        if (existing) { focusWindow('win-help'); return; }
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
    }
}

function handleRun() {
    const input = document.getElementById('run-input');
    if (!input) return;
    const cmd = input.value.toLowerCase().trim();
    const commands = {
        notepad: 'notepad',
        wordpad: 'wordpad',
        write: 'wordpad',
        cmd: 'cmd',
        command: 'cmd',
        calc: 'calc',
        calculator: 'calc',
        mspaint: 'paint',
        paint: 'paint',
        wmplayer: 'media-player',
        'media player': 'media-player',
        cv: 'cv',
        resume: 'cv',
        control: 'control-panel',
        'control panel': 'control-panel',
        'task manager': 'task-manager',
        explorer: 'my-computer',
        'my computer': 'my-computer',
        'internet explorer': 'ie',
        ie: 'ie',
        iexplore: 'ie',
        search: 'search',
        help: 'help'
    };

    if (cmd && commands[cmd]) {
        openApp(commands[cmd]);
    } else if (cmd) {
        alert('Windows cannot find "' + cmd + '".');
    }
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

    document.querySelectorAll('.xp-window').forEach(w => w.classList.remove('active'));
    container.appendChild(win);
    win.classList.add('active');
    win.querySelector('.window-header').addEventListener('dblclick', e => {
        if (!e.target.closest('.window-controls')) maximizeWindow(windowId);
    });
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
        const savedStyle=JSON.parse(localStorage.getItem('xp_notepad_style')||'{}');
        Object.assign(win.querySelector('textarea').style,savedStyle);
        win.querySelector('textarea').addEventListener('input', (e) => {
            localStorage.setItem('xp_notepad_content', e.target.value);
            updateNotepadStatus();
        });
        win.querySelector('textarea').addEventListener('click',updateNotepadStatus);
        win.querySelector('textarea').addEventListener('keyup',updateNotepadStatus);
        updateNotepadStatus();
    }

    return windowId;
}

function focusWindow(id) {
    const win = document.getElementById(id);
    if (win) {
        document.querySelectorAll('.xp-window').forEach(w => w.classList.remove('active'));
        win.classList.remove('minimized');
        win.classList.add('active');
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
                        <div class="dropdown-item" onclick="notepadAction('undo')">Undo</div>
                        <div class="dropdown-item" onclick="notepadAction('redo')">Redo</div>
                        <hr><div class="dropdown-item" onclick="document.execCommand('cut')">Cut</div>
                        <div class="dropdown-item" onclick="document.execCommand('copy')">Copy</div>
                        <div class="dropdown-item" onclick="document.execCommand('paste')">Paste</div>
                        <div class="dropdown-item" onclick="notepadAction('select-all')">Select All</div>
                        <hr><div class="dropdown-item" onclick="notepadAction('find')">Find / Replace...</div>
                        <div class="dropdown-item" onclick="notepadAction('time-date')">Time/Date</div>
                    </div>
                </div>
                <div class="menu-item">Format
                    <div class="dropdown-content">
                        <div class="dropdown-item" onclick="notepadAction('word-wrap')"><span id="word-wrap-check">✓</span> Word Wrap</div>
                        <div class="dropdown-item" onclick="notepadAction('toggle-bold')">Bold</div>
                        <div class="dropdown-item" onclick="notepadAction('toggle-italic')">Italic</div>
                        <div class="dropdown-item" onclick="notepadAction('toggle-underline')">Underline</div>
                    </div>
                </div>
                <div class="menu-item">View<div class="dropdown-content"><div class="dropdown-item" onclick="notepadAction('status-bar')">Status Bar</div></div></div>
            </div>
            <div class="notepad-toolbar">
                <select id="notepad-font" onchange="setNotepadStyle('fontFamily',this.value)" title="Font"><option>Courier New</option><option>Arial</option><option>Tahoma</option><option>Times New Roman</option><option>Verdana</option></select>
                <select id="notepad-size" onchange="setNotepadStyle('fontSize',this.value+'px')" title="Font size"><option>10</option><option>12</option><option selected>14</option><option>16</option><option>18</option><option>24</option><option>32</option></select>
                <button onclick="notepadAction('toggle-bold')" title="Bold"><b>B</b></button><button onclick="notepadAction('toggle-italic')" title="Italic"><i>I</i></button><button onclick="notepadAction('toggle-underline')" title="Underline"><u>U</u></button>
                <button onclick="setNotepadStyle('textAlign','left')" title="Align left">⇤</button><button onclick="setNotepadStyle('textAlign','center')" title="Align centre">↔</button><button onclick="setNotepadStyle('textAlign','right')" title="Align right">⇥</button>
                <label class="notepad-color" title="Text colour">A<input type="color" value="#000000" onchange="setNotepadStyle('color',this.value)"></label>
            </div>
            <textarea class="notepad-textarea" id="notepad-text"></textarea>
            <div class="notepad-status" id="notepad-status"><span>Ln 1, Col 1</span><span>0 words</span><span>0 characters</span></div>
            <input id="notepad-file-input" type="file" accept=".txt,text/plain" hidden onchange="openNotepadFile(this)">
        </div>
    `;
}

let notepadState = { fileName: 'Untitled', isBold: false, isItalic:false, isUnderline:false, wordWrap:true, statusBar:true };

function notepadAction(type) {
    const textarea = document.getElementById('notepad-text');
    const win = document.getElementById('win-notepad');
    if (!textarea || !win) return;
    const titleSpan = win.querySelector('.window-header span:nth-child(2)');

    if (type === 'new') {
        textarea.value = '';
        notepadState.fileName = 'Untitled';
        titleSpan.textContent = 'Untitled - Notepad';
        updateNotepadStatus();
    } else if (type === 'open') {
        document.getElementById('notepad-file-input')?.click();
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
        textarea.style.fontWeight = notepadState.isBold ? 'bold' : 'normal';
    } else if (type === 'toggle-italic') {
        notepadState.isItalic=!notepadState.isItalic; textarea.style.fontStyle=notepadState.isItalic?'italic':'normal';
    } else if (type === 'toggle-underline') {
        notepadState.isUnderline=!notepadState.isUnderline; textarea.style.textDecoration=notepadState.isUnderline?'underline':'none';
    } else if (type === 'word-wrap') {
        notepadState.wordWrap=!notepadState.wordWrap; textarea.classList.toggle('no-wrap',!notepadState.wordWrap); document.getElementById('word-wrap-check').textContent=notepadState.wordWrap?'✓':'';
    } else if (type === 'status-bar') {
        notepadState.statusBar=!notepadState.statusBar; document.getElementById('notepad-status').style.display=notepadState.statusBar?'flex':'none';
    } else if (type === 'select-all') textarea.select();
    else if (type === 'undo') { textarea.focus(); document.execCommand('undo'); }
    else if (type === 'redo') { textarea.focus(); document.execCommand('redo'); }
    else if (type === 'time-date') { const start=textarea.selectionStart; textarea.setRangeText(new Date().toLocaleString(),start,textarea.selectionEnd,'end'); updateNotepadStatus(); }
    else if (type === 'find') showNotepadFind();
}

function setNotepadStyle(property,value){const textarea=document.getElementById('notepad-text');if(textarea){textarea.style[property]=value;localStorage.setItem('xp_notepad_style',JSON.stringify({fontFamily:textarea.style.fontFamily,fontSize:textarea.style.fontSize,color:textarea.style.color,textAlign:textarea.style.textAlign}))}}
function updateNotepadStatus(){const textarea=document.getElementById('notepad-text'),status=document.getElementById('notepad-status');if(!textarea||!status)return;const before=textarea.value.slice(0,textarea.selectionStart),lines=before.split('\n'),words=(textarea.value.trim().match(/\S+/g)||[]).length;status.innerHTML=`<span>Ln ${lines.length}, Col ${lines.at(-1).length+1}</span><span>${words} words</span><span>${textarea.value.length} characters</span>`}
function openNotepadFile(input){const file=input.files?.[0];if(!file)return;const reader=new FileReader();reader.onload=()=>{const textarea=document.getElementById('notepad-text');if(textarea)textarea.value=reader.result;notepadState.fileName=file.name.replace(/\.txt$/i,'');const title=document.querySelector('#win-notepad .window-header span:nth-child(2)');if(title)title.textContent=`${file.name} - Notepad`;updateNotepadStatus()};reader.readAsText(file);input.value=''}
function showNotepadFind(){const textarea=document.getElementById('notepad-text');if(!textarea)return;const find=prompt('Find what:');if(find===null||find==='')return;const replacement=prompt('Replace with (Cancel to only find):');if(replacement===null){const index=textarea.value.toLowerCase().indexOf(find.toLowerCase(),textarea.selectionEnd);if(index<0){alert(`Cannot find "${find}"`);return}textarea.focus();textarea.setSelectionRange(index,index+find.length)}else{const escaped=find.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');textarea.value=textarea.value.replace(new RegExp(escaped,'gi'),replacement);updateNotepadStatus()}}

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

function doSearchLegacy() {
    const fileTerm = document.getElementById('search-file')?.value.trim().toLowerCase() || '';
    const textTerm = document.getElementById('search-text')?.value.trim().toLowerCase() || '';
    const resultsPanel = document.getElementById('search-results');
    if (!resultsPanel) return;

    const localNames = [
        'Resume.txt', 'Ideas.txt', 'My Computer', 'My Documents', 'My Music', 'My Pictures',
        'Control Panel', 'Internet Explorer', 'Notepad', 'Calculator', 'Task Manager'
    ];

    const matches = localNames.filter(name => {
        const haystack = name.toLowerCase();
        return (!fileTerm || haystack.includes(fileTerm)) && (!textTerm || haystack.includes(textTerm));
    });

    if (!matches.length) {
        resultsPanel.innerHTML = '<div style="color: #666;">No results found.</div>';
        return;
    }

    resultsPanel.innerHTML = matches.map(item => `
        <div style="padding: 6px 0; border-bottom: 1px solid #eee; cursor: pointer; color: #003399;" onclick="openSearchItem('${item}')">${item}</div>
    `).join('');
}

function openSearchItemLegacy(item) {
    const map = {
        'Notepad': 'notepad',
        'Calculator': 'calc',
        'Control Panel': 'control-panel',
        'Task Manager': 'task-manager',
        'My Computer': 'my-computer',
        'My Documents': 'my-documents',
        'My Music': 'my-music',
        'My Pictures': 'my-pictures',
        'Internet Explorer': 'ie'
    };
    if (map[item]) openApp(map[item]);
    else if (item.endsWith('.txt')) openTextFile(item, true);
}

function getSearchCatalog(){const items=[
    ['SkdSam CV','cv','document'],['SkdSam-CV.txt','cv','document'],['Resume.txt','text','document'],['Ideas.txt','text','document'],
    ['My Computer','my-computer','folder'],['My Documents','my-documents','folder'],['My Music','my-music','folder'],['My Pictures','my-pictures','folder'],['Recycle Bin','recycle-bin','folder'],
    ['Internet Explorer','ie','application'],['Notepad','notepad','application'],['WordPad','wordpad','application'],['Paint','paint','application'],['Calculator','calc','application'],['Command Prompt','cmd','application'],['Task Manager','task-manager','application'],['Control Panel','control-panel','application'],['Help and Support','help','application'],
    ['Lighthouse.jpg','Lighthouse.jpg','picture'],['Waterfall.jpg','Waterfall.jpg','picture'],['Field.jpg','Field.jpg','picture'],['SoundHelix-Song-1.mp3','SoundHelix-Song-1.mp3','music'],['SoundHelix-Song-2.mp3','SoundHelix-Song-2.mp3','music']
];for(let i=0;i<localStorage.length;i++){const key=localStorage.key(i);if(key?.startsWith('xp_file_'))items.push([key.slice(8)+'.txt',key.slice(8),'local-text'])}return items}
function doSearch(){const fileTerm=document.getElementById('search-file')?.value.trim().toLowerCase()||'',textTerm=document.getElementById('search-text')?.value.trim().toLowerCase()||'',panel=document.getElementById('search-results');if(!panel)return;const matches=getSearchCatalog().filter(([name,id,type])=>{const content=type==='local-text'?(localStorage.getItem(`xp_file_${id}`)||''):'';return(!fileTerm||name.toLowerCase().includes(fileTerm))&&(!textTerm||name.toLowerCase().includes(textTerm)||content.toLowerCase().includes(textTerm))});panel.innerHTML=`<div class="search-heading">Search Results <span>${matches.length} item${matches.length===1?'':'s'} found</span></div>`+(matches.length?matches.map(([name,id,type])=>`<button class="search-result" onclick="openSearchResult('${encodeURIComponent(id)}','${type}')"><span>${searchTypeIcon(type)}</span><span><b>${escapeHtml(name)}</b><small>${type.replace('-',' ')}</small></span></button>`).join(''):'<div class="search-empty">No files or folders matched your search.</div>')}
function searchTypeIcon(type){return({application:'⚙️',folder:'📁',document:'📄',picture:'🖼️',music:'🎵','local-text':'📄'})[type]||'📄'}
function openSearchResult(encoded,type){const id=decodeURIComponent(encoded);if(type==='picture')openImage(id);else if(type==='music')playMusic(id);else if(type==='text')openTextFile(id,true);else if(type==='local-text')openTextFile(id,false);else openApp(id)}

function createHelpContent(){return `<div class="help-center"><header><div><h2>Help and Support Center</h2><p>Learn about Windows XP and get assistance.</p></div><div class="help-search"><input id="help-query" placeholder="Type a question" onkeydown="if(event.key==='Enter')searchHelp()"><button onclick="searchHelp()">➜</button></div></header><main><section><h3>Pick a Help topic</h3><button onclick="showHelpTopic('desktop')"><b>🖥️ Customizing your computer</b><span>Change wallpaper, themes and desktop settings.</span></button><button onclick="showHelpTopic('files')"><b>📁 Files and folders</b><span>Create, find, open and recycle documents.</span></button><button onclick="showHelpTopic('internet')"><b>🌐 Networking and the Web</b><span>Browse websites and check your connection.</span></button><button onclick="showHelpTopic('programs')"><b>⚙️ Using Windows programs</b><span>Learn about Notepad, Paint, WordPad and more.</span></button></section><aside id="help-details"><h3>Did you know?</h3><p>Press <b>Ctrl+R</b> to open Run, or right-click the desktop to change its appearance.</p><h3>Popular tasks</h3><a onclick="openApp('search')">Search for files</a><a onclick="showProperties()">Change the desktop background</a><a onclick="openApp('control-panel')">Open Control Panel</a></aside></main></div>`}
const helpTopics={desktop:['Customizing your computer','Right-click an empty area of the desktop and choose Appearance or Properties. You can select an XP wallpaper, upload your own picture, choose Stretch, Center, Tile or Fill, and change the Luna colour scheme.'],files:['Files and folders','Open My Documents from Start. Double-click files to open them, drag user-created text files to Recycle Bin, and use Search to find programs, documents, pictures and music.'],internet:['Networking and the Web','Open Internet Explorer, type an address and press Enter. Some modern websites block iframe viewing; use Open in new window when that happens.'],programs:['Using Windows programs','Start includes Notepad, WordPad, Paint, Calculator, Minesweeper and Command Prompt. You can also launch them by name from Run.']};
function showHelpTopic(id){const target=document.getElementById('help-details'),topic=helpTopics[id];if(target&&topic)target.innerHTML=`<h3>${topic[0]}</h3><p>${topic[1]}</p><button onclick="this.parentElement.innerHTML='<h3>Did you know?</h3><p>Use the Start menu to explore this Windows XP clone.</p>'">Back</button>`}
function searchHelp(){const query=document.getElementById('help-query')?.value.toLowerCase()||'';const match=Object.entries(helpTopics).find(([,v])=>v.join(' ').toLowerCase().includes(query));if(match)showHelpTopic(match[0]);else{const target=document.getElementById('help-details');if(target)target.innerHTML=`<h3>Search Results</h3><p>No help topics matched “${escapeHtml(query)}”. Try wallpaper, files, internet or programs.</p>`}}

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

function createTaskManagerContent() {
    const appCount = document.querySelectorAll('.taskbar-tab').length;
    return `
        <div style="display: flex; flex-direction: column; height: 100%; background: #ece9d8; font-family: Tahoma; font-size: 11px; padding: 12px;">
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-bottom: 15px;">
                <div style="background: #fff; border: 1px solid #aca899; padding: 10px; text-align: center;">
                    <div style="color: #666;">CPU</div>
                    <div style="font-size: 18px; font-weight: bold; color: #003399;">24%</div>
                </div>
                <div style="background: #fff; border: 1px solid #aca899; padding: 10px; text-align: center;">
                    <div style="color: #666;">Memory</div>
                    <div style="font-size: 18px; font-weight: bold; color: #003399;">41%</div>
                </div>
                <div style="background: #fff; border: 1px solid #aca899; padding: 10px; text-align: center;">
                    <div style="color: #666;">Processes</div>
                    <div style="font-size: 18px; font-weight: bold; color: #003399;">${appCount}</div>
                </div>
            </div>
            <div style="background: #fff; border: 1px solid #aca899; flex: 1; padding: 8px; overflow: auto;">
                <div style="display: flex; justify-content: space-between; padding: 6px 4px; border-bottom: 1px solid #ccc; font-weight: bold;">
                    <span>Image Name</span>
                    <span>CPU</span>
                </div>
                ${Array.from(document.querySelectorAll('.taskbar-tab')).map(tab => {
                    const title = tab.textContent.trim();
                    return `<div style="display: flex; justify-content: space-between; padding: 6px 4px; border-bottom: 1px solid #eee;"><span>${title}</span><span>4%</span></div>`;
                }).join('') || '<div style="padding: 10px; color: #666;">No active apps.</div>'}
            </div>
        </div>
    `;
}

function createControlPanelContent() {
    return `
        <div style="padding: 18px; font-family: Tahoma; font-size: 11px; background: #edf4ff; height: 100%; overflow: auto;">
            <h3 style="margin-bottom: 15px; color: #003399;">Classic Control Panel</h3>
            <div style="display: grid; grid-template-columns: repeat(2, minmax(220px, 1fr)); gap: 14px;">
                <div class="panel-card" style="background: white; border: 1px solid #aca899; padding: 12px;">
                    <strong>Appearance</strong>
                    <div style="margin-top: 10px;">
                        <label><input type="radio" name="theme" value="classic" checked onchange="switchTheme('classic')"> Classic Blue</label><br>
                        <label><input type="radio" name="theme" value="royale" onchange="switchTheme('royale')"> Royale</label><br>
                        <label><input type="radio" name="theme" value="graphite" onchange="switchTheme('graphite')"> Graphite</label>
                    </div>
                </div>
                <div class="panel-card" style="background: white; border: 1px solid #aca899; padding: 12px;">
                    <strong>Desktop</strong>
                    <div style="margin-top: 10px;">
                        <label><input type="radio" name="wallpaper" value="bliss" checked onchange="switchWallpaper('bliss')"> Bliss</label><br>
                        <label><input type="radio" name="wallpaper" value="blue" onchange="switchWallpaper('blue')"> Blue</label><br>
                        <label><input type="radio" name="wallpaper" value="dusk" onchange="switchWallpaper('dusk')"> Dusk</label>
                    </div>
                </div>
                <div class="panel-card" style="background: white; border: 1px solid #aca899; padding: 12px;">
                    <strong>System Settings</strong>
                    <div style="margin-top: 8px;">
                        <label><input type="checkbox" checked> Enable startup sound</label><br>
                        <label><input type="checkbox" checked> Show hidden files</label><br>
                        <label><input type="checkbox" checked> Auto arrange icons</label>
                    </div>
                </div>
                <div class="panel-card" style="background: white; border: 1px solid #aca899; padding: 12px;">
                    <strong>Quick Actions</strong>
                    <div style="margin-top: 10px; display: flex; flex-direction: column; gap: 8px;">
                        <button onclick="openApp('task-manager')">Open Task Manager</button>
                        <button onclick="openApp('notepad')">Open Notepad</button>
                        <button onclick="showShutdownDialog('shutdown')">Turn off computer</button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function switchTheme(name) {
    config.theme = name;
    applyTheme();
}

function switchWallpaper(name) {
    config.wallpaper = name;
    applyTheme();
}

function playMusicLegacy(fileName) {
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

function createMediaPlayerLegacyContent(fileName) {
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

const mediaState={tracks:[],index:-1,shuffle:false,repeat:false,objectUrls:[]};
function playMusic(fileName){openApp('media-player');requestAnimationFrame(()=>{const existing=mediaState.tracks.findIndex(t=>t.name===fileName);if(existing<0)mediaState.tracks.push({name:fileName,url:`assets/music/${fileName}`,source:'My Music'});renderMediaPlaylist();playMediaTrack(existing<0?mediaState.tracks.length-1:existing)})}
function createMediaPlayerContent(){return `<div class="media-player xp-wmp">
    <div class="wmp-top"><b>Windows Media Player</b><span>Now Playing</span><span>Media Library</span><button onclick="document.getElementById('music-folder-input').click()">📁 Add Music Folder</button><input id="music-folder-input" type="file" accept="audio/*" webkitdirectory directory multiple hidden onchange="loadMusicFolder(this.files)"></div>
    <div class="wmp-body"><div class="wmp-now"><div class="player-viz" id="player-viz">${Array(26).fill('<div class="viz-bar" style="height:10px"></div>').join('')}</div><div class="wmp-track-title" id="wmp-track-title">Select a music folder or choose a song</div></div>
    <div class="wmp-library"><div class="wmp-library-head">Playlist <span id="wmp-count">0 items</span></div><div id="wmp-playlist" class="wmp-playlist"><div class="wmp-empty">Click “Add Music Folder” to load MP3, WAV, OGG, M4A, AAC or FLAC files from your computer.</div></div></div></div>
    <div class="wmp-seek"><span id="wmp-current">0:00</span><input id="wmp-progress" type="range" min="0" max="100" value="0" oninput="seekMedia(this.value)"><span id="wmp-duration">0:00</span></div>
    <div class="player-controls"><audio id="mplayer-audio"></audio><button class="player-btn" onclick="previousMedia()" title="Previous">⏮</button><button class="player-btn main" id="wmp-play" onclick="toggleMedia()" title="Play or pause">▶</button><button class="player-btn" onclick="nextMedia()" title="Next">⏭</button><button class="wmp-mode" id="wmp-shuffle" onclick="toggleMediaMode('shuffle')">Shuffle</button><button class="wmp-mode" id="wmp-repeat" onclick="toggleMediaMode('repeat')">Repeat</button><div class="player-info" id="wmp-info">Ready</div><span>🔊</span><input class="wmp-volume" type="range" min="0" max="1" step="0.01" value="0.8" oninput="setMediaVolume(this.value)"></div></div>`}
function initMediaPlayer(){const audio=document.getElementById('mplayer-audio');if(!audio)return;audio.volume=.8;audio.addEventListener('timeupdate',updateMediaProgress);audio.addEventListener('loadedmetadata',updateMediaProgress);audio.addEventListener('play',()=>{const b=document.getElementById('wmp-play');if(b)b.textContent='⏸'});audio.addEventListener('pause',()=>{const b=document.getElementById('wmp-play');if(b)b.textContent='▶'});audio.addEventListener('ended',()=>mediaState.repeat?playMediaTrack(mediaState.index):nextMedia());renderMediaPlaylist()}
function loadMusicFolder(files){const supported=/\.(mp3|wav|ogg|m4a|aac|flac|opus)$/i;mediaState.objectUrls.forEach(URL.revokeObjectURL);mediaState.objectUrls=[];mediaState.tracks=Array.from(files).filter(f=>f.type.startsWith('audio/')||supported.test(f.name)).sort((a,b)=>a.name.localeCompare(b.name)).map(file=>{const url=URL.createObjectURL(file);mediaState.objectUrls.push(url);return{name:file.name,url,source:file.webkitRelativePath?.split('/')[0]||'Selected folder'}});mediaState.index=-1;renderMediaPlaylist();if(mediaState.tracks.length)playMediaTrack(0);else showBubble('Windows Media Player','No supported audio files were found in that folder.')}
function renderMediaPlaylist(){const list=document.getElementById('wmp-playlist'),count=document.getElementById('wmp-count');if(count)count.textContent=`${mediaState.tracks.length} item${mediaState.tracks.length===1?'':'s'}`;if(!list)return;list.innerHTML=mediaState.tracks.length?mediaState.tracks.map((t,i)=>`<button class="wmp-track ${i===mediaState.index?'active':''}" onclick="playMediaTrack(${i})"><span>${i===mediaState.index?'▶':'♫'}</span><span><b>${escapeHtml(t.name)}</b><small>${escapeHtml(t.source)}</small></span></button>`).join(''):'<div class="wmp-empty">Click “Add Music Folder” to load music from your computer.</div>'}
function playMediaTrack(index){const audio=document.getElementById('mplayer-audio');if(!audio||!mediaState.tracks[index])return;mediaState.index=index;audio.src=mediaState.tracks[index].url;audio.play().catch(()=>{});const title=document.getElementById('wmp-track-title'),info=document.getElementById('wmp-info');if(title)title.textContent=mediaState.tracks[index].name;if(info)info.textContent=mediaState.tracks[index].name;renderMediaPlaylist()}
function toggleMedia(){const audio=document.getElementById('mplayer-audio');if(!audio)return;if(!audio.src&&mediaState.tracks.length)playMediaTrack(0);else audio.paused?audio.play():audio.pause()}
function nextMedia(){if(!mediaState.tracks.length)return;const next=mediaState.shuffle?Math.floor(Math.random()*mediaState.tracks.length):(mediaState.index+1)%mediaState.tracks.length;playMediaTrack(next)}
function previousMedia(){if(!mediaState.tracks.length)return;playMediaTrack((mediaState.index-1+mediaState.tracks.length)%mediaState.tracks.length)}
function toggleMediaMode(mode){mediaState[mode]=!mediaState[mode];document.getElementById(`wmp-${mode}`)?.classList.toggle('active',mediaState[mode])}
function seekMedia(value){const audio=document.getElementById('mplayer-audio');if(audio&&Number.isFinite(audio.duration))audio.currentTime=audio.duration*(value/100)}
function setMediaVolume(value){const audio=document.getElementById('mplayer-audio');if(audio)audio.volume=Number(value)}
function formatMediaTime(value){if(!Number.isFinite(value))return'0:00';return`${Math.floor(value/60)}:${String(Math.floor(value%60)).padStart(2,'0')}`}
function updateMediaProgress(){const audio=document.getElementById('mplayer-audio'),range=document.getElementById('wmp-progress');if(!audio)return;if(range)range.value=audio.duration?audio.currentTime/audio.duration*100:0;const current=document.getElementById('wmp-current'),duration=document.getElementById('wmp-duration');if(current)current.textContent=formatMediaTime(audio.currentTime);if(duration)duration.textContent=formatMediaTime(audio.duration)}

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

function createIELegacyContent() {
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

function navigateIELegacy(action) {
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

function createIEContent() {
    return `<div class="ie-container">
        <div class="ie-toolbar">
            <div class="ie-btn" onclick="navigateIE('back')"><span>◀</span><span>Back</span></div>
            <div class="ie-btn" onclick="navigateIE('forward')"><span>▶</span><span>Forward</span></div>
            <div class="ie-btn" onclick="navigateIE('stop')"><span>✕</span><span>Stop</span></div>
            <div class="ie-btn" onclick="navigateIE('refresh')"><span>↻</span><span>Refresh</span></div>
            <div class="ie-btn" onclick="navigateIE('home')"><span>⌂</span><span>Home</span></div>
            <div style="width:1px;height:30px;background:#aca899;margin:0 5px"></div>
            <div class="ie-btn" onclick="openApp('search')"><span>⌕</span><span>Search</span></div>
        </div>
        <div class="ie-address-bar"><span style="font-size:11px">Address</span>
            <input type="text" id="ie-address" value="https://design-demo.co.uk" onkeypress="if(event.key==='Enter') navigateIE('go')">
            <div class="ie-btn" onclick="navigateIE('go')" style="flex-direction:row;height:22px;padding:0 10px"><span>➜</span><span>Go</span></div>
        </div>
        <div class="ie-embed-note">Some websites prevent iframe display for security. Use “Open in new window” if a page stays blank or reports an error.</div>
        <div class="ie-content" id="ie-frame">${getMockSite('msn')}</div>
        <div class="ie-status"><span id="ie-status-text">Done</span><button class="ie-external" onclick="openIEExternal()">Open in new window</button></div>
    </div>`;
}

const ieHistory=[];
let ieHistoryIndex=-1;
function navigateIE(action) {
    const live=document.getElementById('ie-live-frame');
    if(action==='stop'){if(live)live.src='about:blank';setIEStatus('Stopped');return}
    if(action==='back'){historyIE(-1);return}
    if(action==='forward'){historyIE(1);return}
    if(action==='home'){const frame=document.getElementById('ie-frame'),input=document.getElementById('ie-address');if(frame)frame.innerHTML=getMockSite('msn');if(input)input.value='http://www.msn.com';setIEStatus('Done');return}
    if(action==='refresh'&&live){live.src=live.src;setIEStatus('Refreshing...');return}
    if(action==='go')loadIEUrl(document.getElementById('ie-address')?.value||'',true);
}
function normaliseIEUrl(url){url=url.trim();if(!url)return'';if(!/^[a-z][a-z0-9+.-]*:/i.test(url))url='https://'+url;try{const parsed=new URL(url);return ['http:','https:'].includes(parsed.protocol)?parsed.href:''}catch{return''}}
function loadIEUrl(raw,record){const url=normaliseIEUrl(raw),frame=document.getElementById('ie-frame'),input=document.getElementById('ie-address');if(!frame||!input)return;if(!url){setIEStatus('Invalid address');return}input.value=url;setIEStatus(`Opening ${url}...`);frame.innerHTML=`<iframe id="ie-live-frame" class="ie-frame-live" src="${escapeHtml(url)}" title="Web page" referrerpolicy="no-referrer" onload="setIEStatus('Done')"></iframe>`;if(record){ieHistory.splice(ieHistoryIndex+1);ieHistory.push(url);ieHistoryIndex=ieHistory.length-1}const title=document.querySelector('#win-ie .window-header span:nth-child(2)');if(title)title.textContent=`${new URL(url).hostname} - Microsoft Internet Explorer`}
function historyIE(step){const next=ieHistoryIndex+step;if(next<0||next>=ieHistory.length){setIEStatus('No more history');return}ieHistoryIndex=next;loadIEUrl(ieHistory[next],false)}
function setIEStatus(value){const el=document.getElementById('ie-status-text');if(el)el.textContent=value}
function openIEExternal(){const url=normaliseIEUrl(document.getElementById('ie-address')?.value||'');if(url)window.open(url,'_blank','noopener')}
function escapeHtml(value){return String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]))}

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

// Desktop selection and familiar keyboard behavior.
function initDesktopExperience() {
    const desktop = document.getElementById('desktop');
    const box = document.getElementById('selection-box');
    let origin = null;

    desktop.addEventListener('mousedown', e => {
        if (e.button !== 0 || e.target !== desktop) return;
        document.querySelectorAll('.icon.selected').forEach(i => i.classList.remove('selected'));
        origin = { x:e.clientX, y:e.clientY };
        Object.assign(box.style, { display:'block', left:`${origin.x}px`, top:`${origin.y}px`, width:'0', height:'0' });
    });
    document.addEventListener('mousemove', e => {
        if (!origin) return;
        const left=Math.min(origin.x,e.clientX), top=Math.min(origin.y,e.clientY);
        Object.assign(box.style,{left:`${left}px`,top:`${top}px`,width:`${Math.abs(e.clientX-origin.x)}px`,height:`${Math.abs(e.clientY-origin.y)}px`});
        const selection=box.getBoundingClientRect();
        document.querySelectorAll('.icon').forEach(icon => {
            const r=icon.getBoundingClientRect();
            icon.classList.toggle('selected', !(r.right<selection.left || r.left>selection.right || r.bottom<selection.top || r.top>selection.bottom));
        });
    });
    document.addEventListener('mouseup', () => { if(origin){ origin=null; box.style.display='none'; } });
    document.querySelectorAll('.icon').forEach(icon => icon.addEventListener('mousedown', e => {
        if (!e.ctrlKey) document.querySelectorAll('.icon.selected').forEach(i => i.classList.remove('selected'));
        icon.classList.add('selected');
    }));
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') { document.getElementById('start-menu')?.classList.add('hidden'); document.getElementById('context-menu').style.display='none'; }
        if (e.key === 'Delete' && !['INPUT','TEXTAREA'].includes(document.activeElement.tagName)) {
            document.querySelectorAll('.icon.selected[id^="icon-file-"]').forEach(icon => {
                const name=icon.id.replace('icon-file-','');
                if (!config.recycleBin.includes(name)) config.recycleBin.push(name);
                icon.style.display='none'; icon.classList.remove('selected');
            });
            saveRecycleBin();
        }
        if (e.ctrlKey && e.key.toLowerCase()==='r' && !['INPUT','TEXTAREA'].includes(document.activeElement.tagName)) { e.preventDefault(); openApp('run'); }
    });
}

function createPaintContent() {
    const colors=['#000000','#808080','#800000','#ff0000','#808000','#ffff00','#008000','#00ff00','#008080','#00ffff','#000080','#0000ff','#800080','#ff00ff','#ffffff'];
    return `<div class="paint-shell"><div class="paint-menu">File Edit View Image Colors Help</div>
        <div class="paint-toolbar"><button class="paint-tool active" title="Pencil">✎</button><label>Size <input id="paint-size" type="range" min="1" max="30" value="4"></label><button class="paint-tool" onclick="clearPaint()">Clear</button><button class="paint-tool" onclick="savePaint()">Save PNG</button></div>
        <div class="paint-canvas-wrap"><canvas id="paint-canvas" width="900" height="560"></canvas></div>
        <div class="paint-palette">${colors.map((c,i)=>`<button class="paint-swatch ${i===0?'active':''}" style="background:${c}" data-color="${c}" aria-label="${c}"></button>`).join('')}</div></div>`;
}

function initPaint() {
    const canvas=document.getElementById('paint-canvas'); if(!canvas) return;
    const ctx=canvas.getContext('2d'); ctx.fillStyle='#ffffff';ctx.fillRect(0,0,canvas.width,canvas.height);ctx.lineCap='round'; ctx.lineJoin='round';
    let drawing=false, color='#000000';
    const point=e=>{const r=canvas.getBoundingClientRect();return{x:(e.clientX-r.left)*canvas.width/r.width,y:(e.clientY-r.top)*canvas.height/r.height}};
    canvas.addEventListener('pointerdown',e=>{drawing=true;const p=point(e);ctx.beginPath();ctx.moveTo(p.x,p.y);canvas.setPointerCapture(e.pointerId)});
    canvas.addEventListener('pointermove',e=>{if(!drawing)return;const p=point(e);ctx.strokeStyle=color;ctx.lineWidth=+document.getElementById('paint-size').value;ctx.lineTo(p.x,p.y);ctx.stroke()});
    canvas.addEventListener('pointerup',()=>drawing=false); canvas.addEventListener('pointercancel',()=>drawing=false);
    document.querySelectorAll('.paint-swatch').forEach(s=>s.addEventListener('click',()=>{color=s.dataset.color;document.querySelectorAll('.paint-swatch').forEach(x=>x.classList.remove('active'));s.classList.add('active')}));
}
function clearPaint(){const c=document.getElementById('paint-canvas');if(c){const x=c.getContext('2d');x.fillStyle='#fff';x.fillRect(0,0,c.width,c.height)}}
function savePaint(){const c=document.getElementById('paint-canvas');if(!c)return;const a=document.createElement('a');a.download='untitled.png';a.href=c.toDataURL('image/png');a.click()}

function createCvContent() {
    return `<div class="cv-document">
        <div class="cv-toolbar"><button onclick="window.print()">Print</button> <button onclick="downloadCv()">Download TXT</button></div>
        <div class="cv-page-wrap"><article class="cv-page">
            <h1>SkdSam</h1><p><b>Creative Developer · Blender Add-on Developer · Digital Product Designer</b></p>
            <div class="cv-links">
                <a href="https://design-demo.co.uk" target="_blank" rel="noopener">Portfolio Website</a>
                <a href="https://superhivemarket.com/creators/skdsam" target="_blank" rel="noopener">Superhive Store</a>
                <a href="https://github.com/skdsam" target="_blank" rel="noopener">GitHub</a>
            </div>
            <h2>Profile</h2>
            <p>Independent developer and digital creator building useful tools, interactive web experiences, Blender add-ons, creative applications and audio software. Focused on turning complex workflows into approachable, well-designed products.</p>
            <h2>Selected Projects</h2>
            <h3><a href="https://colorstacker.com" target="_blank" rel="noopener">ColorStacker</a></h3>
            <p>A web-based colour workflow and creative utility.</p>
            <h3><a href="https://design-demo.co.uk" target="_blank" rel="noopener">Design Demo</a></h3>
            <p>Portfolio and distribution site for applications, experiments and Blender tools.</p>
            <h3><a href="https://design-demo.co.uk/serpens.html" target="_blank" rel="noopener">Serpens</a></h3>
            <p>A drag-and-drop Blender development workflow with add-on repository integration.</p>
            <h3><a href="https://superhivemarket.com/creators/skdsam" target="_blank" rel="noopener">Blender Add-ons</a></h3>
            <p>Creator of workflow, animation, node, scene and productivity tools including Rescene, Node Mapper, Node Template Manager, Docker, Chromalight, Stack Motion, Isometric Room Generator, Key Capture, Collection Compactor, GIF Maker, Maze Maker, Text Editor Theme and Todo.</p>
            <h3>VST &amp; Audio Applications</h3>
            <p>Development and design of VST instruments, effects and creative audio tools.</p>
            <h2>Core Skills</h2>
            <div><span class="cv-tag">Blender</span><span class="cv-tag">Python</span><span class="cv-tag">JavaScript</span><span class="cv-tag">HTML &amp; CSS</span><span class="cv-tag">UI/UX</span><span class="cv-tag">VST &amp; Audio</span><span class="cv-tag">Procedural Tools</span><span class="cv-tag">Product Design</span></div>
        </article></div></div>`;
}

function downloadCv() {
    const link=document.createElement('a');
    link.href='assets/docs/SkdSam-CV.txt'; link.download='SkdSam-CV.txt'; link.click();
}

function createCommandPromptContent() {
    return `<div class="cmd-shell" id="cmd-shell" onclick="document.getElementById('cmd-input')?.focus()">
        <div class="cmd-output" id="cmd-output">Microsoft Windows XP [Version 5.1.2600]\n(C) Copyright 1985-2001 Microsoft Corp.\n\n</div>
        <div class="cmd-line" id="cmd-line"><span>C:\\Documents and Settings\\SkdSam&gt;&nbsp;</span><input id="cmd-input" class="cmd-input" autocomplete="off" spellcheck="false" onkeydown="if(event.key==='Enter')runCommand(this.value)"></div>
    </div>`;
}

function runCommand(raw) {
    const input=document.getElementById('cmd-input'),output=document.getElementById('cmd-output'),shell=document.getElementById('cmd-shell');
    if(!input||!output)return;
    const command=raw.trim(), parts=command.split(/\s+/), name=(parts.shift()||'').toLowerCase(), arg=parts.join(' ');
    output.innerHTML+=`C:\\Documents and Settings\\SkdSam&gt;${escapeHtml(command)}\n`;
    let result='';
    if(!name)result='';
    else if(name==='help')result='Supported commands: HELP, DIR, CLS, DATE, TIME, VER, ECHO, WHOAMI, START, NOTEPAD, WORDPAD, MSPAINT, CALC, EXPLORER, EXIT';
    else if(name==='dir')result=' Volume in drive C has no label.\n Directory of C:\\Documents and Settings\\SkdSam\n\n08/08/2026  12:00    &lt;DIR&gt;          My Documents\n08/08/2026  12:00    &lt;DIR&gt;          My Pictures\n08/08/2026  12:00    &lt;DIR&gt;          Desktop\n               1 File(s)      SkdSam-CV.txt';
    else if(name==='cls'){output.innerHTML='';input.value='';return}
    else if(name==='date')result=new Date().toLocaleDateString();
    else if(name==='time')result=new Date().toLocaleTimeString();
    else if(name==='ver')result='Microsoft Windows XP [Version 5.1.2600]';
    else if(name==='whoami')result='SKDSAM-XP\\SkdSam';
    else if(name==='echo')result=escapeHtml(arg);
    else if(name==='exit'){closeWindow('win-cmd');return}
    else if(['notepad','wordpad','write','mspaint','paint','calc','explorer','iexplore'].includes(name)){const apps={notepad:'notepad',wordpad:'wordpad',write:'wordpad',mspaint:'paint',paint:'paint',calc:'calc',explorer:'my-computer',iexplore:'ie'};openApp(apps[name]);result=''}
    else if(name==='start'&&arg){if(/^https?:\/\//i.test(arg))window.open(arg,'_blank','noopener');else openApp(({cmd:'cmd',notepad:'notepad',wordpad:'wordpad',paint:'paint',calc:'calc',explorer:'my-computer'})[arg.toLowerCase()]||arg.toLowerCase())}
    else result=`'${escapeHtml(name)}' is not recognized as an internal or external command,\noperable program or batch file.`;
    output.innerHTML+=result+(result?'\n\n':'');input.value='';shell.scrollTop=shell.scrollHeight;
}

function createWordPadContent() {
    return `<div class="wordpad-shell"><div class="wordpad-menu">File Edit View Insert Format Help</div>
        <div class="wordpad-tools">
            <button onclick="wordPadFormat('bold')" title="Bold"><b>B</b></button><button onclick="wordPadFormat('italic')" title="Italic"><i>I</i></button><button onclick="wordPadFormat('underline')" title="Underline"><u>U</u></button>
            <button onclick="wordPadFormat('justifyLeft')">⇤</button><button onclick="wordPadFormat('justifyCenter')">↔</button><button onclick="wordPadFormat('insertUnorderedList')">• List</button>
            <select onchange="wordPadFormat('fontName',this.value)"><option>Arial</option><option>Times New Roman</option><option>Courier New</option></select>
            <button onclick="downloadWordPad()">Save TXT</button>
        </div><div class="wordpad-page-wrap"><div id="wordpad-editor" class="wordpad-page" contenteditable="true"><h1>Welcome to WordPad</h1><p>Start typing your document here.</p></div></div></div>`;
}
function wordPadFormat(command,value=null){document.getElementById('wordpad-editor')?.focus();document.execCommand(command,false,value)}
function downloadWordPad(){const text=document.getElementById('wordpad-editor')?.innerText||'';const url=URL.createObjectURL(new Blob([text],{type:'text/plain'}));const link=document.createElement('a');link.href=url;link.download='Document.txt';link.click();setTimeout(()=>URL.revokeObjectURL(url),1000)}
