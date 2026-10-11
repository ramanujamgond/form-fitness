import { getRuntime } from '../server/runtime.js';
import { journalHandler } from '../server/journal.js';
export default journalHandler(getRuntime);
