const { exec } = require('child_process');

async function AntivirusCheck() {
    console.log("[+] Antivirus check is running .. ");

    const AV_Check = [
        "MsMpEng.exe", "AdAwareService.exe", "afwServ.exe", "avguard.exe", "AVGSvc.exe",
        "bdagent.exe", "BullGuardCore.exe", "ekrn.exe", "fshoster32.exe", "GDScan.exe",
        "avp.exe", "K7CrvSvc.exe", "McAPExe.exe", "NortonSecurity.exe", "PavFnSvr.exe",
        "SavService.exe", "EnterpriseService.exe", "WRSA.exe", "ZAPrivacyService.exe"
    ];

    try {
        const processList = await getProcessList();
        const avFound = findAntivirusProcesses(processList, AV_Check);

        if (!avFound) {
            console.log("--AV software is not found!");
        }
    } catch (error) {
        console.error('Error:', error.message);
    }
}

function executeCommand(command) {
    return new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
            if (error) {
                reject(error);
            } else {
                resolve({ stdout, stderr });
            }
        });
    });
}

async function getProcessList() {
    const { stdout } = await executeCommand('tasklist');
    return stdout.split('\r\n').slice(3); // Exclude header rows
}

function findAntivirusProcesses(processList, AV_Check) {
    let avFound = false;
    for (const process of processList) {
        const processName = process.split(/\s+/)[0];
        if (AV_Check.includes(processName)) {
            console.log(`--AV Found: ${processName}`);
            avFound = true;
        }
    }
    return avFound;
}

AntivirusCheck();
