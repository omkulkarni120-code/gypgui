const CONFIG = {
    PIN_CODE: "1234",
    INSTAGRAM_LINK: "https://www.instagram.com/deer.2957301?igsh=MTBiNWN1cHU4MDlweg==",
    LINKTREE_LINK: "https://linktr.ee/fake_marcus_vanguard_links",
    LINKEDIN_LINK: "https://linkedin.com/in/fake-marcus-vanguard",
    TWITTER_LINK: "https://twitter.com/fake_NightOwl_Sec"
};

const terminal = document.getElementById('terminal');
const output = document.getElementById('output');
const input = document.getElementById('command-input');
const overlay = document.getElementById('captcha-overlay');
const captchaContent = document.getElementById('captcha-content');

let state = {
    stage: 0,
    failures: 0,
    isTyping: false
};

function addLine(text, className = 'director', typingEffect = true) {
    return new Promise(resolve => {
        const line = document.createElement('div');
        line.className = `line ${className}`;
        output.appendChild(line);
        terminal.scrollTop = terminal.scrollHeight;

        if (typingEffect) {
            let i = 0;
            state.isTyping = true;
            input.disabled = true;

            // Allow HTML tags to bypass typing effect (e.g., links)
            if (text.includes('<a ')) {
                line.innerHTML = text;
                state.isTyping = false;
                input.disabled = false;
                input.focus();
                terminal.scrollTop = terminal.scrollHeight;
                resolve();
                return;
            }

            const interval = setInterval(() => {
                line.innerHTML += text.charAt(i);
                i++;
                terminal.scrollTop = terminal.scrollHeight;
                if (i >= text.length) {
                    clearInterval(interval);
                    state.isTyping = false;
                    input.disabled = false;
                    input.focus();
                    resolve();
                }
            }, 15);
        } else {
            line.innerHTML = text;
            terminal.scrollTop = terminal.scrollHeight;
            resolve();
        }
    });
}

async function addLines(linesData) {
    for (let data of linesData) {
        await addLine(data.text, data.class || 'director');
        await new Promise(r => setTimeout(r, 200));
    }
}

function processCommand(cmd) {
    if (state.isTyping) return;
    const action = cmd.toLowerCase().trim();
    if (!action) return;

    addLine(`> ${cmd}`, 'player', false);

    switch (state.stage) {
        case 0: handleStage0(action); break;
        case 1: handleStage1(action); break;
        case 2: handleStage2(action); break;
        case 3: handleStage3(action); break;
        case 4: handleStage4(action); break;
        case 5: handleStage5(action); break;
        case 6: handleStage6(action); break;
        case 7: handleStage7(action); break;
        case 8: handleStage8(action); break;
        case 9:
            addLine("Mission Accomplished. Refresh to restart.", "system", false);
            break;
    }
}

// ----------------------------------------------------
// Captcha Overlays (Casual Mini-Games)
// ----------------------------------------------------

function showCaptcha(htmlContent) {
    captchaContent.innerHTML = htmlContent;
    overlay.classList.remove('hidden');
    input.disabled = true;
}

function hideCaptcha() {
    overlay.classList.add('hidden');
    captchaContent.innerHTML = '';
    input.disabled = false;
    input.focus();
}

function startCaptcha1(onSuccess) {
    let clicks = 0;
    const targetClicks = 150;

    let html = `
        <div style="margin-bottom:10px;">DDoS Attack: Click to overload the firewall. <br>Load: <span id="c1-load">0</span>%</div>
        <div class="ddos-container" id="c1-container">
            <div class="ddos-btn" id="c1-btn">OVERLOAD</div>
        </div>
    `;
    showCaptcha(html);

    const container = document.getElementById('c1-container');
    const btn = document.getElementById('c1-btn');
    const loadSpan = document.getElementById('c1-load');

    let moveInterval = setInterval(() => {
        btn.style.left = 20 + Math.random() * 60 + '%';
        btn.style.top = 20 + Math.random() * 60 + '%';
    }, 2000);

    let boostInterval = setInterval(() => {
        if (Math.random() < 0.4) {
            const boost = document.createElement('div');
            boost.className = 'ddos-boost';
            boost.innerText = 'BOTNET\n+10';
            boost.style.left = Math.random() * 80 + '%';
            boost.style.top = Math.random() * 80 + '%';
            boost.onclick = () => {
                clicks += 10;
                boost.remove();
                updateLoad();
            };
            container.appendChild(boost);
            setTimeout(() => { if (boost.parentElement) boost.remove() }, 1500);
        }
    }, 1000);

    let gameActive = true;

    function updateLoad() {
        const percent = Math.min(100, Math.floor((clicks / targetClicks) * 100));
        loadSpan.innerText = percent;
        if (clicks >= targetClicks && gameActive) {
            gameActive = false;
            clearInterval(moveInterval);
            clearInterval(boostInterval);
            setTimeout(() => { hideCaptcha(); onSuccess(); }, 500);
        }
    }

    btn.onmousedown = () => {
        if (!gameActive) return;
        clicks++;
        updateLoad();
    };
}

function startCaptcha2(onSuccess) {
    let score = 0;
    const targetScore = 20;

    let html = `
        <div style="margin-bottom:10px;">Quarantine the viruses (💀). Avoid data packets (📦). <br>Score: <span id="c2-score">0</span>/${targetScore}</div>
        <div class="whack-grid" id="c2-grid">
            ${Array(9).fill('<div class="whack-hole"><div class="whack-entity"></div></div>').join('')}
        </div>
    `;
    showCaptcha(html);

    const entities = document.querySelectorAll('.whack-entity');
    const scoreSpan = document.getElementById('c2-score');
    let gameActive = true;

    function popUp() {
        if (!gameActive) return;
        const index = Math.floor(Math.random() * entities.length);
        const entity = entities[index];
        if (entity.classList.contains('up')) {
            setTimeout(popUp, 100);
            return;
        }

        const isVirus = Math.random() > 0.25;
        entity.innerText = isVirus ? '💀' : '📦';
        entity.dataset.type = isVirus ? 'virus' : 'packet';
        entity.classList.add('up');

        setTimeout(() => {
            entity.classList.remove('up');
            setTimeout(popUp, Math.random() * 400 + 200);
        }, Math.random() * 800 + 600);
    }

    entities.forEach(entity => {
        entity.parentElement.onmousedown = () => {
            if (!entity.classList.contains('up') || !gameActive) return;
            entity.classList.remove('up');
            if (entity.dataset.type === 'virus') {
                score++;
            } else {
                score = Math.max(0, score - 2);
            }
            scoreSpan.innerText = score;
            if (score >= targetScore) {
                gameActive = false;
                setTimeout(() => { hideCaptcha(); onSuccess(); }, 500);
            }
        };
    });

    popUp();
    setTimeout(popUp, 1000); // multiple at once
}

function startCaptcha3(onSuccess) {
    let score = 0;
    const targetScore = 20;
    let gameActive = true;

    let html = `
        <div style="margin-bottom:10px;">Intercept green packets. Avoid red ones. Use Mouse. <br>Score: <span id="c3-score">0</span>/${targetScore}</div>
        <div class="catch-container" id="c3-container">
            <div class="catch-paddle" id="c3-paddle"></div>
        </div>
    `;
    showCaptcha(html);

    const container = document.getElementById('c3-container');
    const paddle = document.getElementById('c3-paddle');
    const scoreSpan = document.getElementById('c3-score');

    container.addEventListener('mousemove', (e) => {
        if (!gameActive) return;
        const rect = container.getBoundingClientRect();
        let x = e.clientX - rect.left;
        x = Math.max(30, Math.min(x, rect.width - 30));
        paddle.style.left = x + 'px';
    });

    let dropInterval = setInterval(() => {
        if (!gameActive) return clearInterval(dropInterval);

        const packet = document.createElement('div');
        const isGood = Math.random() > 0.25;
        packet.className = `catch-packet ${isGood ? 'packet-good' : 'packet-bad'}`;
        packet.style.left = Math.random() * 90 + '%';
        packet.style.top = '0px';
        container.appendChild(packet);

        let y = 0;
        let fallInterval = setInterval(() => {
            if (!gameActive) {
                clearInterval(fallInterval);
                if (packet.parentElement) packet.remove();
                return;
            }
            y += 4;
            packet.style.top = y + 'px';

            if (y > 270 && y < 290) {
                const pRect = packet.getBoundingClientRect();
                const padRect = paddle.getBoundingClientRect();
                if (pRect.right > padRect.left && pRect.left < padRect.right) {
                    score += isGood ? 1 : -3;
                    score = Math.max(0, score);
                    scoreSpan.innerText = score;
                    clearInterval(fallInterval);
                    packet.remove();

                    if (score >= targetScore) {
                        gameActive = false;
                        setTimeout(() => { hideCaptcha(); onSuccess(); }, 500);
                    }
                }
            } else if (y > 300) {
                clearInterval(fallInterval);
                if (packet.parentElement) packet.remove();
            }
        }, 20);
    }, 500);
}

function startCaptcha4(onSuccess) {
    let crypto = 0;
    const targetCrypto = 2000;
    let cps = 0;
    let gameActive = true;

    let html = `
        <div style="margin-bottom:10px;">Ransomware Lock: Mine crypto to pay the ransom. <br>Crypto: <span id="c4-crypto">0</span> / ${targetCrypto} | CPS: <span id="c4-cps">0</span></div>
        <div class="miner-container">
            <div class="miner-coin" id="c4-coin">🪙</div>
            <div class="miner-store">
                <div class="miner-item disabled" id="upg-1" data-cost="50" data-cps="2">
                    <span>Botnet Node (+2/s)</span><span class="cost">Cost: 50</span>
                </div>
                <div class="miner-item disabled" id="upg-2" data-cost="200" data-cps="10">
                    <span>Server Farm (+10/s)</span><span class="cost">Cost: 200</span>
                </div>
                <div class="miner-item disabled" id="upg-3" data-cost="800" data-cps="50">
                    <span>Quantum Rig (+50/s)</span><span class="cost">Cost: 800</span>
                </div>
            </div>
        </div>
    `;
    showCaptcha(html);

    const coin = document.getElementById('c4-coin');
    const cryptoSpan = document.getElementById('c4-crypto');
    const cpsSpan = document.getElementById('c4-cps');
    const upgrades = [
        document.getElementById('upg-1'),
        document.getElementById('upg-2'),
        document.getElementById('upg-3')
    ];

    function updateUI() {
        cryptoSpan.innerText = Math.floor(crypto);
        cpsSpan.innerText = cps;
        upgrades.forEach(u => {
            if (crypto >= parseInt(u.dataset.cost)) {
                u.classList.remove('disabled');
            } else {
                u.classList.add('disabled');
            }
        });
        if (crypto >= targetCrypto && gameActive) {
            gameActive = false;
            setTimeout(() => { hideCaptcha(); onSuccess(); }, 500);
        }
    }

    coin.onmousedown = () => {
        if (!gameActive) return;
        crypto++;
        updateUI();
    };

    upgrades.forEach(u => {
        u.onmousedown = () => {
            if (!gameActive) return;
            const cost = parseInt(u.dataset.cost);
            if (crypto >= cost) {
                crypto -= cost;
                cps += parseInt(u.dataset.cps);
                u.dataset.cost = Math.floor(cost * 1.5);
                u.querySelector('.cost').innerText = `Cost: ${u.dataset.cost}`;
                updateUI();
            }
        };
    });

    let miningInterval = setInterval(() => {
        if (!gameActive) return clearInterval(miningInterval);
        crypto += cps / 10;
        updateUI();
    }, 100);
}


// ----------------------------------------------------
// Stages
// ----------------------------------------------------

async function handleStage0(action) {
    await addLine(`[SYSTEM]: Credentials accepted. Agent logged in with department code ${action.toUpperCase()}.`, "system");
    await addLine("[SYSTEM]: Establishing remote connection to target device...", "system");
    await new Promise(r => setTimeout(r, 1000));

    // Open phone in new tab
    window.open('./phone.html', '_blank');

    state.stage = 1;
    state.failures = 0;
    setTimeout(startStage1, 500);
}

async function startStage1() {
    await addLines([
        { text: "==================================================", class: "system" },
        { text: "PHASE 1: Target Acquisition", class: "system" },
        { text: "==================================================", class: "system" },
        { text: "Director: Connection established. The target's phone screen is live." },
        { text: "Director: We need their Instagram username to trace their network. Extract it using the remote access phone." },
        { text: "[SYSTEM]: Enter the target's Instagram username:", class: "system" }
    ]);
}

async function handleStage1(action) {
    if (action.includes('marcus_vanguard') || action.includes('marcus_v_vanguard')) {
        startCaptcha1(async () => {
            await addLine("Director: Good work. Target identified on Instagram: @marcus_vanguard");
            state.stage = 2;
            state.failures = 0;
            setTimeout(startStage2, 500);
        });
    } else {
        state.failures++;
        await addLine("[SYSTEM]: Incorrect username.", "error");
        if (state.failures >= 3) {
            await addLine("Director [HINT]: Look through the phone apps.", "hint");
        }
    }
}

async function startStage2() {
    await addLines([
        { text: "Director: We need the target's full real name." },
        { text: "Director: Thoroughly scan their Instagram profile and links." },
        { text: "[SYSTEM]: Enter the target's full name:", class: "system" }
    ]);
}

async function handleStage2(action) {
    if (action.includes('marcus von vanguard')) {
        await addLine("Director: Identity confirmed: Marcus Von Vanguard.");
        state.stage = 3;
        state.failures = 0;
        setTimeout(startStage3, 500);
    } else {
        await addLine("[SYSTEM]: Name does not match records.", "error");
    }
}

async function startStage3() {
    await addLines([
        { text: "Director: Now, find out where he works. It should be listed on his professional profile." },
        { text: "[SYSTEM]: Enter the name of the company:", class: "system" }
    ]);
}

async function handleStage3(action) {
    if (action.includes('vanguard data solutions') || action === 'vanguard data') {
        await addLine("Director: Company verified: Vanguard Data Solutions.");
        state.stage = 4;
        state.failures = 0;
        setTimeout(startStage4, 500);
    } else {
        await addLine("[SYSTEM]: Company name incorrect.", "error");
    }
}

async function startStage4() {
    await addLines([
        { text: "Director: We need to escalate our access. Find his email address." },
        { text: "[SYSTEM]: Enter the target's email address:", class: "system" }
    ]);
}

async function handleStage4(action) {
    if (action === 'marcus@sg-test.top') {
        startCaptcha2(async () => {
            await addLine("Director: Email acquired. We are one step closer.");
            state.stage = 5;
            state.failures = 0;
            setTimeout(startStage5, 500);
        });
    } else {
        await addLine("[SYSTEM]: Invalid email address.", "error");
    }
}

async function startStage5() {
    await addLines([
        { text: "Director: Let's check his other socials. Find out his X username." },
        { text: "[SYSTEM]: Enter the target's X username:", class: "system" }
    ]);
}

async function handleStage5(action) {
    if (action.includes('nightowl0x100') || action === 'nightowl0x100') {
        await addLine("Director: Found him on X: @nightowl0x100.");
        state.stage = 6;
        state.failures = 0;
        setTimeout(startStage6, 500);
    } else {
        await addLine("[SYSTEM]: Username not found.", "error");
    }
}

async function startStage6() {
    await addLines([
        { text: "Director: Finally, we need to know what device he's using to coordinate the attack." },
        { text: "[SYSTEM]: Enter the target's device (e.g., laptop, samsung, etc):", class: "system" }
    ]);
}

async function handleStage6(action) {
    if (action.includes('iphone') || action === 'apple iphone') {
        startCaptcha3(async () => {
            await addLine("Director: Confirmed. The device is an iPhone.");
            state.stage = 7;
            state.failures = 0;
            setTimeout(startStage7, 1000);
        });
    } else {
        await addLine("[SYSTEM]: Incorrect device.", "error");
    }
}

async function startStage7() {
    await addLines([
        { text: "==================================================", class: "system" },
        { text: "PHASE 2: DECRYPTION", class: "system" },
        { text: "==================================================", class: "system" },
        { text: "Director: We have all the necessary metadata to bypass his security." },
        { text: "[SYSTEM]: All data retrieved. Type 'decrypt' to access the final payload.", class: "system" }
    ]);
}

async function handleStage7(action) {
    if (action === 'decrypt') {
        startCaptcha4(async () => {
            await addLine("[SYSTEM]: Password Accepted. Decrypting payload...", "system");
            state.stage = 8;
            setTimeout(startStage8, 1000);
        });
    } else {
        await addLine("[SYSTEM]: Command not recognized. Type 'decrypt'.", "error");
    }
}

async function startStage8() {
    await addLines([
        { text: "==================================================", class: "system" },
        { text: "STAGE 3: The Climax (The Ticking Clock)", class: "system" },
        { text: "==================================================", class: "system" },
        { text: "Director: The decryption reveals a map pointing directly to the abandoned campus boiler room!" },
        { text: "An EXIF data caption on the map reads: 'Initiating Campus Mainframe Wipe at 22:00.'" }
    ]);
    await new Promise(r => setTimeout(r, 1500));
    await addLines([
        { text: "[BREACHING BOILER ROOM]", class: "system" },
        { text: "Director: You kick the door down! A hooded figure is frantically typing at a terminal." },
        { text: "A massive progress bar on the screen reads: WIPE PROGRESS... 99%.", class: "error" },
        { text: "[SYSTEM]: QUICK! What do you do?!", class: "system" }
    ]);
}

async function handleStage8(action) {
    const validActions = ["tackle", "pull", "grab", "stop", "hit", "punch", "unplug"];
    const isValid = validActions.some(word => action.includes(word));

    if (isValid) {
        await addLine("Director: You lunge forward with split-second reflexes!");
        state.stage = 9;
        setTimeout(startStage9, 1500);
    } else {
        await addLine("Director: That won't work in time! You need to physically stop him or the machine immediately!", "error");
    }
}

async function startStage9() {
    await addLines([
        { text: "==================================================", class: "system" },
        { text: "STAGE 4: The Anti-Climax", class: "system" },
        { text: "==================================================", class: "system" },
        { text: "Director: You successfully neutralize the threat and sever the connection at 99.9%." },
        { text: "You grab the hooded mastermind, ready for a fight, and rip back his hood..." }
    ]);
    await new Promise(r => setTimeout(r, 1500));
    await addLines([
        { text: "It's not a cyber-terrorist." },
        { text: "It's... Dave. A terrified, acne-prone sophomore from the AV club." },
        { text: "Dave: *bursts into tears* 'Please don't arrest me! I just wanted my band to win!'", class: "player" }
    ]);
    await new Promise(r => setTimeout(r, 1500));
    await addLines([
        { text: "Director: Further investigation reveals the 'mainframe wipe' was actually just a bot script." },
        { text: "Dave wrote it to artificially inflate the online voting poll for the college's 'Battle of the Bands'." },
        { text: "He just wanted his indie-folk band, 'The Sullen Lattes,' to beat the frat DJ." },
        { text: "The fake accounts, the burner phone, the elaborate encryption? He just watches too many spy movies and got paranoid." }
    ]);
    await new Promise(r => setTimeout(r, 2000));
    await addLines([
        { text: "Director: Well, Agents... congratulations." },
        { text: "You utilized military-grade OSINT tactics to bust a 19-year-old trying to win a $50 cafeteria gift card." },
        { text: "The campus is safe. The Battle of the Bands is secure." },
        { text: "==================================================", class: "system" },
        { text: "MISSION ACCOMPLISHED", class: "system" },
        { text: "==================================================", class: "system" }
    ]);
}

// Event Listeners
input.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        processCommand(input.value);
        input.value = '';
    }
});

// Keep focus on input when clicking terminal
terminal.addEventListener('click', () => {
    input.focus();
});

// Start game
window.onload = async () => {
    await addLines([
        { text: "==================================================", class: "system" },
        { text: "STAGE 0: The Briefing", class: "system" },
        { text: "==================================================", class: "system" },
        { text: "Director: Welcome, Agent. I am the AI Director of the Intelligence Division." },
        { text: "We've intercepted a data stream from a highly-secured burner phone." },
        { text: "[SYSTEM]: Please enter your Department Code to begin.", class: "system" }
    ]);
};
