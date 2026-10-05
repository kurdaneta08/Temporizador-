document.addEventListener('DOMContentLoaded', () => {
    const inputSeconds = document.querySelector('#seconds');
    const displaySeconds = document.querySelector('#seconds-display');

    const btnRun = document.querySelector('#start-button');
    const btnFreeze = document.querySelector('#pause-button');
    const btnReset = document.querySelector('#restart-button');

    const stateIndicator = document.querySelector('#timer-state');
    const videoFeed = document.querySelector('#rocket-video');

    let countdownTime = 60;
    let processInterval = null;

    const formatDigits = (val) => String(val).padStart(2, '0');

    const fetchInputs = () => {
        let s = Math.min(60, Math.max(1, Number(inputSeconds.value) || 60));
        inputSeconds.value = s;
        return s;
    };

    const renderScreen = () => {
        displaySeconds.textContent = formatDigits(countdownTime);
    };

    const clearProcess = () => {
        clearInterval(processInterval);
        processInterval = null;
    };

    const executeTimer = () => {
        if (processInterval) return;
        if (countdownTime <= 0) countdownTime = fetchInputs();

        stateIndicator.textContent = 'RUNNING';
        
        processInterval = setInterval(() => {
            countdownTime--;
            renderScreen();
            
            if (countdownTime <= 0) {
                clearProcess();
                stateIndicator.textContent = 'TERMINATED';
                
                if (videoFeed) {
                    videoFeed.classList.add('active-cam');
                    videoFeed.currentTime = 0;
                    videoFeed.play().catch(() => {});
                }
            }
        }, 1000);
    };

    const freezeTimer = () => {
        if (!processInterval) return;
        clearProcess();
        stateIndicator.textContent = 'FROZEN';
    };

    const resetTimer = () => {
        clearProcess();
        countdownTime = fetchInputs();
        renderScreen();
        stateIndicator.textContent = 'STANDBY';
        
        if (videoFeed) {
            videoFeed.pause();
            videoFeed.currentTime = 0;
            videoFeed.classList.remove('active-cam');
        }
    };

    inputSeconds.addEventListener('input', resetTimer);
    btnRun.addEventListener('click', executeTimer);
    btnFreeze.addEventListener('click', freezeTimer);
    btnReset.addEventListener('click', resetTimer);

    countdownTime = fetchInputs();
    renderScreen();
});