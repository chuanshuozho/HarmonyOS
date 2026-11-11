import preferences from "@ohos:data.preferences";
import { defaultSnapshot } from "@bundle:com.example.dormlink/entry/ets/models/Models";
import type { AppSnapshot } from "@bundle:com.example.dormlink/entry/ets/models/Models";
const FILE_NAME: string = 'dorm_link_preferences';
const DATA_KEY: string = 'application_snapshot_v1';
/** Preferences 是轻量 KV 存储，复杂业务模型使用 JSON 字符串保存。 */
export class SnapshotRepository {
    private prefs: preferences.Preferences;
    private flushQueue: Promise<void> = Promise.resolve();
    constructor(context: Context) {
        this.prefs = preferences.getPreferencesSync(context, { name: FILE_NAME });
    }
    load(): AppSnapshot {
        try {
            let raw: string = this.prefs.getSync(DATA_KEY, '') as string;
            if (raw.length === 0) {
                return defaultSnapshot();
            }
            let parsed: AppSnapshot = JSON.parse(raw) as AppSnapshot;
            if (parsed.version !== 1 || !Array.isArray(parsed.rules) || !Array.isArray(parsed.devices) ||
                !Array.isArray(parsed.logs) || !parsed.environment ||
                typeof parsed.nextRuleId !== 'number') {
                return defaultSnapshot();
            }
            return parsed;
        }
        catch (err) {
            // 偏好数据被破坏时回退到初始状态，避免页面白屏；可由用户重新配置。
            return defaultSnapshot();
        }
    }
    save(snapshot: AppSnapshot): Promise<void> {
        // putSync 修改缓存；串行执行 flush，保证每次最新状态最终落盘。
        this.prefs.putSync(DATA_KEY, JSON.stringify(snapshot));
        this.flushQueue = this.flushQueue.catch((): void => { }).then((): Promise<void> => this.prefs.flush());
        return this.flushQueue;
    }
}
