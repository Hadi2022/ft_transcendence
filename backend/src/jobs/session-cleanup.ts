import { purgeExpiredSessionsJob } from "../services/sessionService.ts";
import { CLEANUP_INTERVAL_MS } from "../constants/session.ts";


let isRunning = false;


export const runSessionCleanup = async()=>{

	if (isRunning)
		return;
	isRunning = true;
	try {
		const deletedSessions = await purgeExpiredSessionsJob();
		console.log(`[SessionCleanup] Cleanup completed: ${deletedSessions.count} expired sessions removed`);
	} catch (error) {
		console.error("[SessionCleanup] Cleanup failed:", error);
	}finally{
		isRunning = false;
	}

}

export const startSessionCleanUp = (intervalMS = CLEANUP_INTERVAL_MS)=>{
	runSessionCleanup();
	const timer = setInterval(runSessionCleanup,intervalMS);
	timer.unref();
}
