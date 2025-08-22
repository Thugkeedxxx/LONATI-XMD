const fs = require('fs');
const path = require('path');

// Load blocked numbers
const blockedNumbersPath = path.join(__dirname, 'blocked.json');
let blockedNumbers = [];

try {
    if (fs.existsSync(blockedNumbersPath)) {
        blockedNumbers = JSON.parse(fs.readFileSync(blockedNumbersPath, 'utf-8'));
    } else {
        fs.writeFileSync(blockedNumbersPath, JSON.stringify(blockedNumbers, null, 2));
    }
} catch (error) {
    console.error('Error loading blocked numbers:', error);
}

async function AntiCall(conn, call) {
    try {
        const caller = call.from;
        const callerNumber = caller.split('@')[0];
        
        // Check if caller is owner
        const ownerNumbers = ['254799056874']; // Add your owner numbers here
        const isOwner = ownerNumbers.includes(callerNumber);
        
        // Check if caller is blocked
        const isBlocked = blockedNumbers.includes(caller);
        
        if (isOwner) {
            // Send message to owner instead of rejecting
            await conn.sendMessage(
                caller, 
                { text: "🤖 Bot doesn't accept calls. Please send a message instead." }
            );
            console.log(`Notified owner ${caller} about call rejection`);
        } else if (isBlocked) {
            // Immediately reject blocked numbers
            await conn.rejectCall(call.id, caller);
            console.log(`Rejected call from blocked number: ${caller}`);
        } else {
            // Reject call and notify
            await conn.rejectCall(call.id, caller);
            await conn.sendMessage(
                caller, 
                { text: "🚫 Calls are not allowed. You have been blocked from calling this number." }
            );
            
            // Add to blocked list
            if (!blockedNumbers.includes(caller)) {
                blockedNumbers.push(caller);
                fs.writeFileSync(blockedNumbersPath, JSON.stringify(blockedNumbers, null, 2));
            }
            
            console.log(`Rejected and blocked call from: ${caller}`);
        }
    } catch (error) {
        console.error('Error in AntiCall:', error);
    }
}

module.exports = AntiCall;
