const CONFIG = {
    PIN_CODE: "1234",
    INSTAGRAM_LINK: "https://www.instagram.com/deer.2957301?igsh=MTBiNWN1cHU4MDlweg==",
    LINKTREE_LINK: "https://linktr.ee/fake_marcus_vanguard_links",
    LINKEDIN_LINK: "https://linkedin.com/in/fake-elena-rostova",
    TWITTER_LINK: "https://twitter.com/fake_NightOwl_Sec",
    IMGUR_LINK: "https://imgur.com/a/fake-overlord-dump",
    FINAL_PASSWORD: "owlthorne"
};

const terminal = document.getElementById('terminal');
const output = document.getElementById('output');
const input = document.getElementById('command-input');

let state = {
    stage: 0,
    failures: 0,
    instagramFound: false,
    corporateCleared: false,
    darkEchoCleared: false,
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
        case 0:
            handleStage0(action);
            break;
        case 1:
            handleStage1(action);
            break;
        case 2:
            handleStage2(action);
            break;
        case 3:
            handleStage3(action);
            break;
        case 4:
            addLine("Mission Accomplished. Refresh to restart.", "system", false);
            break;
    }
}

async function handleStage0(action) {
    if (action.includes(CONFIG.PIN_CODE)) {
        await addLine("[SYSTEM]: Access Granted. Phone unlocked.", "system");
        state.stage = 1;
        state.failures = 0;
        setTimeout(startStage1, 1000);
    } else if (action.includes('examine') || action.includes('look') || action.includes('inspect')) {
        await addLines([
            { text: "Director: You examine the screen closely. Under the light, you see distinct smudge marks..." },
            { text: "They form a linear pattern over the numbers 1, 2, 3, and 4." }
        ]);
    } else {
        await addLine("[SYSTEM]: Incorrect PIN or unrecognized action.", "error");
        state.failures++;
        if (state.failures >= 3) {
            await addLine("Director [HINT]: Maybe you should 'examine' the phone for physical clues, or just try guessing the PIN.", "hint");
        }
    }
}

async function startStage1() {
    await addLines([
        { text: "==================================================", class: "system" },
        { text: "STAGE 1: The Face in the Code", class: "system" },
        { text: "==================================================", class: "system" },
        { text: "Director: The phone is wiped clean. No contacts, no messages." },
        { text: "However, there is one undeleted photo in the gallery: a selfie of a young man in a coffee shop." },
        { text: "[SYSTEM]: Awaiting next move...", class: "system" }
    ]);
}

async function handleStage1(action) {
    if (!state.instagramFound) {
        if (action.includes('reverse') || action.includes('image search') || action.includes('search') || action.includes('social media')) {
            await addLines([
                { text: "Director: Good thinking. Running facial recognition and reverse image search..." },
                { text: `Match found! Target identified on Instagram: @Marcus_V_Vanguard` },
                { text: `URL: <a href="${CONFIG.INSTAGRAM_LINK}" target="_blank" style="color:var(--primary-color)">${CONFIG.INSTAGRAM_LINK}</a>` }
            ]);
            state.instagramFound = true;
            state.failures = 0;
        } else {
            state.failures++;
            if (state.failures >= 3) {
                await addLine("Director [HINT]: We have a photo. Standard OSINT protocol suggests a 'reverse image search' or checking 'social media'.", "hint");
            } else {
                await addLine("Director: That doesn't seem to yield any results.");
            }
        }
    } else {
        if (action.includes('bio') || action.includes('link') || action.includes('linktree') || action.includes('profile')) {
            await addLines([
                { text: "Director: Excellent. Scanning the Instagram bio..." },
                { text: `Found a Linktree URL: <a href="${CONFIG.LINKTREE_LINK}" target="_blank" style="color:var(--primary-color)">${CONFIG.LINKTREE_LINK}</a>` }
            ]);
            state.stage = 2;
            state.failures = 0;
            setTimeout(startStage2, 1000);
        } else {
            state.failures++;
            if (state.failures >= 3) {
                await addLine("Director [HINT]: People often put a 'link' in their 'bio' to consolidate their online presence.", "hint");
            } else {
                await addLine("Director: Nothing useful found there. Keep investigating the profile.");
            }
        }
    }
}

async function startStage2() {
    await addLines([
        { text: "==================================================", class: "system" },
        { text: "STAGE 2: The Linktree Web", class: "system" },
        { text: "==================================================", class: "system" },
        { text: "Director: The Linktree branches into three distinct paths:" },
        { text: "1. A 'Corporate Shell'" },
        { text: "2. A 'Dark Echo'" },
        { text: "3. An 'Encrypted Dump'" },
        { text: "[SYSTEM]: Which path do you want to investigate? (corporate/dark/encrypted)", class: "system" }
    ]);
}

async function handleStage2(action) {
    if (action.includes('corporate') || action === '1') {
        await addLines([
            { text: `Director: Accessing Corporate Shell... It leads to a LinkedIn profile for an 'Elena Rostova'.` },
            { text: `URL: <a href="${CONFIG.LINKEDIN_LINK}" target="_blank" style="color:var(--primary-color)">${CONFIG.LINKEDIN_LINK}</a>` },
            { text: "[SYSTEM]: Scan her profile. What key security company or keyword is she associated with?", class: "system" }
        ]);
        state.awaitingCorporate = true;
        state.awaitingDark = false;
        state.awaitingEncrypted = false;
    } else if (state.awaitingCorporate) {
        if (action.includes('nightowl_sec') || action.includes('nightowl')) {
            await addLine("Director: Confirmed. 'NightOwl_Sec'. Logging keyword.");
            state.corporateCleared = true;
            state.awaitingCorporate = false;
            checkStage2Progress();
        } else {
            await addLine("Director: Incorrect. Look closer at her employment history.", "error");
        }
    } else if (action.includes('dark') || action.includes('echo') || action === '2') {
        await addLines([
            { text: `Director: Accessing Dark Echo... It leads to a Twitter/X account: @NightOwl_Sec.` },
            { text: `URL: <a href="${CONFIG.TWITTER_LINK}" target="_blank" style="color:var(--primary-color)">${CONFIG.TWITTER_LINK}</a>` },
            { text: "[SYSTEM]: Analyze the tweets. Who is the primary name associated with this account?", class: "system" }
        ]);
        state.awaitingDark = true;
        state.awaitingCorporate = false;
        state.awaitingEncrypted = false;
    } else if (state.awaitingDark) {
        if (action.includes('aris thorne') || action.includes('thorne')) {
            await addLine("Director: Confirmed. 'Dr. Aris Thorne'. Logging name.");
            state.darkEchoCleared = true;
            state.awaitingDark = false;
            checkStage2Progress();
        } else {
            await addLine("Director: Incorrect. Check the replies or mentions.", "error");
        }
    } else if (action.includes('encrypted') || action.includes('dump') || action === '3') {
        await addLines([
            { text: `Director: Accessing Encrypted Dump... It points to a hidden Imgur album: Project Overlord.` },
            { text: `URL: <a href="${CONFIG.IMGUR_LINK}" target="_blank" style="color:var(--primary-color)">${CONFIG.IMGUR_LINK}</a>` }
        ]);
        if (!state.corporateCleared || !state.darkEchoCleared) {
            await addLine("Director: This album is password protected. You might need to investigate the other branches first to figure it out.");
        } else {
            await addLine("[SYSTEM]: Enter the password to decrypt the album:", "system");
            state.awaitingEncrypted = true;
            state.awaitingCorporate = false;
            state.awaitingDark = false;
        }
    } else if (state.awaitingEncrypted) {
        if (action === CONFIG.FINAL_PASSWORD.toLowerCase()) {
            await addLine("[SYSTEM]: Password Accepted. Decrypting payload...", "system");
            state.awaitingEncrypted = false;
            state.stage = 3;
            setTimeout(startStage3, 1000);
        } else {
            await addLine("[SYSTEM]: Access Denied. (Hint: Combine the keywords you found).", "error");
        }
    } else {
        await addLine("Director: Please select 'corporate', 'dark', or 'encrypted'.");
    }
}

async function checkStage2Progress() {
    if (state.corporateCleared && state.darkEchoCleared) {
        await addLine("[SYSTEM]: You have enough intel to decrypt the dump. Investigate the 'encrypted' path.", "system");
    } else {
        await addLine("[SYSTEM]: Select another path to investigate. (corporate/dark/encrypted)", "system");
    }
}

async function startStage3() {
    await addLines([
        { text: "==================================================", class: "system" },
        { text: "STAGE 3: The Climax (The Ticking Clock)", class: "system" },
        { text: "==================================================", class: "system" },
        { text: "Director: The Imgur album unlocks. It's a map pointing directly to the abandoned campus boiler room!" },
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

async function handleStage3(action) {
    const validActions = ["tackle", "pull", "grab", "stop", "hit", "punch", "unplug"];
    const isValid = validActions.some(word => action.includes(word));

    if (isValid) {
        await addLine("Director: You lunge forward with split-second reflexes!");
        state.stage = 4;
        setTimeout(startStage4, 1500);
    } else {
        await addLine("Director: That won't work in time! You need to physically stop him or the machine immediately!", "error");
    }
}

async function startStage4() {
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
        { text: "Director: Welcome, Agents. I am the AI Director of the Campus Intelligence Division." },
        { text: "Campus security intercepted a masked individual trying to splice into the main fiber-optic line." },
        { text: "The suspect fled but dropped a burner phone." },
        { text: "[SYSTEM]: What would you like to do? (e.g., 'examine phone', 'enter PIN 0000')", class: "system" }
    ]);
};
